import { supabase } from './supabase';
const STORAGE_KEY = 'salubris_user_data';

export const userStore = {
    get: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            // Fallback to local storage if API fails or no profile yet
            return null;
        }
        return data;
    },

    save: async (userData) => {
        // Ensure user is signed in (anon)
        let { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
            if (authError) throw authError;
            user = authData.user;
        }

        const profileData = {
            id: user.id,
            name: userData.name,
            gender: userData.gender,
            dob: userData.dob,
            weight_kg: userData.weightKg,
            height_cm: userData.heightCm,
            feed_target_ml: userData.feedTarget,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('profiles')
            .upsert(profileData);

        if (error) throw error;

        // Keep local storage as a cache/backup for now
        localStorage.setItem('salubris_user', JSON.stringify(userData));
        return profileData;
    },

    clear: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
