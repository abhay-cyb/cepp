import React, { useState } from 'react';
import { ShieldCheck, Clock, XCircle, Refrigerator } from 'lucide-react';
import { getFoods, getFoodStatus, removeFood } from '../utils/db';
import { differenceInDays } from 'date-fns';

export default function ExpiryTracker() {
    const [foods, setFoods] = useState(getFoods());

    const safe = [];
    const expiringSoon = [];
    const expired = [];
    const today = new Date();

    foods.forEach(f => {
        const status = getFoodStatus(f.expiryDate);
        if (status === 'Expired') expired.push(f);
        else if (status === 'Expiring Soon') expiringSoon.push(f);
        else safe.push(f);
    });

    const handleDelete = (id) => {
        if(window.confirm('Remove this item?')) {
            removeFood(id);
            setFoods(getFoods());
        }
    };

    return (
        <div>
            <div className="page-header">
                <h2>Expiry Tracker</h2>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#d1fae5', color: '#047857' }}><ShieldCheck /></div>
                    <div className="stat-info">
                        <h4>Safe</h4>
                        <p>{safe.length}</p>
                    </div>
                </div>
                
                <div className="stat-card warning">
                    <div className="stat-icon"><Clock /></div>
                    <div className="stat-info">
                        <h4>Expiring Soon</h4>
                        <p>{expiringSoon.length}</p>
                    </div>
                </div>
                
                <div className="stat-card danger">
                    <div className="stat-icon"><XCircle /></div>
                    <div className="stat-info">
                        <h4>Expired</h4>
                        <p>{expired.length}</p>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                {expiringSoon.length > 0 && (
                    <>
                        <h3 style={{ marginBottom: '20px', color: 'var(--warning)' }}>⚠️ Expiring Soon</h3>
                        <div className="grid-cards" style={{ marginTop: 0, marginBottom: '40px', gap: '20px' }}>
                            {expiringSoon.map(f => (
                                <div className="card" key={f.id} style={{ borderTop: '4px solid var(--warning)' }}>
                                    <h3 style={{ marginBottom: '5px' }}>{f.foodName}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>{f.quantity} • {f.category}</p>
                                    <p style={{ fontWeight: 500, marginBottom: '15px' }}>Expires in {differenceInDays(new Date(f.expiryDate), today)} days</p>
                                    <span className="badge badge-warning">🟡 Expiring Soon</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {expired.length > 0 && (
                    <>
                        <h3 style={{ marginBottom: '20px', color: 'var(--danger)' }}>🔴 Expired</h3>
                        <div className="grid-cards" style={{ marginTop: 0, marginBottom: '40px', gap: '20px' }}>
                            {expired.map(f => (
                                <div className="card" key={f.id} style={{ borderTop: '4px solid var(--danger)', backgroundColor: '#fef2f2' }}>
                                    <h3 style={{ marginBottom: '5px' }}>{f.foodName}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>{f.quantity} • {f.category}</p>
                                    <p style={{ fontWeight: 500, marginBottom: '15px' }}>Expired {Math.abs(differenceInDays(new Date(f.expiryDate), today))} days ago</p>
                                    <span className="badge badge-danger" style={{ display: 'block', width: 'fit-content', marginBottom: '15px' }}>🔴 Expired</span>
                                    <button onClick={() => handleDelete(f.id)} className="btn btn-outline" style={{ width: '100%', color: 'var(--danger)', borderColor: 'var(--danger)' }}>Remove Item</button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {safe.length > 0 && (
                    <>
                        <h3 style={{ marginBottom: '20px', color: 'var(--success)' }}>🟢 Safe</h3>
                        <div className="grid-cards" style={{ marginTop: 0, marginBottom: '40px', gap: '20px' }}>
                            {safe.map(f => (
                                <div className="card" key={f.id} style={{ borderTop: '4px solid var(--success)' }}>
                                    <h3 style={{ marginBottom: '5px' }}>{f.foodName}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>{f.quantity} • {f.category}</p>
                                    <p style={{ fontWeight: 500, marginBottom: '15px' }}>Expires in {differenceInDays(new Date(f.expiryDate), today)} days</p>
                                    <span className="badge badge-success">🟢 Safe</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {foods.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
                        <Refrigerator size={64} style={{ color: '#ddd', margin: '0 auto 15px' }} />
                        <h3 style={{ color: 'var(--text-muted)' }}>No food items to track.</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
