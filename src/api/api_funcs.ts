import { TtableCol } from "../types/types";

export async function GET_tablesCols({subdomain, apikey, method, table}:TtableCol ): Promise<any>{
    const req = await fetch(`https://${subdomain}.daftra.com/v2/api/entity/${table}/list/1`, {
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



export async function GET_siteInfo({subdomain, apikey}:Omit<TtableCol, "table" | "method"> ): Promise<any>{
    const req = await fetch(`https://${subdomain}.daftra.com/api2/site_info`, {
        headers: {
            "Content-Type": "application/json",
            "apikey": apikey
          },
    })
return req
}