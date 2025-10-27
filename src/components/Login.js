import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Briefcase, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "../Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Login = () => {
  const [mode, setMode] = useState("sign-up"); // Modes: sign-up, login, forgot-password
  const [userType, setUserType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessType: "",
    contactNumber: "",
    businessEmail: "",
    businessAddress: {
      street: "",
      city: "",
      region: "",
    },
    website: "",
    purchaseVolume: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData };
    if (name.includes("businessAddress.")) {
      const addressField = name.split(".")[1];
      updatedFormData.businessAddress = {
        ...updatedFormData.businessAddress,
        [addressField]: value,
      };
    } else {
      updatedFormData[name] = value;
    }
    setFormData(updatedFormData);
    // Clear field-specific error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode !== "forgot-password") {
      if (!userType) {
        newErrors.userType = "Please select a user type.";
      }
    }

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (mode !== "forgot-password") {
      if (!formData.password) {
        newErrors.password = "Please enter a password.";
      }
    }

    if (mode === "sign-up") {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }

      if (!formData.name) {
        newErrors.name = "Please enter your name.";
      }

      if (userType === "business") {
        if (!formData.businessName) {
          newErrors.businessName = "Please enter your business name.";
        }
        if (!formData.businessType) {
          newErrors.businessType = "Please select a business type.";
        }
        if (
          !formData.contactNumber ||
          !validatePhoneNumber(formData.contactNumber)
        ) {
          newErrors.contactNumber = "Please enter a valid contact number.";
        }
        if (!formData.businessEmail || !validateEmail(formData.businessEmail)) {
          newErrors.businessEmail = "Please enter a valid business email.";
        }
        if (
          !formData.businessAddress.street ||
          !formData.businessAddress.city ||
          !formData.businessAddress.region
        ) {
          newErrors.businessAddress = "Please complete all address fields.";
        }
        if (!formData.purchaseVolume) {
          newErrors.purchaseVolume =
            "Please select an estimated purchase volume.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (mode === "sign-up") {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        const userData = {
          name: formData.name,
          email: formData.email,
          userType: userType,
          createdAt: new Date(),
        };

        if (userType === "business") {
          userData.businessDetails = {
            businessName: formData.businessName,
            businessType: formData.businessType,
            contactNumber: formData.contactNumber,
            businessEmail: formData.businessEmail,
            businessAddress: formData.businessAddress,
            website: formData.website,
            purchaseVolume: formData.purchaseVolume,
          };
        }

        await setDoc(doc(db, "s-tone-users", user.uid), userData);

        localStorage.setItem("userType", userType);
        localStorage.setItem("userId", user.uid);
        toast.success("Sign-up successful! Welcome to S-TONE Cosmetics!", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate(location.state?.from || "/", { replace: true });
      } else if (mode === "login") {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "s-tone-users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          localStorage.setItem("userType", data.userType);
        } else {
          throw new Error("User data not found.");
        }
        localStorage.setItem("userId", user.uid);
        toast.success("Login successful! Welcome back!", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate(location.state?.from || "/", { replace: true });
      } else if (mode === "forgot-password") {
        await sendPasswordResetEmail(auth, formData.email);
        toast.success("Password reset email sent! Check your inbox.", {
          position: "top-right",
          autoClose: 3000,
        });
        setMode("login");
      }
    } catch (error) {
      console.error(`${mode} error:`, error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email already in use. Please try logging in.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/user-not-found":
          errorMessage = "No user found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid credentials provided.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "This operation is not allowed.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Please try again later.";
          break;
        case "auth/missing-email":
          errorMessage = "Please provide an email address.";
          break;
        default:
          errorMessage =
            error.message ||
            `Failed to ${
              mode === "sign-up"
                ? "sign up"
                : mode === "login"
                ? "log in"
                : "reset password"
            }. Please try again.`;
      }
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5F5F5] to-cream-100 relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-72 h-72 bg-[#4A5D23] opacity-20 blur-3xl rounded-full top-10 left-10"
          animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.25, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        ></motion.div>
        <motion.div
          className="absolute w-96 h-96 bg-[#4A5D23] opacity-20 blur-3xl rounded-full bottom-10 right-10"
          animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.25, 0.2] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        ></motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-md shadow-md border border-gray-200 rounded-lg p-6"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-3 text-center"
          >
            {mode === "sign-up"
              ? "Join S-TONE Cosmetics"
              : mode === "login"
              ? "Welcome Back!"
              : "Reset Password"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-gray-600 text-sm font-sans text-center mb-2"
          >
            {mode === "sign-up"
              ? "Sign up to explore our premium cosmetics"
              : mode === "login"
              ? "Log in to continue your beauty journey"
              : "Enter your email to receive a password reset link"}
          </motion.p>

          {mode !== "forgot-password" && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-gray-400 text-xs font-sans text-center mb-6"
            >
              Select your user type to tailor your experience
            </motion.p>
          )}

          {errors.general && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm"
              role="alert"
            >
              {errors.general}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="space-y-4"
          >
            <div className="flex justify-center mb-4">
              {mode === "forgot-password" ? (
                <button
                  onClick={() => setMode("login")}
                  className="text-[#4A5D23] text-sm font-sans hover:underline"
                >
                  Back to Log In
                </button>
              ) : (
                <button
                  onClick={() =>
                    setMode(mode === "sign-up" ? "login" : "sign-up")
                  }
                  className="text-[#4A5D23] text-sm font-sans hover:underline"
                >
                  {mode === "sign-up"
                    ? "Already have an account? Log In"
                    : "Need an account? Sign Up"}
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {mode === "sign-up" && (
                  <motion.div variants={childVariants} className="mb-4">
                    <label className="block text-sm font-sans text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans ${
                        errors.name ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </motion.div>
                )}
                <motion.div variants={childVariants} className="mb-4">
                  <label className="block text-sm font-sans text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </motion.div>
                {mode !== "forgot-password" && (
                  <motion.div
                    variants={childVariants}
                    className="mb-4 relative"
                  >
                    <label className="block text-sm font-sans text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-9 text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </motion.div>
                )}
                {mode === "sign-up" && (
                  <motion.div
                    variants={childVariants}
                    className="mb-4 relative"
                  >
                    <label className="block text-sm font-sans text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2 top-9 text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </motion.div>
                )}
                {mode !== "forgot-password" && (
                  <motion.div variants={childVariants} className="mb-4">
                    <label className="block text-sm font-sans text-gray-700 mb-2">
                      Choose User Type
                    </label>
                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                      <label
                        className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all w-full sm:w-1/2 ${
                          userType === "regular"
                            ? "bg-[#F5F5F5] border-[#4A5D23] shadow-md"
                            : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          value="regular"
                          checked={userType === "regular"}
                          onChange={(e) => setUserType(e.target.value)}
                          className="hidden"
                        />
                        <User className="h-5 w-5 text-[#4A5D23] mr-2" />
                        <span className="text-gray-800 text-sm font-sans">
                          Regular User
                        </span>
                      </label>
                      <label
                        className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all w-full sm:w-1/2 ${
                          userType === "business"
                            ? "bg-[#F5F5F5] border-[#4A5D23] shadow-md"
                            : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          value="business"
                          checked={userType === "business"}
                          onChange={(e) => setUserType(e.target.value)}
                          className="hidden"
                        />
                        <Briefcase className="h-5 w-5 text-[#4A5D23] mr-2" />
                        <span className="text-gray-800 text-sm font-sans">
                          Business User
                        </span>
                      </label>
                    </div>
                    {errors.userType && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.userType}
                      </p>
                    )}
                  </motion.div>
                )}

                {mode === "sign-up" && userType === "business" && (
                  <motion.div variants={childVariants} className="space-y-4">
                    <div className="mb-4">
                      <label className="block text-sm font-sans text-gray-700 mb-1">
                        Business Name
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans ${
                          errors.businessName
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Enter your business name"
                      />
                      {errors.businessName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.businessName}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-sans text-gray-700 mb-1">
                        Business Type
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans ${
                          errors.businessType
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                      >
                        <option value="" disabled>
                          Select business type
                        </option>
                        <option value="Salon / Spa">Salon / Spa</option>
                        <option value="Beauty Supply Store">
                          Beauty Supply Store
                        </option>
                        <option value="Retailer / Distributor">
                          Retailer / Distributor
                        </option>
                        <option value="Makeup Artist">Makeup Artist</option>
                        <option value="Online Store">Online Store</option>
                      </select>
                      {errors.businessType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.businessType}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-sans text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans ${
                          errors.contactNumber
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Enter your contact number"
                      />
                      {errors.contactNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.contactNumber}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-sans text-gray-700 mb-1">
                        Business Email
                      </label>
                      <input
                        type="email"
                        name="businessEmail"
                        value={formData.businessEmail}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans ${
                          errors.businessEmail
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Enter your business email"
                      />
                      {errors.businessEmail && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.businessEmail}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-sans text-gray-700 mb-1">
                        Business Address
                      </label>
                      <input
                        type="text"
                        name="businessAddress.street"
                        value={formData.businessAddress.street}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans mb-2 ${
                          errors.businessAddress
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Street"
                      />
                      <input
                        type="text"
                        name="businessAddress.city"
                        value={formData.businessAddress.city}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans mb-2 ${
                          errors.businessAddress
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="City"
                      />
                      <input
                        type="text"
                        name="businessAddress.region"
                        value={formData.businessAddress.region}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans ${
                          errors.businessAddress
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Region / Country"
                      />
                      {errors.businessAddress && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.businessAddress}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-sans text-gray-700 mb-1">
                        Website or Instagram Handle (Optional)
                      </label>
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-200 rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans"
                        placeholder="Enter your website or Instagram handle"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-sans text-gray-700 mb-1">
                        Estimated Monthly Purchase Volume
                      </label>
                      <select
                        name="purchaseVolume"
                        value={formData.purchaseVolume}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans ${
                          errors.purchaseVolume
                            ? "border-red-500"
                            : "border-gray-200"
                        }`}
                      >
                        <option value="" disabled>
                          Select purchase volume
                        </option>
                        <option value="< GHS 1,000">&lt; GHS 1,000</option>
                        <option value="GHS 1,000–5,000">GHS 1,000–5,000</option>
                        <option value="GHS 5,000–10,000">
                          GHS 5,000–10,000
                        </option>
                        <option value="> GHS 10,000">&gt; GHS 10,000</option>
                      </select>
                      {errors.purchaseVolume && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.purchaseVolume}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                <motion.button
                  variants={childVariants}
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full bg-[#4A5D23] text-white px-4 py-2 rounded-lg font-sans text-sm shadow-md hover:bg-[#3A4A1C] transition-colors duration-300 flex items-center justify-center ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : mode === "sign-up" ? (
                    "Sign Up"
                  ) : mode === "login" ? (
                    "Log In"
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </motion.form>
            </AnimatePresence>
          </motion.div>

          {mode === "login" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="text-xs font-sans text-[#4A5D23] mt-4 text-center hover:underline cursor-pointer"
              onClick={() => setMode("forgot-password")}
            >
              Forgot Password?
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-xs font-sans text-gray-400 mt-4 text-center"
          >
            Having trouble?{" "}
            <a
              href="mailto:info@stonecosmetics.com"
              className="text-[#4A5D23] hover:underline"
            >
              Contact support
            </a>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Login;
