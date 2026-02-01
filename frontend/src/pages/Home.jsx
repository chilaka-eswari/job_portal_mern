import React, { useState, useEffect } from "react";
//import Navbar from "../components/Navbar";
import "./style.css";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { displayAPI } from "../services/api";
import AuthPromptModal from "../components/AuthPromptModal";



/* Search Job Section Component */
const SearchJobSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchTerm, "in", location);
  };

  return (
    <section className="search-job">
      <div className="search-container">
        <input
          type="text"
          placeholder="Job title, keywords, or company"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="location-dropdown"
        >
          <option value="">Select Location</option>
          <option value="New York, NY">New York</option>
          <option value="San Francisco, CA">San Francisco</option>
          <option value="London, UK">London</option>
          <option value="Remote">Remote</option>
        </select>

        <button onClick={handleSearch} className="search-btn">
          Search Jobs
        </button>
      </div>
    </section>
  );
};

/* Homepage Component */
const Homepage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch jobs from database on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await displayAPI.getAllJobs();
        if (data.success && data.jobs) {
          setJobs(data.jobs);
        } else {
          setError("Failed to fetch jobs");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Error fetching jobs from database");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = (jobId) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || !!localStorage.getItem('userInfo');
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    navigate(`/apply/${jobId}`);
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div>
      {/* Navbar at the top */}
      {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-heading">Find Your Dream Job Today</h1>
          <p className="hero-description">
            Connect with top employers and discover opportunities tailored to your skills.
            Whether you're a job seeker or an employee looking to advance, our platform
            makes it easy to find the perfect match.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <SearchJobSection />

      {/* Job Listings */}
      <section className="job-listings">
        <h2>Job Listings</h2>
        
        {loading && <p className="loading-message">Loading jobs...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {!loading && !error && jobs.length === 0 && (
          <p className="no-jobs-message">No jobs available at the moment.</p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="job-grid">
            {jobs.slice(0, 6).map((job) => (
              <div key={job._id || job.id} className="job-card">
                <h3>{job.jobTitle || job.title}</h3>
                <p>{job.companyName || job.company}</p>
                <p>{job.location}</p>

                <div className="job-buttons">
                  <button onClick={() => handleApply(job._id || job.id)}>Apply</button>
                  <button onClick={() => handleViewDetails(job._id || job.id)}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="see-more-wrapper">
          <button
            className="see-more-btn"
            onClick={() => navigate("/jobs")}
          >
            See More
          </button>

        </div>
      </section>
      <Footer />

      <AuthPromptModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => { setShowAuthModal(false); window.location.href = '/login'; }}
        onRegister={() => { setShowAuthModal(false); window.location.href = '/register'; }}
      />
    </div>

  );
};

export default Homepage;
