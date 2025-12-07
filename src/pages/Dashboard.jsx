import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../services/userStore';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        userStore.get().then(setUser);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    }

    return (
        <div style={{ paddingBottom: '5rem' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem' }}>Hi, {user?.name ? `${user.name}'s Parent` : 'Parent'}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Here is your daily overview</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={handleSignOut} style={{ padding: '0.5rem', borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent' }}>
                        <LogOut size={20} color="var(--text-muted)" />
                    </button>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: 'var(--background)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img src="/logo.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
            </header>

            <section style={{ marginBottom: '2rem' }}>
                <div onClick={() => navigate('/update-stats')} className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white', border: 'none', cursor: 'pointer' }}>
                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Baby Stat <span style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.8 }}>(Tap to update)</span></h3>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.875rem', opacity: 0.8 }}>Weight</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{user?.weight_kg || user?.weightKg || '-'} kg</span>
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.875rem', opacity: 0.8 }}>Height</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{user?.height_cm || user?.heightCm || '-'} cm</span>
                        </div>
                        <div style={{ display: 'none' }}>
                            {/* Hidden Age for now as it needs recalc */}
                            <span style={{ display: 'block', fontSize: '0.875rem', opacity: 0.8 }}>Age</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{user?.ageMonths || '-'} m</span>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {/* Placeholders for actions */}
                    <button className="card" onClick={() => navigate('/tracker/feed')} style={{ textAlign: 'left', cursor: 'pointer' }}>
                        <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>🍼</span>
                        <span style={{ fontWeight: '500' }}>Log Feed</span>
                    </button>
                    <button className="card" onClick={() => navigate('/tracker/poop')} style={{ textAlign: 'left', cursor: 'pointer' }}>
                        <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>💩</span>
                        <span style={{ fontWeight: '500' }}>Log Poop</span>
                    </button>
                    <button className="card" onClick={() => navigate('/reports')} style={{ textAlign: 'left', cursor: 'pointer' }}>
                        <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</span>
                        <span style={{ fontWeight: '500' }}>Reports</span>
                    </button>
                    <button className="card" onClick={() => navigate('/analysis')} style={{ textAlign: 'left', cursor: 'pointer' }}>
                        <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</span>
                        <span style={{ fontWeight: '500' }}>Poop Analysis</span>
                    </button>
                </div>
            </section>
        </div>
    );
}
