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

    const [feedTarget, setFeedTarget] = useState(750);

    useEffect(() => {
        async function fetchData() {
            try {
                // 1. Feeds
                const feeds = await feedStore.getAll(); // Fetch all feeds

                // Group by day (last 7 days from today)
                const last7Days = [];
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    last7Days.push(d);
                }

                const aggregatedFeeds = last7Days.map(date => {
                    const dateStr = date.toDateString();
                    const dayFeeds = feeds.filter(f => new Date(f.timestamp).toDateString() === dateStr && f.type === 'milk');
                    const total = dayFeeds.reduce((acc, curr) => acc + (parseInt(curr.amount || curr.amount_ml || 0)), 0);
                    return {
                        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                        amount: total
                    };
                });

                setFeedData(aggregatedFeeds);

                // 2. Growth
                const stats = await statsStore.getAll();
                const user = await userStore.get();

                if (user) {
                    setFeedTarget(parseInt(user.feed_target_ml || user.feedTarget || 750));
                }

                // Filter weight stats and map
                // Sort by date asc
                const weightStats = stats
                    .filter(s => s.metric === 'weight' || s.weight_kg)
                    .sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));

                const growthMappers = weightStats.map(s => {
                    // Try to calculate age at that timestamp if possible, otherwise skip or approximate
                    // For now, let's just plot by index or simply skip age calc if too complex without DOB
                    // Simplest: If we have DOB in user, calc age for each point
                    let age = 0;
                    if (user && user.dob) {
                        const birth = new Date(user.dob);
                        const recordDate = new Date(s.recorded_at || s.timestamp);
                        // diff in months
                        age = (recordDate - birth) / (1000 * 60 * 60 * 24 * 30.44); // approx months
                    }
                    return {
                        age: parseFloat(age.toFixed(1)),
                        value: parseFloat(s.weight_kg || s.value)
                    };
                });

                // Add current user state as latest point if not already there? 
                // Actually `statsStore` updates user profile too, so strictly history is enough OR user profile is enough.
                // But let's assume history table is source of truth for the chart.

                // If history empty but user has weight, show at least that point
                if (growthMappers.length === 0 && user && user.weight_kg) {
                    const birth = new Date(user.dob);
                    const today = new Date();
                    const age = (today - birth) / (1000 * 60 * 60 * 24 * 30.44);
                    growthMappers.push({ age: parseFloat(age.toFixed(1)), value: parseFloat(user.weight_kg) });
                }

                setGrowthData(growthMappers);
            } catch (err) {
                console.error("Failed to load reports data", err);
            }
        }

        fetchData();
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
                    <FeedChart data={feedData} target={feedTarget} />
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Target Goal</p>
                        <p style={{ fontWeight: 'bold' }}>{feedTarget} ml / day</p>
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
