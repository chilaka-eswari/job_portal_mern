import React, { useState } from "react";
import Footer from "../components/Footer";
import "./style.css";
import ResomeTemplates from "../components/ResumeTemplates";
import ResumeBuilderZety from "../components/ResumeBuilderZety";
import ATSChecker from "../components/ATSChecker";

const PrepResume = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      summary: ""
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  });

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setActiveTab("builder");
  };

  const handleResumeDataChange = (data) => {
    setResumeData(data);
  };

  return (
    <div className="prep-resume-container">
      <div className="resume-page-header">
        <h1>Prepare Your Resume</h1>
        <p>Create a professional resume and check your ATS score</p>
      </div>

      <div className="resume-tabs">
        <button
          className={`tab-button ${activeTab === "templates" ? "active" : ""}`}
          onClick={() => setActiveTab("templates")}
        >
          📋 Resume Templates
        </button>
        <button
          className={`tab-button ${activeTab === "builder" ? "active" : ""}`}
          onClick={() => setActiveTab("builder")}
        >
          ✏️ Build Resume
        </button>
        <button
          className={`tab-button ${activeTab === "ats" ? "active" : ""}`}
          onClick={() => setActiveTab("ats")}
        >
          🔍 ATS Score
        </button>
      </div>

      <div className="resume-content">
        {activeTab === "templates" && (
          <ResomeTemplates onSelectTemplate={handleTemplateSelect} />
        )}

        {activeTab === "builder" && (
          <ResumeBuilderZety
            selectedTemplate={selectedTemplate}
            resumeData={resumeData}  
            onDataChange={handleResumeDataChange}
            onChangeTemplate={() => setActiveTab('templates')}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PrepResume;
