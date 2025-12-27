import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // prevent page reload

    // TODO: validate user / call API later

    // Redirect to Home page
    navigate("/");
  };

  return (
    <div className="login-body">
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>

          <div className="input-box">
            <input type="text" placeholder="Username" required />
          </div>

          <div className="input-box">
            <input type="password" placeholder="Password" required />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="button-btn">
            Login
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
