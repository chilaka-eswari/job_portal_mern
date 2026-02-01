import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ResumeBuilder = ({ selectedTemplate, resumeData, onDataChange }) => {
  const [data, setData] = useState(resumeData);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    experience: false,
    education: false,
    skills: false,
    projects: false,
    certifications: false
  });

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
          grade: "",
          description: ""
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
      skills: [
        ...data.skills,
        { id: Date.now(), skill: "", proficiency: "Intermediate" }
      ]
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

  const handleAddProject = () => {
    const updatedData = {
      ...data,
      projects: [
        ...data.projects,
        {
          id: Date.now(),
          projectName: "",
          description: "",
          technologies: "",
          link: "",
          date: ""
        }
      ]
    };
    setData(updatedData);
    onDataChange(updatedData);
  };

  const handleUpdateProject = (id, field, value) => {
    const updatedData = {
      ...data,
      projects: data.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    };
    setData(updatedData);
    onDataChange(updatedData);
  };

  const handleDeleteProject = (id) => {
    const updatedData = {
      ...data,
      projects: data.projects.filter((proj) => proj.id !== id)
    };
    setData(updatedData);
    onDataChange(updatedData);
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  return (
    <div className="resume-builder-container" style={{ '--accent-color': selectedTemplate?.color || '#667eea' }}>
      <div className="builder-content">
        <div className="form-section">
          {/* Personal Information */}
          <div className="section-header" onClick={() => toggleSection("personal")}>
            <h3>👤 Personal Information</h3>
            <span className="toggle-icon">
              {expandedSections.personal ? "▼" : "▶"}
            </span>
          </div>
          {expandedSections.personal && (
            <div className="section-content">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={data.personalInfo.fullName}
                  onChange={handlePersonalInfoChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Professional Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={data.personalInfo.jobTitle}
                  onChange={handlePersonalInfoChange}
                  placeholder="Software Engineer, Designer, etc."
                />
              </div>
              <div className="form-row">
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
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={data.personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={data.personalInfo.location}
                  onChange={handlePersonalInfoChange}
                  placeholder="City, State"
                />
              </div>
              <div className="form-group">
                <label>Professional Summary</label>
                <textarea
                  name="summary"
                  value={data.personalInfo.summary}
                  onChange={handlePersonalInfoChange}
                  placeholder="Brief overview of your professional background and goals..."
                  rows="4"
                />
              </div>
            </div>
          )}

          {/* Work Experience */}
          <div className="section-header" onClick={() => toggleSection("experience")}>
            <h3>💼 Work Experience</h3>
            <span className="toggle-icon">
              {expandedSections.experience ? "▼" : "▶"}
            </span>
          </div>
          {expandedSections.experience && (
            <div className="section-content">
              {data.experience.map((exp, index) => (
                <div key={exp.id} className="entry-card">
                  <div className="entry-header">
                    <h4>Experience #{index + 1}</h4>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteExperience(exp.id)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Job Title *</label>
                    <input
                      type="text"
                      value={exp.jobTitle}
                      onChange={(e) =>
                        handleUpdateExperience(exp.id, "jobTitle", e.target.value)
                      }
                      placeholder="Software Developer"
                    />
                  </div>
                  <div className="form-group">
                    <label>Company *</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        handleUpdateExperience(exp.id, "company", e.target.value)
                      }
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) =>
                        handleUpdateExperience(exp.id, "location", e.target.value)
                      }
                      placeholder="City, State"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date *</label>
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
                  <div className="form-group checkbox">
                    <input
                      type="checkbox"
                      checked={exp.currentlyWorking}
                      onChange={(e) =>
                        handleUpdateExperience(
                          exp.id,
                          "currentlyWorking",
                          e.target.checked
                        )
                      }
                    />
                    <label>Currently working here</label>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) =>
                        handleUpdateExperience(exp.id, "description", e.target.value)
                      }
                      placeholder="Describe your responsibilities and achievements..."
                      rows="4"
                    />
                  </div>
                </div>
              ))}
              <button className="add-btn" onClick={handleAddExperience}>
                + Add Work Experience
              </button>
            </div>
          )}

          {/* Education */}
          <div className="section-header" onClick={() => toggleSection("education")}>
            <h3>🎓 Education</h3>
            <span className="toggle-icon">
              {expandedSections.education ? "▼" : "▶"}
            </span>
          </div>
          {expandedSections.education && (
            <div className="section-content">
              {data.education.map((edu, index) => (
                <div key={edu.id} className="entry-card">
                  <div className="entry-header">
                    <h4>Education #{index + 1}</h4>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteEducation(edu.id)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Degree *</label>
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
                    <label>Institution *</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        handleUpdateEducation(edu.id, "institution", e.target.value)
                      }
                      placeholder="University Name"
                    />
                  </div>
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
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) =>
                          handleUpdateEducation(edu.id, "startDate", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) =>
                          handleUpdateEducation(edu.id, "endDate", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Grade/GPA</label>
                    <input
                      type="text"
                      value={edu.grade}
                      onChange={(e) =>
                        handleUpdateEducation(edu.id, "grade", e.target.value)
                      }
                      placeholder="3.8/4.0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={edu.description}
                      onChange={(e) =>
                        handleUpdateEducation(edu.id, "description", e.target.value)
                      }
                      placeholder="Additional details about your education..."
                      rows="3"
                    />
                  </div>
                </div>
              ))}
              <button className="add-btn" onClick={handleAddEducation}>
                + Add Education
              </button>
            </div>
          )}

          {/* Skills */}
          <div className="section-header" onClick={() => toggleSection("skills")}>
            <h3>⭐ Skills</h3>
            <span className="toggle-icon">
              {expandedSections.skills ? "▼" : "▶"}
            </span>
          </div>
          {expandedSections.skills && (
            <div className="section-content">
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
                      className="skill-input"
                    />
                    <select
                      value={skill.proficiency}
                      onChange={(e) =>
                        handleUpdateSkill(skill.id, "proficiency", e.target.value)
                      }
                      className="proficiency-select"
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
          )}

          {/* Projects */}
          <div className="section-header" onClick={() => toggleSection("projects")}>
            <h3>🚀 Projects</h3>
            <span className="toggle-icon">
              {expandedSections.projects ? "▼" : "▶"}
            </span>
          </div>
          {expandedSections.projects && (
            <div className="section-content">
              {data.projects.map((project, index) => (
                <div key={project.id} className="entry-card">
                  <div className="entry-header">
                    <h4>Project #{index + 1}</h4>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Project Name *</label>
                    <input
                      type="text"
                      value={project.projectName}
                      onChange={(e) =>
                        handleUpdateProject(project.id, "projectName", e.target.value)
                      }
                      placeholder="Project Title"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={project.description}
                      onChange={(e) =>
                        handleUpdateProject(project.id, "description", e.target.value)
                      }
                      placeholder="Describe the project and your role..."
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Technologies Used</label>
                    <input
                      type="text"
                      value={project.technologies}
                      onChange={(e) =>
                        handleUpdateProject(project.id, "technologies", e.target.value)
                      }
                      placeholder="React, Node.js, MongoDB..."
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="month"
                        value={project.date}
                        onChange={(e) =>
                          handleUpdateProject(project.id, "date", e.target.value)
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Project Link</label>
                      <input
                        type="url"
                        value={project.link}
                        onChange={(e) =>
                          handleUpdateProject(project.id, "link", e.target.value)
                        }
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button className="add-btn" onClick={handleAddProject}>
                + Add Project
              </button>
            </div>
          )}
        </div>

        {/* Resume Preview */}
        <div className="preview-section">
          <div className="preview-header">
            <h3>📄 Resume Preview</h3>
            <button className="download-btn" onClick={async () => {
              try {
                const element = document.querySelector('.resume-preview .preview-content');
                const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'pt', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${(data.personalInfo.fullName || 'resume').replace(/\s+/g,'_')}.pdf`);
              } catch (err) {
                console.error(err);
              }
            }}>⬇️ Download PDF</button>
          </div>
          <div className="resume-preview">
            <div className="preview-content">
              {data.personalInfo.fullName ? (
                <>
                  <div className="preview-header-section">
                    <h1>{data.personalInfo.fullName}</h1>
                    <p className="contact-info">
                      {data.personalInfo.email}
                      {data.personalInfo.phone && ` • ${data.personalInfo.phone}`}
                      {data.personalInfo.location && ` • ${data.personalInfo.location}`}
                    </p>
                  </div>

                  {data.personalInfo.summary && (
                    <div className="preview-section">
                      <h3>Professional Summary</h3>
                      <p>{data.personalInfo.summary}</p>
                    </div>
                  )}

                  {data.experience.length > 0 && (
                    <div className="preview-section">
                      <h3>Work Experience</h3>
                      {data.experience.map((exp) => (
                        <div key={exp.id} className="preview-entry">
                          <div className="entry-title">
                            <strong>{exp.jobTitle}</strong> - {exp.company}
                          </div>
                          {exp.startDate && (
                            <p className="date">
                              {exp.startDate}
                              {exp.endDate ? ` - ${exp.endDate}` : " - Present"}
                            </p>
                          )}
                          {exp.description && <p>{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {data.education.length > 0 && (
                    <div className="preview-section">
                      <h3>Education</h3>
                      {data.education.map((edu) => (
                        <div key={edu.id} className="preview-entry">
                          <div className="entry-title">
                            <strong>{edu.degree}</strong> - {edu.institution}
                          </div>
                          {edu.field && <p className="field">{edu.field}</p>}
                          {edu.grade && <p className="grade">GPA: {edu.grade}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {data.skills.length > 0 && (
                    <div className="preview-section">
                      <h3>Skills</h3>
                      <div className="skills-list">
                        {data.skills.map((skill) => (
                          <span key={skill.id} className="skill-tag">
                            {skill.skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.projects.length > 0 && (
                    <div className="preview-section">
                      <h3>Projects</h3>
                      {data.projects.map((project) => (
                        <div key={project.id} className="preview-entry">
                          <div className="entry-title">
                            <strong>{project.projectName}</strong>
                          </div>
                          {project.technologies && (
                            <p className="tech">{project.technologies}</p>
                          )}
                          {project.description && <p>{project.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="placeholder">
                  Start filling in your information to see the preview
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
