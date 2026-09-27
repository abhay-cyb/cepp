import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                        <Leaf size={24} style={{ marginRight: '8px' }}/> FoodSave
                    </Link>
                    <p>Food Waste Reduction System</p>
                    <p style={{ marginTop: '10px' }}>Small Changes. Less Waste. Bigger Impact.</p>
                </div>
                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <Link to="/">Home</Link>
                    <Link to="/tips">Food Waste Tips</Link>
                    <Link to="/register">Get Started</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 FoodSave. All rights reserved.</p>
            </div>
        </footer>
    );
}
