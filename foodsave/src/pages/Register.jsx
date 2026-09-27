import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/db';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        try {
            registerUser(name, email, password);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '450px', margin: '50px auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--primary-dark)' }}>Create Account</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" className="form-control" required value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" required value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
                </div>
                
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" className="form-control" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" />
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Create Account</button>
            </form>
            
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Login here</Link>
            </p>
        </div>
    );
}
