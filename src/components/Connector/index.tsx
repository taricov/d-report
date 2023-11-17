import { ChangeEvent, useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { GET_siteInfo, GetUser, POSTnewUser, POSTreportsWorkflow } from "../../api/api_funcs";
import { cookieHandler } from "../../logic/cookies";
import type { TformProps } from "../../types/types";
import { Button } from "../Button";
import Error from "../Error";

import NotificationContext from "../Notification/NotificationProvider";
import { schedule } from "../../helpers/helpers";


export default function Connector({showed}:{showed: boolean}){
const userInfo = useContext(UserContext)
const notify = useContext(NotificationContext)
const [formProps, setFormProps] = useState<TformProps>({loading: false, error: "", disconnecting: false})

useEffect(() => {
  notify.success({title:"Successfully Connected!", text:"Your are now connected successfully 🎉"})
  schedule(notify.clear, 3000)
},[])


  const disconnect = () => { 
    setFormProps(prev=>({...prev, disconnecting: true}))
    cookieHandler.remove('site_subdomain')
    cookieHandler.remove('site_api_key')
    userInfo.setSiteData(()=>({...Object.keys(userInfo.siteData).reduce((acc:any, curr)=>({...acc, [curr]: ""}), {})}))
    setTimeout(() => {
      setFormProps(prev=>({...prev, disconnecting: false}))
      userInfo.setConnected(false)
    userInfo.setSiteData(prev=>({...prev, fromForm: true}))

      setTimeout(() => {
        userInfo.setSiteData(prev=>({...prev, fromForm: false}))
        console.log(userInfo.siteData.submitting)
    }, 1000);
    }, 3000);
  }

  const submitHandler = (e: React.FormEvent) =>{
    e.preventDefault()
    setFormProps(prev=>({...prev, error: "", loading: true}))
    userInfo.setSiteData(prev=>({...prev, fromForm: true}))

    return new Promise<any>(async (resolve, _) =>{
      if(userInfo.siteData.apikey === "" || userInfo.siteData.apikey === "") setFormProps(prev=>({...prev, error: "Please Fill/Check The Subdomain and API Key Values.", loading: false}))
      // If Empty Values...
      if(userInfo.siteData.subdomain.split(" ").length > 1) setFormProps(prev=>({...prev, error: "Please check your Subdomain. The provided value may be invalid value.", loading: false}))
      // GET site info. request...
        const res = await GET_siteInfo({...userInfo.siteData})
        resolve(res)
      }).then(async(res) =>{
        if(res.status === 422) setFormProps(prev=>({...prev, error: "Please check your API Key. The provided value may be invalid value.", loading: false}))
      const data = await res.json()
      return data
    }).then(async(data) =>{
      const siteInfo = data.data.Site
      userInfo.setSiteData(prev => ({...prev, 
        siteBusinessName: siteInfo.business_name, 
        siteEmail: siteInfo.email, 
        siteFirstName: siteInfo.first_name, 
        siteLastName: siteInfo.last_name, 
        siteCity: siteInfo.city, 
        siteState: siteInfo.state, 
        sitePhone1: siteInfo.phone1, 
        sitePhone2: siteInfo.phone2, 
        siteCountryCode: siteInfo.country_code, 
        siteCurrencyCode: siteInfo.currency_code, 
        siteAddress1: siteInfo.address1, 
        siteAddress2: siteInfo.address2, 
        siteID: siteInfo.id, 
        siteLogoURL: `https://${userInfo.siteData.subdomain}.daftra.com/files/images/site-logos/${siteInfo.site_logo}`}))

  const user: any = await GetUser('subdomain', userInfo.siteData.subdomain)
  console.log('existing user: ', user)

  if (user.total === 0){
try{

  const creatReportWorkflow = await POSTreportsWorkflow({subdomain: userInfo.siteData.subdomain, apikey: userInfo.siteData.apikey})
  const res = await creatReportWorkflow.json()
  if(creatReportWorkflow.status === 200) userInfo.setSiteData(prev=>({...prev, siteModuleKey: res.id}))
  console.log(res)

    const userCreated = await POSTnewUser({...userInfo.siteData})
      console.log(userCreated)
}catch (err) {
  console.log(err)
}


  }

  if (user.total > 0) {
    userInfo.setSiteData(prev => ({...prev, siteModuleKey:  user.documents[0].noteModuleKey}))
    console.log(userInfo.siteData)
  }

  
    })
    .then(()=>{
      cookieHandler.setter(userInfo.siteData.subdomain, userInfo.siteData.apikey)
      setFormProps(prev=>({...prev, loading: false}))
      userInfo.setConnected(true)
      userInfo.setSiteData(prev=>({...prev, fromForm: false}))
    })
    .catch((err) =>{
    
    userInfo.setSiteData(prev=>({...prev, loading: false}))
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
                    <input autoComplete="subdomain" disabled={userInfo.connected && userInfo.siteData.subdomain.length > 0} className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" id="subdomain" type="text" placeholder="Your Subdomain goes here..." value={userInfo.siteData.subdomain.toLocaleLowerCase()} onChange={(e:ChangeEvent<HTMLInputElement>)=>userInfo.setSiteData(prev=>({...prev, subdomain: e.target.value}))}/>
                </div>
                <div className="mb-6">
                    <label className="block text-slate-700 font-bold mb-2" htmlFor="apikey">
            API Key
          </label>
                    <input autoComplete="current-password" disabled={userInfo.connected && userInfo.siteData.apikey.length > 0} className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" id="apikey" type="password" placeholder="API Key goes here..." value={userInfo.siteData.apikey} onChange={(e:ChangeEvent<HTMLInputElement>)=>userInfo.setSiteData(prev=>({...prev, apikey: e.target.value}))} />
                </div>
                <div className="flex gap-2">
                <Button disabled={userInfo.connected} btnFor="submitting" loading={formProps.loading}  type="submit" text={userInfo.connected ? "Connected!" : "Connect Now"} color={userInfo.connected ? "bg-emerald-600 hover:bg-emerald-600/90" : "bg-slate-500 hover:bg-slate-500/90"}/>

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