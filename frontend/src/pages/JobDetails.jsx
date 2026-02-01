import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { displayAPI, jobAPI } from "../services/api";
import "./style.css";
import Footer from "../components/Footer";
import AuthPromptModal from "../components/AuthPromptModal";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const userInfoStr = localStorage.getItem("userInfo");
    if (userInfoStr) {
      setUserInfo(JSON.parse(userInfoStr));
    }
    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    if (userInfo && job) {
      checkIfJobSaved();
    }
  }, [userInfo, job]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const data = await displayAPI.getJobById(id);
      
      if (data.error) {
        setError(data.error || "Failed to load job details");
      } else {
        setJob(data.job);
      }
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("Error loading job details");
    } finally {
      setLoading(false);
    }
  };

  const checkIfJobSaved = async () => {
    try {
      const result = await jobAPI.isJobSaved(userInfo._id, job._id);
      if (result && result.isSaved !== undefined) {
        setIsSaved(result.isSaved);
      }
    } catch (err) {
      console.error("Error checking if job is saved:", err);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveJob = async () => {
    if (!userInfo) {
      setShowAuthModal(true);
      return;
    }

    try {
      setIsSaving(true);
      if (isSaved) {
        const result = await jobAPI.unsaveJob(userInfo._id, job._id);
        if (result.error) {
          showToast("Failed to unsave job", 'error');
        } else {
          setIsSaved(false);
          showToast("Job removed from saved", 'success');
        }
      } else {
        const result = await jobAPI.saveJob(userInfo._id, job._id);
        if (result.error) {
          showToast(result.error || "Failed to save job", 'error');
        } else {
          setIsSaved(true);
          showToast("Job saved successfully!", 'success');
        }
      }
    } catch (err) {
      console.error("Error saving job:", err);
      showToast("Error saving job", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="job-details-main">
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-details-page">
        <div className="job-details-main">
          <div style={{textAlign: 'center', padding: '40px'}}>
            <p style={{color: '#e74c3c', fontSize: '16px'}}>{error}</p>
            <button 
              onClick={() => navigate("/jobs")}
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
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page">
        <div className="job-details-main">
          <p>Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
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

      <div className="job-details-main">
        <AuthPromptModal
          visible={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={() => { setShowAuthModal(false); navigate('/login'); }}
          onRegister={() => { setShowAuthModal(false); navigate('/register'); }}
        />
        {/* Job Header Card */}
        <div className="job-header-card">
          <div>
            <h1>{job.title}</h1>
            <h3>{job.company}</h3>

            <div className="job-meta">
              <span>{job.experience}</span>
              <span>
                {job.salary && job.salary.min && job.salary.max
                  ? `${job.salary.min} - ${job.salary.max}`
                  : "Salary Not Specified"}
              </span>
              <span>{job.location}</span>
            </div>
          </div>

          <div className="job-actions">
            <button 
              className={`save-btn ${isSaved ? 'saved' : ''}`}
              onClick={handleSaveJob}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
            </button>
            <button className="apply-btn" onClick={() => {
              if (!userInfo) setShowAuthModal(true);
              else navigate(`/apply/${id}`);
            }}>
              Apply
            </button>
          </div>
        </div>

        {/* Job Stats */}
        <div className="job-stats">
          <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
          <span>Status: {job.status || 'Open'}</span>
        </div>

        {/* Job Description */}
        <section className="job-section">
          <h2>Job Description</h2>
          <p>{job.description}</p>
        </section>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <section className="job-section">
            <h2>Requirements</h2>
            <ul>
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Key Skills */}
        {job.skills && job.skills.length > 0 && (
          <section className="job-section">
            <h2>Key Skills</h2>
            <div className="skills">
              {job.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Posted By */}
        {job.postedBy && (
          <section className="job-section">
            <h2>Posted By</h2>
            <p>
              <strong>{job.postedBy.firstName} {job.postedBy.lastName}</strong>
              <br />
              Email: {job.postedBy.email}
            </p>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};



export default JobDetails;
