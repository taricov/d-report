// import Connector from "../../components/Connector";
import { Hero } from "../../components/Hero";
import Incorporate from "../../components/Incorporate";

const Home = () => {
    return (
  
      <>
    {/* <Connector/> */}
          <Hero/>
          <div className="flex flex-col items-center min-h-screen">
        <Incorporate />
      </div>
      </>
    );
  };
  
  export default Home;
  