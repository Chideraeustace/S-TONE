import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [userType, setUserType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (userType) {
      localStorage.setItem("userType", userType);
      setTimeout(() => {
        toast.success(`User type ${userType} saved successfully!`, {
          position: "top-right",
          autoClose: 3000,
        });
        setIsSubmitting(false);
        navigate("/"); // Navigate to home page
      }, 500);
    } else {
      toast.error("Please select a user type.", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute w-72 h-72 bg-blue-300 opacity-30 blur-3xl rounded-full top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-purple-300 opacity-30 blur-3xl rounded-full bottom-10 right-10"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-md">
        {/* Animated Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-xl shadow-2xl border border-gray-200 rounded-2xl p-10"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-4xl font-bold text-gray-900 mb-3 text-center"
          >
            Welcome Back!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-gray-600 mb-2 text-center text-lg"
          >
            Select your user type to continue
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-gray-400 mb-8 text-center text-sm"
          >
            This helps us tailor your experience
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="space-y-6"
          >
            {/* User Type Selection */}
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-3">
                Choose User Type
              </label>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                {/* Regular User */}
                <label
                  className={`flex items-center p-4 rounded-xl cursor-pointer border transition-all w-full sm:w-1/2
                    ${
                      userType === "regular"
                        ? "bg-blue-50 border-blue-600 shadow-md"
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
                  <User className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-800 font-medium">
                    Regular User
                  </span>
                </label>

                {/* Business User */}
                <label
                  className={`flex items-center p-4 rounded-xl cursor-pointer border transition-all w-full sm:w-1/2
                    ${
                      userType === "business"
                        ? "bg-blue-50 border-blue-600 shadow-md"
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
                  <Briefcase className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-800 font-medium">
                    Business User
                  </span>
                </label>
              </div>
            </div>

            {/* Blue Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 
                      5.373 0 12h4zm2 5.291A7.962 7.962 0 014 
                      12H0c0 3.042 1.135 5.824 3 
                      7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Continue"
              )}
            </motion.button>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-xs text-gray-400 mt-6 text-center"
          >
            Having trouble?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
              Contact support
            </span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Login;
