import { supabase } from './supabase';

const STORAGE_KEY = 'salubris_analysis_history';

export const analysisStore = {
    getAll: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data } = await supabase
            .from('analysis_history')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false })
            .limit(20);

        // Map back to frontend structure
        return (data || []).map(row => ({
            id: row.id,
            timestamp: row.timestamp,
            result: row.result_json,
            image: row.image_base64
        }));
    },

    save: async (analysisResult, imageData) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from('analysis_history')
            .insert({
                user_id: user.id,
                result_json: analysisResult,
                image_base64: imageData, // Using text column for base64 as planned
                timestamp: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            timestamp: data.timestamp,
            result: data.result_json,
            image: data.image_base64
        };
    },

    clear: async () => {
        // Not implemented for DB safety
    }
};
