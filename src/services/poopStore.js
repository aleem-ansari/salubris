import { supabase } from './supabase';

const POOP_KEY = 'salubris_poop';

export const poopStore = {
    getAll: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data } = await supabase
            .from('poop_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false });
        return data || [];
    },

    add: async (event) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from('poop_logs')
            .insert({
                user_id: user.id,
                type: event.type,
                consistency: event.consistency,
                color: event.color,
                timestamp: event.timestamp || new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    getToday: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data } = await supabase
            .from('poop_logs')
            .select('*')
            .eq('user_id', user.id)
            .gte('timestamp', today.toISOString())
            .order('timestamp', { ascending: false });
        return data || [];
    }
};
