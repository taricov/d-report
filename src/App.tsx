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
import { Tconnector } from "./types/types";
import SnackBar from "./components/SanckBar";

const queryClient = new QueryClient()

export const UserContext = createContext<Tconnector>({connected: false, setConnected:()=>false});

function App() {
const [connected, setConnected] = useState<boolean>(false)
const [showSnackBar, setShowSnackBar] = useState<boolean>(false)

useEffect(()=>{
  setShowSnackBar(()=>connected)
  console.log("connected", showSnackBar)
  setTimeout(()=>{
  setShowSnackBar(false)
  console.log("timeout", showSnackBar)
  },3000)
},[connected])

  return (
    <>
    <UserContext.Provider value={{connected, setConnected}}>
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
