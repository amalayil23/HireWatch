import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    console.log("Sending login request to:", "https://hirewatch.pythonanywhere.com/login");
    console.log("Request payload:", { username, password });

    try {
      const response = await axios.post("https://hirewatch.pythonanywhere.com/login", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        const { access_token, name } = response.data;

        // Store token securely (e.g., localStorage or sessionStorage)
        localStorage.setItem("token", access_token);
        localStorage.setItem("name", name);

        // Update the message with a success message
        setMessage(`Welcome, ${name}!`);
      }
    } catch (error) {
      console.error("Error details:", error); // Log the error object for debugging
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
    </div>
  );
};

// Simple CSS styling for the form
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
