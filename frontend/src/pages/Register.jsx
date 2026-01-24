import React, { useState } from "react";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Calculate password strength
  const calculatePasswordStrength = (pwd) => {
    if (pwd.length < 4) {
      return "Weak";
    }
    
    let strength = 0;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
    
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChar) strength++;
    
    if (pwd.length >= 5 && strength >= 3) {
      return "Strong";
    } else if (pwd.length >= 5) {
      return "Moderate";
    }
    return "Moderate";
  };

  // Update password strength on change
  const handlePasswordChange = (value) => {
    setPassword(value);
    if (value) {
      setPasswordStrength(calculatePasswordStrength(value));
    } else {
      setPasswordStrength("");
    }
  };

  // Handle name change - only allow letters and spaces
  const handleNameChange = (value) => {
    // Remove any non-letter characters except spaces
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
    setFullName(filteredValue);
  };

  // Check if password meets all requirements
  const isPasswordComplete = () => {
    if (password.length < 5) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
    return true;
  };

  // Validate all fields
  const validateForm = () => {
    const errors = {};

    // Name validation - at least 5 characters
    if (!fullName || fullName.trim().length < 5) {
      errors.fullName = "Name must be at least 5 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = "Please enter a valid Gmail address (example@gmail.com)";
    }

    // Phone validation - only numbers and length 10
    const phoneRegex = /^\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    // User type validation
    if (!userType) {
      errors.userType = "Please select a user type";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 5) {
      errors.password = "Password must be at least 5 characters";
    } else {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        errors.password = "Password must contain uppercase, lowercase, number, and special character";
      }
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Split full name into first and last name
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      // Call backend registration API
      const data = await authAPI.register({
        firstName,
        lastName,
        email,
        phone,
        userType,
        password,
      });

      console.log("Register response:", data);

      // Check for error first
      if (data.error) {
        setError(data.error);
        showToast(data.error, 'error');
        return;
      }

      // Check for success
      if (data.message && data.userId) {
        // Success
        showToast("Registration successful! Redirecting to login...", 'success');
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
      showToast("Registration failed. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-content">
            <span className="toast-message">{toast.message}</span>
            <button 
              className="toast-close"
              onClick={() => setToast(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="wrapper">
        <form onSubmit={handleRegister}>
          <h2>Register</h2>

          {error && <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

          <div className="input-box">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => handleNameChange(e.target.value)}
              disabled={loading}
            />
            {validationErrors.fullName && (
              <span className="validation-error">{validationErrors.fullName}</span>
            )}
          </div>

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {validationErrors.email && (
              <span className="validation-error">{validationErrors.email}</span>
            )}
          </div>

          <div className="input-box">
            <input
              type="tel"
              placeholder="Phone Number (10 digits only)"
              value={phone}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/[^\d]/g, "");
                setPhone(value);
              }}
              maxLength="10"
              disabled={loading}
            />
            {validationErrors.phone && (
              <span className="validation-error">{validationErrors.phone}</span>
            )}
          </div>

          <div className="input-box">
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              disabled={loading}
            >
              <option value="">Select User Type</option>
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
            {validationErrors.userType && (
              <span className="validation-error">{validationErrors.userType}</span>
            )}
          </div>

          <div className="input-box has-toggle">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
            {password && (
              <>
                <div className={`password-strength ${passwordStrength.toLowerCase()}`}></div>
                <span className={`password-strength-label ${passwordStrength.toLowerCase()}`}>
                  Strength: {passwordStrength}
                </span>
              </>
            )}
            {password && !isPasswordComplete() && (
              <div className="password-requirements">
                <small>Password must contain:</small>
                <ul>
                  <li className={password.length >= 5 ? "valid" : ""}>At least 5 characters</li>
                  <li className={/[A-Z]/.test(password) ? "valid" : ""}>Uppercase letter</li>
                  <li className={/[a-z]/.test(password) ? "valid" : ""}>Lowercase letter</li>
                  <li className={/\d/.test(password) ? "valid" : ""}>Number</li>
                  <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "valid" : ""}>Special character</li>
                </ul>
              </div>
            )}
            {validationErrors.password && (
              <span className="validation-error">{validationErrors.password}</span>
            )}
          </div>

          <div className="input-box has-toggle">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              title={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
            {validationErrors.confirmPassword && (
              <span className="validation-error">{validationErrors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="button-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
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

