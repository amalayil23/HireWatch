import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookedInterview = () => {
    const [interviews, setInterviews] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
            const token = localStorage.getItem("token");
    
            if (!token) {
                navigate("/login", { state: { from: "/bookedinterviews" } });
            } else {
                fetchBookedInterviews(token);
            }
        }, [navigate]);
    
    const fetchBookedInterviews = async (token) => {
        try {
            const response = await axios.get(
                "https://hirewatch.pythonanywhere.com/bookedinterviews",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                const data = response.data;
                
                if (data.message == "No interviews booked yet.") {
                    setInterviews([]);
                    setError("No booked interviews found.");
                } else if (Array.isArray(data) && data.length > 0) {
                    setInterviews(data);
                    setError("");
                } else if (data.intDate) {
                    setInterviews([data]);
                    setError("");
                }
            } else {
                setError("Failed to fetch booked interviews.");
            }
        } catch (err) {
            console.error("Error fetching interviews:", err);
            setError("Error fetching interviews. Please check your connection.");
        }
    };

    const deleteInterview = async (id) => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.delete(
                `https://hirewatch.pythonanywhere.com/removeinterview?intid=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                fetchBookedInterviews(token);
                //setInterviews(interviews.filter((interview) => interview.id !== id));
            } else {
                setError("Failed to delete interview.");
            }
        } catch (err) {
            console.error("Error deleting interview:", err);
            setError("Error deleting interview. Please try again.")
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Booked Interviews
                </h1>

                {error && (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                )}

                {interviews.length === 0 && !error ? (
                    <p className="text-gray-500 text-center">
                        No booked interviews to display
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                <th className="py-2 px-4 border-b text-left">Date</th>
                                <th className="py-2 px-4 border-b text-left">Time</th>
                                <th className="py-2 px-4 border-b text-left">Location</th>
                                <th className="py-2 px-4 border-b text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {interviews.map((interview) => (
                                    <tr
                                        key={interview.intid}
                                        className="hover:bg-gray-50 transition-all"
                                    >
                                        <td className="py-2 px-4 border-b">
                                            {interview.intDate}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {interview.intTime}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {interview.intLocation}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => 
                                                    deleteInterview(interview.intid)
                                                }
                                                className="bg-red-500 text-white px-4 py-1 rounded-lg hover:big-red-600 transition"
                                            >
                                                Cancel Interview
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookedInterview;