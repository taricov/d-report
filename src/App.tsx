import Footer from "./components/Footer";
import Header from "./components/Header";

import {
  QueryClient,
  QueryClientProvider

} from 'react-query'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Home from "./pages/Home";
import About from "./pages/About";
import Reports from "./pages/Reports";
import Report from "./pages/Report";
import { createContext, useEffect, useState } from "react";
import type { TCONTEXT_Connector, TCONTEXT_ReportData, TreportData, TsiteData } from "./types/types";
import SnackBar from "./components/SanckBar";
import { cookieHandler } from "./logic/cookies";
import { GET_siteInfo, GetUser } from "./api/api_funcs";
import { accountAttributes } from "./data/attrs";

const queryClient = new QueryClient()



export const ReportContext = createContext<TCONTEXT_ReportData>({reportData: {selectedColumns: [],columnsSettings: [], reportConfig: {}}, setReportData: () => {}})

export const UserContext = createContext<TCONTEXT_Connector>({
  connected: false, 
  setConnected:()=>false, 
  siteData:{} as TsiteData, 
  setSiteData:()=>{},
});


function App() {
  const [reportData, setReportData ] = useState<TreportData>({selectedColumns: [],columnsSettings: [], reportConfig: {}})
  
  const [siteData, setSiteData ] = useState<TsiteData>(accountAttributes.reduce((acc,curr)=>({...acc, [curr]: ["fetching", "submitting"].includes(curr) ? false : ""}),{} as TsiteData))
  console.log(siteData)

const [connected, setConnected] = useState<boolean>(false)
const [showSnackBar, setShowSnackBar] = useState<boolean>(false)
const [showSnackBarDisconnected, setShowSnackBarDisconnected] = useState<boolean>(false)
const [showSnackBarInternetConnection, setShowSnackBarInternetConnection] = useState<boolean>(false)
const [showSnackBarWorkflow, setShowSnackBarWorkflow] = useState<boolean>(false)

const [, setErrors] = useState<{[key:string]: boolean}>({internetConnection: false})

const checkCookie = async() => {
  setSiteData(prev=>({...prev, fetching: true}));
  const sub = cookieHandler.getter("site_subdomain") || ""
  const api = cookieHandler.getter("site_api_key") || ""
setSiteData(prev => ({...prev, apikey: api, subdomain: sub}))
if(sub.length < 1 || api.length < 1){
  setSiteData(prev=>({...prev, fetching: false}));
  setConnected(false);
console.log("Fds")
return;
}
if(!navigator.onLine){
  setSiteData(prev=>({...prev, fetching: false}));
  setErrors(prev=>({...prev, internetConnection: true}));
  setTimeout(()=>{
    // setShowSnackBarInternetConnection(true)
  },1000)
    setTimeout(()=>{
      setShowSnackBarInternetConnection(false)
    },3000)
  return;
}

const user: any = await GetUser('subdomain', siteData.subdomain)
console.log('existing user: ', user)
if(!user){
  // const data = await res.json()
  // const siteInfo = data.data.Site
  setConnected(false);
  setSiteData(prev=>({...prev, fetching: false}));
  return
  
}
if(user){
  const userFromDB = user.documents[0]
  // setSiteData(prev=>({...prev, siteLogoURL: `https://${siteData.subdomain}.daftra.com/files/images/site-logos/${sub}`,  siteModuleKey: user.documents[0].id || null}))
  setSiteData(prev => ({...prev, 
    siteBusinessName: userFromDB?.business_name, 
    siteEmail: userFromDB?.email, 
    siteFirstName: userFromDB?.first_name, 
    siteLastName: userFromDB?.last_name, 
    siteCity: userFromDB?.city, 
    siteState: userFromDB?.state, 
    sitePhone1: userFromDB?.phone1, 
    sitePhone2: userFromDB?.phone2, 
    siteCountryCode: userFromDB?.country_code, 
    siteCurrencyCode: userFromDB?.currency_code, 
    siteAddress1: userFromDB?.address1, 
    siteAddress2: userFromDB?.address2, 
    siteID: userFromDB?.daftra_site_id, 
    siteLanguage: userFromDB?.lang, 
    siteModuleKey: userFromDB?.note_module_key || null,
    siteLogoURL: `https://${sub}.daftra.com/files/images/site-logos/${userFromDB?.site_logo}`}))
  setSiteData(prev=>({...prev, fetching: false}));
  setConnected(true);
  
}
// const res = await GET_siteInfo({subdomain: sub, apikey: api})
// if(res.status !== 200) {
  // return;};

}

useEffect(()=>{
  checkCookie()
},[]);

useEffect(()=>{

if(connected && siteData.submitting && !!siteData.dreport_module_key){

    setShowSnackBar(()=>connected)
    setTimeout(()=>{
      setShowSnackBar(false)
      setShowSnackBarWorkflow(()=>connected)
    },3000)
    setTimeout(()=>{
      setShowSnackBarWorkflow(false)
    },5000)
    console.log("Please I am here")
    // setShowSnackBar(()=>connected)
    // setTimeout(()=>{
    //   setShowSnackBar(false)
    // },3000)
}else if(!connected && siteData.submitting){
  console.log("Please I am here")
    setShowSnackBarDisconnected(true)
    setTimeout(()=>{
      setShowSnackBarDisconnected(false)
    },3000)
  }

  console.log("fromForm: " + siteData.submitting, connected)
},[connected])

// if(siteData.subdomain.length < 0) return <div >loading...</div>;

  return (
    <>

    <UserContext.Provider value={{connected, setConnected, siteData, setSiteData}}>
    <ReportContext.Provider value={{reportData, setReportData}}>
        <QueryClientProvider client={queryClient}>
          <Header />
          <BrowserRouter>
<Routes>
<Route  path='/' element={<Home/>} />
<Route  path='/about' element={<About/>} />
<Route  path='/reports' element={<Reports/>} />
<Route  path='/reports/:id' element={<Report/>} />

</Routes>

</BrowserRouter>
    <SnackBar showMe={showSnackBar} body={<><span className="font-medium">Connected!</span> You are now connected successfully!</>}/>
    <SnackBar color="!border-red-400 !text-red-800 !bg-red-100" showMe={showSnackBarDisconnected} body={<><span className="font-medium">Disconnected! ☹️</span> You have disconnected the service!</>}/>
    <SnackBar color="!border-red-400 !text-red-800 !bg-red-100" showMe={showSnackBarInternetConnection} body={<><span className="font-medium">Check Your Internet!</span>You are NOT Connected to the internet!</>}/>
    <SnackBar color="!border-green-400 !text-green-800 !bg-green-100" showMe={showSnackBarWorkflow} body={<><span className="font-medium">Sucess!</span>A Workflow has been created 👉 "D-Report App" 👈</>}/>
    <Footer/>
    {/* <div className="absolute top-0 bottom-0 left-0 right-0 inset-0 w-full h-[100vh] overflow-hidden bg-no-repeat pointer-events-none -z-10 lg:block bg-gradient-to-b from-slate-50 to-slate-800 via-slate-500/80" /> */}
    </QueryClientProvider>
    </ReportContext.Provider>
    </UserContext.Provider>
    </>
  );
}

export default App;
