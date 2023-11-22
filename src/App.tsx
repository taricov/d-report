import Footer from "./components/Footer";
import Header from "./components/Header";

import { createContext, useEffect, useMemo, useState } from "react";
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
import type { TCONTEXT_Connector, TCONTEXT_ReportData, TreportData, TreportVariables, TsiteData } from "./types/types";
import { useNotify } from "./hooks/useNotify";

const queryClient = new QueryClient()



export const ReportContext = createContext<TCONTEXT_ReportData>({reportData: {selectedColumns: [],columnsSettings: [], reportConfig: {}, joins: {} , reportTitle: "", fromTable: "", foreignKey: ""}, setReportData: () => {}})

export const UserContext = createContext<TCONTEXT_Connector>({
  connected: false, 
  setConnected:()=>false, 
  siteData:{} as TsiteData, 
  setSiteData:()=>{},
});


function App() {

  const [reportData, setReportData ] = useState<TreportData & TreportVariables>({selectedColumns: [],columnsSettings: [], reportConfig: {}, joins:{}, reportTitle: "", fromTable: "", foreignKey: ""})
  const [siteData, setSiteData ] = useState<TsiteData>(accountAttributes.reduce((acc,curr)=>({...acc, [curr]: ["fetching", "submitting"].includes(curr) ? false : ""}),{} as TsiteData))
const [connected, setConnected] = useState<boolean>(false)
const { notifyError } = useNotify()

// useEffect(()=>{
//   checkCookie()
// },[]);
// useEffect(()=>{
// console.log("data", siteData)
// },[connected]);


const checkCookie:any = useMemo(async() => {
  setSiteData(prev=>({...prev, fetching: true}));
  const sub = cookieHandler.getter("site_subdomain") || ""
setSiteData(prev => ({...prev, subdomain: sub}))
if(sub.length < 1){
  setSiteData(prev=>({...prev, fetching: false}));
  setConnected(false);
  return;
}
if(!navigator.onLine){
  notifyError({title:"Network is Out!", body: "Please check your internet connection!", xx:3000})
  return;
}
const USER_DB: any = await GetUser('subdomain', sub)
console.log('existing user: ', USER_DB)
if(!USER_DB){
  setConnected(false);
  setSiteData(prev=>({...prev, fetching: false}));
  return
  
}
if(USER_DB){
  const USER_DB_DATA = USER_DB.documents[0]
  setSiteData(prev=>({...prev, ...Object.keys(siteData).reduce((acc,curr)=>({...acc, [curr]: ["id", "language_code"].includes(curr) ? +USER_DB_DATA[curr] : curr === "subdomain" ? USER_DB_DATA[curr].split(".")[0] : USER_DB_DATA[curr] }),{})
}))
  setConnected(true);
  
}}, [])
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
    </QueryClientProvider>
    </ReportContext.Provider>
    </UserContext.Provider>
</NotificationProvider>

    </>
  );
}

export default App;
