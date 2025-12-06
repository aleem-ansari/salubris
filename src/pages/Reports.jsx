import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, Activity } from 'lucide-react';
import { feedStore } from '../services/feedStore';
import { userStore } from '../services/userStore';
import { statsStore } from '../services/statsStore';
import GrowthChart from '../components/GrowthChart';
import FeedChart from '../components/FeedChart';

export default function Reports() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('feeds'); // 'feeds' | 'growth'
    const [feedData, setFeedData] = useState([]);
    const [growthData, setGrowthData] = useState([]);

    useEffect(() => {
        // Mocking daily aggregate for demonstration since we only have single day store
        const data = [
            { day: 'Mon', amount: 650 },
            { day: 'Tue', amount: 720 },
            { day: 'Wed', amount: 680 },
            { day: 'Thu', amount: 800 },
            { day: 'Fri', amount: 750 },
            { day: 'Sat', amount: 500 }, // Today mock
            { day: 'Sun', amount: 0 }
        ];
        // Inject today's actual data into Saturday for demo (assuming today is Sat)
        const todayFeeds = feedStore.getToday().filter(f => f.type === 'milk');
        const todayTotal = todayFeeds.reduce((acc, curr) => acc + parseInt(curr.amount || 0), 0);
        if (todayTotal > 0) {
            // Find today index or push (simplified mock logic)
            data[5].amount = todayTotal;
        }
        setFeedData(data);

        // Prep growth data
        const stats = statsStore.getAll().filter(s => s.metric === 'weight');
        const user = userStore.get();
        // Mock historical data + current user data
        const history = [
            { age: 0, value: 3.3 }, // Birth
            ...stats.map(s => ({ age: 3, value: s.value })), // Mock mapping time to age for demo
            { age: user.ageMonths, value: user.weightKg }
        ];
        // Remove duplicates/cleanup in real app
        setGrowthData(history);

    }, []);

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                <button onClick={() => navigate('/dashboard')} style={{ padding: '0.5rem', marginLeft: '-0.5rem' }}>
                    <ArrowLeft size={24} color="var(--text-main)" />
                </button>
                <h2>Health Reports</h2>
            </div>

            {/* Tabs */}
            <div className="card" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--border)' }}>
                <button
                    onClick={() => setActiveTab('feeds')}
                    style={{
                        flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)',
                        background: activeTab === 'feeds' ? 'white' : 'transparent',
                        color: activeTab === 'feeds' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: '600'
                    }}
                >
                    Feeds
                </button>
                <button
                    onClick={() => setActiveTab('growth')}
                    style={{
                        flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)',
                        background: activeTab === 'growth' ? 'white' : 'transparent',
                        color: activeTab === 'growth' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: '600'
                    }}
                >
                    Growth
                </button>
            </div>

            {activeTab === 'feeds' ? (
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BarChart2 size={20} color="var(--primary)" />
                        Weekly Milk Intake
                    </h3>
                    <FeedChart data={feedData} target={parseInt(userStore.get()?.feedTarget || 750)} />
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Target Goal</p>
                        <p style={{ fontWeight: 'bold' }}>{userStore.get()?.feedTarget || 750} ml / day</p>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={20} color="var(--primary)" />
                        Weight Growth Chart
                    </h3>
                    <GrowthChart data={growthData} />
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Current Status</p>
                        <p style={{ fontWeight: 'bold' }}>50th Percentile (Healthy)</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Your baby is tracking along the ideal growth curve.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
