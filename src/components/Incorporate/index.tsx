import Card from "../Card/index";
import Chip from "../Chip/index";
import List from "../List/index";
// import { report } from "../../logic/report"
import { ChangeEvent, useContext, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { ReportContext, UserContext } from "../../App";
import { GET_tablesCols, GETallReports, POSTcreateRerport } from "../../api/api_funcs";
import { colors } from "../../data/colors";
import type { TErrors, Tloading, TreportVariables, TtableVariables } from "../../types/types";
import { Button } from "../Button";
import CardsList from "../CardsList";
import Error from "../Error";
import Spinner from "../Spinner";
import { useNotify } from "../../hooks/useNotify";
import { tables } from "../../data/tables";
import { flattenObject } from "../../helpers/helpers";


const Incorporate = () => {
const reportInfo = useContext(ReportContext)
const userInfo = useContext(UserContext)

const [newReportMetadata, setReportMetadata] = useState<{reportID: string, reportURL: string, localEntityID: string}>({reportID: "", reportURL: "", localEntityID: ""})
  const [loading, setLoading] = useState<Tloading>({fetching: false, building: false})
  const [error, setErrors] = useState<TErrors>({fetching: false, reportTitle: false, building: false, creatingReport: false})
  const [clipboardValue, setClipboardValue] = useState<string | null>(null)
const [tablesVariables, setTablesVariables] = useState<TtableVariables>({available:[], selected: []})
const [data, setData] = useState<any>()
const [joinedTable, setJoinedTable] = useState<any>()
const { notifyError, notifySuccess } = useNotify()



useEffect(() => {
  console.log(tablesVariables)
  // console.log(reportVariables)
  // console.log(data)
  // console.log("joind", joinedTable)
  // reportInfo.setReportData(prev=>({...prev,
  // selectedColumns: [...tablesVariables.selected]
  // }))
  console.log(reportInfo.reportData)
  console.log("id", newReportMetadata.localEntityID)

},[reportInfo.reportData, tablesVariables, data, joinedTable, newReportMetadata, clipboardValue])



const colorRandomizer = () => {
  return colors[Math.floor(Math.random()*colors.length)]
}

const GETtablesVariables = async () => {
  setTablesVariables({available:[], selected: []})
  setErrors((prev:any) => ({...prev, fetching: false}))
  let allVars: any = []
  setLoading((prev:Tloading) => ({...prev, fetching: true}))


  const tablesArr: string[]= [reportInfo.reportData.fromTable, ...Object.keys(reportInfo.reportData.joins)]

  return await Promise.all(tablesArr.map(async(table) =>{
    const res = await GET_tablesCols({subdomain: userInfo.siteData.subdomain, apikey: userInfo.siteData.apikey, table})
    const rawData = await res.json()
    const data = rawData.data.map((record:any)=>flattenObject(record, tables[table].alias+"_")) 
    console.log("data", rawData.data)
    console.log("fllaten", data)
  const currentColor: string = colorRandomizer()
    allVars = [...allVars, ...Object.entries(data[0]).map(([c,v])=>({columnName: c.split("_").slice(1).join("_"), tableName: table, bgColor: currentColor, alias: tables[table].alias, isNull: v === null || v === ""}))]

  })
  ).then(() => {
    setTablesVariables((prev:any)=>({"available":[...prev.available,
      ...allVars.map((b:string)=>(b)
    )], "selected": []}))
  setLoading((prev:Tloading) => ({...prev, fetching: false}))
  
}).catch(err => {
  console.log("catched", err)
  if(err.message === "Failed to fetch") setErrors((prev:any) => ({...prev, fetching: true}))
  setLoading((prev:Tloading) => ({...prev, fetching: false}))
  });


  }


  const goToReport = async () => {
    const goTo = newReportMetadata.reportURL+"?id="+newReportMetadata.localEntityID
    console.log(goTo);
    setTimeout(() =>{
    window.open(goTo)
    setClipboardValue(null)
  },500)
}






const buildReport = async () => {
  

  console.log(reportInfo.reportData)

  setErrors(prev=>({...prev, fetching: false, building: false, reportTitle: false})); 
  setLoading(prev=>({...prev, building: true}))
  if(tablesVariables.selected.length < 1) {
    setErrors(prev=>({...prev, building: true}))
    setLoading(prev=>({...prev, building: false}))
    return;
  }
  if(!reportInfo.reportData.reportTitle.length) {
    setErrors(prev=>({...prev, reportTitle: true})); 
    setLoading(prev=>({...prev, building: false}))
    return;
}
  let tablesData: any = {}
  // eslint-disable-next-line no-restricted-globals
  const requiredTables: string[] = [reportInfo.reportData.fromTable, ...Object.keys(reportInfo.reportData.joins)] 
  const foreignKey = reportInfo.reportData.foreignKey
      //build the report
  
      return await Promise.all(
        requiredTables.map(async(table:any, i:number)=>{
        const res: Response = await GET_tablesCols({subdomain: userInfo.siteData.subdomain, apikey: userInfo.siteData.apikey, table, limit:1000})
        const dataJSON = await res.json();
        console.log("json:", dataJSON)
        tablesData[table] = dataJSON.data
      })).then(async() => {
        const reportRES = await POSTcreateRerport({subdomain: userInfo.siteData.subdomain, apikey: userInfo.siteData.apikey, title: reportInfo.reportData.reportTitle , reportModuleKey: +userInfo.siteData.dreport_module_key, data: JSON.stringify(reportInfo.reportData)})
        if(!reportRES.ok){
          setErrors(prev=>({...prev, creatingReport: true})); 
          setLoading(prev=>({...prev, building: false}))
        }
        const result = await reportRES.json()
        setReportMetadata(prev=>({...prev, localEntityID: result.id}))
        console.log("result", result)
        GETallReports(userInfo.siteData.subdomain, userInfo.siteData.apikey, userInfo.siteData.dreport_module_key).then(res=>res.json()).then(async(data) =>{
          // eslint-disable-next-line no-restricted-globals
          const baseURL = location.href+"reports/"
          const id = JSON.stringify(data.data.length)
          setReportMetadata(prev=>({...prev, reportURL: baseURL+id+"/?id="+result.id, reportID: id}))
          setClipboardValue(()=> newReportMetadata.reportURL)
          await navigator.clipboard.writeText(clipboardValue as string)
          setErrors(prev=>({...prev, creatingReport: false})); 
          setLoading(prev=>({...prev, building: false}))
          notifySuccess({title:"Successful Build!", body: "Report URL was copied to your clipboard!", xx:3000})
      })
      })

      

     
//   .catch (err) {
//     console.error('Failed to copy: ', err);
//   }
// })


}


  const removeFromList = (list: any, index: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(index, 1);
    return [removed, result];
  };

  const addToList = (list: any, index: any, element: any) => {
    const result = Array.from(list);
    result.splice(index, 0, element);
    return result;
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const listCopy: any = { ...tablesVariables };
    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
      );
      listCopy[result.source.droppableId] = newSourceList;

    const destinationList = listCopy[result.destination.droppableId];

    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );
    setTablesVariables(listCopy);
    reportInfo.setReportData(prev=>({...prev, selectedColumns: listCopy.selected}))
  };
const selectTable = (e: ChangeEvent<HTMLInputElement>) => {
  reportInfo.setReportData(prev=> ({...prev, joins: {}, fromTable: e.target.value, foreignKey: tables[e.target.value].foreign_key }))
}
const selectJoinTable = (e: ChangeEvent<HTMLInputElement>) => {
  
  if(e.target.checked) {
    reportInfo.setReportData(prev=> ({...prev, joins: {...prev.joins, [e.target.value]: "left"}})) }
  else{ 
    // const {[e.target.value], ...rest} = reportVariables.joins
    delete reportInfo.reportData.joins[e.target.value]
    reportInfo.setReportData((prev)=> ({...prev, joins:reportInfo.reportData.joins
      // {...prev.joins.filter((j:string)=> j !== e.target.value)}
    }))
  }
}

  return (
    <>
<div className="lg:w-[100%] w-11/12 m-auto flex justify-center items-start gap-1">
<div className="flex flex-col">
  <h2 className="bg-slate-500/30 shadow m-auto rounded-md w-fit px-5 py-3 font-bold text-slate-600">Select 1st Table</h2>
<ul className="flex flex-col gap-2 w-full overflow-scroll h-[500px] border rounded-md px-3 py-4">
    {Object.entries(tables).map((table, idx) =>(
<li key={idx}>
        <input name="from-table" type="radio" id={table[0]+"-"+table} value={table[0]} onChange={selectTable} className="hidden peer" required={true} />
        <label htmlFor={table[0]+"-"+table} className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-slate-600 peer-checked:text-slate-200 hover:text-gray-600 dark:peer-checked:text-gray-300  hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
            <div className="block">
                <div className="w-full text-lg font-semibold capitalize">{table[0].split("_").join(" ")}</div>
                <div className="w-full text-sm">{table[1].description}</div>

            </div>
                {reportInfo.reportData.fromTable === table[0] && <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24"><path fill="currentColor" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83L9 20.42Z"/></svg>
}
        </label>
    </li>
    ))}
    </ul>
    </div>
    <svg width="100" viewBox="0 0 24 24" className="self-center fill-slate-600"><path  d="M4 15V9h8V4.16L19.84 12L12 19.84V15H4Z"/></svg>

<div className="flex flex-col">
<h2 className="bg-slate-500/30 m-auto shadow rounded-md w-fit px-5 py-3 font-bold text-slate-600">Select Tables To Join</h2>
<ul className="w-[40vw] flex flex-col gap-2 min-w-full overflow-scroll h-[500px] border rounded-md px-3 py-4">
  
    {tables[reportInfo.reportData?.fromTable]?.rels.map((rel, idx) =>
<li key={idx} className="flex">
        <input type="checkbox" data-foreignkey={rel.foreign_key} checked={Object.keys(reportInfo.reportData.joins).includes(rel.table)} id={rel.table} value={rel.table} onChange={selectJoinTable} className="hidden peer" />
        <label htmlFor={rel.table} className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-slate-600 peer-checked:text-slate-200 hover:text-gray-600 dark:peer-checked:text-gray-300hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
            <div className="block">
                <div className="w-full text-lg font-semibold capitalize">{rel.table.split("_").join(" ")}</div>
                <div className="w-full text-xs">Join the <b>{reportInfo.reportData.fromTable.split("_").join(" ").toUpperCase()}</b> table with the <b>{rel.table.split("_").join(" ").toUpperCase()}</b> table.</div>

            </div>
            </label>


    </li> 
    )}
    </ul>
    </div>
    </div>


<div className="mt-9 py-4 bg-slate-200/60 w-10/12 flex flex-col items-center justify-center rounded-md">
<div className="block text-center w-full lg:flex items-center justify-center rounded-md">
You selected the&nbsp;<b>{reportInfo.reportData.fromTable ? reportInfo.reportData.fromTable.split("_").join(" ").toUpperCase() : "..."}</b>&nbsp;table in joint with the&nbsp;<b>{!!Object.keys(reportInfo.reportData.joins).length ? Object.keys(reportInfo.reportData.joins).map(j=>j.split("_").join(" ").toUpperCase()).map((t,i,arr)=> arr[i+1] ? t : " and " + t).join(", "): "..."}</b>&nbsp;
</div>
<div className="flex items-center text-center justify-center px-5 text-slate-200 w-fit bg-slate-500 rounded-full">
Now you can start building your report by checking the available variables (columns)
</div>
<Button disabled={!userInfo.connected} color="bg-slate-500 hover:bg-slate-500/90" btnFor="fetching" onClickFunc={()=>GETtablesVariables()} loading={loading.fetching} text="Check Available Columns" />
{error.fetching && 
<Error text={"Please select a table to see the avaialable columns."}/>
}
</div>

<div className="flex-col gap-3 mt-9 py-4 bg-slate-200/60 w-10/12 items-center justify-center rounded-md">
<div className="flex gap-3 py-2 mx-auto w-10/12 items-center justify-center rounded-md">
  {tablesVariables.available.filter((col1, i) => tablesVariables.available.findIndex((col2) => col1.tableName === col2.tableName) === i).reverse().map(col =>(

    <div key={col.tableName} className="flex items-center gap-1">
    <span className={`${col.bgColor} w-4 h-4 rounded shadow`}></span>
    <span className="capitalize">{col.tableName.split("_").join(" ")}</span>
    </div>


))
    }
      </div>
  <span className="hidden lg:block text-sm text-center px-6"><sup className="mx-1">1</sup><b>Colors:</b> the available variables are color labeled as below so you can pick a variable that belongs to the desired table easily.</span>
 
  <span className="block text-sm text-center px-6"><sup className="mx-1">2</sup><b>Relation Direction:</b> please note that the relations in the selected section is going from top to bottom. 
  <span className="block text-xs text-center px-6">(e.g. if you arranged the invoice ID column before the client ID that means the report will display clients regarding the invoices and not the other way around.)</span>
  </span>

  <span className="block text-sm text-center px-6"><sup className="mx-1">3</sup><b>Columns Features:</b> After you finish selecting/arranging your desired columns, click on the tiny gear icon on the selected section title to tweak columns configurations. 

  </span>
  <span className="block text-sm text-center px-6"><sup className="mx-1">4</sup><b>Rename Columns:</b> Rename a column by double clicking the column name. 
  <span className="block text-xs text-center px-6 italic">(No Empty Values Allowed)</span>

  </span>


      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex row w-11/12 mx-auto pb-8 pt-4 gap-x-4">
          <List title="Available Columns" onDragEnd={onDragEnd} name="available" availableColumnsLen={tablesVariables.available.length}>
            {/* <div className="relative w-full h-2">

            </div> */}
          {loading.fetching && <Spinner size={"w-20"} />}
              {tablesVariables.available.map((col:any, idx:number) => (
              <Draggable key={"available-"+col.alias+"_"+col.columnName} draggableId={col.columnName+ "-"+idx} index={idx}>
                {(
                  provided: DraggableProvided | any,
                  snapshot: DraggableStateSnapshot
                ) => (
                    <div
                      className="!h-fit"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Chip {...col} />
                    </div>
                )}
              </Draggable>
            ))
            }
          </List>
          <CardsList title="Selected Columns" onDragEnd={onDragEnd} name="selected" selectedColumnsLen={tablesVariables.selected.length}>
          {tablesVariables.selected.map((col, i:number) => (
              <Draggable draggableId={col.columnName+"-"+i} index={i} key={"selected-"+col.alias+"_"+col.columnName}>
                {(provided, snapshot) => (
                  <div
                  className="w-[40vw]"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card {...col} idx={i} />
                  </div>
                )}
              </Draggable>
            ))}
          </CardsList>
        </div>

      </DragDropContext>
{
  !clipboardValue && 
  <>
  <div className="my-3 w-5/12 flex flex-col gap-5 ">
  <svg width="100" viewBox="0 0 24 24" className="transform rotate-90 self-center fill-slate-600"><path  d="M4 15V9h8V4.16L19.84 12L12 19.84V15H4Z"/></svg>

      { error.reportTitle && <Error text={"Please give a title to your report."}/> }
    <input type="text" id="default-input" value={reportInfo.reportData.reportTitle} onChange={(e:ChangeEvent<HTMLInputElement>)=>reportInfo.setReportData(prev=>({...prev, reportTitle: e.target.value}))}  placeholder="Give Your Report a Title" className="transition duration-200 placeholder:text-center bg-slate-100 ring-0 outline-0 shadow border-2 border-slate-300 text-center text-slate-700 font-bold text-sm rounded-lg  focus:border-slate-500/40 block w-full p-2.5"/>
</div>
      <Button disabled={!userInfo.connected} color="bg-emerald-600 hover:bg-emerald-600/90" btnFor="building" onClickFunc={()=>buildReport()} loading={loading.building} text="Build Report" /> 
</>
}
      {!!clipboardValue &&  <Button disabled={!userInfo.connected} color="bg-emerald-600 hover:bg-emerald-600/90" btnFor="go-to-reports" onClickFunc={()=>goToReport()} loading={loading.building} text="Go To Report" /> }
      {error.building && <Error text={"Please Select Columns to build the report."}/> }
      {error.creatingReport && <Error text={"Something wrong happened while building your report."}/> }

    </>
  );
};

export default Incorporate;
