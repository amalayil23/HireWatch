import React, { useState } from "react"; // Import React and useState hook
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { FaBars, FaSearch, FaFilter, FaList, FaRss, FaShieldAlt, FaBell, FaFileExport, FaHome, FaCrosshairs, FaRegUser, FaUserPlus } from "react-icons/fa"; // Import icons from react-icons
import { MdOutlineReviews } from "react-icons/md";
import "./Navbar.css"; // Import styles

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown open/close

  return (
    <nav className="navbar"> {/* Navbar container */}
      <Link to="/" className="logo" style={{ textDecoration: 'none' }}> {/* Logo container */}
        <img src="/hirewatch.png" alt="HireWatch" className="logo" /> {/* Logo image */}
        <h1 className="logo-text">HireWatch</h1> {/* Logo text */}
      </Link>

      {/* Clickable Dropdown Button */}
      <button className="menu-icon" onClick={() => setDropdownOpen(!dropdownOpen)}> {/* Toggle dropdown */}
        <FaBars size={30} /> {/* Menu icon */}
      </button>

      {dropdownOpen && ( // Conditional rendering of dropdown menu
        <ul className="dropdown-menu"> {/* Dropdown menu */}
          <li><Link to="/"><FaHome /> Home</Link></li> {/* Home link */}
          <li><Link to="/addusers"><FaUserPlus /> Add User</Link></li> {/* Home link */}
          <li><Link to="/searchjobs"><FaSearch /> Search Jobs</Link></li> {/* Search by Date link */}
          <li><Link to="/reviews"><MdOutlineReviews /> Reviews </Link></li> {/* Search by Vendor link */}
          <li><Link to="/"><FaFilter /> TBD</Link></li> {/* Filter by CVSS link */}
          <li><Link to="/"><FaList /> TBD</Link></li> {/* Search by Category link */}
        </ul>
      )}
    </nav>
  );
}

export default Navbar; // Export the Navbar component