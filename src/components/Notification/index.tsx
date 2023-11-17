import { useContext } from "react"
import NotificationContext from "./NotificationProvider"

export default function Notification({ color}:{color?: string}) {
  
 const notificationCtx = useContext(NotificationContext)

  return (
      <>

<div className={`${!!notificationCtx.type.length && "!translate-x-0"} ${ notificationCtx.type === "error" ? "!border-red-400 !text-red-800 !bg-red-100" : null} z-30 fixed bottom-0 left-5 -translate-x-[140%] transform shadow flex items-center p-4 mb-4 text-sm border border-green-400 text-green-800 bg-green-100 rounded-lg dark:bg-gray-800 dark:text-green-400 dark:border-green-800 transition duration-200`} role="alert">
  <svg className="flex-shrink-0 inline w-4 h-4 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>
  <span className="">{notificationCtx.title}&nbsp;</span>
  <div>
    {notificationCtx.body}
  </div>
</div>
      </>
    )
}