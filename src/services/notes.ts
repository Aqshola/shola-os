import { pb } from "@/lib/pocketbase";

export interface Note {
    id: string;
    title: string;
    content: string;
    created: string;
    updated: string;
}

export async function getListNotes(): Promise<Note[]> {
    try {
        const records = await pb.collection('notes').getFullList<Note>({
            sort: '-updated',
        });
        return records;
    } catch (error) {
        console.error('Failed to fetch notes:', error);
        return [];
    }
}

export async function createNote(title: string, content: string): Promise<Note | null> {
    try {
        const record = await pb.collection('notes').create<Note>({
            title,
            content,
        });
        return record;
    } catch (error) {
        console.error('Failed to create note:', error);
        return null;
    }
}

export async function updateNote(id: string, title: string, content: string): Promise<Note | null> {
    try {
        const record = await pb.collection('notes').update<Note>(id, {
            title,
            content,
        });
        return record;
    } catch (error) {
        console.error('Failed to update note:', error);
        return null;
    }
}
