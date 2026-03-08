import { pb } from "@/lib/pocketbase";

export type Portfolio = {
    id: string;

    title?: string;

    image_cover?: string;

    content?: string;

    repo?: string;

    link?: string;

    status?: string;

    private?: boolean;

    created: string; // ISO date
    updated: string; // ISO date

    collectionId?: string;
    collectionName?: string;
};

export async function getListPortofolio():Promise<Portfolio[]>  {
    const records = await pb.collection('portofolio').getFullList() as Portfolio[]
    return records
}