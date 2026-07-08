import { supabase } from "@/lib/supabase";

export interface Note {
    id: string;
    title: string;
    content: string;
    created: string;
    updated: string;
}

export async function getListNotes(): Promise<Note[]> {
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .order('updated', { ascending: false })

        if (error) throw error
        return data ?? []
    } catch (error) {
        console.error('Failed to fetch notes:', error);
        return []
    }
}

export async function createNote(title: string, content: string): Promise<Note | null> {
    try {
        const { data, error } = await supabase
            .from('notes')
            .insert({ title, content })
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Failed to create note:', error);
        return null
    }
}

export async function updateNote(id: string, title: string, content: string): Promise<Note | null> {
    try {
        const { data, error } = await supabase
            .from('notes')
            .update({ title, content, updated: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Failed to update note:', error);
        return null
    }
}
