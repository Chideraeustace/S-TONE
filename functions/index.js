const {
  onCall,
  HttpsError,
  onRequest,
} = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const fetch = require("node-fetch");
const admin = require("firebase-admin");
const crypto = require("crypto");

const COINBASE_API_KEY = defineSecret("COINBASE_API_KEY");
const COINBASE_WEBHOOK_SECRET = defineSecret("COINBASE_WEBHOOK_SECRET");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.createCharge = onCall(
  { secrets: [COINBASE_API_KEY], timeoutSeconds: 60 },
  async (request) => {
    const { amount, metadata } = request.data;

    // Input validation
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new HttpsError(
        "invalid-argument",
        "Amount must be a positive number."
      );
    }
    if (typeof metadata !== "object" || metadata === null) {
      throw new HttpsError("invalid-argument", "Metadata must be an object.");
    }

    // Dynamic name and description based on metadata
    const cartItems = metadata.cartItems || [];
    const name =
      cartItems.length > 0 ? `Order: ${cartItems[0].name}` : "Lumixing Order";
    const description =
      cartItems.length > 0
        ? `Payment for ${cartItems.length} item(s)`
        : "Payment via Coinbase Commerce";

    const requestBody = {
      name,
      description,
      pricing_type: "fixed_price",
      local_price: { amount: parseFloat(amount).toFixed(2), currency: "USD" },
      metadata: {
        ...metadata,
        source: "lumixing-cart",
      },
    };

    try {
      const response = await fetch(
        "https://api.commerce.coinbase.com/charges",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CC-Api-Key": COINBASE_API_KEY.value(),
            "X-CC-Version": "2018-03-22",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new HttpsError(
          "internal",
          `Coinbase API error: ${data.error?.message || response.statusText}`
        );
      }

      // Write order to Firestore at charge creation
      await db.collection("lumixing-orders").doc(data.data.code).set({
        amount,
        chargeId: data.data.id,
        hostedUrl: data.data.hosted_url,
        metadata,
        status: "created",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Order document created for charge: ${data.data.code}`);
      return data;
    } catch (error) {
      console.error("Error in createCharge:", error);
      throw new HttpsError(
        "internal",
        `Failed to create charge: ${error.message}`
      );
    }
  }
);

exports.coinbaseWebhook = onRequest(
  { secrets: [COINBASE_WEBHOOK_SECRET], timeoutSeconds: 60 },
  async (req, res) => {
    // Ensure raw body is available for signature verification
    const rawBody = req.rawBody
      ? req.rawBody.toString()
      : JSON.stringify(req.body);

    // Verify webhook signature
    const signature = req.get("X-CC-Webhook-Signature");
    if (!signature) {
      console.error("No webhook signature provided");
      return res.status(401).send("Missing webhook signature");
    }

    const computedSignature = crypto
      .createHmac("sha256", COINBASE_WEBHOOK_SECRET.value())
      .update(rawBody)
      .digest("hex");

    if (computedSignature !== signature) {
      console.error("Invalid webhook signature");
      return res.status(401).send("Invalid webhook signature");
    }

    // Process webhook event
    try {
      const event = req.body.event;
      if (!event || !event.data) {
        console.error("Invalid webhook payload");
        return res.status(400).send("Invalid webhook payload");
      }

      const { type, data } = event;
      const chargeId = data.code; // Coinbase charge code
      const orderRef = db.collection("lumixing-orders").doc(chargeId);

      // Update order status based on event type
      let status;
      switch (type) {
        case "charge:created":
          status = "created";
          break;
        case "charge:confirmed":
          status = "confirmed";
          break;
        case "charge:failed":
          status = "failed";
          break;
        default:
          console.warn(`Unhandled event type: ${type}`);
          return res.status(200).send("Unhandled event type");
      }

      // Update Firestore order document
      await orderRef.update({
        status,
        webhookReceivedAt: admin.firestore.FieldValue.serverTimestamp(),
        webhookEvent: type,
      });

      console.log(`Order ${chargeId} updated with status: ${status}`);
      return res.status(200).send("Webhook received");
    } catch (error) {
      console.error("Error processing webhook:", error);
      return res.status(500).send(`Error processing webhook: ${error.message}`);
    }
  }
);
