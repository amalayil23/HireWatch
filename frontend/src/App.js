import React, { useEffect, useState } from "react"; // Import React
import axios from "axios"; // Import Axios
import { UserProvider } from "./pages/usercontext.js"; // Import UserProvider
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router
import Navbar from "./components/Navbar"; // Import the Navbar
import Home from "./pages/Home"; // Home Page
import AddUser from "./pages/addusers";
import SearchJobs from "./pages/searchjobs";
import ReviewCompany from "./pages/reviews";
import ScheduleInterview from "./pages/scheduleinterview";
import Login from "./pages/login"
import Savedjobs from "./pages/saved_jobs";
import Appliedjobs from "./pages/appliedjobs";
import BookedInterview from "./pages/bookedinterviews.js";

import "./App.css"; // Importing styles

function App() {
  return (
    <UserProvider> {/* Wrap the app with UserProvider */}
    <Router> {/* Wrap the application in a Router */}
      <div className="container"> {/* Main container */}
        <Navbar /> {/* Navbar */}

        <main className="content"> {/* Main Content */}
          <Routes> {/* Define routes */}
            <Route path="/" element={<Home />} /> {/* Home Page */}
            <Route path="/addusers" element={<AddUser />} /> {/* Add User Page */}
            <Route path="/searchjobs" element={<SearchJobs />} /> {/* Search Jobs Page */}
            <Route path="/reviews" element={<ReviewCompany />} /> {/* Check Company Reviews */}
            <Route path="/scheduleinterview" element={<ScheduleInterview />} /> {/* Check Interview Booking */}
            <Route path="/bookedinterviews" element={<BookedInterview />} /> {/* Check Booked Interview */}
            <Route path="/login" element={<Login/>} />
            <Route path="/savedjobs" element={<Savedjobs/>} />
            <Route path="/appliedjobs" element={<Appliedjobs/>} />
          </Routes>
        </main>

        <footer className="footer"> {/* Footer */}
          <p>© {new Date().getFullYear()} HireWatch | Your Job Search Companion</p> {/* Footer text */}
        </footer>
      </div>
    </Router>
    </UserProvider>
  );
}

export default App; // Export the App component