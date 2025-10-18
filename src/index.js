import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./index.css";
import App from "./App";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { CartProvider } from "./components/CartContext";
import { CategoriesProvider } from "./components/CategoriesContex";
import { auth } from "./Firebase";

const Root = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[DEBUG] Initializing onAuthStateChanged");
    const unsubscribe = auth.onAuthStateChanged(
      (currentUser) => {
        console.log("[DEBUG] onAuthStateChanged fired:", {
          currentUser: currentUser
            ? { uid: currentUser.uid, email: currentUser.email }
            : null,
          authCurrentUser: auth.currentUser
            ? { uid: auth.currentUser.uid, email: auth.currentUser.email }
            : null,
        });
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error("[DEBUG] onAuthStateChanged error:", error);
        setLoading(false);
      }
    );
    AOS.init({ duration: 1000 });
    return () => {
      console.log("[DEBUG] Cleaning up onAuthStateChanged");
      unsubscribe();
    };
  }, []);

  if (loading) {
    console.log("[DEBUG] Rendering loading state");
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-cream-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#4A5D23]"></div>
      </div>
    );
  }

  console.log(
    "[DEBUG] Rendering routes, user:",
    user ? { uid: user.uid, email: user.email } : null
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <>
                {console.log(
                  "[DEBUG] /login route: Redirecting to / for authenticated user",
                  { uid: user.uid }
                )}
                <Navigate to="/" replace />
              </>
            ) : (
              <>
                {console.log(
                  "[DEBUG] /login route: Rendering Login for unauthenticated user"
                )}
                <Login />
              </>
            )
          }
        />
        <Route
          path="/*"
          element={
            user ? (
              <>
                {console.log(
                  "[DEBUG] /* route: Rendering App for authenticated user",
                  { uid: user.uid }
                )}
                <App />
              </>
            ) : (
              <>
                {console.log(
                  "[DEBUG] /* route: Redirecting to /login for unauthenticated user"
                )}
                <Navigate
                  to="/login"
                  replace
                  state={{ from: window.location.pathname }}
                />
              </>
            )
          }
        />
        <Route
          path="/admin"
          element={
            user ? (
              <>
                {console.log(
                  "[DEBUG] /admin route: Rendering Dashboard for authenticated user",
                  { uid: user.uid }
                )}
                <Dashboard />
              </>
            ) : (
              <>
                {console.log(
                  "[DEBUG] /admin route: Redirecting to /login for unauthenticated user"
                )}
                <Navigate to="/login" replace state={{ from: "/admin" }} />
              </>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CartProvider>
      <CategoriesProvider>
        <Root />
      </CategoriesProvider>
    </CartProvider>
  </React.StrictMode>
);
