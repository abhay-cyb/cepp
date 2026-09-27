import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/db';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            loginUser(email, password);
            navigate('/dashboard');
            window.location.reload(); // Refresh to update nav
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-dark)' }}>Welcome Back</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" required value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
                </div>
                
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Login</button>
            </form>
            
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Register here</Link>
            </p>
        </div>
    );
}
