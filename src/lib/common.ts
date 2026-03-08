import { PortofolioStatus } from "@/services/portofolio";

export function getPortofolioBadgeClassStatus(status:PortofolioStatus){
    if(status=="Published"){
        return "portofolio-status-badge-success"
    }

    if(status=="Discontinue"){
        return "portofolio-status-badge-danger"
    }

    if(status=="Development"){
        return "portofolio-status-badge-warning"
    }

    if(status=="Initial"){
        return "portofolio-status-badge-base"
    }
}