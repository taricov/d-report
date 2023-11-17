import { createContext, useState } from "react";
import { TSNACKBAR_STATES } from "../../types/types";


const NotificationContext = createContext({
  type: "",
  body: "",
  title: "",
  success: ({body, title}:{body:string, title: string}) => {},
  error: ({body, title}:{body:string, title: string}) => {},
  clear: () => {},
});

const NotificationProvider = ({...props}):JSX.Element => {
    const [type, setType] = useState<string>("");
    const [body, setBody] = useState<string>("");
    const [title, setTitle] = useState<string>("");
  const success = ({body, title}:{body:string, title: string}) => {
      setBody(body);
      setTitle(title);
      setType(TSNACKBAR_STATES.SUCCESS);
    };
    const error = ({body, title}:{body:string, title: string}) => {
      setBody(body);
      setTitle(title);
      setType(TSNACKBAR_STATES.ERROR);
    };
    const clear = () => {
      setType("");
      setTimeout(() => {
        setBody("");
        setTitle("");
      }, 1000)
    };
  return (
      <NotificationContext.Provider
        value={{
          success, error, clear, type, body,title
        }}
      >
        {props.children}
      </NotificationContext.Provider>
    );
  };

export { NotificationProvider };
export default NotificationContext;