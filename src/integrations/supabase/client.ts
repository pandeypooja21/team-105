
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fpferwjsngcduabsftap.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwZmVyd2pzbmdjZHVhYnNmdGFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MzEwMTQsImV4cCI6MjA1NjQwNzAxNH0.Wzc03ugjA3SLLHU3ZydUtP32vaI-idbalpkmZaFP3S0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
