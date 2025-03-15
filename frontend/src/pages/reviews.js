import React, { useState, useEffect } from "react";
import axios from "axios";
import "./reviews.css"

function ReviewCompany() {
    const [reviews, setReviews] = useState([])
    const [search, setSearch] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async (companyName = "") => {
        try {
            let url = "https://hirewatch.pythonanywhere.com/reviews";
            if (companyName) {
                url += `?companyName=${encodeURIComponent(companyName)}`;
            }
            console.log("Fetching from URL", url);

            const response =await axios.get(url);
            console.log("Response Data:", response.data);

            setReviews(response.data);
            setMessage("");
        } catch (error) {
            console.error("Error fetching reviews:", error.response || error.message);
            setMessage("Failed to load reviews. Please try again later.");
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
        fetchReviews(search.trim());
    };

    return (
        <div className="container">
            <h2>Company Reviews</h2>
            <form onSubmit={handleSearch} className="mb-3">
                <input type="text" className="form-control" placeholder="Search by company name" value={search} onChange={(e) => setSearch(e.target.value)}></input>
                <button type="submit" className="btn btn-primary mt-2">Search</button>
            </form>
            {message && <p className="text-danger">{message}</p>}
            <div className="reviews-container">
                {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews found.</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.reviewid}>
                            <h3 className="company-name">{review.companyName}</h3>
                            <p className="rating"><strong>Rating: </strong> {review.rating} / 10</p>
                            <p className="feedback"><strong>Feedback: </strong> {review.feedback}</p>
                            <p className="date-posted"><small>Posted On: {review.datePosted}</small></p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ReviewCompany;
