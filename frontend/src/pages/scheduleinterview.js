import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

function ScheduleInterview() {
    const [interview, setInterview] = useState({
        firstName: "",
        lastName: "",
        jobTitle: "",
        intDate: "",
        intTime: "",
        intLocation: ""
    });

    const [message, setMessage] = useState("")
    const navigate = useNavigate();
    const uname = localStorage.getItem("name");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login", { state: { from: "/scheduleinterview" } });
        }
    }, [navigate]);

    const handleChange = (event) => {
        setInterview({
            ...interview,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const fullName = `${interview.firstName} ${interview.lastName}`.trim();
        const interviewData = { ...interview, name: fullName };
        delete interviewData.firstName;
        delete interviewData.lastName;

        console.log("Sending Data:", interviewData);

        try {
            await axios.post("https://hirewatch.pythonanywhere.com/scheduleinterview", interviewData);
            setInterview({ firstName: "", lastName: "", jobTitle: "", intDate: "", intTime: "", intLocation: "" });
            setMessage("Interview scheduled successfully");
        } catch (error) {
            setMessage("Error scheduling interview. Make sure user and job exist.");
            console.error("Error:", error);
        }
    };

    const handleClear = () => {
        setInterview({ firstName: "", lastName: "", jobTitle: "", intDate: "", intTime: "", intLocation: "" });
        setMessage("");
    }

    return (
        <div className="container">
            <h2>Schedule an Interview</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">First Name: </label>
                    <input type="text" className="form-control" name="firstName" value={interview.firstName} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Name: </label>
                    <input type="text" className="form-control" name="lastName" value={interview.lastName} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Job Title: </label>
                    <input type="text" className="form-control" name="jobTitle" value={interview.jobTitle} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Interview Date: </label>
                    <input type="date" className="form-control" name="intDate" value={interview.intDate} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Interview Time: </label>
                    <input type="time" className="form-control" name="intTime" value={interview.intTime} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Interview Location: </label>
                    <input type="text" className="form-control" name="intLocation" value={interview.intLocation} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Book Interview</button>
                <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
}

export default ScheduleInterview;