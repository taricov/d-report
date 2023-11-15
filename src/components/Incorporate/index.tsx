import { tables } from "../../data/tables";
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
import { GET_tablesCols } from "../../api/api_funcs";
import type { Tloading, TreportVariables, TtableVariables, TErrors } from "../../types/types";
import { Button } from "../Button";
import CardsList from "../CardsList";
import Spinner from "../Spinner";
import Error from "../Error";
import SnackBar from "../SanckBar";
import { UserContext } from "../../App";
import { colors } from "../../data/colors";
import { table } from "console";


const Incorporate = () => {
  const userStatus = useContext(UserContext)
  const [loading, setLoading] = useState<Tloading>({fetching: false, building: false})
  const [error, setErrors] = useState<TErrors>({fetching: false, reportTitle: false, building: false})
  const [clipboardValue, setClipboardValue] = useState<string | null>(null)
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false)
const [tablesVariables, setTablesVariables] = useState<TtableVariables>({available:[], selected: []})
const [reportVariables, setReportVariables] = useState<TreportVariables>({joins:{}, report_title: "", from_table: ""})
const [selectedTablesRows, setSelectedTablesRows] = useState<any>()
const [joinedTable, setJoinedTable] = useState<any>()


const userInfo = useContext(UserContext)

const colorRandomizer = () => {
  return colors[Math.floor(Math.random()*colors.length)]
}

const GETtablesVariables = async () => {
  setTablesVariables({available:[], selected: []})
  setErrors((prev:any) => ({...prev, fetching: false}))
  let allVars: any = []
  setLoading((prev:Tloading) => ({...prev, fetching: true}))


  const tables: string[]= [reportVariables.from_table, ...Object.keys(reportVariables.joins)]
  console.log(tables)
  // const subdomain: string = "taricov"
  // const apikey: string = "24b476fdd8aa43091e0963ba01b98762155c9dd4"
  // const method: string = "GET"

  return await Promise.all(tables.map(async(table) =>{
    const res = await GET_tablesCols({subdomain: userInfo.siteData.subdomain, apikey: userInfo.siteData.apikey, table})
    const data = await res.json()
    console.log(data)
  const currentColor: string = colorRandomizer()
    allVars = [...allVars, ...Object.keys(data.data[0]).map(c=>({columnName: c, tableName: table, bgColor: currentColor}))]

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
    window.open("/reports")
    setClipboardValue(null)
}

const merge2Tables = async (foreignKey: string, table1:any, table2:any) => {
  setJoinedTable(()=>table1.map((row1:any) => ({...row1, ...table2.find((row2:any)=> row2[foreignKey] === row1.id)})))
  console.log("merge2Tables", joinedTable)
// return table1.map((item:any, i:number) => Object.assign({}, item, table2[i]));
}

const buildReport = async (allSelected: any) => {
  setErrors(({fetching: false, building: false, reportTitle: false})); 
  setLoading(prev=>({...prev, building: true}))
  if(tablesVariables.selected.length < 1) {
    setErrors(prev=>({...prev, building: true}))
    setLoading(prev=>({...prev, building: false}))
    return;
  }
  if(!reportVariables.report_title.length) {
    setErrors(prev=>({...prev, reportTitle: true})); 
    setLoading(prev=>({...prev, building: false}))
    return;
}
  let tablesData: any = {}
  const baseURL = "http://localhost:8080/reports/"
  const reportID = "2"
  const requiredTables: any[] = [...new Set(allSelected.map((selected: any) => selected.tableName))]
  const foreignKey = tables[requiredTables[0] as string]["foreign_key"]
  console.log(foreignKey)
        
      //build the report
  
      // const requiredTables = [...new Map(allSelected.map((selected:any)=>[selected["tableName"], selected])).values()];
      return await Promise.all(
        requiredTables.map(async(table:any, i:number)=>{
        const res: Response = await GET_tablesCols({subdomain: userInfo.siteData.subdomain, apikey: userInfo.siteData.apikey, table, limit:1000})
        const dataJSON = await res.json();
        tablesData[table] = dataJSON.data
      })).then(() => {
        setSelectedTablesRows(tablesData)
        // console.log(Object.entries(selectedTablesRows)[0][1])
        const merged = merge2Tables(foreignKey, Object.entries(selectedTablesRows)[0][1], Object.entries(selectedTablesRows)[1][1])

      })


      // await navigator.clipboard.writeText(baseURL + reportID)
      // resolve(baseURL + reportID)
//   .catch (err) {
//     console.error('Failed to copy: ', err);
//   }
// })
.then((data)=>{
  // setClipboardValue(data as string)
  console.log("clipboard val: ", clipboardValue)
  setLoading(prev=>({...prev, building: false}))
setReportVariables(prev=>({...prev, report_title: ""}))
  setShowSnackBar(true)
  setTimeout(()=>{
    setShowSnackBar(false)
  },3000)
})

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
      console.log(result);
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
    console.log("result",result.destination);

    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );
    setTablesVariables(listCopy);

  };
const selectTable = (e: ChangeEvent<HTMLInputElement>) => {
setReportVariables((prev:any)=> ({...prev, joins: {}, from_table: e.target.value}))
}



const selectJoinTable = (e: ChangeEvent<HTMLInputElement>) => {
  
  if(e.target.checked) {
  setReportVariables((prev:TreportVariables)=> ({...prev, joins: {...prev.joins, [e.target.value]: "left"}})) }
  else{ 
    // const {[e.target.value], ...rest} = reportVariables.joins
    delete reportVariables.joins[e.target.value]
    setReportVariables((prev:TreportVariables)=> ({...prev, joins:reportVariables.joins
      // {...prev.joins.filter((j:string)=> j !== e.target.value)}
    }))
  }
}

useEffect(() => {
      console.log(tablesVariables)
      console.log(reportVariables)
      console.log(selectedTablesRows)
      console.log("joind", joinedTable)


},[reportVariables, tablesVariables, selectedTablesRows, joinedTable])
  return (
    <>
    <SnackBar showMe={showSnackBar} body={<><span className="font-medium">Successful Build!</span> Report URL is Copied to Clipbaord!</>}/>
<div className="w-[100%] m-auto flex justify-center items-start gap-1">
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
                {reportVariables.from_table === table[0] && <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24"><path fill="currentColor" d="m9 20.42l-6.21-6.21l2.83-2.83L9 14.77l9.88-9.89l2.83 2.83L9 20.42Z"/></svg>
}
        </label>
    </li>
    ))}
    </ul>
    </div>
    <svg width="100" viewBox="0 0 24 24" className="self-center fill-slate-600"><path  d="M4 15V9h8V4.16L19.84 12L12 19.84V15H4Z"/></svg>

<div className="flex flex-col">
<h2 className="bg-slate-500/30 m-auto shadow rounded-md w-fit px-5 py-3 font-bold text-slate-600">Select Tables To Join</h2>
<ul className="flex flex-col gap-2 min-w-full overflow-scroll h-[500px] border rounded-md px-3 py-4">
  
    {tables[reportVariables?.from_table]?.rels.map((rel, idx) =>
<li key={idx} className="flex">
        <input type="checkbox" data-foreignkey={rel.foreign_key} checked={Object.keys(reportVariables.joins).includes(rel.table)} id={rel.table} value={rel.table} onChange={selectJoinTable} className="hidden peer" />
        <label htmlFor={rel.table} className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-slate-600 peer-checked:text-slate-200 hover:text-gray-600 dark:peer-checked:text-gray-300hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
            <div className="block">
                <div className="w-full text-lg font-semibold capitalize">{rel.table.split("_").join(" ")}</div>
                <div className="w-full text-xs">Join the <b>{reportVariables.from_table.split("_").join(" ").toUpperCase()}</b> table with the <b>{rel.table.split("_").join(" ").toUpperCase()}</b> table.</div>

            </div>
            </label>


    </li> 
    )}
    </ul>
    </div>
    </div>


<div className="mt-9 py-4 bg-slate-200/60 w-10/12 flex flex-col items-center justify-center rounded-md">
<div className="w-full flex items-center justify-center rounded-md">
You selected the&nbsp;<b>{reportVariables.from_table ? reportVariables.from_table.split("_").join(" ").toUpperCase() : "..."}</b>&nbsp;table in joint with the&nbsp;<b>{!!Object.keys(reportVariables.joins).length ? Object.keys(reportVariables.joins).map(j=>j.split("_").join(" ").toUpperCase()).map((t,i,arr)=> arr[i+1] ? t : " and " + t).join(", "): "..."}</b>&nbsp;
</div>
<div className="flex items-center justify-center px-5 text-slate-200 w-fit bg-slate-500 rounded-full">
Now you can start building your report by checking the available variables (columns)
</div>
<Button disabled={!userStatus.connected} color="bg-slate-500 hover:bg-slate-500/90" btnFor="fetching" onClickFunc={()=>GETtablesVariables()} loading={loading.fetching} text="Check Available Columns" />
{error.fetching && 
<Error text={"Please Select A Table to See Avaialable Columns."}/>
}
</div>

<div className="flex-col gap-3 mt-9 py-4 bg-slate-200/60 w-10/12 items-center justify-center rounded-md">
<div className="flex gap-3 py-2 mx-auto w-10/12 items-center justify-center rounded-md">
  {tablesVariables.available.filter((col1, i) => tablesVariables.available.findIndex((col2) => col1.tableName === col2.tableName) === i).reverse().map(col =>(

    <div className="flex items-center gap-1">
    <span className={`${col.bgColor} w-4 h-4 rounded shadow`}></span>
    <span className="capitalize">{col.tableName.split("_").join(" ")}</span>
    </div>


))
    }
      </div>
  <span className="block text-sm text-center px-6"><sup className="mx-1">1</sup><b>color:</b> the available variables are color labeled as below so you can pick a variable that belongs to the desired table easily.</span>
  <span className="block text-sm text-center px-6"><sup className="mx-1">2</sup><b>Relation Direction:</b> please note that the relations in the selected section is going from top to bottom. <span className="block text-xs text-center px-6">(e.g. if you arranged the invoice ID column before the client ID that means the report will display clients regarding the invoices and not the other way around.)</span></span>


      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex row w-full pb-8 pt-4 gap-x-4">
          <List title="Available Columns" onDragEnd={onDragEnd} name="available">
          {loading.fetching && <Spinner size={"w-20"} />}
              {tablesVariables.available.map((col:any, idx:number) => (
              // {tablesVariables.available.map((v:any,i:number) =>(
              <Draggable key={col.columnName+"-"+idx} draggableId={col.columnName+ "-"+idx} index={idx}>
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
                      <Chip text={col.columnName} tableColor={col.bgColor} />
                    </div>
                )}
              </Draggable>
            ))
            }
          </List>
          <CardsList title="Selected Columns" onDragEnd={onDragEnd} name="selected">
          {tablesVariables.selected.map((col, i) => (
              <Draggable draggableId={col.columnName+"-"+i} index={i} key={"selected-"+col.columnName}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card text={col.columnName} bgColor={col.bgColor} idx={i} />
                    {/* <Card text={v.name} /> */}
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
    <input type="text" id="default-input" value={reportVariables.report_title} onChange={(e:ChangeEvent<HTMLInputElement>)=>setReportVariables(prev=>({...prev, report_title: e.target.value}))}  placeholder="Give Your Report a Title" className="transition duration-200 placeholder:text-center bg-slate-100 ring-0 outline-0 shadow border-2 border-slate-300 text-center text-slate-700 font-bold text-sm rounded-lg  focus:border-slate-500/40 block w-full p-2.5"/>
</div>
      <Button disabled={!userStatus.connected} color="bg-emerald-600 hover:bg-emerald-600/90" btnFor="building" onClickFunc={()=>buildReport(tablesVariables.selected)} loading={loading.building} text="Build Report" /> 
</>
}
      {!!clipboardValue &&  <Button disabled={!userStatus.connected} color="bg-emerald-600 hover:bg-emerald-600/90" btnFor="go-to-reports" onClickFunc={()=>goToReport()} loading={loading.building} text="Go To Reports" /> }
      {error.building && <Error text={"Please Select Columns to build the report."}/> }

    </>
  );
};

export default Incorporate;
