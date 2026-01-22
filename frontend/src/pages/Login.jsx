import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { authAPI } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      // Call backend login API
      const data = await authAPI.login(email, password);

      console.log("Login response:", data);

      // Check for error first
      if (data.error) {
        setError("❌ " + data.error);
        return;
      }

      // Check for success
      if (data.message && data.user) {
        // Success - store user info
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", `${data.user.firstName} ${data.user.lastName}`);
        localStorage.setItem("userType", data.user.userType);

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedEmail", email);
        }

        setSuccess("✅ Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("❌ Login failed. Make sure backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Load saved email if user had remembered it
  React.useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="login-body">
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>

          {error && <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
          {success && <div className="success-message" style={{ color: "green", marginBottom: "10px" }}>{success}</div>}

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="remember-forgot">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="button-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
