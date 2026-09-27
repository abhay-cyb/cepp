import React, { useState } from 'react';
import { Plus, Trash2, Refrigerator } from 'lucide-react';
import { getFoods, addFood, removeFood, getFoodStatus } from '../utils/db';
import { format } from 'date-fns';

export default function Inventory() {
    const [foods, setFoods] = useState(getFoods());
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    
    const [formData, setFormData] = useState({
        foodName: '', category: 'Fruits', quantity: '', 
        purchaseDate: new Date().toISOString().split('T')[0], 
        expiryDate: '', storageLocation: 'Refrigerator'
    });

    const handleAdd = (e) => {
        e.preventDefault();
        addFood(formData);
        setFoods(getFoods());
        setShowModal(false);
        setFormData({ ...formData, foodName: '', quantity: '', expiryDate: '' });
    };

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this item?')) {
            removeFood(id);
            setFoods(getFoods());
        }
    };

    const filtered = foods.filter(f => 
        f.foodName.toLowerCase().includes(search.toLowerCase()) && 
        (category === '' || f.category === category)
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Food Inventory</h2>
                    <p>Manage all your household food items here.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary"><Plus size={20} /> Add Food</button>
            </div>

            <div className="card" style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <input type="text" className="form-control" placeholder="Search food..." style={{ maxWidth: '300px' }} value={search} onChange={e => setSearch(e.target.value)} />
                <select className="form-control" style={{ maxWidth: '200px' }} value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Grains">Grains</option>
                    <option value="Meat">Meat</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Food Name</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Purchase Date</th>
                            <th>Expiry Date</th>
                            <th>Storage</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(food => {
                            const status = getFoodStatus(food.expiryDate);
                            return (
                                <tr key={food.id}>
                                    <td style={{ fontWeight: 500 }}>{food.foodName}</td>
                                    <td>{food.category}</td>
                                    <td>{food.quantity}</td>
                                    <td>{format(new Date(food.purchaseDate), 'dd MMM yyyy')}</td>
                                    <td>{format(new Date(food.expiryDate), 'dd MMM yyyy')}</td>
                                    <td>{food.storageLocation}</td>
                                    <td>
                                        {status === 'Safe' && <span className="badge badge-success">🟢 Safe</span>}
                                        {status === 'Expiring Soon' && <span className="badge badge-warning">🟡 Expiring Soon</span>}
                                        {status === 'Expired' && <span className="badge badge-danger">🔴 Expired</span>}
                                    </td>
                                    <td>
                                        <button onClick={() => handleDelete(food.id)} className="btn btn-danger" style={{ padding: '5px 10px' }}><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                    <Refrigerator size={48} style={{ color: '#ddd', display: 'block', margin: '0 auto 10px' }}/>
                                    No food items found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 style={{ marginBottom: '20px' }}>Add Food Item</h3>
                        <form onSubmit={handleAdd}>
                            <div className="form-group">
                                <label>Food Name</label>
                                <input type="text" className="form-control" required value={formData.foodName} onChange={e => setFormData({...formData, foodName: e.target.value})} placeholder="e.g. Milk, Apple" />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select className="form-control" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Dairy">Dairy</option>
                                    <option value="Grains">Grains</option>
                                    <option value="Meat">Meat</option>
                                    <option value="Bakery">Bakery</option>
                                    <option value="Beverages">Beverages</option>
                                    <option value="Snacks">Snacks</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input type="text" className="form-control" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="e.g. 2 L, 5 kg" />
                            </div>
                            <div className="form-group">
                                <label>Purchase Date</label>
                                <input type="date" className="form-control" required value={formData.purchaseDate} onChange={e => setFormData({...formData, purchaseDate: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input type="date" className="form-control" required value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Storage Location</label>
                                <select className="form-control" required value={formData.storageLocation} onChange={e => setFormData({...formData, storageLocation: e.target.value})}>
                                    <option value="Refrigerator">Refrigerator</option>
                                    <option value="Freezer">Freezer</option>
                                    <option value="Pantry">Pantry</option>
                                    <option value="Kitchen Shelf">Kitchen Shelf</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Food</button>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
