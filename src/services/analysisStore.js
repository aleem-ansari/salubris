const STORAGE_KEY = 'salubris_analysis_history';

export const analysisStore = {
    getAll: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    save: (analysisResult, imageData) => {
        const currentHistory = analysisStore.getAll();

        const newEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            result: analysisResult,
            image: imageData // Base64 string
        };

        // Prepend new entry
        const updatedHistory = [newEntry, ...currentHistory];

        // Limit storage to last 20 items to prevent crashing localStorage with large images
        if (updatedHistory.length > 20) {
            updatedHistory.length = 20;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        return newEntry;
    },

    clear: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
