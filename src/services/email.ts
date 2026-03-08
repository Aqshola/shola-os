import { pb } from "@/lib/pocketbase";

export async function sendEmail(sender: string, content: string): Promise<boolean> {
    try {
        await pb.collection('email').create({ sender, content });
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}
