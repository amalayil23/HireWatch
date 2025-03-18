import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Savedjobs = () => {
  const navigate = useNavigate();
  const uname = localStorage.getItem("name")

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      // Redirect to login if no token is found
      navigate("/login", { state: { from: "/savedjobs" } });
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome {uname}</h1>
      <p>Your Saved Jobs.</p>
    </div>
  );
};

export default Savedjobs;