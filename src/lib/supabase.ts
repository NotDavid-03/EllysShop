import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Determinar si Supabase tiene credenciales reales configuradas
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('tu-proyecto') && 
  !supabaseAnonKey.includes('tu-anon-key')
);

// Si no está configurado, pasamos strings válidos para evitar que la librería crashee
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://dummyproject.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'dummy-anon-key'
);
