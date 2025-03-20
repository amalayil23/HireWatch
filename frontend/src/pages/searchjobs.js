import React, { useEffect, useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function SearchJobs() {
  const [filters, setFilters] = useState({
    title: '',
    companyName: '',
    location: ''
  });

  const [jobs, setJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    } 
  }, []);

  const fetchJobs = async () => {
    if (!filters.title.trim()) {
      alert("Please enter title of a job.");
      return;
    }

    try {
      console.log("Fetching jobs with filters...", filters);
      const response = await axios.get('https://hirewatch.pythonanywhere.com/searchjobs', {
        params: filters
      });
      console.log("Response data:", response.data);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const saveJob = async (jobid) => {
    console.log(jobid)
    console.log(token)
    if (!isLoggedIn) {
      alert('You must be logged in to save jobs');
      return
    }

    try {
      const response = await axios.post(
        'https://hirewatch.pythonanywhere.com/savejob',
        { jobid:jobid },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(response.data.message || 'Job saved successfully!');
    } catch (error) {
      console.error('Error saving job:', error)
      alert('Failed to save job. Please try again.')
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSearchClick = () => {
    fetchJobs();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchJobs();
    }
  }

  return (
    <div className='container'>
      <h1>Jobs</h1>
      <div className='input-group mb-3'>
        <input
          type='text'
          className='form-control'
          name='title'
          placeholder='Enter job title'
          value={filters.title}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          required
        />
        <button
          className='btn btn-secondary'
          type='button'
          onClick={() => setShowFilters(!showFilters)}
        >
          Filter
        </button>
        <button className='btn btn-primary' type='button' onClick={handleSearchClick}>
          Search
        </button>
      </div>

      {showFilters && (
        <div className='filter-box p-3 border rounded'>
          <h5>Advanced Filters</h5>
          <input
            type='text'
            className='form-control mb-2'
            name='companyName'
            placeholder='Enter the company name'
            value={filters.companyName}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <input
            type='text'
            className='form-control mb-2'
            name='location'
            placeholder='Enter the location'
            value={filters.location}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>
      )}

      <table className='table mt-3'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Company Name</th>
            <th>Industry</th>
            <th>Job type</th>
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
              <td><a href={job.jobUrl} target="_blank" rel='noopener noreferrer'>{job.jobUrl}</a></td>
              <td>
                <button
                  className='btn btn-success btn-sm'
                  onClick={() => saveJob(job.jobid)}
                >
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default SearchJobs;
