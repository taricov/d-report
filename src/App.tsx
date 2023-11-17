import Footer from "./components/Footer";
import Header from "./components/Header";

import { createContext, useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider
} from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GetUser } from "./api/api_funcs";
import Notification from "./components/Notification";
import { NotificationProvider } from "./components/Notification/NotificationProvider";
import { accountAttributes } from "./data/attrs";
import { cookieHandler } from "./logic/cookies";
import About from "./pages/About";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Reports from "./pages/Reports";
import type { TCONTEXT_Connector, TCONTEXT_ReportData, TreportData, TsiteData } from "./types/types";

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
const [connected, setConnected] = useState<boolean>(false)


useEffect(()=>{
  checkCookie()
},[]);


const checkCookie = async() => {
  setSiteData(prev=>({...prev, fetching: true}));
  const sub = cookieHandler.getter("site_subdomain") || ""
setSiteData(prev => ({...prev, subdomain: sub}))
if(sub.length < 1){
  setSiteData(prev=>({...prev, fetching: false}));
  setConnected(false);
return;
}
if(!navigator.onLine){
  setSiteData(prev=>({...prev, fetching: false}));
  return;
}

const user: any = await GetUser('subdomain', siteData.subdomain)
console.log('existing user: ', user)
if(!user){
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

}



// useEffect(()=>{

// if(connected && siteData.submitting && !!siteData.dreport_module_key){

//     setShowSnackBar(()=>connected)
//     setTimeout(()=>{
//       setShowSnackBar(false)
//       setShowSnackBarWorkflow(()=>connected)
//     },3000)
//     setTimeout(()=>{
//       setShowSnackBarWorkflow(false)
//     },5000)
//     console.log("Please I am here")
//     // setShowSnackBar(()=>connected)
//     // setTimeout(()=>{
//     //   setShowSnackBar(false)
//     // },3000)
// }else if(!connected && siteData.submitting){
//   console.log("Please I am here")
//     setShowSnackBarDisconnected(true)
//     setTimeout(()=>{
//       setShowSnackBarDisconnected(false)
//     },3000)
//   }

//   console.log("fromForm: " + siteData.submitting, connected)
// },[connected])

// if(siteData.subdomain.length < 0) return <div >loading...</div>;

  return (
    <>
<NotificationProvider>
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
<Notification />

    <Footer/>
    {/* <div className="absolute top-0 bottom-0 left-0 right-0 inset-0 w-full h-[100vh] overflow-hidden bg-no-repeat pointer-events-none -z-10 lg:block bg-gradient-to-b from-slate-50 to-slate-800 via-slate-500/80" /> */}
    </QueryClientProvider>
    </ReportContext.Provider>
    </UserContext.Provider>
</NotificationProvider>

    </>
  );
}

export default App;
