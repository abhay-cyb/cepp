import React from 'react';
import { ShoppingCart, UtensilsCrossed, Trash2, Bowl } from 'lucide-react';
import { getFoods, getLeftovers, getWasteRecords } from '../utils/db';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Reports() {
    const foods = getFoods();
    const leftovers = getLeftovers();
    const wasteRecords = getWasteRecords();

    const foodAdded = foods.length;
    const foodConsumed = leftovers.filter(l => l.status === 'Consumed').length;
    const foodWasted = wasteRecords.length;
    const leftoversTotal = leftovers.length;

    // Charts Data
    const usageData = {
        labels: ['Added (in stock)', 'Consumed (leftovers)', 'Wasted'],
        datasets: [{
            data: [foodAdded, foodConsumed, foodWasted],
            backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
            borderWidth: 0
        }]
    };

    const categoriesCount = {};
    wasteRecords.forEach(w => {
        // Find category from food or default to 'Other'
        const food = foods.find(f => f.foodName === w.foodName);
        const cat = food ? food.category : 'Other';
        categoriesCount[cat] = (categoriesCount[cat] || 0) + 1;
    });

    const categoryData = {
        labels: Object.keys(categoriesCount).length > 0 ? Object.keys(categoriesCount) : ['No Data'],
        datasets: [{
            label: 'Items Wasted',
            data: Object.keys(categoriesCount).length > 0 ? Object.values(categoriesCount) : [0],
            backgroundColor: '#f59e0b',
            borderRadius: 5
        }]
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Food Waste Reports</h2>
                    <p>Understand how much food you consume and waste.</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}><ShoppingCart /></div>
                    <div className="stat-info">
                        <h4>Food Added</h4>
                        <p>{foodAdded}</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#d1fae5', color: '#047857' }}><UtensilsCrossed /></div>
                    <div className="stat-info">
                        <h4>Food Consumed</h4>
                        <p>{foodConsumed}</p>
                    </div>
                </div>
                
                <div className="stat-card danger">
                    <div className="stat-icon"><Trash2 /></div>
                    <div className="stat-info">
                        <h4>Food Wasted</h4>
                        <p>{foodWasted}</p>
                    </div>
                </div>
                
                <div className="stat-card warning">
                    <div className="stat-icon"><Bowl /></div>
                    <div className="stat-info">
                        <h4>Total Leftovers</h4>
                        <p>{leftoversTotal}</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Food Usage Breakdown</h3>
                    <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                        <Doughnut data={usageData} options={{ plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>
                
                <div className="card">
                    <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Waste by Category</h3>
                    <Bar data={categoryData} options={{ scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
                </div>
            </div>
        </div>
    );
}
