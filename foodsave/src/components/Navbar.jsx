import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Menu, UserCircle, X } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../utils/db';

export default function Navbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = getCurrentUser();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const navLinks = user ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Food Inventory', path: '/inventory' },
        { name: 'Expiry Tracker', path: '/expiry-tracker' },
        { name: 'Leftovers', path: '/leftovers' },
        { name: 'Meal Planner', path: '/meal-planner' },
        { name: 'Waste Reports', path: '/reports' },
        { name: 'Tips', path: '/tips' },
    ] : [
        { name: 'Home', path: '/' },
        { name: 'Tips', path: '/tips' },
    ];

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to={user ? '/dashboard' : '/'} className="logo" style={{ textDecoration: 'none' }}>
                    <Leaf size={32} color="var(--primary-color)" />
                    <div>
                        <h1>FoodSave</h1>
                        <span>Food Waste Reduction System</span>
                    </div>
                </Link>
                
                <div className="mobile-menu-btn" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
                </div>

                <div className={`nav-links ${isMobileOpen ? 'show' : ''}`}>
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            to={link.path}
                            className={location.pathname === link.path ? 'active' : ''}
                            onClick={() => setIsMobileOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    
                    {/* Mobile auth buttons */}
                    <div style={{ display: isMobileOpen ? 'flex' : 'none', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                         {user ? (
                            <>
                                <div style={{ fontWeight: 500 }}><UserCircle size={20} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> {user.name}</div>
                                <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-text" onClick={() => setIsMobileOpen(false)}>Login</Link>
                                <Link to="/register" className="btn btn-primary" onClick={() => setIsMobileOpen(false)}>Register</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="nav-auth" style={{ display: isMobileOpen ? 'none' : 'flex' }}>
                    {user ? (
                        <>
                            <div className="user-profile">
                                <span><UserCircle size={20} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> {user.name}</span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-text">Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
