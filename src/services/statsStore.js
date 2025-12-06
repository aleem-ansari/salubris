import { supabase } from './supabase';
import { userStore } from './userStore';

const STATS_KEY = 'salubris_stats_history';

export const statsStore = {
    getAll: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data } = await supabase
            .from('stats_history')
            .select('*')
            .eq('user_id', user.id)
            .order('recorded_at', { ascending: false });
        return data || [];
    },

    addMetric: async (metric, value, unit) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // This prototype function was a bit hybrid (handling both metric and profile update)
        // Let's split it:
        // 1. Insert history record
        const { data, error } = await supabase
            .from('stats_history')
            .insert({
                user_id: user.id,
                weight_kg: metric === 'weight' ? value : null,
                height_cm: metric === 'height' ? value : null,
                recorded_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        // 2. Update profile (current user stats)
        const userProfile = await userStore.get();
        if (userProfile) {
            if (metric === 'weight') userProfile.weightKg = value; // Note: userStore might map DB snake_case to camelCase? 
            // Wait, existing userStore.get() returns raw DB fields? 
            // Looking at userStore.js: get returns `data` directly from select. 
            // DB has weight_kg, height_cm. 
            // So we should update those specific columns in profiles table

            const updates = {};
            if (metric === 'weight') updates.weight_kg = value;
            if (metric === 'height') updates.height_cm = value;

            await supabase.from('profiles').update(updates).eq('id', user.id);
        }

        return data;
    }
};
