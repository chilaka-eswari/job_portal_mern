import React, { useState } from "react";

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
  // Sample job data
  const jobs = [
    { id: 1, title: "Software Engineer", company: "TechCorp", location: "New York, NY" },
    { id: 2, title: "Data Analyst", company: "DataSolutions", location: "San Francisco, CA" },
    { id: 3, title: "Marketing Manager", company: "BrandBoost", location: "London, UK" },
    { id: 4, title: "UX Designer", company: "DesignHub", location: "Remote" },
    { id: 5, title: "Project Manager", company: "BuildIt", location: "Austin, TX" },
    { id: 6, title: "DevOps Engineer", company: "CloudTech", location: "Seattle, WA" },
  ];

  const handleApply = (jobId) => {
    console.log("Applying for job:", jobId);
  };

  const handleViewDetails = (jobId) => {
    console.log("Viewing details for job:", jobId);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-heading">Find Your Dream Job Today</h1>
          <p className="hero-description">
            Connect with top employers and discover opportunities tailored to your skills.
            Whether you're a job seeker or an employee looking to advance, our platform
            makes it easy to find the perfect match.
          </p>
          <button
            className="find-jobs-btn"
            onClick={() => (window.location.href = "/jobs")}
          >
            Find Jobs
          </button>
        </div>
      </section>

      {/* Search Section */}
      <SearchJobSection />

      {/* Job Listings */}
      <section className="job-listings">
        <h2>Job Listings</h2>
        <div className="job-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3 className="job-title">{job.title}</h3>
              <p className="job-company">{job.company}</p>
              <p className="job-location">{job.location}</p>

              <div className="job-buttons">
                <button
                  className="apply-btn"
                  onClick={() => handleApply(job.id)}
                >
                  Apply
                </button>
                <button
                  className="details-btn"
                  onClick={() => handleViewDetails(job.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
