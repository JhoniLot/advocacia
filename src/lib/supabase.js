import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uuemgjvshggjyzsoxlpfd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZW1nanZzaGdnanlzb3hscGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NzQ0MjksImV4cCI6MjA5NDQ1MDQyOX0.5XrqRWAkffpXN3rMYBE0XIRjaDlYbgvI_xrj6h9vGkM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

