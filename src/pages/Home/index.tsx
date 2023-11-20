// import Connector from "../../components/Connector";
import { useContext } from "react";
import { Hero } from "../../components/Hero";
import Incorporate from "../../components/Incorporate";
import { UserContext } from "../../App";
import Spinner from "../../components/Spinner";

const Home = () => {
  const userInfo = useContext(UserContext)
    return (
      <>
     
      {userInfo.siteData.fetching ? 
      
      <div className="w-screen h-screen flex align-center justify-center">
      <Spinner size="w-20" />
      </div>

        : 
        <>
         <div className="flex align-center justify-center w-full mx-auto mt-28">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-32" viewBox="0 0 128.65 139.81"><defs></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path className="cls-1" d="M94.85,5.15,0,139.81,52.44,0H64.19Q83.17,0,94.85,5.15Z"/><polygon className="cls-2" points="52.44 0 0 139.81 0 0 52.44 0"/><path className="cls-3" d="M128.65,69.43q0,22.41-5.1,34.76a57.54,57.54,0,0,1-14.16,20.7A46.32,46.32,0,0,1,89.93,136a100.26,100.26,0,0,1-25.74,3.81H0L126.83,49.42A106.53,106.53,0,0,1,128.65,69.43Z"/><path className="cls-4" d="M126.83,49.42,0,139.81,94.85,5.15a50,50,0,0,1,19.31,14.78,61.41,61.41,0,0,1,11.06,22.42C125.85,44.67,126.38,47,126.83,49.42Z"/></g></g></svg>
      </div>
      <div
        className="select-none text-[80px] font-bold leading-snug text-center text-transparent lg:text-center lg:text-[120px] m-auto bg-clip-text bg-gradient-to-bl from-slate-400 to-slate-700">D-Report</div>
          <Hero/>
          <div className="flex flex-col items-center min-h-screen">
        <Incorporate />
      </div>
      </>
}

      </>
    );
  };
  
  export default Home;
  