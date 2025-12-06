import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function FeedChart({ data, target = 750 }) {
    // Data expected: [{ day: 'Mon', amount: 600 }, ...]

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <ReferenceLine y={target} stroke="var(--secondary)" strokeDasharray="3 3" label={{ value: 'Goal', fill: 'var(--secondary)', fontSize: 12 }} />
                    <Bar dataKey="amount" fill="var(--primary-light)" radius={[4, 4, 0, 0]} name="Milk Volume (ml)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
