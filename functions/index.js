const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const fetch = require("node-fetch");

const COINBASE_API_KEY = defineSecret("COINBASE_API_KEY");

exports.createCharge = onCall(
  { secrets: [COINBASE_API_KEY] },
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

      return data;
    } catch (error) {
      throw new HttpsError(
        "internal",
        `Failed to create charge: ${error.message}`
      );
    }
  }
);
