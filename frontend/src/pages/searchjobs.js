import React, { useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function SearchJobs() {
  const [title, setTitle] = useState('');  // State for job title input
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      console.log("Fetching jobs...");
      const response = await axios.get('https://hirewatch.pythonanywhere.com/searchjobs', {
        params: { title }
      });
      console.log("Response data:", response.data);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleInputChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSearchClick = () => {
    fetchJobs();
  };

  return (
    <div className="container">
      <h1>Jobs</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter job title"
          value={title}
          onChange={handleInputChange}
        />
        <div className="input-group-append">
          <button className="btn btn-primary" type="button" onClick={handleSearchClick}>
            Search
          </button>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Company Name</th>
            <th>Industry</th>
            <th>Job Type</th>
            <th>Location</th>
            <th>Job URL</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr key={index}>
              <td>{job.title}</td>
              <td>{job.companyName}</td>
              <td>{job.industry}</td>
              <td>{job.jobType}</td>
              <td>{job.companyLocation}</td>
              <td><a href={job.jobUrl} target="_blank" rel="noopener noreferrer">{job.jobUrl}</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SearchJobs;
