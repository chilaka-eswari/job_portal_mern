import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { applicationAPI } from "../services/api";
import "./style.css";

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchAppliedJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?._id) {
        setError("Please login to view applied jobs");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      const data = await applicationAPI.getUserApplications(userInfo._id);
      setApplications(data?.applications || []);
    } catch (err) {
      setError("Error loading applications");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAppliedJobs();
  }, [fetchAppliedJobs]);

  const filteredApplications =
    filterStatus === "all"
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  return (
    <div className="applied-jobs-page">
      {/* UI unchanged */}
    </div>
  );
};

export default AppliedJobs;
