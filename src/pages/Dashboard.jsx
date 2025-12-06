import { userStore } from '../services/userStore';

export default function Dashboard() {
    const user = userStore.get();

    return (
        <div style={{ paddingBottom: '5rem' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem' }}>Hi, {user?.name || 'Parent'}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Here is your daily overview</p>
                </div>
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
            </header>

            <section style={{ marginBottom: '2rem' }}>
                <div onClick={() => window.location.href = '/update-stats'} className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white', border: 'none', cursor: 'pointer' }}>
                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Baby Stat <span style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.8 }}>(Tap to update)</span></h3>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.875rem', opacity: 0.8 }}>Weight</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{user?.weightKg || '-'} kg</span>
                        </div>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.875rem', opacity: 0.8 }}>Height</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{user?.heightCm || '-'} cm</span>
                        </div>
                        <div>
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
                    <button className="card" onClick={() => window.location.href = '/tracker/feed'} style={{ textAlign: 'left', cursor: 'pointer' }}>
                        <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>🍼</span>
                        <span style={{ fontWeight: '500' }}>Log Feed</span>
                    </button>
                    <button className="card" onClick={() => window.location.href = '/tracker/poop'} style={{ textAlign: 'left', cursor: 'pointer' }}>
                        <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>💩</span>
                        <span style={{ fontWeight: '500' }}>Log Poop</span>
                    </button>
                    <button className="card" onClick={() => window.location.href = '/reports'} style={{ textAlign: 'left', cursor: 'pointer' }}>
                        <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</span>
                        <span style={{ fontWeight: '500' }}>Reports</span>
                    </button>
                    <button className="card" onClick={() => window.location.href = '/analysis'} style={{ textAlign: 'left', cursor: 'pointer' }}>
                        <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</span>
                        <span style={{ fontWeight: '500' }}>Poop Analysis</span>
                    </button>
                </div>
            </section>
        </div>
    );
}
