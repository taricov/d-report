import { useContext } from "react"
import NotificationContext from "../components/Notification/NotificationProvider"
import { schedule } from "../helpers/helpers"

export const useNotify = () => {
    const notificationCtx = useContext(NotificationContext)

    return {
        notifySuccess: ({title, body, xx}:{title: string, body: string, xx:number}) =>{
        notificationCtx.success({title, body})
        schedule(notificationCtx.clear, xx)
    },
    notifyError: ({title, body, xx}:{title: string, body: string, xx:number}) =>{
    notificationCtx.error({title, body})
    schedule(notificationCtx.clear, xx)
}
}
    // return notify;

}