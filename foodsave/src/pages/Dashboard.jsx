import React from 'react';
import { Link } from 'react-router-dom';
import { Refrigerator, Clock, XCircle, Utensils, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { getCurrentUser, getFoods, getFoodStatus, getLeftovers, getWasteRecords } from '../utils/db';
import { format } from 'date-fns';

export default function Dashboard() {
    const user = getCurrentUser();
    const foods = getFoods();
    const leftovers = getLeftovers().filter(l => l.status === 'Available');
    const wasteRecords = getWasteRecords();

    const totalItems = foods.length;
    let expiringSoon = 0;
    let expired = 0;
    
    const expiringAlerts = [];
    
    foods.forEach(f => {
        const status = getFoodStatus(f.expiryDate);
        if (status === 'Expired') expired++;
        if (status === 'Expiring Soon') {
            expiringSoon++;
            expiringAlerts.push(f);
        }
    });

    const foodWasted = wasteRecords.reduce((acc, w) => {
        const val = parseFloat(w.quantity) || 0;
        const isKg = w.quantity.toLowerCase().includes('kg');
        return acc + (isKg ? val : val / 1000);
    }, 0);

    const recentFoods = [...foods].reverse().slice(0, 5);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Good morning, {user?.name?.split(' ')[0]} 👋</h2>
                    <p>Here's your household food overview.</p>
                </div>
                <Link to="/inventory" className="btn btn-primary"><Plus size={20} /> Add Food</Link>
            </div>

            {expiringAlerts.length > 0 && (
                <div className="alert alert-warning" style={{ borderRadius: 'var(--radius-lg)' }}>
                    <AlertTriangle size={24} />
                    <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0 }}>⚠️ Food Expiring Soon</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>You have {expiringAlerts.length} item(s) expiring within 3 days.</p>
                    </div>
                    <Link to="/expiry-tracker" className="btn btn-outline" style={{ background: 'white' }}>View Expiring Food</Link>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon"><Refrigerator /></div>
                    <div className="stat-info">
                        <h4>Total Food Items</h4>
                        <p>{totalItems}</p>
                    </div>
                </div>
                
                <div className="stat-card warning">
                    <div className="stat-icon"><Clock /></div>
                    <div className="stat-info">
                        <h4>Expiring Soon</h4>
                        <p>{expiringSoon}</p>
                    </div>
                </div>
                
                <div className="stat-card danger">
                    <div className="stat-icon"><XCircle /></div>
                    <div className="stat-info">
                        <h4>Expired Items</h4>
                        <p>{expired}</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}><Utensils /></div>
                    <div className="stat-info">
                        <h4>Leftover Items</h4>
                        <p>{leftovers.length}</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}><Trash2 /></div>
                    <div className="stat-info">
                        <h4>Food Wasted</h4>
                        <p>{foodWasted.toFixed(2)} kg</p>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px' }}>Recent Food Items</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Food</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Expiry</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentFoods.map(food => {
                                const status = getFoodStatus(food.expiryDate);
                                return (
                                    <tr key={food.id}>
                                        <td style={{ fontWeight: 500 }}>{food.foodName}</td>
                                        <td>{food.category}</td>
                                        <td>{food.quantity}</td>
                                        <td>{format(new Date(food.expiryDate), 'dd MMM yyyy')}</td>
                                        <td>
                                            {status === 'Safe' && <span className="badge badge-success">🟢 Safe</span>}
                                            {status === 'Expiring Soon' && <span className="badge badge-warning">🟡 Expiring Soon</span>}
                                            {status === 'Expired' && <span className="badge badge-danger">🔴 Expired</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                            {recentFoods.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No food items added yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
