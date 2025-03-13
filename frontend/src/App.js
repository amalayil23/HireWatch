import React, { useEffect, useState } from "react"; // Import React
import axios from "axios"; // Import Axios
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router
import Navbar from "./components/Navbar"; // Import the Navbar
import Home from "./pages/Home"; // Home Page
import SearchJobs from "./pages/searchjobs";

import "./App.css"; // Importing styles

function App() {
  return (
    <Router> {/* Wrap the application in a Router */}
      <div className="container"> {/* Main container */}
        <Navbar /> {/* Navbar */}

        <main className="content"> {/* Main Content */}
          <Routes> {/* Define routes */}
            <Route path="/" element={<Home />} /> {/* Home Page */}
            <Route path="/search-jobs" element={<SearchJobs />} /> {/* Home Page */}
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