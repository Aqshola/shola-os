import { pb } from "@/lib/pocketbase";

export interface Social {
  id: string;

  name?: string;

  url?: string;

  created: string; // ISO date string
  updated: string; // ISO date string
}

export async function getListSocial():Promise<Social[]>  {
    const records = await pb.collection('social').getFullList() as Social[]
    return records
}
