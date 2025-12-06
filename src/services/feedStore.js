const FEED_KEY = 'salubris_feeds';

export const feedStore = {
    getAll: () => {
        const data = localStorage.getItem(FEED_KEY);
        return data ? JSON.parse(data) : [];
    },

    add: (feed) => {
        const feeds = feedStore.getAll();
        const newFeed = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...feed
        };
        feeds.push(newFeed);
        localStorage.setItem(FEED_KEY, JSON.stringify(feeds));
        return newFeed;
    },

    getToday: () => {
        const feeds = feedStore.getAll();
        const today = new Date().toDateString();
        return feeds.filter(f => new Date(f.timestamp).toDateString() === today).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
};
