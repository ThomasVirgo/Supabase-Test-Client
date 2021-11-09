import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { createContext } from "react";
dotenv.config()


const options = {
  schema: 'public',
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true
}

const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjEwMjM4MSwiZXhwIjoxOTUxNjc4MzgxfQ.cBRCxDWSf_g828qzlin5ByBUIimkyitb1x8JQNmU9Ug'
const SUPABASE_URL='https://birsscgnqkrdhzidaayn.supabase.co'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, options);
const SupaBaseContext = createContext();

export { supabase, SupaBaseContext }


