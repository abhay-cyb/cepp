import React from 'react';

export default function Tips() {
    return (
        <div>
            <div className="page-header" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '50px' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)' }}>Simple Ways to Reduce Food Waste</h2>
                    <p style={{ fontSize: '1.1rem' }}>Smart habits that save food and money.</p>
                </div>
            </div>

            <div className="grid-cards" style={{ marginTop: 0 }}>
                <div className="card tip-card">
                    <div className="tip-number">01</div>
                    <div style={{ paddingTop: '20px', borderTop: '3px solid var(--primary-light)' }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--text-main)' }}>Avoid Over-Purchasing</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Buy only what your household needs. Plan your shopping list and stick to it to avoid buying excess items that might go bad.</p>
                    </div>
                </div>
                
                <div className="card tip-card">
                    <div className="tip-number">02</div>
                    <div style={{ paddingTop: '20px', borderTop: '3px solid var(--primary-light)' }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--text-main)' }}>Check Expiry Dates</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Regularly check expiry dates and use food that expires sooner first. Practice the FIFO (First In, First Out) method in your fridge.</p>
                    </div>
                </div>
                
                <div className="card tip-card">
                    <div className="tip-number">03</div>
                    <div style={{ paddingTop: '20px', borderTop: '3px solid var(--primary-light)' }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--text-main)' }}>Store Food Properly</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Use appropriate storage methods to maintain freshness. Keep fruits and veggies in separate drawers, and use airtight containers.</p>
                    </div>
                </div>
                
                <div className="card tip-card">
                    <div className="tip-number">04</div>
                    <div style={{ paddingTop: '20px', borderTop: '3px solid var(--primary-light)' }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--text-main)' }}>Use Leftovers</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Turn safe leftovers into another meal instead of throwing them away. Pack them for tomorrow's lunch or incorporate them into dinner.</p>
                    </div>
                </div>
                
                <div className="card tip-card">
                    <div className="tip-number">05</div>
                    <div style={{ paddingTop: '20px', borderTop: '3px solid var(--primary-light)' }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--text-main)' }}>Plan Your Meals</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Plan meals before shopping to reduce unnecessary purchases. Check what you already have in stock before buying more.</p>
                    </div>
                </div>
                
                <div className="card tip-card">
                    <div className="tip-number">06</div>
                    <div style={{ paddingTop: '20px', borderTop: '3px solid var(--primary-light)' }}>
                        <h3 style={{ marginBottom: '15px', color: 'var(--text-main)' }}>Dispose Responsibly</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Dispose of unavoidable food waste responsibly, such as through composting where appropriate instead of tossing it in the trash bin.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
