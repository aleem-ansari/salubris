const POOP_KEY = 'salubris_poop';

export const poopStore = {
    getAll: () => {
        const data = localStorage.getItem(POOP_KEY);
        return data ? JSON.parse(data) : [];
    },

    add: (event) => {
        const events = poopStore.getAll();
        const newEvent = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...event
        };
        events.push(newEvent);
        localStorage.setItem(POOP_KEY, JSON.stringify(events));
        return newEvent;
    },

    getToday: () => {
        const events = poopStore.getAll();
        const today = new Date().toDateString();
        return events.filter(e => new Date(e.timestamp).toDateString() === today).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
};
