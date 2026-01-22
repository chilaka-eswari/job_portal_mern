// 🔗 API Service - Connect Frontend to Backend

const API_BASE_URL = 'http://localhost:5000/api';

// ✅ Display Routes (for fetching data)
export const displayAPI = {
  // Stats
  getStats: async () => {
    const res = await fetch(`${API_BASE_URL}/display/stats`);
    return res.json();
  },

  // Jobs
  getAllJobs: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE_URL}/display/jobs?${params}`);
    return res.json();
  },

  getJobById: async (jobId) => {
    const res = await fetch(`${API_BASE_URL}/display/jobs/${jobId}`);
    return res.json();
  },

  searchJobs: async (keyword) => {
    const res = await fetch(`${API_BASE_URL}/display/search/jobs?keyword=${keyword}`);
    return res.json();
  },

  getJobsBySkill: async (skill) => {
    const res = await fetch(`${API_BASE_URL}/display/jobs-by-skill/${skill}`);
    return res.json();
  },

  getTrendingJobs: async () => {
    const res = await fetch(`${API_BASE_URL}/display/trending-jobs`);
    return res.json();
  },

  // Users
  getAllUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/display/users`);
    return res.json();
  },

  getUserById: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/display/users/${userId}`);
    return res.json();
  },

  // Applications
  getUserApplications: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/display/user/${userId}/applications`);
    return res.json();
  },

  getJobApplications: async (jobId) => {
    const res = await fetch(`${API_BASE_URL}/display/job/${jobId}/applications`);
    return res.json();
  },

  getEmployerJobs: async (employerId) => {
    const res = await fetch(`${API_BASE_URL}/display/employer/${employerId}/jobs`);
    return res.json();
  },
};

// ✅ Auth Routes (for login/register)
export const authAPI = {
  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  getProfile: async (token) => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },

  updateProfile: async (userId, userData, token) => {
    const res = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return res.json();
  },
};

// ✅ Job Routes (for creating/updating jobs)
export const jobAPI = {
  createJob: async (jobData, token) => {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });
    return res.json();
  },

  updateJob: async (jobId, jobData, token) => {
    const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });
    return res.json();
  },

  deleteJob: async (jobId, token) => {
    const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },
};

// ✅ Application Routes (for submitting/managing applications)
export const applicationAPI = {
  submitApplication: async (applicationData, token) => {
    const res = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(applicationData),
    });
    return res.json();
  },

  updateApplicationStatus: async (applicationId, status, token) => {
    const res = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  withdrawApplication: async (applicationId, token) => {
    const res = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
  },
};

export default {
  displayAPI,
  authAPI,
  jobAPI,
  applicationAPI,
  API_BASE_URL,
};
