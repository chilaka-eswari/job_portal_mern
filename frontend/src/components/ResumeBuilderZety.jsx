import React, { useState } from "react";
import "./resume-builder-styles.css";

const ResumeBuilderZety = ({ selectedTemplate, resumeData, onDataChange }) => {
  const [data, setData] = useState(resumeData);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { id: 0, name: "Personal Info", icon: "👤" },
    { id: 1, name: "Work History", icon: "💼" },
    { id: 2, name: "Education", icon: "🎓" },
    { id: 3, name: "Skills", icon: "⭐" },
    { id: 4, name: "Summary", icon: "📝" }
  ];

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...data,
      personalInfo: { ...data.personalInfo, [name]: value }
    };
    setData(updatedData);
    onDataChange(updatedData);
  };

  const handleAddExperience = () => {
    const updatedData = {
      ...data,
      experience: [
        ...data.experience,
        {
          id: Date.now(),
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: ""
        }
      ]
    };
    setData(updatedData);
    onDataChange(updatedData);
  };

  const handleUpdateExperience = (id, field, value) => {
    const updatedData = {
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    };
    setData(updatedData);
    onDataChange(updatedData);
  };

  const handleDeleteExperience = (id) => {
    const updatedData = {
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id)
    };
    setData(updatedData);
    onDataChange(updatedData);
  };

  const handleAddEducation = () => {
    const updatedData = {
      ...data,
      education: [
        ...data.education,
        {
          id: Date.now(),
          degree: "",
          institution: "",
          field: "",
          startDate: "",
          endDate: "",
          grade: ""
        }
      ]
    };
    setData(updatedData);
    onDataChange(updatedData);
  };

  const handleUpdateEducation = (id, field, value) => {
    const updatedData = {
      ...data,
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    };
    setData(updatedData);
    onDataChange(updatedData);
  };

  const handleDeleteEducation = (id) => {
    const updatedData = {
      ...data,
      education: data.education.filter((edu) => edu.id !== id)
    };
    setData(updatedData);
    onDataChange(updatedData);
  };

  const handleAddSkill = () => {
    const updatedData = {
      ...data,
      skills: [...data.skills, { id: Date.now(), skill: "", proficiency: "Intermediate" }]
    };
    setData(updatedData);
    onDataChange(updatedData);
  };

  const handleUpdateSkill = (id, field, value) => {
    const updatedData = {
      ...data,
      skills: data.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    };
    setData(updatedData);
    onDataChange(updatedData);
  };

  const handleDeleteSkill = (id) => {
    const updatedData = {
      ...data,
      skills: data.skills.filter((skill) => skill.id !== id)
    };
    setData(updatedData);
    onDataChange(updatedData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return (
          <div className="step-content">
            <h2>What's the best way for employers to contact you?</h2>
            <p className="step-subtitle">We suggest including an email and phone number.</p>
            
            <div className="form-group-full">
              <label>First Name *</label>
              <input
                type="text"
                name="fullName"
                value={data.personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                placeholder="John"
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={data.personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={data.personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="location"
                  value={data.personalInfo.location}
                  onChange={handlePersonalInfoChange}
                  placeholder="New York"
                />
              </div>
              <div className="form-group">
                <label>Professional Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={data.personalInfo.jobTitle}
                  onChange={handlePersonalInfoChange}
                  placeholder="Software Engineer"
                />
              </div>
            </div>
          </div>
        );

      case 1: // Work History
        return (
          <div className="step-content">
            <h2>Work History</h2>
            
            {data.experience.map((exp, index) => (
              <div key={exp.id} className="entry-block">
                <div className="entry-header">
                  <h4>Job #{index + 1}</h4>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteExperience(exp.id)}
                  >
                    ✕ Delete
                  </button>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      value={exp.jobTitle}
                      onChange={(e) =>
                        handleUpdateExperience(exp.id, "jobTitle", e.target.value)
                      }
                      placeholder="Senior Developer"
                    />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        handleUpdateExperience(exp.id, "company", e.target.value)
                      }
                      placeholder="Company Name"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) =>
                        handleUpdateExperience(exp.id, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) =>
                        handleUpdateExperience(exp.id, "endDate", e.target.value)
                      }
                      disabled={exp.currentlyWorking}
                    />
                  </div>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={exp.currentlyWorking}
                    onChange={(e) =>
                      handleUpdateExperience(exp.id, "currentlyWorking", e.target.checked)
                    }
                  />
                  <label>I currently work here</label>
                </div>

                <div className="form-group-full">
                  <label>Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) =>
                      handleUpdateExperience(exp.id, "description", e.target.value)
                    }
                    placeholder="Describe your responsibilities..."
                    rows="3"
                  />
                </div>
              </div>
            ))}

            <button className="add-btn" onClick={handleAddExperience}>
              + Add Work Experience
            </button>
          </div>
        );

      case 2: // Education
        return (
          <div className="step-content">
            <h2>Education</h2>
            
            {data.education.map((edu, index) => (
              <div key={edu.id} className="entry-block">
                <div className="entry-header">
                  <h4>Education #{index + 1}</h4>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteEducation(edu.id)}
                  >
                    ✕ Delete
                  </button>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        handleUpdateEducation(edu.id, "degree", e.target.value)
                      }
                      placeholder="Bachelor of Science"
                    />
                  </div>
                  <div className="form-group">
                    <label>Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        handleUpdateEducation(edu.id, "institution", e.target.value)
                      }
                      placeholder="University Name"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Field of Study</label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) =>
                        handleUpdateEducation(edu.id, "field", e.target.value)
                      }
                      placeholder="Computer Science"
                    />
                  </div>
                  <div className="form-group">
                    <label>Grade</label>
                    <input
                      type="text"
                      value={edu.grade}
                      onChange={(e) =>
                        handleUpdateEducation(edu.id, "grade", e.target.value)
                      }
                      placeholder="3.8/4.0"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button className="add-btn" onClick={handleAddEducation}>
              + Add Education
            </button>
          </div>
        );

      case 3: // Skills
        return (
          <div className="step-content">
            <h2>Skills</h2>
            
            <div className="skills-grid">
              {data.skills.map((skill) => (
                <div key={skill.id} className="skill-item">
                  <input
                    type="text"
                    value={skill.skill}
                    onChange={(e) =>
                      handleUpdateSkill(skill.id, "skill", e.target.value)
                    }
                    placeholder="Enter skill"
                  />
                  <select
                    value={skill.proficiency}
                    onChange={(e) =>
                      handleUpdateSkill(skill.id, "proficiency", e.target.value)
                    }
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteSkill(skill.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button className="add-btn" onClick={handleAddSkill}>
              + Add Skill
            </button>
          </div>
        );

      case 4: // Summary
        return (
          <div className="step-content">
            <h2>Professional Summary</h2>
            
            <div className="form-group-full">
              <label>Summary</label>
              <textarea
                name="summary"
                value={data.personalInfo.summary}
                onChange={handlePersonalInfoChange}
                placeholder="Brief overview of your professional background and goals..."
                rows="6"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="resume-builder-zety">
      {/* Sidebar */}
      <aside className="builder-sidebar">
        <div className="sidebar-header">
          <h3>Resume Steps</h3>
          <div className="completeness">
            <div className="completeness-bar">
              <div 
                className="completeness-fill"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            <p>{Math.round(((currentStep + 1) / steps.length) * 100)}%</p>
          </div>
        </div>

        <nav className="steps-nav">
          {steps.map((step) => (
            <button
              key={step.id}
              className={`step-btn ${currentStep === step.id ? "active" : ""}`}
              onClick={() => setCurrentStep(step.id)}
            >
              <span className="step-icon">{step.id + 1}</span>
              <span className="step-name">{step.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="builder-main">
        <div className="main-content">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="step-buttons">
          <button
            className="btn-prev"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>
          <button
            className="btn-next"
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
          >
            Next →
          </button>
        </div>
      </main>

      {/* Preview Sidebar */}
      <aside className="preview-sidebar">
        <div className="preview-box">
          <h4>Preview</h4>
          <div className="resume-thumbnail">
            {selectedTemplate && (
              <img 
                src={selectedTemplate.preview} 
                alt="Resume preview"
                className="template-thumb"
              />
            )}
          </div>
          <button className="change-template-btn">Change template</button>
        </div>
      </aside>
    </div>
  );
};

export default ResumeBuilderZety;
