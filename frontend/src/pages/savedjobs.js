import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const uname = localStorage.getItem("name")
    if (!token) {
      // Redirect to login if no token is found
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome {{uname}}</h1>
      <p>This is a protected page.</p>
    </div>
  );
};

export default Savedjobs;