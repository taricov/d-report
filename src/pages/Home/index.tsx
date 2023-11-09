import { Hero } from "../../components/Hero";
import Incorporate from "../../components/Incorporate";

const Home = () => {
    return (
  
      <>
          <Hero/>
          <div className="flex flex-col items-center bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-14 mt-40 ">
          D-Report 
        </h1>
        <div className="max-w-[50%] text-center px-4 py-6 bg-slate-500 rounded-md text-3xl font-bold mt-12 mb-14 capitalize">
         this tool is a report builder for Daftra ERP users, with which they can build custom reports in matter of seconds.
        </div>
        <Incorporate />
      </div>
      </>
    );
  };
  
  export default Home;
  