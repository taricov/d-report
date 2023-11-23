import { TDaftraWorkflow, TreportData, TreportObj, TreportVariables, TsiteData, TtableCol } from "../types/types";
import { Client, Databases, ID, Query } from 'appwrite'




export async function GET_tablesCols({subdomain, apikey, method="GET", table, limit=1}:TtableCol ): Promise<Response>{
    const req = await fetch(`https://${subdomain}.daftra.com/v2/api/entity/${table}/list/1?per_page=${limit}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            "apikey": apikey
          },
    })
//     console.log(req)
// const res = await req.json();
return req
}



export async function GET_SITEINFO({subdomain, apikey}:Pick<TsiteData, "subdomain" | "apikey"> ): Promise<Response>{
    // console.log(subdomain, apikey)
    const req: Response = await fetch(`https://${subdomain}.daftra.com/api2/site_info`, {
        headers: {
            "Content-Type": "application/json",
            "apikey": apikey
          },
    })
return req
}

export const POSTcreateReportModule = async ({ subdomain, apikey, workflowTitle }: Pick<TsiteData, "subdomain" | "apikey"> & {workflowTitle: string}): Promise<Response> => {


  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("apikey", apikey);
  
  const data: TDaftraWorkflow = {
    name: workflowTitle+" ❌Don't Edit❌",
    status: 1,
    singular_title: "Report",
    // singular_title: workflowTitle,
    
  }
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
  };
  
  const res = await fetch(`https://${subdomain}.daftra.com/v2/api/entity/workflow_type`, requestOptions)
  return res
  
    }


    export const POSTcreateRerport = async ({ subdomain, apikey, title, reportModuleKey, data}: Pick<TsiteData, "subdomain" | "apikey"> & {reportModuleKey: number, title: string, data: any}): Promise<Response> => {


      const today = new Date();
      const formatedToday = today.toISOString().split("T")[0].split("-").join("/")
      const formatedToday2 = today.toISOString().split("T")[0]
console.log(formatedToday, formatedToday2)

      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("apikey", apikey);
      
  const d = {
        number: { code: "1", generated: "1" },
        title: title,
        start_date: formatedToday2,
        description: data,
        budget: {
          currency: "USD"
        },

  }

  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(d),
  };


      const res: Response = await fetch(`https://${subdomain}.daftra.com/v2/api/entity/le_workflow-type-entity-${reportModuleKey}`, requestOptions)
      return res
    }
    
    
    export const GETallReports = async (subdomain: string, apikey: string, reportModuleKey: string):Promise<Response> => {

      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("apikey", apikey);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };
      // console.log(subdomain, apikey, reportModuleKey);
      const res: Response = await fetch(`https://${subdomain}.daftra.com/v2/api/entity/le_workflow-type-entity-${reportModuleKey}/list/1?per_page=10000`, requestOptions)
      return res
    }


    export const GETcurrentReport = async (subdomain: string, apikey: string, reportModuleKey: string, id: string):Promise<Response> => {

      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("apikey", apikey);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
      };
      // console.log("currentReport", subdomain, apikey, reportModuleKey);
      const res: Response = await fetch(`https://${subdomain}.daftra.com/v2/api/entity/le_workflow-type-entity-${reportModuleKey}/${id}`, requestOptions)
      return res
    }


    // Appwrite DB 
    const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  // .setProject(`${PROJECT_ID}`)
  .setProject('6470ec273ccbfc1462f7')

const databases = new Databases(client)

    export const POSTnewUser = (data: any) => databases.createDocument(
        '6470ec650e1ca8428bf6', '6470eca413760d1ae70a',
        // `${DATABASE_ID}`, `${COLLECTION_ID}`,
        ID.unique(),
        JSON.stringify(data),
      ).then((res) => {
        return res
      }, (error) => {
        return error
      })

      export const GetUser = (label: string, data: string) => databases.listDocuments(
        '6470ec650e1ca8428bf6', '6470eca413760d1ae70a',
        // `${DATABASE_ID}`, `${COLLECTION_ID}`,
        [
          Query.equal(label, data),
        ],
      ).then((response) => {
        return response
      }, (error) => {
        return error
      })
      