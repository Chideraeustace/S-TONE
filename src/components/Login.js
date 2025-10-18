import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { auth, db } from "../Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Login = () => {
  const [mode, setMode] = useState("sign-up"); // Default to sign-up
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!userType) {
      toast.error("Please select a user type.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.email || !validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.password) {
      toast.error("Please enter a password.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    if (mode === "sign-up" && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    if (mode === "sign-up" && !formData.name) {
      toast.error("Please enter your name.", {
        position: "top-right",
        autoClose: 3000,
      });
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

        await setDoc(doc(db, "s-tone-users", user.uid), {
          name: formData.name,
          email: formData.email,
          userType: userType,
          createdAt: new Date(),
        });

        localStorage.setItem("userType", userType);
        localStorage.setItem("userId", user.uid);
        toast.success("Sign-up successful! Welcome to S-TONE Cosmetics!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        localStorage.setItem("userType", userType);
        localStorage.setItem("userId", user.uid);
        toast.success("Login successful! Welcome back!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      navigate(location.state?.from || "/", { replace: true });
    } catch (error) {
      console.error(
        `${mode === "sign-up" ? "Sign-up" : "Login"} error:`,
        error
      );
      toast.error(
        error.code === "auth/email-already-in-use"
          ? "Email already in use. Please try logging in."
          : error.code === "auth/user-not-found" ||
            error.code === "auth/wrong-password"
          ? "Invalid email or password."
          : `Failed to ${
              mode === "sign-up" ? "sign up" : "log in"
            }. Please try again.`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5F5F5] to-cream-100 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute w-72 h-72 bg-[#4A5D23] opacity-20 blur-3xl rounded-full top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-[#4A5D23] opacity-20 blur-3xl rounded-full bottom-10 right-10"></div>
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
            {mode === "sign-up" ? "Join S-TONE Cosmetics" : "Welcome Back!"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-gray-600 text-sm font-sans text-center mb-2"
          >
            {mode === "sign-up"
              ? "Sign up to explore our premium cosmetics"
              : "Log in to continue your beauty journey"}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-gray-400 text-xs font-sans text-center mb-6"
          >
            Select your user type to tailor your experience
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="space-y-4"
          >
            <div className="flex justify-center mb-4">
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
            </div>

            <form onSubmit={handleSubmit}>
              {mode === "sign-up" && (
                <div className="mb-4">
                  <label className="block text-sm font-sans text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-sans text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-sans text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans"
                  placeholder="Enter your password"
                  required
                />
              </div>
              {mode === "sign-up" && (
                <div className="mb-4">
                  <label className="block text-sm font-sans text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
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
              </div>
              <motion.button
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
                ) : (
                  "Log In"
                )}
              </motion.button>
            </form>
          </motion.div>

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
