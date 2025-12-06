import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { statsStore } from '../services/statsStore';
import { userStore } from '../services/userStore';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function UpdateStats() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        userStore.get().then(u => {
            if (u) {
                setUser(u);
                if (u.weight_kg) setWeight(u.weight_kg);
                if (u.height_cm) setHeight(u.height_cm);
            }
        });
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            if (weight && parseFloat(weight) !== parseFloat(user?.weight_kg)) {
                await statsStore.addMetric('weight', weight, 'kg');
            }
            if (height && parseFloat(height) !== parseFloat(user?.height_cm)) {
                await statsStore.addMetric('height', height, 'cm');
            }

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                navigate('/dashboard');
            }, 1500);
        } catch (error) {
            console.error(error);
            alert('Failed to update stats');
        }
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '0.5rem', marginLeft: '-0.5rem' }}>
                    <ArrowLeft size={24} color="var(--text-main)" />
                </button>
                <h2>Update Stats</h2>
            </div>

            <form onSubmit={handleUpdate} className="card">
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Weight (kg)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>Height (cm)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={height}
                        onChange={e => setHeight(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                    />
                </div>

                <button type="submit" className="btn" style={{ width: '100%' }}>
                    {showSuccess ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={20} /> Updated!</span> : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
