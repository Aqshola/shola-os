import { supabase } from "@/lib/supabase";

export async function sendEmail(sender: string, content: string): Promise<boolean> {
    try {
        const { error } = await supabase.from('email').insert({ sender, content })
        if (error) throw error
        return true
    } catch (error) {
        console.error('Failed to send email:', error);
        return false
    }
}
