import { getListSocial } from "@/services/social";
import { createStore } from "solid-js/store";

type socialList = {
    github: string
    linkedin: string
    resume: string
}
const [social, setSocial] = createStore<socialList>({
    github: "",
    linkedin: "",
    resume: "",
})

const initSocial = async () => {
    const res = await getListSocial()
    const transformed = res.reduce((acc, item) => {
        acc[item.name as keyof socialList] = item.url ||""
        return acc
    }, {} as socialList)

    setSocial(transformed)
};

export {
    social,
    initSocial
}

