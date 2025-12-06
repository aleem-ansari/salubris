import { supabase } from './supabase';

const FEED_KEY = 'salubris_feeds';

export const feedStore = {
    getAll: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data } = await supabase
            .from('feeds')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false });
        return data || [];
    },

    add: async (feed) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from('feeds')
            .insert({
                user_id: user.id,
                type: feed.type,
                subtype: feed.subtype,
                amount_ml: feed.amount,
                timestamp: feed.timestamp || new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        // Backup to local
        // const current = JSON.parse(localStorage.getItem(FEED_KEY) || '[]');
        // localStorage.setItem(FEED_KEY, JSON.stringify([feed, ...current]));

        return data;
    },

    getToday: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data } = await supabase
            .from('feeds')
            .select('*')
            .eq('user_id', user.id)
            .gte('timestamp', today.toISOString())
            .order('timestamp', { ascending: false });

        // Map back to frontend expectation if needed (amount_ml -> amount)
        return (data || []).map(f => ({ ...f, amount: f.amount_ml }));
    }
};
