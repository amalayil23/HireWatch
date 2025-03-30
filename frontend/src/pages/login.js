import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./usercontext"; // Import UserContext

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(UserContext); // Use login from UserContext

  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://hirewatch.pythonanywhere.com/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const { access_token, name } = response.data;

        // Use the login function to update the global state
        login(name, access_token);

        // Redirect to the original page
        navigate(from);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setMessage("Invalid username or password.");
      } else {
        setMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      {message && <p>{message}</p>}
      <br></br>
      <p>Don't have an account? <Link to="/addusers">Sign Up</Link></p>
    </div>
  );
};

const styles = {
  container: {
    width: "300px",
    margin: "100px auto",
    fontFamily: "Arial, sans-serif",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default Login;