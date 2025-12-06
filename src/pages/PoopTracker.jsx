import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { poopStore } from '../services/poopStore';
import { ArrowLeft, Droplets, Trash2, CheckCircle } from 'lucide-react';

export default function PoopTracker() {
    const navigate = useNavigate();
    const [type, setType] = useState('poop'); // 'poop' | 'pee' | 'both'
    const [consistency, setConsistency] = useState('normal'); // 'hard', 'normal', 'soft', 'liquid'
    const [color, setColor] = useState('brown');
    const [events, setEvents] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        poopStore.getToday().then(setEvents);
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await poopStore.add({
                type,
                consistency: type !== 'pee' ? consistency : null,
                color: type !== 'pee' ? color : null
            });
            const today = await poopStore.getToday();
            setEvents(today);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error(error);
            alert('Failed to log event');
        }
    };

    const getIcon = (event) => {
        if (event.type === 'pee') return <Droplets size={20} />;
        return <span style={{ fontSize: '20px' }}>💩</span>;
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '0.5rem', marginLeft: '-0.5rem' }}>
                    <ArrowLeft size={24} color="var(--text-main)" />
                </button>
                <h2>Bathroom Tracker</h2>
            </div>

            {/* Type Selection */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {['poop', 'pee', 'both'].map(t => (
                    <button
                        key={t}
                        onClick={() => setType(t)}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            background: type === t ? 'var(--secondary)' : 'white',
                            color: type === t ? 'white' : 'var(--text-main)',
                            textTransform: 'capitalize',
                            fontWeight: '600'
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="card" style={{ marginBottom: '2rem' }}>
                {type !== 'pee' && (
                    <>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Consistency</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                {['hard', 'normal', 'soft', 'liquid'].map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setConsistency(c)}
                                        style={{
                                            padding: '0.5rem',
                                            borderRadius: 'var(--radius-sm)',
                                            border: `1px solid ${consistency === c ? 'var(--secondary)' : 'var(--border)'}`,
                                            background: consistency === c ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
                                            color: consistency === c ? 'var(--secondary)' : 'var(--text-main)',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Color</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {['brown', 'green', 'yellow', 'black', 'red'].map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: c,
                                            border: color === c ? '3px solid var(--text-main)' : '1px solid var(--border)',
                                            cursor: 'pointer'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <button type="submit" className="btn" style={{ width: '100%', background: 'var(--secondary)' }}>
                    {showSuccess ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={20} /> Logged!</span> : 'Log Event'}
                </button>
            </form>

            {/* Stats/History */}
            <h3 style={{ marginBottom: '1rem' }}>Today's Events</h3>
            {events.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>No events logged today.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {events.map(event => (
                        <div key={event.id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{
                                width: '40px', height: '40px',
                                borderRadius: '50%',
                                background: event.type !== 'pee' && event.color ? event.color : '#FCE7F3',
                                color: 'var(--secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid var(--border)'
                            }}>
                                {getIcon(event)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: '600', textTransform: 'capitalize' }}>{event.type} {event.type !== 'pee' ? `(${event.consistency})` : ''}</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
