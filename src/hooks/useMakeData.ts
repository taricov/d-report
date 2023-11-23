import { useContext, useEffect, useMemo, useState } from "react";
import { GETcurrentReport, GET_tablesCols } from "../api/api_funcs";
import { flattenObject, merge2Tables, extractDataObj, useQueryParams } from "../helpers/helpers";
import { UserContext, ReportContext } from "../App";






export const useMakeData = () => {
// useMemo(() => {
    
    
    const userInfo = useContext(UserContext)
    const reportInfo = useContext(ReportContext)

    const [metadata, setMetadata] = useState<any>(null)
    const [allData, setAllData] = useState<any>({})
    const [data, setData] = useState<any[]>([])

    // const [reportTables, setTables] = useState<any[]>([])
    const [fetchingData, setFetchingData] = useState<boolean>(true)
    
    const id: string | null = useQueryParams("id")


    async function fetchReportMetadata(){
        const firstRes = await GETcurrentReport(userInfo.siteData.subdomain, userInfo.siteData.apikey, userInfo.siteData.dreport_module_key, id as string)
        const fData = await firstRes.json()
        reportInfo.setReportData(JSON.parse(fData.description))
        if(!metadata)setMetadata(fData)
      }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchReportData = async () =>{
      // setTables([...new Set([reportInfo.reportData.fromTable, ...reportInfo.reportData.selectedColumns.map(c=>c.tableName)])])
    
      return await Promise.all([...new Set([reportInfo.reportData.fromTable, ...reportInfo.reportData.selectedColumns.map(c=>c.tableName)])].map(async (table) => {
        try {
          const response:any = await GET_tablesCols({subdomain: userInfo.siteData.subdomain, apikey: userInfo.siteData.apikey, table, limit:1000000})
          const data:any = await response.json()
          const flattenData = data.data.map((record:any)=>flattenObject(record))
          setAllData((prev: any) =>({...prev, [table]: flattenData}))
          // console.log("allData: " +  )
          // [...new Set([reportInfo.reportData.fromTable, ...reportInfo.reportData.selectedColumns.map(c=>c.tableName)])].map(table=>{
            // const r = 
          
          // return [table, flattenData]
        } catch (error) {
          console.error(`Error fetching data for ${table}:`, error);
        }
        
      }))
    }



    useMemo(() => {
        fetchReportMetadata()
        console.log("metadata: ", metadata)
        
        
      },[userInfo.siteData, metadata, id])
      
      
      useMemo(() => {
    
        fetchReportData().then(async () => {
          const foreignKey = await reportInfo.reportData.foreignKey
          console.log(allData)
          console.log("satisfied", foreignKey)
                const rez = await merge2Tables(allData[reportInfo.reportData.fromTable], allData[Object.keys(reportInfo.reportData.joins)[0]], [...new Map(reportInfo.reportData.selectedColumns.map(c=>([c.tableName, c]))).values()][1]?.alias+"_", [...new Map(reportInfo.reportData.selectedColumns.map(c=>([c.tableName, c]))).values()][0]?.alias+"_", foreignKey, "id");
                // setData(rez)
                const filteredData = await extractDataObj(rez, reportInfo.reportData.columnsSettings.map(c=> c.accessorKey))
    
                setData(filteredData)
                setFetchingData(false)
                console.log(filteredData, data)
              })
    
      
    },[userInfo.siteData, reportInfo.reportData, metadata, id])

return {metadata, fetchingData, data}

// },[])
  }
