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

    getByDate: async (date) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        const { data } = await supabase
            .from('feeds')
            .select('*')
            .eq('user_id', user.id)
            .gte('timestamp', start.toISOString())
            .lte('timestamp', end.toISOString())
            .order('timestamp', { ascending: false });

        return (data || []).map(f => ({ ...f, amount: f.amount_ml, foodItem: f.subtype }));
    },

    getToday: async () => {
        return feedStore.getByDate(new Date());
    },

    update: async (id, feed) => {
        const { data, error } = await supabase
            .from('feeds')
            .update({
                type: feed.type,
                subtype: feed.subtype, // foodItem
                amount_ml: feed.amount,
                timestamp: feed.timestamp
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    delete: async (id) => {
        const { error } = await supabase
            .from('feeds')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
