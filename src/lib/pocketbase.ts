import Pocketbase from "pocketbase"
export let pb:Pocketbase;

export function initPocketBase(){
    pb=new Pocketbase('https://registry.shola.pro')
}

