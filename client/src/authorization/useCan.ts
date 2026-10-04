import { useSelector } from "react-redux";
import canAccess from "./canAccess";
import { selectPanelUserRole } from "@/stores/panelUser/selector";

export default function useCan(action:string){
    const role = useSelector(selectPanelUserRole);
    if(!role) return false;
    return canAccess(role, action);
}