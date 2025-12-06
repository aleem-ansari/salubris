const STATS_KEY = 'salubris_stats_history';
import { userStore } from './userStore';

export const statsStore = {
    getAll: () => {
        const data = localStorage.getItem(STATS_KEY);
        return data ? JSON.parse(data) : [];
    },

    addMetric: (metric, value, unit) => {
        const history = statsStore.getAll();
        const newEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            metric, // 'weight' or 'height'
            value,
            unit
        };
        history.push(newEntry);
        localStorage.setItem(STATS_KEY, JSON.stringify(history));

        // Also update current user stats
        const user = userStore.get();
        if (user) {
            if (metric === 'weight') user.weightKg = value;
            if (metric === 'height') user.heightCm = value;
            // Optionally update age if needed, but that usually comes from DOB
            userStore.save(user);
        }

        return newEntry;
    }
};
