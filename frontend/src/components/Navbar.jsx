import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Check login status when navbar loads
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (loginStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    setOpen(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${searchTerm}`);
      setSearchTerm("");
    }
  };

  return (
    <nav>
      {/* Logo */}
      <div>
        <Link to="/">JobSearch</Link>
      </div>

      {/* Search Bar */}
      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      {/* Menu */}
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/jobs">Jobs</Link></li>
        <li><Link to="/prepare">Prepare</Link></li>
        <li><Link to="/prepare-resume">Resume Builder</Link></li>
      </ul>

      {/* 🔐 NOT LOGGED IN */}
      {!isLoggedIn && (
        <button onClick={() => navigate("/login")}>
          Login / Register
        </button>
      )}

      {/* 🔐 LOGGED IN */}
      {isLoggedIn && (
        <div className="nav-right">
          {/* Profile Image */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="profile"
            className="profile-img"
            onClick={() => setOpen(!open)}
          />

          {/* Dropdown Menu */}
          {open && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <h4>{localStorage.getItem("userName")}</h4>
                <p>{localStorage.getItem("userEmail") || "user@email.com"}</p>
              </div>

              <div className="profile-divider" />

              <ul className="profile-menu">
                <li onClick={() => {
                  navigate("/view-profile");
                  setOpen(false);
                }}>
                  View Profile
                </li>
                <li onClick={() => {
                  navigate("/applied-jobs");
                  setOpen(false);
                }}>
                  Applied Jobs
                </li>
                <li onClick={() => {
                  navigate("/saved-jobs");
                  setOpen(false);
                }}>
                  Saved Jobs
                </li>
                <li className="logout" onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>


      )}
    </nav>
  );
};

export default Navbar;
