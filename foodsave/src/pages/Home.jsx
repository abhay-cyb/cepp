import React from 'react';
import { Link } from 'react-router-dom';
import { Refrigerator, AlertTriangle, Utensils, Calendar, BarChart3, Lightbulb } from 'lucide-react';

export default function Home() {
    return (
        <div>
            <section className="hero">
                <div className="hero-content">
                    <h1>Reduce Food Waste. Save Food. Save Money.</h1>
                    <p>Smartly manage your household food, track expiry dates, reuse leftovers and plan better meals — all in one place.</p>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>Get Started</Link>
                        <a href="#features" className="btn btn-outline" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>Explore Features</a>
                    </div>
                </div>
                <div className="hero-image">
                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Fresh vegetables and groceries" style={{ borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-lg)' }}/>
                </div>
            </section>

            <section id="features" style={{ padding: '60px 0' }}>
                <div className="page-header" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '50px' }}>
                    <h2>Everything You Need to Waste Less</h2>
                </div>
                
                <div className="grid-cards">
                    <div className="card feature-card">
                        <div className="icon-wrapper"><Refrigerator size={40} /></div>
                        <h3>Food Inventory</h3>
                        <p>Keep track of all food items in your household easily.</p>
                    </div>
                    <div className="card feature-card">
                        <div className="icon-wrapper"><AlertTriangle size={40} /></div>
                        <h3>Expiry Tracker</h3>
                        <p>Know which food is safe, expiring soon or already expired.</p>
                    </div>
                    <div className="card feature-card">
                        <div className="icon-wrapper"><Utensils size={40} /></div>
                        <h3>Leftover Management</h3>
                        <p>Track leftovers and get reminders to consume them.</p>
                    </div>
                    <div className="card feature-card">
                        <div className="icon-wrapper"><Calendar size={40} /></div>
                        <h3>Meal Planner</h3>
                        <p>Plan meals using food that you already have.</p>
                    </div>
                    <div className="card feature-card">
                        <div className="icon-wrapper"><BarChart3 size={40} /></div>
                        <h3>Waste Reports</h3>
                        <p>Understand how much food you consume and waste.</p>
                    </div>
                    <div className="card feature-card">
                        <div className="icon-wrapper"><Lightbulb size={40} /></div>
                        <h3>Smart Tips</h3>
                        <p>Learn practical ways to reduce household food waste.</p>
                    </div>
                </div>
            </section>

            <section style={{ padding: '80px 0', textAlign: 'center', background: 'var(--secondary-color)', borderRadius: 'var(--radius-xl)', margin: '40px 0' }}>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '20px' }}>Small Changes. Less Waste. Bigger Impact.</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', maxWidth: '700px', margin: '0 auto 30px' }}>
                    Household food management can help reduce unnecessary food waste, save you money, and lower your carbon footprint. Start tracking today.
                </p>
                <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '12px 30px' }}>Start Managing Your Food</Link>
            </section>
        </div>
    );
}
