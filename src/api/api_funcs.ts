import { TtableCol } from "../types/types";

export async function GET_tablesCols({SUBDOMAIN, API_KEY, method, table}:TtableCol ): Promise<any>{
    const req = await fetch(`https://${SUBDOMAIN}.daftra.com/v2/api/entity/${table}/list/1`, {
        method,
        headers: {
            "Content-Type": "application/json",
            "apikey": API_KEY
          },
    })
const res = await req.json();
return res
}

