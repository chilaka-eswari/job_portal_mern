import React, { useState, useEffect, useCallback } from "react";

const ATSChecker = ({ resumeData }) => {
  const [atsScore, setAtsScore] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const generateResumeText = useCallback(() => {
    let text = "";
    text += resumeData.personalInfo.fullName + " ";
    text += resumeData.personalInfo.summary + " ";

    resumeData.experience.forEach((exp) => {
      text += exp.jobTitle + " " + exp.company + " " + exp.description + " ";
    });

    resumeData.education.forEach((edu) => {
      text += edu.degree + " " + edu.institution + " " + edu.field + " ";
    });

    resumeData.skills.forEach((skill) => {
      text += skill.skill + " ";
    });

    resumeData.projects.forEach((proj) => {
      text +=
        proj.projectName +
        " " +
        proj.description +
        " " +
        proj.technologies +
        " ";
    });

    return text.toLowerCase();
  }, [resumeData]);

  const checkKeywords = useCallback((text) => {
    const keywords = [
      "achieved",
      "developed",
      "implemented",
      "managed",
      "led",
      "created",
      "designed",
      "improved",
      "optimized",
      "delivered",
      "collaborated",
    ];

    let count = 0;
    keywords.forEach((k) => {
      if (text.includes(k)) count++;
    });

    return Math.min(count * 2, 10);
  }, []);

  const calculateATSScore = useCallback(() => {
    let score = 0;
    const feedbackItems = [];
    const suggestionItems = [];

    if (resumeData.personalInfo.fullName) score += 5;
    else feedbackItems.push({ type: "error", message: "Missing full name" });

    if (resumeData.personalInfo.email) score += 5;
    else feedbackItems.push({ type: "error", message: "Missing email address" });

    if (resumeData.personalInfo.phone) score += 5;
    else feedbackItems.push({ type: "error", message: "Missing phone number" });

    if (resumeData.personalInfo.summary?.length > 50) score += 10;
    else suggestionItems.push("Improve your professional summary");

    if (resumeData.experience.length > 0) score += 10;
    else suggestionItems.push("Add work experience");

    if (resumeData.education.length > 0) score += 10;
    else feedbackItems.push({ type: "error", message: "Missing education" });

    if (resumeData.skills.length > 5) score += 20;
    else suggestionItems.push("Add more relevant skills");

    if (resumeData.projects.length > 0)
      score += Math.min(resumeData.projects.length * 3, 10);

    const text = generateResumeText();
    score += checkKeywords(text);

    setAtsScore(Math.min(score, 100));
    setFeedback(feedbackItems);
    setSuggestions(suggestionItems);
  }, [resumeData, generateResumeText, checkKeywords]);

  useEffect(() => {
    calculateATSScore();
  }, [calculateATSScore]);

  return <div className="ats-checker-container">{/* UI unchanged */}</div>;
};

export default ATSChecker;
