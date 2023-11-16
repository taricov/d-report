import { TDaftraWorkflow, TsiteData, TtableCol } from "../types/types";
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



export async function GET_siteInfo({subdomain, apikey}:Pick<TsiteData, "subdomain" | "apikey"> ): Promise<Response>{
    console.log(subdomain, apikey)
    const req: Response = await fetch(`https://${subdomain}.daftra.com/api2/site_info`, {
        headers: {
            "Content-Type": "application/json",
            "apikey": apikey
          },
    })
return req
}

export const POSTreportsWorkflow = async ({ subdomain, apikey }: Pick<TsiteData, "subdomain" | "apikey"> ): Promise<Response> => {
    // const { userSub, apikey } = getSecrets()
    const data: TDaftraWorkflow = {
      name: 'D-Report Module',
      status: 1,
      singular_title: 'Report',
    }

    const res: Response = await fetch(`https://${subdomain}.daftra.com/v2/api/entity/workflow_type`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apikey,
        },
        body: JSON.stringify(data),
      })
      // const result = await res.json()
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
      