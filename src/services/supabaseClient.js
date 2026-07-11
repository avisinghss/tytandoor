// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Retrieve credentials securely from Vite environment configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail early if configurations are missing during development phase
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase configuration environment variables!");
}

// Initialize and export the single instance of Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);