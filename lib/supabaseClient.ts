import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// LMNTODO: Set this Environment Variables later
export const BASE_URL = 'https://rcnpshfccnhlcyvnzxua.supabase.co';
export const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbnBzaGZjY25obGN5dm56eHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyNzMyMDIsImV4cCI6MjA0NTg0OTIwMn0.D2AVtaCFFfJF8LqEzOT3hsFk4rXfJ7Ro4F_8ZOQCZiE';

export const supabase = createClient(BASE_URL, ANON_KEY);
