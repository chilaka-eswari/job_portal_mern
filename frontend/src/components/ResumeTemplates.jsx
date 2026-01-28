import React from "react";

const ResumeTemplates = ({ onSelectTemplate }) => {
  const templates = [
    {
      id: 1,
      name: "Professional",
      description: "Clean and professional layout suitable for most industries",
      preview: "/templates/professional-sample.svg",
      color: "#2C3E50"
    },
    {
      id: 2,
      name: "Modern",
      description: "Contemporary design with modern elements and color accents",
      preview: "/templates/modern-sample.svg",
      color: "#3498DB"
    },
    {
      id: 3,
      name: "Creative",
      description: "Ideal for creative roles with unique layout and design",
      preview: "/templates/creative-sample.svg",
      color: "#E74C3C"
    },
    {
      id: 4,
      name: "Minimalist",
      description: "Simple and elegant design focusing on content",
      preview: "/templates/minimalist-sample.svg",
      color: "#34495E"
    },
    {
      id: 5,
      name: "Tech",
      description: "Perfect for tech and IT professionals",
      preview: "/templates/tech-sample.svg",
      color: "#27AE60"
    },
    {
      id: 6,
      name: "Academic",
      description: "Best for academic and research positions",
      preview: "/templates/academic-sample.svg",
      color: "#8E44AD"
    }
  ];

  return (
    <div className="templates-section">
      <div className="templates-intro">
        <h2>Choose a Resume Template</h2>
        <p>Select a template that best matches your professional style</p>
      </div>

      <div className="templates-grid">
        {templates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="template-preview">
              <img 
                src={template.preview} 
                alt={`${template.name} template`}
                className="template-image"
              />
            </div>
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <button
                className="select-template-btn"
                onClick={() => onSelectTemplate(template)}
              >
                Use This Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeTemplates;
