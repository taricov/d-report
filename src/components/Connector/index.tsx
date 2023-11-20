import { ChangeEvent, useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { GET_SITEINFO, GetUser, POSTcreateReportModule, POSTnewUser } from "../../api/api_funcs";
import { cookieHandler } from "../../logic/cookies";
import type { TformProps } from "../../types/types";
import { Button } from "../Button";
import Error from "../Error";

import { useNotify } from "../../hooks/useNotify";
import { Checkbox } from "@mantine/core";


export default function Connector({showed}:{showed: boolean}){
const userInfo = useContext(UserContext)
const [firstTimeToConnect, setFirstTimeToConnect] = useState<boolean>(false)
const [formProps, setFormProps] = useState<TformProps>({submitting: false, error: "", disconnecting: false, apikey: "", subdomain: "", workflowTitle: ""})
const { notifyError, notifySuccess } = useNotify()

useEffect(() => {
 
},[])


  const disconnect = () => { 
    // Loading State onClick...
    setFormProps(prev=>({...prev, disconnecting: true}))
    // Cleaning Cookies...
    cookieHandler.remove('site_subdomain')
    // Cleaning siteData...
    userInfo.setSiteData(()=>({...Object.keys(userInfo.siteData).reduce((acc:any, curr)=>({...acc, [curr]: ""}), {})}))
    
    // Disconnecting...
    setTimeout(() => {
      setFormProps(prev=>({...prev, disconnecting: false, apikey: "", subdomain: "", workflowTitle: ""}))
      userInfo.setConnected(false)
      notifyError({title:"Disconnected! ☹️", body: "You have disconnected the service! ", xx:3000})
    }, 3000);
  }


  const submitHandler = (e: React.FormEvent) =>{
    e.preventDefault()
    // userInfo.setSiteData(prev=>({...prev, apikey: formProps.apikey, subdomain: formProps.subdomain}))
    setFormProps(prev=>({...prev, error: "", submitting: true}))


    if(!navigator.onLine){
      notifyError({title:"Network is Out!", body: "Please check your internet connection!", xx:1000})
      userInfo.setConnected(false)
      setFormProps(prev=>({...prev, error: "", submitting: false}))
      
      return;
    }

    return new Promise<any>(async (resolve, reject) =>{
      // If Empty Values...
      if(formProps.subdomain === "" || formProps.apikey === ""){
        setFormProps(prev=>({...prev, error: "Please Fill/Check The Subdomain and API Key Values.", submitting: false}))
        return;
      } 
      // If Invalid Values...
      if(formProps.subdomain.split(" ").length > 1){
        setFormProps(prev=>({...prev, error: "Please check your Subdomain. The provided value may be invalid value.", submitting: false}))
        return;
      } 
      console.log("b4 requesting", userInfo.siteData)
      
      try{
        // GET site info. request...
        const res = await GET_SITEINFO({...formProps})
        if(res.status === 401){
          setFormProps(prev=>({...prev, error: "Please check your API Key. The provided value may be invalid value.", submitting: false}))
          return;
        }
        const data = await res.json() 
        const siteInfo = data.data.Site
        // Setting the siteData Obj...
        userInfo.setSiteData(prev=>({...prev, ...Object.keys(userInfo.siteData).reduce((acc,curr)=>({...acc, [curr]: ["id", "language_code"].includes(curr) ? +siteInfo[curr] : curr === "subdomain" ? siteInfo[curr].split(".")[0] : siteInfo[curr] }),{})
      }))
      
      // GET user from DB...
      const DB_USER: any = await GetUser('subdomain', formProps.subdomain)
      console.log('existing user: ', DB_USER.documents)
      if (DB_USER.total === 0){
        
        // POST new report workflow...
        const creatReportWorkflow = await POSTcreateReportModule({...formProps})
        const WORKFLOW_RES = await creatReportWorkflow.json()
        console.log(WORKFLOW_RES)
        if(WORKFLOW_RES.id) {
          userInfo.setSiteData(prev=>({...prev, dreport_module_key: WORKFLOW_RES.id}))
          userInfo.setConnected(true)
          setFormProps(prev=>({...prev, error: "", submitting: false}))

          notifySuccess({title:"Connected!", body: 'You are now connected successfully!', xx:3000})
          setTimeout(() => {
            notifySuccess({title:"Success!", body: 'A Workflow has been created 👉 "D-Report App" 👈', xx:3000})
          }, 3000);
        } else if(WORKFLOW_RES.errors.name[0] === "هذا الحقل موجود من قبل"){
          setFormProps(prev=>({...prev, error: "Please change the selected Title. the input value may be already in use.", submitting: false}))
        }
        
        // POST new USER in DB...
        const userCreated = await POSTnewUser({...userInfo.siteData, id: +userInfo.siteData.id, language_code: +userInfo.siteData.language_code})
        console.log(userCreated)
        // if(userCreated) notifySuccess({title:"Connected!", body: 'You are now connected successfully!', xx:3000})
        
      }else{
        userInfo.setSiteData(prev => ({...prev, dreport_module_key: DB_USER.documents[0].dreport_module_key}))
        setFormProps(prev=>({...prev, error: "", submitting: false}))
      cookieHandler.setter(formProps.subdomain)
      userInfo.setConnected(true)
        notifySuccess({title:"Welcome Back!", body: 'You are connected successfully!', xx:3000})
        // setTimeout(() => {
        //   notifySuccess({title:"Success!", body: 'A Workflow has been created 👉 "D-Report App" 👈', xx:3000})
        // }, 2000);
        }
        
      }catch(err){  
        console.log(err)
        setFormProps(prev=>({...prev, error: "Please check your Subdomain/API Key. The provided values may be invalid values.", submitting: false}))
      }

  }).then(()=>{
      cookieHandler.setter(userInfo.siteData.subdomain)
      setFormProps(prev=>({...prev, submitting: false}))
      userInfo.setConnected(true)
      notifySuccess({title:"Connected!", body: 'You are now connected successfully!', xx:3000})
      setTimeout(() => {
        notifySuccess({title:"Success!", body: 'A Workflow has been created 👉 "D-Report App" 👈', xx:3000})
      }, 3000);

    })
    .catch((err) =>{
      console.log("p", err)
  });
  }  

    return (
        <>

        <div className={`${showed && "!translate-y-12"} bg-slate-300 fixed top-20 left-1/2 transform transition duration-200 -translate-y-[140%] -translate-x-1/2 shadow-lg rounded-lg overflow-hidden mx-auto w-10/12 md:w-[800px]`}>

        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Welcome to D-Report!</h2>
            <p className="text-slate-600 mb-6 capitalize">Conncect your Daftra ERP account </p>
            {formProps.error !== "" && <Error text={formProps.error}/>}

            <form onSubmit={submitHandler}>
                <div className="mb-4">
                    <label className="block text-slate-700 font-bold mb-2" htmlFor="subdomain">
            Subdomain
          </label>
                    <input autoComplete="subdomain" disabled={userInfo.connected} className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" id="subdomain" type="text" placeholder="Your Subdomain goes here..." value={userInfo.connected ? userInfo.siteData.subdomain : formProps.subdomain.toLocaleLowerCase()} onChange={(e:ChangeEvent<HTMLInputElement>)=>setFormProps(prev=>({...prev, subdomain: e.target.value}))}/>
                </div>
                <div className="mb-6">
                    <label className="block text-slate-700 font-bold mb-2" htmlFor="apikey">
            API Key
          </label>
                    <input autoComplete="current-password" disabled={userInfo.connected} className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" id="apikey" type="password" placeholder="API Key goes here..." value={userInfo.connected ? userInfo.siteData.apikey : formProps.apikey} onChange={(e:ChangeEvent<HTMLInputElement>)=>setFormProps(prev=>({...prev, apikey: e.target.value}))} />
                </div>
                <div className="mb-6">
          {!userInfo.connected && <Checkbox className=""  classNames={{root:"my-5",label:"px-2", input:"checked:bg-slate-700 border-0"}} checked={firstTimeToConnect} onChange={(event) => setFirstTimeToConnect(event.currentTarget.checked)} label="First time to connect?"/>}
                    <label className="block text-slate-700 font-bold mb-2" htmlFor="workflow-title">
            {userInfo.connected ? "Workflow ID" : "Workflow Title"}
          </label>
                    <input autoComplete="name" disabled={userInfo.connected || !firstTimeToConnect} className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" id="workflow-title" type="text" placeholder="e.g. D-Report Module" value={userInfo.connected ? userInfo.siteData.dreport_module_key : formProps.workflowTitle.trim().split(" ").join("_").toLowerCase()} onChange={(e:ChangeEvent<HTMLInputElement>)=>setFormProps(prev=>({...prev, workflowTitle: e.target.value.trim().split(" ").join("_").toLowerCase()}))} />
                </div>
                <div className="flex gap-2">
                <Button disabled={userInfo.connected} btnFor="submitting" loading={formProps.submitting}  type="submit" text={userInfo.connected ? "Connected!" : "Connect Now"} color={userInfo.connected ? "bg-emerald-600 hover:bg-emerald-600/90" : "bg-slate-500 hover:bg-slate-500/90"}/>

                <Button disabled={!userInfo.connected} btnFor="submitting" loading={formProps.disconnecting} type="button" text={"Disconnect"} onClickFunc={disconnect} color={"bg-red-600 hover:bg-red-600/90"}/>
                </div>
                 
                    <a className="block align-baseline mb-2 transition duration-300 text-xs underline text-blue-500 hover:text-blue-800" href="/">Don't know how to get your subdomain and API key?             
                      </a>
            </form>
    </div>

</div>
        </>
    )
}