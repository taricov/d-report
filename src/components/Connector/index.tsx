import { ChangeEvent, useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { GET_siteInfo } from "../../api/api_funcs";
import { cookieHandler } from "../../logic/cookies";
import type { TformProps } from "../../types/types";
import { Button } from "../Button";
import Error from "../Error";


export default function Connector({showed}:{showed: boolean}){
const userInfo = useContext(UserContext)
const [formProps, setFormProps] = useState<TformProps>({loading: false, error: "", disconnecting: false})
  // const [formData, seTsiteData ] = useState<TsiteData>({subdomain: "", apikey: "", siteLogoURL: "", siteID: "", siteEmail: "", siteFirstName: "", siteLastName: "", siteBusinessName: ""})

  const disconnect = () => { 
    setFormProps(prev=>({...prev, disconnecting: true}))
    cookieHandler.remove('site_subdomain')
    cookieHandler.remove('site_api_key')
    userInfo.setSiteData(prev=>({...prev, apikey: "", subdomain: "", siteID: ""}))
    setTimeout(() => {
      setFormProps(prev=>({...prev, disconnecting: false}))
      userInfo.setConnected(false)
    }, 3000);
  }

  const formControl = (e: React.FormEvent) =>{
    e.preventDefault()
    setFormProps(prev=>({...prev, error: "", loading: true}))

    return new Promise<any>(async (resolve, reject) =>{

      if(userInfo.siteData.apikey === "" || userInfo.siteData.apikey === "") setFormProps(prev=>({...prev, error: "Please Fill/Check The Subdomain and API Key Values.", loading: false}))
        const res = await GET_siteInfo({...userInfo.siteData})
        resolve(res)
      }).then(async(res) =>{
        console.log("reeez", res)
        if(res.status === 401) setFormProps(prev=>({...prev, error: "Please check your API Key. The provided value may be invalid value.", loading: false}))
        // console.log(res)
      const data = await res.json()
      return data
    }).then((data) =>{
      const siteInfo = data.data.Site
      console.log(siteInfo)
      userInfo.setSiteData(prev=>({...prev, siteLogoURL: `https://${userInfo.siteData.subdomain}.daftra.com/files/images/site-logos/${siteInfo.site_logo}`, siteID: siteInfo.id, siteEmail: siteInfo.email, siteFirstName: siteInfo.first_name, siteLastName: siteInfo.last_name, siteBusinessName: siteInfo.business_name}))

      cookieHandler.setter(userInfo.siteData.subdomain, userInfo.siteData.apikey)
      setFormProps(prev=>({...prev, loading: false}))
    }).catch((err) =>{
    console.log("catectef",(err as Error).message)
    
    
    // if(err) setFormProps(prev=>({...prev, error: "", loading: false}))
    userInfo.setSiteData(prev=>({...prev, loading: false}))
  });
  }
  
  useEffect(() => {
    console.log(userInfo.siteData)
console.log("from connector", userInfo);

    userInfo.siteData.siteID !== "" && userInfo.setConnected(true)
  },[userInfo.siteData])
    return (
        <>
        <div className={`${showed && "!translate-y-12"} bg-slate-300 fixed top-20 left-1/2 transform transition duration-200 -translate-y-[140%] -translate-x-1/2 shadow-lg rounded-lg overflow-hidden mx-auto w-10/12 md:w-[800px]`}>

        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Welcome to D-Report!</h2>
            <p className="text-slate-600 mb-6 capitalize">Conncect your Daftra ERP account </p>
            {formProps.error !== "" && <Error text={formProps.error}/>}

            <form onSubmit={formControl}>
                <div className="mb-4">
                    <label className="block text-slate-700 font-bold mb-2" htmlFor="subdomain">
            Subdomain
          </label>
                    <input disabled={userInfo.connected && userInfo.siteData.subdomain.length > 0} className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" id="subdomain" type="text" placeholder="Your Subdomain goes here..." value={userInfo.siteData.subdomain} onChange={(e:ChangeEvent<HTMLInputElement>)=>userInfo.setSiteData(prev=>({...prev, subdomain: e.target.value}))}/>
                </div>
                <div className="mb-6">
                    <label className="block text-slate-700 font-bold mb-2" htmlFor="apikey">
            API Key
          </label>
                    <input disabled={userInfo.connected && userInfo.siteData.apikey.length > 0} className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline" id="apikey" type="apikey" placeholder="API Key goes here..." value={userInfo.siteData.apikey} onChange={(e:ChangeEvent<HTMLInputElement>)=>userInfo.setSiteData(prev=>({...prev, apikey: e.target.value}))} />
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