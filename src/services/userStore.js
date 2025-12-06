const STORAGE_KEY = 'salubris_user_data';

export const userStore = {
    get: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    },

    save: (data) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    clear: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
