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
import { GET_siteInfo } from "./api/api_funcs";

const queryClient = new QueryClient()

export const ReportContext = createContext<TCONTEXT_ReportData>({reportData: {selectedColumns: [],columnsSettings: [], reportConfig: {}}, setReportData: () => {}})
export const UserContext = createContext<TCONTEXT_Connector>({
  connected: false, setConnected:()=>false, 
  siteData: {
  subdomain: "",
  apikey: "",
  siteFirstName: "",
  siteLastName: "",
  siteBusinessName: "",
  siteID: "",
  siteEmail: "",
  siteLogoURL: "",
  fromForm: false,
  fetching: false,
  sitePhone1: "",
   sitePhone2: "",
   siteAddress1: "",
   siteAddress2: "",
   siteBn1: "",
   siteModuleKey: "",
   siteCity: "",
   siteState: "",
   siteCountryCode: "",
   siteCountry: "",
   siteCurrencyCode: ""
}, setSiteData:()=>{},
});

function App() {
  const [reportData, setReportData ] = useState<TreportData>({selectedColumns: [],columnsSettings: [], reportConfig: {}})
  const [siteData, setSiteData ] = useState<TsiteData>({subdomain: "", apikey: "", siteLogoURL: "", siteID: "", siteEmail: "", siteFirstName: "", siteLastName: "", siteBusinessName: "", fromForm: false, fetching: false, sitePhone1: "", sitePhone2: "", siteAddress1: "", siteAddress2: "", siteBn1: "", siteModuleKey: "", siteCountryCode: "", siteCurrencyCode: "", siteCity: "", siteState: "", siteCountry: ""})
const [connected, setConnected] = useState<boolean>(false)
const [showSnackBar, setShowSnackBar] = useState<boolean>(false)
const [showSnackBarDisconnected, setShowSnackBarDisconnected] = useState<boolean>(false)
const [showSnackBarInternetConnection, setShowSnackBarInternetConnection] = useState<boolean>(false)

const [errors, setErrors] = useState<{[key:string]: boolean}>({internetConnection: false})

const checkCookie = async() => {
  setSiteData(prev=>({...prev, fetching: true}));
  const sub = cookieHandler.getter("site_subdomain") || ""
  const api = cookieHandler.getter("site_api_key") || ""
setSiteData(prev => ({...prev, apikey: api, subdomain: sub}))
if(sub.length < 1 || api.length < 1){
  setSiteData(prev=>({...prev, fetching: false}));
return;
}
if(!navigator.onLine){
  setSiteData(prev=>({...prev, fetching: false}));
  setErrors(prev=>({...prev, internetConnection: true}));
  setTimeout(()=>{
    setShowSnackBarInternetConnection(true)
  },1000)
    setTimeout(()=>{
      setShowSnackBarInternetConnection(false)
    },3000)
  return;
}
const res = await GET_siteInfo({subdomain: siteData.subdomain, apikey: siteData.apikey})
if(res.status !== 200) {
  setSiteData(prev=>({...prev, fetching: false}));
  return;};
if(res.status === 200){
  const data = await res.json()
  console.log(data)
  const siteInfo = data.data.Site
  setSiteData(prev => ({...prev, siteBusinessName: siteInfo.business_name, siteEmail: siteInfo.email, siteFirstName: siteInfo.first_name, siteLastName: siteInfo.last_name, siteID: siteInfo.id, siteLogoURL: `https://${siteData.subdomain}.daftra.com/files/images/site-logos/${siteInfo.site_logo}`}))
  setConnected(true);
  setSiteData(prev=>({...prev, fetching: false}));
  
}
}

useEffect(()=>{
 
  // if(siteData.subdomain.length < 0) return;
  checkCookie()

},[]);

useEffect(()=>{

// console.log(connected)

if(connected && siteData.fromForm){

    setShowSnackBar(()=>connected)
    setTimeout(()=>{
      setShowSnackBar(false)
    },3000)
  }else if(connected && siteData.fromForm){
    setShowSnackBarDisconnected(()=>!connected)
    setTimeout(()=>{
      setShowSnackBarDisconnected(false)
    },3000)

  }
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
    <Footer/>
    {/* <div className="absolute top-0 bottom-0 left-0 right-0 inset-0 w-full h-[100vh] overflow-hidden bg-no-repeat pointer-events-none -z-10 lg:block bg-gradient-to-b from-slate-50 to-slate-800 via-slate-500/80" /> */}
    </QueryClientProvider>
    </ReportContext.Provider>
    </UserContext.Provider>
    </>
  );
}

export default App;
