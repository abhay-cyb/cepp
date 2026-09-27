import React, { useState } from 'react';
import { Plus, X, ShoppingBag } from 'lucide-react';
import { getMeals, addMeal, removeMeal, getFoods, getFoodStatus } from '../utils/db';

export default function MealPlanner() {
    const [meals, setMeals] = useState(getMeals());
    const foods = getFoods().filter(f => getFoodStatus(f.expiryDate) !== 'Expired');
    const [showModal, setShowModal] = useState(false);
    
    const [formData, setFormData] = useState({
        day: 'Monday', mealType: 'Breakfast', mealName: '', ingredients: ''
    });

    const handleAdd = (e) => {
        e.preventDefault();
        addMeal(formData);
        setMeals(getMeals());
        setShowModal(false);
        setFormData({ ...formData, mealName: '', ingredients: '' });
    };

    const handleDelete = (id) => {
        removeMeal(id);
        setMeals(getMeals());
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Weekly Meal Planner</h2>
                    <p>Plan meals using food that you already have to reduce waste.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary"><Plus size={20} /> Add Meal</button>
            </div>

            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <div className="grid-cards" style={{ marginTop: 0, gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                        {days.map(day => (
                            <div className="card" key={day} style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ background: 'var(--primary-color)', color: 'white', padding: '15px', textAlign: 'center', fontWeight: 600 }}>
                                    {day}
                                </div>
                                <div style={{ padding: '15px' }}>
                                    {mealTypes.map(type => {
                                        const dayMeals = meals.filter(m => m.day === day && m.mealType === type);
                                        return (
                                            <div key={type} style={{ marginBottom: type === 'Dinner' ? 0 : '15px', borderBottom: type === 'Dinner' ? 'none' : '1px solid #eee', paddingBottom: type === 'Dinner' ? 0 : '10px' }}>
                                                <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '5px' }}>{type}</h4>
                                                {dayMeals.length > 0 ? dayMeals.map(m => (
                                                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                                                        <div>
                                                            <span style={{ fontWeight: 500 }}>{m.mealName}</span>
                                                            {m.ingredients && <div style={{ fontSize: '0.8rem', color: '#888' }}>{m.ingredients}</div>}
                                                        </div>
                                                        <button onClick={() => handleDelete(m.id)} className="btn btn-text" style={{ padding: 0, color: 'var(--danger)' }}><X size={16}/></button>
                                                    </div>
                                                )) : <span style={{ color: '#ccc', fontSize: '0.9rem' }}>No meal planned</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div style={{ width: '100%', maxWidth: '300px' }}>
                    <div className="card" style={{ position: 'sticky', top: '90px', background: '#f8fafc' }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--primary-dark)', borderBottom: '2px solid var(--primary-light)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShoppingBag size={20} /> Available Food
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px' }}>Use these items to plan your meals.</p>
                        
                        <ul style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                            {foods.length > 0 ? foods.map(f => (
                                <li key={f.id} style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 500 }}>{f.foodName}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{f.quantity}</span>
                                </li>
                            )) : <li style={{ color: '#ccc', textAlign: 'center', padding: '20px 0' }}>No available food.</li>}
                        </ul>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 style={{ marginBottom: '20px' }}>Add New Meal</h3>
                        <form onSubmit={handleAdd}>
                            <div className="form-group">
                                <label>Day</label>
                                <select className="form-control" required value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})}>
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Meal Type</label>
                                <select className="form-control" required value={formData.mealType} onChange={e => setFormData({...formData, mealType: e.target.value})}>
                                    {mealTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Meal Name</label>
                                <input type="text" className="form-control" required value={formData.mealName} onChange={e => setFormData({...formData, mealName: e.target.value})} placeholder="e.g. Rice + Vegetables" />
                            </div>
                            <div className="form-group">
                                <label>Ingredients (optional)</label>
                                <input type="text" className="form-control" value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} placeholder="e.g. Rice, Carrots" />
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
