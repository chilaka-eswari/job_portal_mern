import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applicationAPI } from "../services/api";
import "./style.css";
const ApplyForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sample job data - in a real app, fetch from API using jobId
  const jobData = {
    1: { title: 'Software Engineer', company: 'Tech Corp', location: 'New York, NY' },
    2: { title: 'Data Analyst', company: 'Data Inc', location: 'San Francisco, CA' },
    3: { title: 'Frontend Developer', company: 'Web Solutions', location: 'Austin, TX' },
    4: { title: 'UX Designer', company: 'Design Studio', location: 'Los Angeles, CA' },
    5: { title: 'Backend Engineer', company: 'Server Tech', location: 'Seattle, WA' },
    6: { title: 'Product Manager', company: 'Innovate Ltd', location: 'Chicago, IL' },
  };

  const currentJob = jobData[jobId] || { title: 'Job Position', company: 'Company', location: 'Location' };

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

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = [...formData.educationList];
    updatedEducation[index][name] = value;
    setFormData({ ...formData, educationList: updatedEducation });
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
    const updatedEducation = formData.educationList.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, educationList: updatedEducation });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.terms) {
      alert("Please accept the Terms & Conditions");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Get user info from localStorage
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo || !userInfo._id) {
        setError("Please login to apply for jobs");
        return;
      }

      // Prepare application data
      const applicationData = {
        applicant: userInfo._id,
        job: jobId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || userInfo.email,
        phone: formData.mobile || userInfo.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        resume: formData.resumeName || "resume.pdf",
        education: formData.educationList,
        certifications: formData.professionalCert === "Yes" ? [{
          name: formData.certName,
          proficiency: formData.proficiency,
          certNumber: formData.certNumber,
          issueDate: formData.issueDate,
        }] : [],
      };

      // Submit application to backend
      const response = await applicationAPI.submitApplication(applicationData);

      if (response.error) {
        setError(response.error);
        return;
      }

      console.log("Application submitted:", response);
      setSubmitted(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/jobs");
      }, 2000);
    } catch (err) {
      console.error("Error submitting application:", err);
      setError(err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SUCCESS PAGE ----------------
  if (submitted) {
    return (
      <div style={styles.successBox}>
        <h2>🎉 Application Submitted Successfully</h2>
        <p>Thank you for applying. We will contact you shortly.</p>
        <p style={{fontSize: '12px', marginTop: '20px', color: '#666'}}>Redirecting to jobs...</p>
      </div>
    );
  }

  // ---------------- FORM ----------------
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Job Application Form</h2>
      
      {/* Job Info Display */}
      <div style={styles.jobInfoBox}>
        <h3>Applying for:</h3>
        <p><strong>{currentJob.title}</strong></p>
        <p>Company: {currentJob.company}</p>
        <p>Location: {currentJob.location}</p>
        <button 
          type="button" 
          style={styles.backBtn} 
          onClick={() => navigate(`/jobs/${jobId}`)}
        >
          ← Back to Job Details
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* PERSONAL DETAILS */}
        <h3 style={styles.section}>Personal Details</h3>
        <input style={styles.input} name="firstName" placeholder="First Name *" required onChange={handleChange} />
        <input style={styles.input} name="middleName" placeholder="Middle Name" onChange={handleChange} />
        <input style={styles.input} name="lastName" placeholder="Last Name *" required onChange={handleChange} />
        <input style={styles.input} name="preferredName" placeholder="Preferred Name" onChange={handleChange} />

        <input style={styles.input} type="email" name="email" placeholder="Email *" required onChange={handleChange} />
        <input style={styles.input} type="email" name="altEmail" placeholder="Alternate Email" onChange={handleChange} />

        <input style={styles.input} name="mobile" placeholder="Mobile Number *" required onChange={handleChange} />
        <input style={styles.input} name="altMobile" placeholder="Alternate Mobile" onChange={handleChange} />

        <input style={styles.input} type="date" name="dob" required onChange={handleChange} />

        <select style={styles.input} name="gender" required onChange={handleChange}>
          <option value="">Select Gender *</option>
          <option>Male</option>
          <option>Female</option>
          <option>I choose not to specify</option>
        </select>

        {/* ADDRESS */}
        <h3 style={styles.section}>Address Details</h3>
        <textarea style={styles.textarea} name="address" placeholder="Address *" required onChange={handleChange} />
        <input style={styles.input} name="pincode" placeholder="Pincode *" required onChange={handleChange} />
        <input style={styles.input} name="city" placeholder="City *" required onChange={handleChange} />
        <input style={styles.input} name="state" placeholder="State *" required onChange={handleChange} />
        <input style={styles.input} name="country" placeholder="Country *" required onChange={handleChange} />

        {/* EDUCATION */}
        <h3 style={styles.section}>Education Details</h3>

        {formData.educationList.map((edu, index) => (
          <div key={index} style={styles.eduBox}>
            <h4>Education {index + 1}</h4>

            <select
              style={styles.input}
              name="educationType"
              required
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

            <input
              style={styles.input}
              name="course"
              placeholder="Course / Branch *"
              required
              value={edu.course}
              onChange={(e) => handleEducationChange(index, e)}
            />

            <input
              style={styles.input}
              name="college"
              placeholder="School / College Name *"
              required
              value={edu.college}
              onChange={(e) => handleEducationChange(index, e)}
            />

            <input
              style={styles.input}
              name="score"
              placeholder="CGPA / Percentage *"
              required
              value={edu.score}
              onChange={(e) => handleEducationChange(index, e)}
            />

            <input
              style={styles.input}
              name="universityRegNo"
              placeholder="University / Roll Number *"
              required
              value={edu.universityRegNo}
              onChange={(e) => handleEducationChange(index, e)}
            />

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
        <select style={styles.input} name="professionalCert" required onChange={handleChange}>
          <option value="">Do you have certifications? *</option>
          <option>Yes</option>
          <option>No</option>
        </select>

        {formData.professionalCert === "Yes" && (
          <>
            <input style={styles.input} name="certName" placeholder="Certificate Name *" required onChange={handleChange} />
            <select style={styles.input} name="proficiency" required onChange={handleChange}>
              <option value="">Proficiency *</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <input style={styles.input} name="certNumber" placeholder="Certificate Number *" required onChange={handleChange} />
            <input style={styles.input} type="date" name="issueDate" required onChange={handleChange} />
          </>
        )}

        {/* ATTACHMENTS */}
        <h3 style={styles.section}>Attachments</h3>
        <label>Photo (Camera / Upload)</label>
        <input style={styles.input} type="file" accept="image/*" capture="environment" required />

        <input style={styles.input} name="resumeName" placeholder="Resume Name *" required onChange={handleChange} />
        <label>Resume (PDF / DOC / DOCX)</label>
        <input style={styles.input} type="file" accept=".pdf,.doc,.docx" required />

        {/* TERMS */}
        <label style={styles.checkbox}>
          <input type="checkbox" name="terms" onChange={handleChange} /> I agree to Terms & Conditions
        </label>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

// ---------------- STYLES ----------------
const styles = {
  container: {
    maxWidth: "900px",
    margin: "30px auto",
    padding: "25px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 0 12px rgba(0,0,0,0.1)",
  },
  heading: { textAlign: "center" },
  section: { marginTop: "25px", color: "#0d6efd" },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    margin: "8px 0",
  },
  checkbox: { display: "block", margin: "15px 0" },
  button: {
    width: "100%",
    padding: "12px",
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  errorMessage: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "4px",
    margin: "15px 0",
    border: "1px solid #f5c6cb",
  },
  eduBox: {
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "15px",
  },
  addBtn: {
    padding: "8px 12px",
    marginBottom: "10px",
  },
  removeBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
  },
  successBox: {
    maxWidth: "600px",
    margin: "80px auto",
    padding: "40px",
    textAlign: "center",
    background: "#e6fffa",
  },
  jobInfoBox: {
    background: "#f0f8ff",
    border: "2px solid #0d6efd",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "30px",
    color: "#333",
  },
  backBtn: {
    padding: "10px 15px",
    background: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "15px",
    fontSize: "14px",
  },
};

export default ApplyForm;
