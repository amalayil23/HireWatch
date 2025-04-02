import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

function ScheduleInterview() {
    const location = useLocation();
    const appid = location.state?.appid || ""; // Retrieve appid from location.state

    const [interview, setInterview] = useState({
        appid: appid,
        intDate: "",
        intTime: "",
        intLocation: ""
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login", { state: { from: "/scheduleinterview" } });
        }

        if (!appid) {
            setMessage("Error: App ID is missing. Please try again.");
        }
    }, [navigate, appid]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInterview((prevInterview) => ({
            ...prevInterview,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("You are not authorized. Please log in.");
            navigate("/login");
            return;
        }

        // Validate that all fields are filled
        if (!interview.appid || !interview.intDate || !interview.intTime || !interview.intLocation) {
            setMessage("All fields are required. Please fill out the form completely.");
            return;
        }

        try {
            console.log("Submitting Interview Data:", interview);

            // Construct the URL with query parameters
            const url = `https://hirewatch.pythonanywhere.com/scheduleinterview?appid=${interview.appid}&intDate=${interview.intDate}&intTime=${interview.intTime}&intLocation=${interview.intLocation}`;
            console.log("URL:", url);
            // Send the GET request with query parameters
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Reset the form and display success message
            setInterview({ appid: appid, intDate: "", intTime: "", intLocation: "" });
            setMessage("Interview scheduled successfully");
            console.log("Response:", response.data);
        } catch (error) {
            setMessage("Error scheduling interview. Please try again.");
            console.error("Error:", error.response?.data || error.message);
        }
    };

    const handleClear = () => {
        setInterview({ appid: appid, intDate: "", intTime: "", intLocation: "" });
        setMessage("");
    };

    return (
        <div className="container">
            <h2>Schedule an Interview</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Interview Date: </label>
                    <input
                        type="date"
                        className="form-control"
                        name="intDate"
                        value={interview.intDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Interview Time: </label>
                    <input
                        type="time"
                        className="form-control"
                        name="intTime"
                        value={interview.intTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Interview Location: </label>
                    <input
                        type="text"
                        className="form-control"
                        name="intLocation"
                        value={interview.intLocation}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Book Interview
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleClear}>
                    Clear
                </button>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
}

export default ScheduleInterview;