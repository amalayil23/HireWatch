import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './savedjobs.css'

const Savedjobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const uname = localStorage.getItem("name");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to login if no token is found
      navigate("/login", { state: { from: "/savedjobs" } });
    } else {
      // Fetch saved jobs
      axios.get("https://hirewatch.pythonanywhere.com/savedjobs", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching saved jobs:", error);
        setLoading(false);
      });
    }
  }, [navigate]);

  const addToApplied = async (jobid) => {
    const token = localStorage.getItem("token");
    console.log("Adding job to applied:", jobid); // Debugging line

    try {

      
      const response = await axios.post(
        `https://hirewatch.pythonanywhere.com/addapplied?jobid=${jobid}`, null,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert(response.data.message || "Job added to applied successfully!");
    } catch (error) {
      console.error("Error adding job to applied:", error);
      alert("Failed to add job to applied. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome {uname}</h1>
      <p>Your Saved Jobs.</p>
      {jobs.length === 0 ? (
        <p>No saved jobs found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Date Saved</th>
              <th>Job Type</th>
              <th>Job URL</th>
              <th>Title</th>
              <th>Action</th> {/* New column for the "Add to Applied" button */}
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr key={index}>
                <td>{job.companyName}</td>
                <td>{new Date(job.dateSaved).toLocaleDateString()}</td>
                <td>{job.jobType}</td>
                <td><a href={job.jobUrl} target="_blank" rel="noopener noreferrer">View Job</a></td>
                <td>{job.title}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => addToApplied(job.jobid)} // Call the function with jobid
                  >
                    Add to Applied
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <br></br>
      <Link to="/searchjobs"> Browse Jobs</Link>
    </div>
  );
};

export default Savedjobs;