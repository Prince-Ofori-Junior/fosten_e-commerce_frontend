import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  const API_BASE = process.env.REACT_APP_API_BASE_URL;
  const REDIRECT_PATH = process.env.REACT_APP_DEFAULT_REDIRECT;

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const res = await fetch(`${API_BASE}/csrf-token`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch CSRF token");
        const data = await res.json();
        setCsrfToken(data.csrfToken);
      } catch (err) {
        console.error("Failed to fetch CSRF token", err);
      }
    };
    fetchCsrf();
  }, [API_BASE]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        credentials: "include", // for CSRF cookies
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorsObj = {};
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err) => {
            if (err.param) errorsObj[err.param] = err.msg || err.message;
          });
          if (Object.keys(errorsObj).length > 0) {
            setFieldErrors(errorsObj);
            throw new Error("Please fix the errors above.");
          }
        }
        throw new Error(data.message || "Invalid email or password");
      }

      // Login success
      localStorage.setItem("token", data.data?.accessToken || "");
      setSuccess("✅ Login successful! Redirecting...");
      setTimeout(() => navigate(REDIRECT_PATH), 1500);
    } catch (err) {
      setGeneralError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>

        {generalError && <p className="error-message">{generalError}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {fieldErrors.password && <p className="error-message">{fieldErrors.password}</p>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

       <p className="auth-switch-text">
  New user?{" "}
  <span className="auth-switch-link" onClick={() => navigate("/register")}>
    Register here
  </span>
</p>



        <div className="divider"><span>or</span></div>

        <div className="social-login">
          <button className="google-btn" type="button">
            <FaGoogle className="icon" /> Login with Google
          </button>
          <button className="facebook-btn" type="button">
            <FaFacebookF className="icon" /> Login with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
