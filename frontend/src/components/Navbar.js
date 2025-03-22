import React, { useState, useEffect, useRef } from "react"; // Import React and hooks
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import { FaBars, FaSearch, FaHome, FaUserPlus, FaHandshake } from "react-icons/fa"; // Import icons
import { MdOutlineReviews, MdOutlineSavedSearch } from "react-icons/md";

import "./Navbar.css"; // Import styles

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown open/close
  const [username, setUsername] = useState(""); // State to store the user's name
  const [showSignOut, setShowSignOut] = useState(false); // State to manage sign out visibility
  const navigate = useNavigate(); // For navigation
  const dropdownRef = useRef(null); // Ref for the dropdown menu

  // Fetch the user's name from localStorage on component mount
  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) {
      setUsername(name);
    }
  }, []);

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("token"); // Remove the token
    localStorage.removeItem("name"); // Remove the user's name
    setDropdownOpen(false); // Close the dropdown menu
    navigate("/login"); // Redirect to the login page
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="navbar"> {/* Navbar container */}
      <Link to="/" className="logo" style={{ textDecoration: "none" }}> {/* Logo container */}
        <img src="/hirewatch.png" alt="HireWatch" className="logo" /> {/* Logo image */}
        <h1 className="logo-text">HireWatch</h1> {/* Logo text */}
      </Link>

      {/* Clickable Dropdown Button */}
      <button
        className="menu-icon"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        aria-label="Toggle menu"
      >
        <FaBars size={30} /> {/* Menu icon */}
      </button>

      {dropdownOpen && ( // Conditional rendering of dropdown menu
        <ul className="dropdown-menu" ref={dropdownRef}> {/* Dropdown menu */}
          {username && ( // Conditional rendering for user info and sign out
            <>
              <li className="dropdown-user-info" onClick={() => setShowSignOut(!showSignOut)}>
                Welcome, {username}
              </li> {/* User info */}
              {showSignOut && (
                <li>
                  <button className="dropdown-signout-button" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </li>
              )}
              <li className="dropdown-divider"></li> {/* Divider */}
            </>
          )}
          <li><Link to="/"><FaHome /> Home</Link></li> {/* Home link */}
          <li><Link to="/savedjobs"><MdOutlineSavedSearch /> Saved Jobs</Link></li> {/* Saved Jobs link */}
          <li><Link to="/addusers"><FaUserPlus /> Sign Up</Link></li> {/* Sign Up link */}
          <li><Link to="/searchjobs"><FaSearch /> Search Jobs</Link></li> {/* Search Jobs link */}
          <li><Link to="/reviews"><MdOutlineReviews /> Reviews</Link></li> {/* Reviews link */}
          <li><Link to="/scheduleinterview"><FaHandshake /> Book Interview</Link></li> {/* Book Interview link */}
          <li><Link to="/appliedjobs"><FaHandshake /> Applied</Link></li> {/* Applied Jobs link */}
        </ul>
      )}
    </nav>
  );
}

export default Navbar; // Export the Navbar component