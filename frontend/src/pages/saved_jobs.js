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