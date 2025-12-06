import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedStore } from '../services/feedStore';
import { ArrowLeft, Milk, Utensils, CheckCircle } from 'lucide-react';

export default function FeedTracker() {
    const navigate = useNavigate();
    const [type, setType] = useState('milk'); // 'milk' | 'solid'
    const [amount, setAmount] = useState(''); // ml for milk
    const [foodItem, setFoodItem] = useState(''); // for solid
    const [feeds, setFeeds] = useState([]);
    const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setFeeds(feedStore.getToday());
    }, []);

    const handleSave = (e) => {
        e.preventDefault();

        // Construct date from today's date + selected time
        const date = new Date();
        const [hours, minutes] = time.split(':');
        date.setHours(parseInt(hours), parseInt(minutes));

        feedStore.add({
            type,
            amount: type === 'milk' ? amount : null,
            foodItem: type === 'solid' ? foodItem : null,
            timestamp: date.toISOString()
        });
        setFeeds(feedStore.getToday());
        setAmount('');
        setFoodItem('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '0.5rem', marginLeft: '-0.5rem' }}>
                    <ArrowLeft size={24} color="var(--text-main)" />
                </button>
                <h2>Feed Tracker</h2>
            </div>

            {/* Tabs */}
            <div className="card" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--border)' }}>
                <button
                    onClick={() => setType('milk')}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: type === 'milk' ? 'white' : 'transparent',
                        boxShadow: type === 'milk' ? 'var(--shadow-sm)' : 'none',
                        fontWeight: '600',
                        color: type === 'milk' ? 'var(--primary)' : 'var(--text-muted)',
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Milk size={20} />
                        <span>Milk</span>
                    </div>
                </button>
                <button
                    onClick={() => setType('solid')}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: type === 'solid' ? 'white' : 'transparent',
                        boxShadow: type === 'solid' ? 'var(--shadow-sm)' : 'none',
                        fontWeight: '600',
                        color: type === 'solid' ? 'var(--primary)' : 'var(--text-muted)',
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Utensils size={20} />
                        <span>Solid</span>
                    </div>
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Time</label>
                    <input
                        type="time"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                        required
                    />
                </div>

                {type === 'milk' ? (
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Amount (ml)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="e.g. 150"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                            required
                        />
                    </div>
                ) : (
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Food Item</label>
                        <input
                            type="text"
                            value={foodItem}
                            onChange={e => setFoodItem(e.target.value)}
                            placeholder="e.g. Mashed Potatoes"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                            required
                        />
                    </div>
                )}

                <button type="submit" className="btn" style={{ width: '100%' }}>
                    {showSuccess ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={20} /> Saved!</span> : 'Log Feed'}
                </button>
            </form>

            {/* Stats/History */}
            <h3 style={{ marginBottom: '1rem' }}>Today's Feeds</h3>
            {feeds.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No feeds logged today yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {feeds.map(feed => (
                        <div key={feed.id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{
                                width: '40px', height: '40px',
                                borderRadius: '50%',
                                background: feed.type === 'milk' ? '#E0E7FF' : '#FCE7F3',
                                color: feed.type === 'milk' ? 'var(--primary)' : 'var(--secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {feed.type === 'milk' ? <Milk size={20} /> : <Utensils size={20} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '600' }}>{feed.type === 'milk' ? `${feed.amount} ml` : feed.foodItem}</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{new Date(feed.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
