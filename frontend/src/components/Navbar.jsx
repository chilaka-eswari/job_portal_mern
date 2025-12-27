import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav>
      {/* Logo */}
      <div>
        <Link to="/">JobSearch</Link>
      </div>

      {/* Navigation Links */}
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/jobs">Jobs</Link>
        </li>
        <li>
          <Link to="/companies">Companies</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>

      {/* Login / Register */}
      <div>
        <button onClick={() => navigate("/login")}>
          Login / Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
