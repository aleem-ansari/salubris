import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';

// Simplified WHO/CDC data (Boy) 50th percentile as "Ideal"
const IDEAL_BOY_WEIGHT = [
    { age: 0, weight: 3.3 }, { age: 1, weight: 4.5 }, { age: 2, weight: 5.6 },
    { age: 3, weight: 6.4 }, { age: 4, weight: 7.0 }, { age: 5, weight: 7.5 },
    { age: 6, weight: 7.9 }, { age: 9, weight: 8.9 }, { age: 12, weight: 9.6 }
];

export default function GrowthChart({ data, metric = 'weight' }) {
    // Merge user data with ideal data helper (simplified for demo)
    const chartData = IDEAL_BOY_WEIGHT.map(ideal => {
        // Find closest user log
        const userLog = data.find(d => Math.abs(d.age - ideal.age) < 0.5);
        return {
            name: `${ideal.age}m`,
            ideal: ideal.weight,
            baby: userLog ? userLog.value : null
        };
    });

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="ideal" stroke="#CBD5E1" strokeWidth={2} dot={false} name="Ideal (50%)" />
                    <Line type="monotone" dataKey="baby" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} name="Your Baby" connectNulls />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
