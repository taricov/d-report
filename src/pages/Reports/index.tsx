import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { GETallReports } from "../../api/api_funcs";

// interface TreportMetaData {
// [key: string]: string;
// }

const Reports = () => {
  const userInfo = useContext(UserContext)
  const [allReports, setReports] = useState<Array<any>>([])
  useEffect(() => {
    
    if(userInfo.siteData.subdomain.length && userInfo.siteData.apikey.length && userInfo.siteData.dreport_module_key){
  console.log(userInfo.siteData)
  GETallReports(userInfo.siteData.subdomain, userInfo.siteData.apikey, userInfo.siteData.dreport_module_key).then((res:Response) => {
       return res.json()
  }).then(data=>{
    setReports(data.data)
  })
    
  }
  }, [userInfo.siteData.subdomain, userInfo.siteData.dreport_module_key, userInfo.siteData.apikey])
  

    return (
      <div className="min-h-screen py-8 px-4 mt-20">
      {userInfo.siteData.fetching ? 
      <div className="w-screen h-screen flex align-center justify-center">
      <Spinner size="w-20" />
      </div>

        : 
<>
<div className="mx-auto w-full max-w-2xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
<h5 className="mb-3 text-base text-center font-semibold text-gray-900 md:text-xl dark:text-white">
Your Reports
</h5>
<p className="text-sm font-normal text-center text-gray-500 dark:text-gray-400">This list contains all the reports you created.</p>
<ul className="my-4 space-y-3">
  {allReports.reverse().map((report,i) =>(
    
    <li key={i+1}>
<Link to={"/reports/"+ (i+1)} className="transition duration-200 flex items-center p-3 text-base font-bold text-slate-700 rounded-lg bg-slate-300 hover:bg-slate-600 hover:text-slate-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">

<span className="px-3 py-1 bg-slate-400/80 rounded-md mr-1 text-sm whitespace-nowrap">{i+1}</span>
<span className="flex-1 ms-3 whitespace-nowrap">Report: {report.title}</span>
<span className="inline-flex items-center justify-center px-2 py-0.5 ms-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">Created at: {report.workflow_type.created.split(" ")[0].split("-").join("/")}</span>

</Link>
</li>
  ))}

</ul>
<div>
{/* <a href="/reports" className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
Why do I need to connect with my wallet?</a> */}
</div>
</div>

      





      <div className="my-10 mt-9 py-4 bg-slate-200/60 w-10/12 flex flex-col items-center justify-center rounded-md mx-auto">
<h2 className="text-xl font-bold text-slate-600 text-center">See More About</h2>
<div className="flex items-center justify-center gap-3 ">
                  <a aria-current="page"
                      className="inline-block rounded-lg py-1 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-slate-700/70"
                      href="/reportsabout">How it works</a>
                  <a className="inline-block rounded-lg py-1 text-sm font-medium text-slate-700 transition-all duration-200 hover:text-slate-700/70"
                      href="/reportsttps://linkedin.com/in/taricov">Author</a>
              </div>
              </div>
              </>
}
      </div>

    );
  };
  
  export default Reports;
  