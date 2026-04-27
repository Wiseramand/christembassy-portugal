import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder values if environment variables are missing during build.
// This prevents the build from crashing while still allowing client-side execution.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
