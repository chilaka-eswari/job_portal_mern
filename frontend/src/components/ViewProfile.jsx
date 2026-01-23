import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import "./style.css";

const ViewProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // ✅ Fetch user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Get userInfo from localStorage
      const userInfoStr = localStorage.getItem("userInfo");
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      
      if (!isLoggedIn || !userInfoStr) {
        console.warn("User not logged in, redirecting to login");
        setError("Please login to view profile");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const userInfo = JSON.parse(userInfoStr);
      
      if (!userInfo || !userInfo._id) {
        setError("Invalid user information. Please login again.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      // Fetch complete user profile from backend
      const data = await authAPI.getUserById(userInfo._id);
      
      if (data && data.user) {
        setProfile(data.user);
        setEditData(data.user);
      } else if (data.error) {
        setError(data.error || "Failed to load profile");
      } else {
        setError("Failed to load profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Error loading profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profile);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const response = await authAPI.updateProfile(userInfo._id, editData);

      if (response.message) {
        setProfile(editData);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="view-profile-page">
        <div className="profile-container">
          <p className="loading-message">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-profile-page">
        <div className="profile-container">
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{color: '#e74c3c', fontSize: '16px', marginBottom: '20px'}}>
              ❌ {error}
            </p>
            <button 
              onClick={() => navigate("/login")}
              style={{
                padding: '10px 20px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header-section">
          <h1>👤 My Profile</h1>
          {!isEditing && (
            <button className="edit-btn" onClick={handleEdit}>
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          {/* Personal Information */}
          <div className="profile-section">
            <h2>📋 Personal Information</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={editData.firstName || ""}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{profile?.firstName}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={editData.lastName || ""}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{profile?.lastName}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email || ""}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{profile?.email}</p>
                )}
              </div>

              <div className="profile-field">
                <label>Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone || ""}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                ) : (
                  <p>{profile?.phone}</p>
                )}
              </div>

              <div className="profile-field">
                <label>User Type</label>
                <p className="badge" style={{
                  backgroundColor: profile?.userType === 'employer' ? '#e74c3c' : '#27ae60'
                }}>
                  {profile?.userType === 'employer' ? '💼 Employer' : '👤 Job Seeker'}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="profile-section">
            <h2>📝 Bio</h2>
            <div className="profile-field full-width">
              <label>About You</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editData.bio || ""}
                  onChange={handleInputChange}
                  className="profile-textarea"
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              ) : (
                <p>{profile?.bio || "No bio provided"}</p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="profile-section">
            <h2>🔧 Skills</h2>
            {isEditing ? (
              <div className="profile-field full-width">
                <textarea
                  name="skills"
                  value={editData.skills?.join(", ") || ""}
                  onChange={(e) => setEditData({
                    ...editData,
                    skills: e.target.value.split(",").map(s => s.trim()).filter(s => s)
                  })}
                  className="profile-textarea"
                  placeholder="Enter skills separated by commas (e.g., React, Node.js, MongoDB)"
                  rows="3"
                />
              </div>
            ) : (
              <div className="skills-list">
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))
                ) : (
                  <p>No skills added yet</p>
                )}
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="profile-section">
            <h2>💼 Experience</h2>
            {profile?.experience && profile.experience.length > 0 ? (
              profile.experience.map((exp, idx) => (
                <div key={idx} className="experience-item">
                  <h4>{exp.jobTitle}</h4>
                  <p className="company">{exp.company}</p>
                  <p className="duration">{exp.duration}</p>
                  <p className="description">{exp.description}</p>
                </div>
              ))
            ) : (
              <p>No experience added yet</p>
            )}
          </div>

          {/* Education */}
          <div className="profile-section">
            <h2>🎓 Education</h2>
            {profile?.education && profile.education.length > 0 ? (
              profile.education.map((edu, idx) => (
                <div key={idx} className="education-item">
                  <h4>{edu.degree}</h4>
                  <p className="school">{edu.school}</p>
                  <p className="field">{edu.field}</p>
                  <p className="year">Graduation: {edu.graduationYear}</p>
                </div>
              ))
            ) : (
              <p>No education added yet</p>
            )}
          </div>

          {/* Account Information */}
          <div className="profile-section">
            <h2>🔐 Account Information</h2>
            <div className="profile-grid">
              <div className="profile-field">
                <label>Member Since</label>
                <p>{new Date(profile?.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="profile-field">
                <label>Profile Status</label>
                <p className="badge" style={{ backgroundColor: '#3498db' }}>
                  ✅ Active
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="profile-actions">
              <button className="save-btn" onClick={handleSaveProfile}>
                💾 Save Changes
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                ❌ Cancel
              </button>
            </div>
          )}

          {!isEditing && (
            <div className="profile-actions">
              <button className="back-btn" onClick={() => navigate("/")}>
                ← Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
