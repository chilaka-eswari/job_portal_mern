import React, { useState } from "react";
import { validateFormData, validatePhoneNumber, sendOTP, verifyOTP } from "../Auth/auth";

const ApplyForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // OTP States
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  const [formData, setFormData] = useState({
    // Personal
    firstName: "",
    middleName: "",
    lastName: "",
    preferredName: "",
    email: "",
    altEmail: "",
    mobile: "",
    altMobile: "",
    dob: "",
    gender: "",

    // Address
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "",

    // Education (MULTIPLE)
    educationList: [
      {
        educationType: "",
        course: "",
        college: "",
        score: "",
        universityRegNo: "",
      },
    ],

    // Certification
    professionalCert: "",
    certName: "",
    proficiency: "",
    certNumber: "",
    issueDate: "",

    // Attachments
    resumeName: "",
    terms: false,
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle education change
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = [...formData.educationList];
    updatedEducation[index][name] = value;
    setFormData({ ...formData, educationList: updatedEducation });
    // Clear error
    if (errors[`education_${index}_${name}`]) {
      setErrors({ ...errors, [`education_${index}_${name}`]: "" });
    }
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      educationList: [
        ...formData.educationList,
        {
          educationType: "",
          course: "",
          college: "",
          score: "",
          universityRegNo: "",
        },
      ],
    });
  };

  const removeEducation = (index) => {
    const updatedEducation = formData.educationList.filter((_, i) => i !== index);
    setFormData({ ...formData, educationList: updatedEducation });
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (!validatePhoneNumber(formData.mobile)) {
      setOtpMessage("❌ Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setOtpMessage("");
    try {
      const response = await sendOTP(formData.mobile);
      if (response.success) {
        setOtpSent(true);
        setOtpMessage("✅ OTP sent successfully! Check your phone.");
      } else {
        setOtpMessage("❌ " + (response.message || "Failed to send OTP"));
      }
    } catch (error) {
      setOtpMessage("❌ Error sending OTP. Please try again.");
    }
    setLoading(false);
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!enteredOTP || enteredOTP.length !== 6) {
      setOtpMessage("❌ Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setOtpMessage("");
    try {
      const response = await verifyOTP(formData.mobile, enteredOTP);
      if (response.success) {
        setPhoneVerified(true);
        setShowOTPModal(false);
        setOtpMessage("");
        setOtpSent(false);
        setEnteredOTP("");
      } else {
        setOtpMessage("❌ Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpMessage("❌ Error verifying OTP. Please try again.");
    }
    setLoading(false);
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = validateFormData(formData);
    
    if (!phoneVerified) {
      validationErrors.mobile = "Phone number must be verified via OTP";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo(0, 0);
      return;
    }

    console.log("Application Submitted:", formData);
    setSubmitted(true);
  };

  // Success page
  if (submitted) {
    return (
      <div style={styles.successBox}>
        <h2>🎉 Application Submitted Successfully</h2>
        <p>Thank you for applying. We will contact you shortly.</p>
      </div>
    );
  }

  // OTP Modal
  if (showOTPModal) {
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modal}>
          <h3>Verify Your Phone Number</h3>
          <p>Enter the 6-digit OTP sent to {formData.mobile}</p>

          {!otpSent ? (
            <>
              <button 
                onClick={handleSendOTP} 
                disabled={loading}
                style={{ ...styles.button, marginBottom: "10px" }}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={enteredOTP}
                onChange={(e) => setEnteredOTP(e.target.value.replace(/\D/g, ""))}
                style={styles.input}
              />
              <button 
                onClick={handleVerifyOTP}
                disabled={loading}
                style={{ ...styles.button, marginBottom: "10px" }}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button 
                onClick={handleSendOTP}
                disabled={loading}
                style={{ ...styles.secondaryButton, marginBottom: "10px" }}
              >
                Resend OTP
              </button>
            </>
          )}

          {otpMessage && (
            <p style={otpMessage.includes("✅") ? styles.successText : styles.errorText}>
              {otpMessage}
            </p>
          )}

          <button 
            onClick={() => setShowOTPModal(false)}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Job Application Form</h2>

      <form onSubmit={handleSubmit}>
        {/* PERSONAL DETAILS */}
        <h3 style={styles.section}>Personal Details</h3>
        
        <div style={styles.formGroup}>
          <input 
            style={{...styles.input, borderColor: errors.firstName ? "red" : "#ccc"}}
            name="firstName" 
            placeholder="First Name *" 
            value={formData.firstName}
            onChange={handleChange} 
          />
          {errors.firstName && <p style={styles.errorText}>{errors.firstName}</p>}
        </div>

        <div style={styles.formGroup}>
          <input 
            style={styles.input}
            name="middleName" 
            placeholder="Middle Name" 
            value={formData.middleName}
            onChange={handleChange} 
          />
        </div>

        <div style={styles.formGroup}>
          <input 
            style={{...styles.input, borderColor: errors.lastName ? "red" : "#ccc"}}
            name="lastName" 
            placeholder="Last Name *" 
            value={formData.lastName}
            onChange={handleChange} 
          />
          {errors.lastName && <p style={styles.errorText}>{errors.lastName}</p>}
        </div>

        <div style={styles.formGroup}>
          <input 
            style={styles.input}
            name="preferredName" 
            placeholder="Preferred Name" 
            value={formData.preferredName}
            onChange={handleChange} 
          />
        </div>

        <div style={styles.formGroup}>
          <input 
            style={{...styles.input, borderColor: errors.email ? "red" : "#ccc"}}
            type="email" 
            name="email" 
            placeholder="Email *" 
            value={formData.email}
            onChange={handleChange} 
          />
          {errors.email && <p style={styles.errorText}>{errors.email}</p>}
        </div>

        <div style={styles.formGroup}>
          <input 
            style={{...styles.input, borderColor: errors.altEmail ? "red" : "#ccc"}}
            type="email" 
            name="altEmail" 
            placeholder="Alternate Email" 
            value={formData.altEmail}
            onChange={handleChange} 
          />
          {errors.altEmail && <p style={styles.errorText}>{errors.altEmail}</p>}
        </div>

        <div style={styles.formGroup}>
          <div style={styles.phoneContainer}>
            <input 
              style={{...styles.input, flex: 1, borderColor: errors.mobile ? "red" : "#ccc"}}
              name="mobile" 
              placeholder="Mobile Number *" 
              value={formData.mobile}
              maxLength="10"
              onChange={(e) => handleChange({...e, target: {...e.target, value: e.target.value.replace(/\D/g, "")}})}
            />
            {!phoneVerified && (
              <button 
                type="button"
                onClick={() => setShowOTPModal(true)}
                style={styles.otpButton}
              >
                Verify
              </button>
            )}
            {phoneVerified && <span style={styles.verifiedBadge}>✅ Verified</span>}
          </div>
          {errors.mobile && <p style={styles.errorText}>{errors.mobile}</p>}
        </div>

        <div style={styles.formGroup}>
          <input 
            style={{...styles.input, borderColor: errors.altMobile ? "red" : "#ccc"}}
            name="altMobile" 
            placeholder="Alternate Mobile" 
            value={formData.altMobile}
            maxLength="10"
            onChange={(e) => handleChange({...e, target: {...e.target, value: e.target.value.replace(/\D/g, "")}})}
          />
          {errors.altMobile && <p style={styles.errorText}>{errors.altMobile}</p>}
        </div>

        <div style={styles.formGroup}>
          <input 
            style={{...styles.input, borderColor: errors.dob ? "red" : "#ccc"}}
            type="date" 
            name="dob" 
            value={formData.dob}
            onChange={handleChange} 
          />
          {errors.dob && <p style={styles.errorText}>{errors.dob}</p>}
        </div>

        <div style={styles.formGroup}>
          <select 
            style={{...styles.input, borderColor: errors.gender ? "red" : "#ccc"}}
            name="gender" 
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender *</option>
            <option>Male</option>
            <option>Female</option>
            <option>I choose not to specify</option>
          </select>
          {errors.gender && <p style={styles.errorText}>{errors.gender}</p>}
        </div>

        {/* ADDRESS */}
        <h3 style={styles.section}>Address Details</h3>
        
        <div style={styles.formGroup}>
          <textarea 
            style={{...styles.textarea, borderColor: errors.address ? "red" : "#ccc"}}
            name="address" 
            placeholder="Address *" 
            value={formData.address}
            onChange={handleChange} 
          />
          {errors.address && <p style={styles.errorText}>{errors.address}</p>}
        </div>

        <div style={styles.formGroup}>
          <input 
            style={{...styles.input, borderColor: errors.pincode ? "red" : "#ccc"}}
            name="pincode" 
            placeholder="Pincode *" 
            value={formData.pincode}
            maxLength="6"
            onChange={(e) => handleChange({...e, target: {...e.target, value: e.target.value.replace(/\D/g, "")}})}
          />
          {errors.pincode && <p style={styles.errorText}>{errors.pincode}</p>}
        </div>

        <div style={styles.formGroup}>
          <input 
            style={{...styles.input, borderColor: errors.city ? "red" : "#ccc"}}
            name="city" 
            placeholder="City *" 
            value={formData.city}
            onChange={handleChange} 
          />
          {errors.city && <p style={styles.errorText}>{errors.city}</p>}
        </div>

        <div style={styles.formGroup}>
          <input 
            style={{...styles.input, borderColor: errors.state ? "red" : "#ccc"}}
            name="state" 
            placeholder="State *" 
            value={formData.state}
            onChange={handleChange} 
          />
          {errors.state && <p style={styles.errorText}>{errors.state}</p>}
        </div>

        <div style={styles.formGroup}>
          <input 
            style={{...styles.input, borderColor: errors.country ? "red" : "#ccc"}}
            name="country" 
            placeholder="Country *" 
            value={formData.country}
            onChange={handleChange} 
          />
          {errors.country && <p style={styles.errorText}>{errors.country}</p>}
        </div>

        {/* EDUCATION */}
        <h3 style={styles.section}>Education Details</h3>

        {formData.educationList.map((edu, index) => (
          <div key={index} style={styles.eduBox}>
            <h4>Education {index + 1}</h4>

            <div style={styles.formGroup}>
              <select
                style={{...styles.input, borderColor: errors[`education_${index}_type`] ? "red" : "#ccc"}}
                name="educationType"
                value={edu.educationType}
                onChange={(e) => handleEducationChange(index, e)}
              >
                <option value="">Select Education *</option>
                <option>X</option>
                <option>XII</option>
                <option>Diploma</option>
                <option>Bachelors</option>
                <option>Masters</option>
                <option>PhD</option>
              </select>
              {errors[`education_${index}_type`] && <p style={styles.errorText}>{errors[`education_${index}_type`]}</p>}
            </div>

            <div style={styles.formGroup}>
              <input
                style={{...styles.input, borderColor: errors[`education_${index}_course`] ? "red" : "#ccc"}}
                name="course"
                placeholder="Course / Branch *"
                value={edu.course}
                onChange={(e) => handleEducationChange(index, e)}
              />
              {errors[`education_${index}_course`] && <p style={styles.errorText}>{errors[`education_${index}_course`]}</p>}
            </div>

            <div style={styles.formGroup}>
              <input
                style={{...styles.input, borderColor: errors[`education_${index}_college`] ? "red" : "#ccc"}}
                name="college"
                placeholder="School / College Name *"
                value={edu.college}
                onChange={(e) => handleEducationChange(index, e)}
              />
              {errors[`education_${index}_college`] && <p style={styles.errorText}>{errors[`education_${index}_college`]}</p>}
            </div>

            <div style={styles.formGroup}>
              <input
                style={{...styles.input, borderColor: errors[`education_${index}_score`] ? "red" : "#ccc"}}
                name="score"
                placeholder="CGPA / Percentage *"
                value={edu.score}
                onChange={(e) => handleEducationChange(index, e)}
              />
              {errors[`education_${index}_score`] && <p style={styles.errorText}>{errors[`education_${index}_score`]}</p>}
            </div>

            <div style={styles.formGroup}>
              <input
                style={{...styles.input, borderColor: errors[`education_${index}_regNo`] ? "red" : "#ccc"}}
                name="universityRegNo"
                placeholder="University / Roll Number *"
                value={edu.universityRegNo}
                onChange={(e) => handleEducationChange(index, e)}
              />
              {errors[`education_${index}_regNo`] && <p style={styles.errorText}>{errors[`education_${index}_regNo`]}</p>}
            </div>

            {formData.educationList.length > 1 && (
              <button type="button" onClick={() => removeEducation(index)} style={styles.removeBtn}>
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addEducation} style={styles.addBtn}>
          + Add More Education
        </button>

        {/* CERTIFICATION */}
        <h3 style={styles.section}>Professional Certifications</h3>
        <div style={styles.formGroup}>
          <select 
            style={{...styles.input, borderColor: errors.professionalCert ? "red" : "#ccc"}}
            name="professionalCert" 
            value={formData.professionalCert}
            onChange={handleChange}
          >
            <option value="">Do you have certifications? *</option>
            <option>Yes</option>
            <option>No</option>
          </select>
          {errors.professionalCert && <p style={styles.errorText}>{errors.professionalCert}</p>}
        </div>

        {formData.professionalCert === "Yes" && (
          <>
            <div style={styles.formGroup}>
              <input 
                style={{...styles.input, borderColor: errors.certName ? "red" : "#ccc"}}
                name="certName" 
                placeholder="Certificate Name *" 
                value={formData.certName}
                onChange={handleChange} 
              />
              {errors.certName && <p style={styles.errorText}>{errors.certName}</p>}
            </div>

            <div style={styles.formGroup}>
              <select 
                style={{...styles.input, borderColor: errors.proficiency ? "red" : "#ccc"}}
                name="proficiency" 
                value={formData.proficiency}
                onChange={handleChange}
              >
                <option value="">Proficiency *</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              {errors.proficiency && <p style={styles.errorText}>{errors.proficiency}</p>}
            </div>

            <div style={styles.formGroup}>
              <input 
                style={{...styles.input, borderColor: errors.certNumber ? "red" : "#ccc"}}
                name="certNumber" 
                placeholder="Certificate Number *" 
                value={formData.certNumber}
                onChange={handleChange} 
              />
              {errors.certNumber && <p style={styles.errorText}>{errors.certNumber}</p>}
            </div>

            <div style={styles.formGroup}>
              <input 
                style={{...styles.input, borderColor: errors.issueDate ? "red" : "#ccc"}}
                type="date" 
                name="issueDate" 
                value={formData.issueDate}
                onChange={handleChange} 
              />
              {errors.issueDate && <p style={styles.errorText}>{errors.issueDate}</p>}
            </div>
          </>
        )}

        {/* ATTACHMENTS */}
        <h3 style={styles.section}>Attachments</h3>
        <label>Photo (Camera / Upload)</label>
        <input style={styles.input} type="file" accept="image/*" capture="environment" required />

        <div style={styles.formGroup}>
          <input 
            style={styles.input}
            name="resumeName" 
            placeholder="Resume Name *" 
            value={formData.resumeName}
            onChange={handleChange} 
          />
          {errors.resumeName && <p style={styles.errorText}>{errors.resumeName}</p>}
        </div>
        
        <label>Resume (PDF / DOC / DOCX)</label>
        <input style={styles.input} type="file" accept=".pdf,.doc,.docx" required />

        {/* TERMS */}
        <div style={styles.formGroup}>
          <label style={styles.checkbox}>
            <input 
              type="checkbox" 
              name="terms" 
              checked={formData.terms}
              onChange={handleChange} 
            /> I agree to Terms & Conditions
          </label>
          {errors.terms && <p style={styles.errorText}>{errors.terms}</p>}
        </div>

        <button style={styles.button} type="submit">
          Submit Application
        </button>
      </form>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: "900px",
    margin: "30px auto",
    padding: "25px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 0 12px rgba(0,0,0,0.1)",
  },
  heading: { textAlign: "center", marginBottom: "30px" },
  section: { marginTop: "25px", color: "#0d6efd", marginBottom: "15px" },
  formGroup: { marginBottom: "15px" },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  phoneContainer: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  otpButton: {
    padding: "10px 15px",
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  verifiedBadge: {
    color: "green",
    fontWeight: "bold",
    fontSize: "14px",
  },
  checkbox: { display: "flex", alignItems: "center", gap: "10px" },
  button: {
    width: "100%",
    padding: "12px",
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "4px",
    marginTop: "20px",
  },
  secondaryButton: {
    width: "100%",
    padding: "10px",
    background: "#6c757d",
    color: "#fff",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  cancelButton: {
    width: "100%",
    padding: "10px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  eduBox: {
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "4px",
  },
  addBtn: {
    padding: "10px 15px",
    marginBottom: "20px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  removeBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "4px",
    marginTop: "10px",
  },
  successBox: {
    maxWidth: "600px",
    margin: "80px auto",
    padding: "40px",
    textAlign: "center",
    background: "#d4edda",
    border: "1px solid #c3e6cb",
    borderRadius: "4px",
  },
  errorText: {
    color: "#dc3545",
    fontSize: "12px",
    marginTop: "5px",
  },
  successText: {
    color: "#28a745",
    fontSize: "14px",
    marginTop: "10px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 0 20px rgba(0,0,0,0.2)",
    maxWidth: "400px",
    width: "90%",
  },
};

export default ApplyForm;