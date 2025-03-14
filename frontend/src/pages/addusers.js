import React, { useState } from "react";
import axios from "axios";

function AddUser() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        major: '',
        year: ''
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
        try {
            const response = await axios.post('https://hirewatch.pythonanywhere.com/addusers', user);
            setUser({ name: '', email:'', major:'', year:''});
        } catch (error) {
            setMessage('Error adding user.');
            console.error('Error:', error)
        }
    };

    return (
        <div className="container">
            <h2>Add a New User</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" value={user.name} onChange={handleChange} required></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="text" className="form-control" name="email" value={user.email} onChange={handleChange} required></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">Major</label>
                    <input type="text" className="form-control" name="major" value={user.major} onChange={handleChange} required></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">Year</label>
                    <input type="text" className="form-control" name="year" value={user.year} onChange={handleChange} required></input>
                </div>
                <button type="submit" className="btn btn-success">Add User</button>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
}

export default AddUser;