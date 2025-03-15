import React, { useEffect, useState } from "react"; // Import React
import axios from "axios"; // Import Axios
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router
import Navbar from "./components/Navbar"; // Import the Navbar
import Home from "./pages/Home"; // Home Page
import AddUser from "./pages/addusers";
import SearchJobs from "./pages/searchjobs";
import ReviewCompany from "./pages/reviews";

import "./App.css"; // Importing styles

function App() {
  return (
    <Router> {/* Wrap the application in a Router */}
      <div className="container"> {/* Main container */}
        <Navbar /> {/* Navbar */}

        <main className="content"> {/* Main Content */}
          <Routes> {/* Define routes */}
            <Route path="/" element={<Home />} /> {/* Home Page */}
            <Route path="/addusers" element={<AddUser />} /> {/* Add User Page */}
            <Route path="/searchjobs" element={<SearchJobs />} /> {/* Search Jobs Page */}
            <Route path="/reviews" element={<ReviewCompany />} /> {/* Check Company Reviews */}
          </Routes>
        </main>

        <footer className="footer"> {/* Footer */}
          <p>© {new Date().getFullYear()} HireWatch | your job search companion</p> {/* Footer text */}
        </footer>
      </div>
    </Router>
  );
}

export default App; // Export the App component