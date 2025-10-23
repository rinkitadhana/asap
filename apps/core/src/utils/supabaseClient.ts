import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

export const supabaseServer = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
)
