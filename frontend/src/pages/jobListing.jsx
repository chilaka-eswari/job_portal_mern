import React, { useState, useEffect } from 'react';
import './style.css';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";
import { displayAPI } from '../services/api';
import AuthPromptModal from "../components/AuthPromptModal";

const JobListing = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);


  // ✅ Fetch jobs from backend on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await displayAPI.getAllJobs();
      if (data.success) {
        setJobs(data.jobs || []);
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    return (
      (jobTitle === '' || job.title.toLowerCase().includes(jobTitle.toLowerCase())) &&
      (location === '' || job.location.toLowerCase().includes(location.toLowerCase())) &&
      (jobType === '' || job.jobType === jobType) &&
      (experienceLevel === '' || job.experience === experienceLevel) &&
      (salaryRange === '')
    );
  });

  const handleSearch = () => {
    console.log('Searching with:', { jobTitle, location, jobType, experienceLevel, salaryRange });
  };

  const handleClearFilters = () => {
    setJobTitle('');
    setLocation('');
    setJobType('');
    setExperienceLevel('');
    setSalaryRange('');
  };

  const handleViewMore = () => {
    console.log('Loading more jobs...');
  };

  const handleAuthRequired = () => setShowAuthModal(true);


  if (loading) {
    return (
      <div className="job-listing-page">
        <div className="job-listing-header">
          <div className="header-content">
            <h1>Explore Job Opportunities</h1>
            <p>Find your perfect job match from thousands of opportunities</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Loading jobs...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-listing-page">
        <div className="job-listing-header">
          <div className="header-content">
            <h1>Explore Job Opportunities</h1>
            <p>Find your perfect job match from thousands of opportunities</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
          <h2>❌ {error}</h2>
          <p>Make sure backend server is running on port 5000</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="job-listing-page">
      {/* Header Section */}
      <div className="job-listing-header">
        <div className="header-content">
          <h1>Explore Job Opportunities</h1>
          <p>Find your perfect job match from thousands of opportunities</p>
        </div>
      </div>

      <div className="job-listing-wrapper">
        {/* Left Sidebar - Filters */}
        <aside className="job-filters-sidebar">
          <div className="filters-header">
            <h2>Filters</h2>
            <button onClick={handleClearFilters} className="clear-filters-btn">Clear All</button>
          </div>

          <div className="filter-group">
            <label className="filter-label">🔍 Job Title</label>
            <input
              type="text"
              placeholder="Search job title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">📍 Location</label>
            <input
              type="text"
              placeholder="Search location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">💼 Job Type</label>
            <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="filter-select">
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">📊 Experience Level</label>
            <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="filter-select">
              <option value="">All Levels</option>
              <option value="Entry-level">Entry-level</option>
              <option value="Mid-level">Mid-level</option>
              <option value="Senior-level">Senior-level</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">💰 Salary Range</label>
            <select value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} className="filter-select">
              <option value="">All Ranges</option>
              <option value="$50k - $70k">$50k - $70k</option>
              <option value="$70k - $90k">$70k - $90k</option>
              <option value="$80k - $100k">$80k - $100k</option>
              <option value="$100k+">$100k+</option>
            </select>
          </div>

          <button onClick={handleSearch} className="apply-filters-btn">Apply Filters</button>
        </aside>

        {/* Right Content - Job Listings */}
        <main className="job-listings-main">
          <div className="results-header">
            <h2>
              {filteredJobs.length === 0 
                ? '❌ No jobs found' 
                : `✅ Found ${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''}`
              }
            </h2>
          </div>

          {/* Job List */}
          <div className="jobs-grid">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard key={job._id} job={job} onAuthRequired={handleAuthRequired} />
              ))
            ) : (
              <div className="no-jobs-found">
                <p>Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* View More Button */}
          {filteredJobs.length > 0 && (
            <div className="view-more-container">
              <button onClick={handleViewMore} className="view-more-btn">Load More Jobs</button>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
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

// JobCard Component
const JobCard = ({ job, onAuthRequired }) => {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || !!localStorage.getItem('userInfo');
    if (!isLoggedIn) {
      if (onAuthRequired) onAuthRequired();
      return;
    }
    navigate(`/apply/${job._id}`);
  };

  const getTypeColor = (type) => {
    return type === 'Full-time' ? '#667eea' : '#f39c12';
  };

  const getExperienceColor = (exp) => {
    if (exp === 'Entry Level') return '#27ae60';
    if (exp === 'Mid Level') return '#3498db';
    return '#e74c3c';
  };

  // Format salary range
  const formatSalary = (salary) => {
    if (!salary || !salary.min || !salary.max) return 'Competitive';
    return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
  };

  return (
    <div className="job-card-modern">
      <div className="job-card-header">
        <div className="job-card-title-section">
          <h3 className="job-card-title">{job.title}</h3>
          <p className="job-card-company">{job.company}</p>
        </div>
        <span className="job-card-badge" style={{ backgroundColor: getTypeColor(job.jobType) }}>
          {job.jobType}
        </span>
      </div>

      <div className="job-card-body">
        <p className="job-card-description">{job.description}</p>

        <div className="job-card-meta">
          <span className="meta-item">📍 {job.location}</span>
          <span className="meta-item">💰 {formatSalary(job.salary)}</span>
          <span 
            className="meta-item experience-badge" 
            style={{ backgroundColor: getExperienceColor(job.experience), color: 'white' }}
          >
            {job.experience}
          </span>
        </div>
      </div>

      <div className="job-card-footer">
        <button 
          className="job-card-btn view-btn" 
          onClick={() => navigate(`/jobs/${job._id}`)}
        >
          View Details
        </button>
        <button 
          className="job-card-btn apply-btn" 
          onClick={handleApplyClick}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobListing;