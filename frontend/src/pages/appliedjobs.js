import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import axios from "axios";
import './savedjobs.css';

function Appliedjobs() {
  const [jobs, setJobs] = useState([]); // State to store jobs
  const [loading, setLoading] = useState(true); // State to manage loading
  const [selectedStatuses, setSelectedStatuses] = useState({}); // Temporary state for dropdown selections
  const navigate = useNavigate();
  const uname = localStorage.getItem("name");
  

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to login if no token is found
      navigate("/login", { state: { from: "/appliedjobs" } });
    } else {
      // Fetch applied jobs
      axios.get("https://hirewatch.pythonanywhere.com/appliedjobs", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching applied jobs:", error);
        setLoading(false);
      });
    }
  }, [navigate]);

  // Function to handle dropdown selection (temporary state)
  const handleStatusChange = (appid, newStatus) => {
    setSelectedStatuses((prevStatuses) => ({
      ...prevStatuses,
      [appid]: newStatus, // Update the temporary status for the specific job
    }));
  };

  // Function to save the updated status to the backend
  const updateApp = async (appid) => {
    const token = localStorage.getItem("token");
    const newStatus = selectedStatuses[appid]; // Get the selected status from temporary state

    if (!newStatus) {
      alert("Please select a status before saving.");
      return;
    }

      // Add console.log to print appid and newStatus
      console.log("App ID:", appid);
      console.log("New Status:", newStatus);

    try {
      const response = await axios.put(
        `https://hirewatch.pythonanywhere.com/appliedjobs`,
        { appid :appid, newStatus: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update the status in the jobs state after successful save
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.appid === appid ? { ...job, status: newStatus } : job
        )
      );

      // Clear the temporary status for the job
      setSelectedStatuses((prevStatuses) => {
        const updatedStatuses = { ...prevStatuses };
        delete updatedStatuses[appid];
        return updatedStatuses;
      });

      alert(response.data.message || "Status updated successfully!");
    } catch (error) {
      console.error("Error updating job status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome {uname}</h1>
      {jobs === "No Jobs Saved" ? (
        <p>No applied jobs found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Job Type</th>
              <th>Company Name</th>
              <th>Location</th>
              <th>Date Applied</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => (
              <tr key={index}>
                <td>{job.title}</td>
                <td>{job.jobType}</td>
                <td>{job.companyName}</td>
                <td>{job.companyLocation}</td>
                <td>{new Date(job.dateApplied).toLocaleDateString()}</td>
                <td>{job.status}</td> {/* Status column shows the current status */}
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={selectedStatuses[job.appid] || job.status} // Show temporary status or fallback to current status
                    onChange={(e) => handleStatusChange(job.appid, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Interviewed">Interviewed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Accepted">Accepted</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => updateApp(job.appid)}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p><li><Link to="/searchjobs"> Search Jobs</Link></li></p>
    </div>
  );
}

export default Appliedjobs;