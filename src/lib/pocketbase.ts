import Pocketbase from "pocketbase"
export let pb:Pocketbase;

const domain='https://registry.shola.pro'
export function initPocketBase(){
    pb=new Pocketbase(domain)
}

export function getFileUrl(collectionId:string,recordId:string,fileName:string){
    return `${domain}/api/files/${collectionId}/${recordId}/${fileName}`
}

