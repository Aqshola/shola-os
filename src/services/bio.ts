import { pb } from "@/lib/pocketbase";

export interface Bio {
  id: string;
  name: string;
  desc: string;
  avatar?: string;
  created: string;
  updated: string;
}

export async function getBio(): Promise<Bio> {
  const records = await pb.collection('bio').getFullList<Bio>();
  return records[0];
}
