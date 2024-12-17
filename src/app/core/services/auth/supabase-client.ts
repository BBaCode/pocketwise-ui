import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton Supabase instance
let supabase: SupabaseClient;
// move to .env file
const supabaseUrl = 'https://sbvghbgzfitnurkzuzsb.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidmdoYmd6Zml0bnVya3p1enNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MzQyMTQsImV4cCI6MjA0ODIxMDIxNH0.qOSO8HZurjCQNN5I12sYCKei1BX6ytJ3zS4QzDCCzuw';

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
};
