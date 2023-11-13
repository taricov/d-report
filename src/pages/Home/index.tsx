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
  