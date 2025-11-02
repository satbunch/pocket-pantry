import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabasePublicUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublicKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabasePublicUrl || !supabasePublicKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabasePublicUrl, supabasePublicKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // React Nativeではfalse
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-app-name': 'pocket-pantry',
    },
  },
});
