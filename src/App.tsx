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
import { Tconnector, TformData } from "./types/types";
import SnackBar from "./components/SanckBar";
import { cookieHandler } from "./logic/cookies";
import { GET_siteInfo } from "./api/api_funcs";

const queryClient = new QueryClient()

export const UserContext = createContext<Tconnector>({connected: false, setConnected:()=>false, siteData: {
  subdomain: "",
  apikey: "",
  siteFirstName: "",
  siteLastName: "",
  siteBusinessName: "",
  siteID: "",
  siteEmail: "",
  siteLogoURL: "",}, setSiteData:()=>{}});

function App() {
  const [siteData, setSiteData ] = useState<TformData>({subdomain: "", apikey: "", siteLogoURL: "", siteID: "", siteEmail: "", siteFirstName: "", siteLastName: "", siteBusinessName: ""})
const [connected, setConnected] = useState<boolean>(false)
const [showSnackBar, setShowSnackBar] = useState<boolean>(false)

const checkCookie = async() => {
const apikey = cookieHandler.getter("site_api_key") || ""
const subdomain =  cookieHandler.getter("site_id") || ""
setSiteData(prev => ({...prev, apikey: cookieHandler.getter("site_api_key") || "", subdomain: cookieHandler.getter("site_subdomain") || ""}))
const res = await GET_siteInfo({subdomain, apikey})
console.log(res)
if(res.status !== 200) return;
if(res.status === 200){
  const data = res.json()
  const siteInfo = data.data.Site
  setSiteData(prev => ({...prev, siteBusinessName: siteInfo.business_name, siteEmail: siteInfo.email, siteFirstName: siteInfo.first_name, siteLastName: siteInfo.last_name, siteID: siteInfo.id, siteLogoURL: siteInfo.site_logo}))
  setConnected(true);

}
}

useEffect(()=>{
  checkCookie()
  setShowSnackBar(()=>connected)
  console.log("connected", showSnackBar)
  setTimeout(()=>{
  setShowSnackBar(false)
  console.log("timeout", showSnackBar)
  },3000)
},[connected])

  return (
    <>
    <UserContext.Provider value={{connected, setConnected, siteData, setSiteData}}>
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
    <Footer/>

    </QueryClientProvider>
    </UserContext.Provider>
    </>
  );
}

export default App;
