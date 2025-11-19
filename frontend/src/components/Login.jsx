import React, { useContext, useState } from "react";
import { authStyles as styles } from "../assets/dummystyle";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { validateEmail } from "../utils/helper";
import { UserContext } from "../context/UserContext";
import { Input } from "./Input.jsx";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    setError(null);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      console.log("Login successful:", response.data);

      const { token, user } = response.data;

      if (token) {
        // ✅ Save token & user
        localStorage.setItem("token", token);
        updateUser(user);
        // After successful login, go to dashboard. Creating a resume is now
        // an explicit user action (use the "Create Resume" button/form).
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);

      setError(
        error.response?.data?.message || "An error occurred during login"
      );
    }
  };

  return (
    <div className={styles.Container}>
      {/* Header */}
      <h3 className={styles.loginTitle}>Welcome Back</h3>
      <p className={styles.switchText}>
        Don't have an account?
        <button
          type="button"
          className={styles.signupSwitchButton}
          onClick={() => {
            if (typeof setCurrentPage === "function") {
              setCurrentPage("SignUp");
            } else {
              navigate("/signup");
            }
          }}
        >
          Sign Up
        </button>
      </p>
      <p className={styles.loginSubtitle}>Sign in to continue</p>

      {/* Error */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Form */}
      <form className={styles.form} onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          label="Email"
          type="email"
        />

        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          label="Password"
          type="password"
        />

        <button type="submit" className={styles.loginButton}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
