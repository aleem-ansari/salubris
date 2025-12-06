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

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadFeeds(selectedDate);
    }, [selectedDate]);

    const loadFeeds = async (date) => {
        const data = await feedStore.getByDate(new Date(date));
        setFeeds(data);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Construct date from selectedDate + selected time
        const date = new Date(selectedDate);
        const [hours, minutes] = time.split(':');
        date.setHours(parseInt(hours), parseInt(minutes));

        const feedData = {
            type,
            subtype: type === 'solid' ? foodItem : null,
            amount: type === 'milk' ? amount : null,
            timestamp: date.toISOString()
        };

        try {
            if (editingId) {
                await feedStore.update(editingId, feedData);
                setShowSuccess(true); // 'Updated!'
            } else {
                await feedStore.add(feedData);
                setShowSuccess(true);
            }

            await loadFeeds(selectedDate);
            resetForm();
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error(error);
            alert('Failed to save feed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this log?")) return;
        try {
            await feedStore.delete(id);
            await loadFeeds(selectedDate);
        } catch (error) {
            console.error(error);
            alert("Failed to delete");
        }
    }

    const handleEdit = (feed) => {
        setEditingId(feed.id);
        setType(feed.type);
        if (feed.type === 'milk') {
            setAmount(feed.amount);
            setFoodItem('');
        } else {
            setFoodItem(feed.foodItem || feed.subtype);
            setAmount('');
        }
        // Extract time from timestamp
        const d = new Date(feed.timestamp);
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        setTime(`${hours}:${minutes}`);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const resetForm = () => {
        setEditingId(null);
        setAmount('');
        setFoodItem('');
        setTime(new Date().toTimeString().slice(0, 5));
    }

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '0.5rem', marginLeft: '-0.5rem' }}>
                    <ArrowLeft size={24} color="var(--text-main)" />
                </button>
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0 }}>Feed Tracker</h2>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            resetForm();
                        }}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-muted)',
                            fontSize: '0.875rem',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="card" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--border)' }}>
                <button
                    onClick={() => { setType('milk'); setEditingId(null); }}
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
                    onClick={() => { setType('solid'); setEditingId(null); }}
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

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="btn" style={{ flex: 1, background: 'var(--text-muted)' }}>
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="btn" style={{ flex: 2 }}>
                        {showSuccess ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                <CheckCircle size={20} /> {editingId ? 'Updated!' : 'Saved!'}
                            </span>
                        ) : (
                            editingId ? 'Update Feed' : 'Log Feed'
                        )}
                    </button>
                </div>
            </form>

            {/* Stats/History */}
            <h3 style={{ marginBottom: '1rem' }}>
                {new Date(selectedDate).toDateString() === new Date().toDateString() ? "Today's Feeds" : `Feeds on ${new Date(selectedDate).toLocaleDateString()}`}
            </h3>
            {feeds.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No feeds logged for this day.</p>
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
                            <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleEdit(feed)}>
                                <p style={{ fontWeight: '600' }}>{feed.type === 'milk' ? `${feed.amount} ml` : (feed.foodItem || feed.subtype)}</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{new Date(feed.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.25rem' }}>Tap to edit</p>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(feed.id); }}
                                style={{ padding: '0.5rem', color: 'var(--danger)', background: 'transparent', border: 'none' }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
