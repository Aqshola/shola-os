import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const STORAGE_BUCKET = 'media'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export function getFileUrl(filename: string): string {
    if (!filename) return ''
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filename}`
}
