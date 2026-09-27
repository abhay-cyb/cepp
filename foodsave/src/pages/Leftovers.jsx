import React, { useState } from 'react';
import { Plus, Utensils, Calendar, Bell, Check, Trash2, X } from 'lucide-react';
import { getLeftovers, addLeftover, updateLeftoverStatus, removeLeftover } from '../utils/db';
import { format } from 'date-fns';

export default function Leftovers() {
    const [leftovers, setLeftovers] = useState(getLeftovers().filter(l => l.status === 'Available'));
    const [showModal, setShowModal] = useState(false);
    
    const [formData, setFormData] = useState({
        foodName: '', quantity: '', dateAdded: new Date().toISOString().split('T')[0], reminderDate: ''
    });

    const handleAdd = (e) => {
        e.preventDefault();
        addLeftover(formData);
        setLeftovers(getLeftovers().filter(l => l.status === 'Available'));
        setShowModal(false);
        setFormData({ ...formData, foodName: '', quantity: '', reminderDate: '' });
    };

    const handleStatus = (id, status) => {
        updateLeftoverStatus(id, status);
        setLeftovers(getLeftovers().filter(l => l.status === 'Available'));
    };

    const handleDelete = (id) => {
        if(window.confirm('Delete this leftover entry?')) {
            removeLeftover(id);
            setLeftovers(getLeftovers().filter(l => l.status === 'Available'));
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Leftover Management</h2>
                    <p>Track leftovers and get reminders to consume them.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary"><Plus size={20} /> Add Leftover</button>
            </div>

            <div className="grid-cards" style={{ marginTop: 0 }}>
                {leftovers.map(l => (
                    <div className="card" key={l.id} style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ marginBottom: '10px', color: 'var(--primary-dark)' }}>{l.foodName}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}><Utensils size={16} /> Quantity: {l.quantity}</p>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}><Calendar size={16} /> Added: {format(new Date(l.dateAdded), 'dd MMM yyyy')}</p>
                        
                        {l.reminderDate && (
                            <div style={{ background: '#e0f2fe', padding: '10px', borderRadius: 'var(--radius-md)', marginBottom: '15px', textAlign: 'center' }}>
                                <span style={{ color: '#0284c7', fontWeight: 500 }}><Bell size={16} /> Consume by: {format(new Date(l.reminderDate), 'dd MMM')}</span>
                            </div>
                        )}
                        
                        <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <button onClick={() => handleStatus(l.id, 'Consumed')} className="btn btn-success" style={{ width: '100%', padding: '8px' }}><Check size={16}/> Consumed</button>
                            <button onClick={() => handleStatus(l.id, 'Wasted')} className="btn btn-danger" style={{ width: '100%', padding: '8px' }}><Trash2 size={16}/> Wasted</button>
                        </div>
                        <button onClick={() => handleDelete(l.id)} className="btn btn-text" style={{ width: '100%', fontSize: '0.9rem', marginTop: '10px' }}><X size={16}/> Remove</button>
                    </div>
                ))}
                
                {leftovers.length === 0 && (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
                        <Utensils size={64} style={{ color: '#ddd', margin: '0 auto 15px' }} />
                        <h3 style={{ color: 'var(--text-muted)' }}>No available leftovers.</h3>
                        <p>When you have extra food after a meal, add it here!</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 style={{ marginBottom: '20px' }}>Add New Leftover</h3>
                        <form onSubmit={handleAdd}>
                            <div className="form-group">
                                <label>Food Name</label>
                                <input type="text" className="form-control" required value={formData.foodName} onChange={e => setFormData({...formData, foodName: e.target.value})} placeholder="e.g. Vegetable Rice" />
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input type="text" className="form-control" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="e.g. 500 g, 1 bowl" />
                            </div>
                            <div className="form-group">
                                <label>Date Added</label>
                                <input type="date" className="form-control" required value={formData.dateAdded} onChange={e => setFormData({...formData, dateAdded: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Consume By (Optional)</label>
                                <input type="date" className="form-control" value={formData.reminderDate} onChange={e => setFormData({...formData, reminderDate: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
