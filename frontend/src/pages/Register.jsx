import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

const Register = () => {
   
  return (
    <div className="login-body">
      <div className="wrapper">
        <form>
          <h2>Register</h2>

          <div className="input-box">
            <input type="text" placeholder="Full Name" required />
          </div>

          <div className="input-box">
            <input type="email" placeholder="Email" required />
          </div>

          <div className="input-box">
            <input type="password" placeholder="Create Password" required />
          </div>

          <div className="input-box">
            <input type="password" placeholder="Confirm Password" required />
          </div>

          <button type="submit" className="button-btn">
            Register
          </button>

          <div className="register-link">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

