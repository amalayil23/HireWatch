import React, { useState } from "react";
import axios from "axios";

function AddUser() {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        major: '',
        year: '',
        password: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const fullName = `${user.firstName} ${user.lastName}`.trim()

        const year = parseInt(user.year);
        if (isNaN(year) || year < 1 || year > 4) {
            setMessage("Invalid year! Must be between 1-4.")
            return;
        }

        if (user.password !== user.confirmPassword) {
            setMessage("Passwords do not match!");
        }

        console.log("Sending Data:", {
            name: fullName,
                email: user.email,
                major: user.major,
                year: user.year,
                password: user.password
        });

        try {
            const response = await axios.post('https://hirewatch.pythonanywhere.com/addusers', {
                name: fullName,
                email: user.email,
                major: user.major,
                year: user.year,
                password: user.password
            });
            setUser({ firstName:'', lastName:'', email:'', major:'', year:'', password: "", confirmPassword: "",});
            setMessage("Successfully added user")
        } catch (error) {
            setMessage('Error adding user.');
            console.error('Error:', error)
        }

    };

    const handleClear = () => {
        setUser({ firstName: '', lastName: '', email: '', major: '', year: '', password: '', confirmPassword: ''});
        setMessage('');
    }

    return (
        <div className="container">
            <h2>Add a New User</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">First Name: </label>
                    <input type="text" className="form-control" name="firstName" value={user.firstName} onChange={handleChange} required></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Name: </label>
                    <input type="text" className="form-control" name="lastName" value={user.lastName} onChange={handleChange} required></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">Email: </label>
                    <input type="text" className="form-control" name="email" value={user.email} onChange={handleChange} required></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">Major: </label>
                    <input type="text" className="form-control" name="major" value={user.major} onChange={handleChange} required></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">Year: </label>
                    <input type="text" className="form-control" name="year" value={user.year} onChange={handleChange} required></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password: </label>
                    <input type="password" className="form-control" name="password" value={user.password} onChange={handleChange} required></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirm Password: </label>
                    <input type="password" className="form-control" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} required></input>
                </div>
                <button type="submit" className="btn btn-success">Add User</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={handleClear}>Clear</button>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
}

export default AddUser;