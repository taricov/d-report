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

const Incorporate = () => {
  const userStatus = useContext(UserContext)
  const [loading, setLoading] = useState<Tloading>({fetching: false, building: false})
  const [error, setErrors] = useState<TErrors>({fetching: "", building: ""})
  const [clipboardValue, setClipboardValue] = useState<string | null>(null)
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false)
const [tablesVariables, setTablesVariables] = useState<TtableVariables>({available:[], selected: []})
const [reportVariables, setReportVariables] = useState<TreportVariables>({joins:{}, report_title: "", from_table: ""})



const GETtablesVariables = async () => {
  setTablesVariables({available:[], selected: []})
  setErrors((prev:any) => ({...prev, fetching: ""}))
  const allVars: string[] = []
  setLoading((prev:Tloading) => ({...prev, fetching: true}))


  const tables: string[]= [reportVariables.from_table, ...Object.keys(reportVariables.joins)]
  console.log(tables)
  const subdomain: string = "taricov"
  const apikey: string = "24b476fdd8aa43091e0963ba01b98762155c9dd4"
  const method: string = "GET"

  return await Promise.all(tables.map(async(table) =>{
    const res = await GET_tablesCols({subdomain, apikey, method, table})
    const data = await res.json()
    console.log(data)
    allVars.push(...Object.keys(data.data[0]))
  })
  ).then(() => {
    console.log(allVars)
    setTablesVariables((prev:any)=>({"available":[...prev.available,
      ...allVars.map((b:string)=>({title:b})
    )], "selected": []}))
  setLoading((prev:Tloading) => ({...prev, fetching: false}))
  
}).catch(err => {
  console.log("catched", err)
  if(err.message === "Failed to fetch") setErrors((prev:any) => ({...prev, fetching: "Please Select A Table to See Avaialable Columns."}))
  setLoading((prev:Tloading) => ({...prev, fetching: false}))
  });


  }

  const goToReport = async () => {
    window.open("/reports")
    setClipboardValue(null)
}

const buildReport = () => {
  
  setLoading(prev=>({...prev, building: true}))
  const baseURL = "http://localhost:8080/reports/"
  const reportID = "2"

return new Promise((resolve, reject) => {
  setErrors(prev=>({...prev, building: ""}))
  try {
    setTimeout(async()=>{
      if(tablesVariables.selected.length < 1) {
        setErrors(prev=>({...prev, building: "Please Select Columns to build the report."}))
        setLoading(prev=>({...prev, building: false}))
        reject("fuck");  
        return;
      }
      await navigator.clipboard.writeText(baseURL + reportID);
      resolve(baseURL + reportID)
    },2000)
  }
  catch (err) {
    console.error('Failed to copy: ', err);
  }
}).then((data)=>{
  setClipboardValue(data as string)
  console.log("clipboard val: ", clipboardValue)
  setLoading(prev=>({...prev, building: false}))

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

},[reportVariables, tablesVariables])
  return (
    <>
    <SnackBar showMe={showSnackBar} body={<><span className="font-medium">Successful Build!</span> Report URL is Copied to Clipbaord!</>}/>
<div className="w-[100%] m-auto flex justify-center items-start gap-4">
<ul className="flex flex-col gap-2 w-[40%]">
  <h2 className="bg-slate-500/30 m-auto rounded-md w-fit px-5 py-3 font-bold text-slate-600">Select 1st Table</h2>
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

    <svg width="100" viewBox="0 0 24 24" className="self-center fill-slate-600"><path  d="M4 15V9h8V4.16L19.84 12L12 19.84V15H4Z"/></svg>


<ul className="flex flex-col gap-2 w-[40%]">
<h2 className="bg-slate-500/30 m-auto rounded-md w-fit px-5 py-3 font-bold text-slate-600">Select Tables To Join</h2>
  
    {tables[reportVariables?.from_table]?.rels.map((table, idx) =>(
<li key={idx} className="flex">
        <input type="checkbox" checked={Object.keys(reportVariables.joins).includes(table)} id={table} value={table} onChange={selectJoinTable} className="hidden peer" />
        <label htmlFor={table} className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-slate-600 peer-checked:text-slate-200 hover:text-gray-600 dark:peer-checked:text-gray-300hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
            <div className="block">
                <div className="w-full text-lg font-semibold capitalize">{table.split("_").join(" ")}</div>
                <div className="w-full text-xs">Join the <b>{reportVariables.from_table.split("_").join(" ").toUpperCase()}</b> table with the <b>{table.split("_").join(" ").toUpperCase()}</b> table.</div>

            </div>
            </label>


    </li> 
    ))}
    </ul>
    </div>


<div className="mt-9 py-4 bg-slate-200/60 w-10/12 flex flex-col items-center justify-center rounded-md">
<div className="w-full flex items-center justify-center rounded-md">
You selected the&nbsp;<b>{reportVariables.from_table ? reportVariables.from_table.split("_").join(" ").toUpperCase() : "..."}</b>&nbsp;table in joint with the&nbsp;<b>{!!Object.keys(reportVariables.joins).length ? Object.keys(reportVariables.joins).map(j=>j.split("_").join(" ").toUpperCase()).map((t,i,arr)=> arr[i+1] ? t : " and " + t).join(", "): "..."}</b>&nbsp;
</div>
<div className="flex items-center justify-center px-5 text-slate-200 w-fit bg-slate-500 rounded-full">
Now you can start building your report by checking the available variables (columns)
</div>
<Button disabled={!userStatus.connected} color="bg-slate-500 hover:bg-slate-500/90" btnFor="fetching" onClickFunc={()=>GETtablesVariables()} loading={loading.fetching} text="Check Available Columns" />
{error.fetching !== "" && 
<Error text={error.fetching}/>
}
</div>



      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex row w-full p-12 gap-x-4">
          <List title="Available Columns" onDragEnd={onDragEnd} name="available">
          {loading.fetching && <Spinner size={"w-20"} />}
              {tablesVariables.available.map((v:any, i:number) => (
              // {tablesVariables.available.map((v:any,i:number) =>(
              <Draggable key={v.title+"-"+i} draggableId={v.title+ "-"+i} index={i}>
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
                      <Chip text={v.title} />
                    </div>
                )}
              </Draggable>
            ))
            }
          </List>
          <CardsList title="Selected Columns" onDragEnd={onDragEnd} name="selected">
          {tablesVariables.selected.map((v, i) => (
              <Draggable draggableId={v.title+"-"+i} index={i} key={"selected-"+v.title}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card text={v.title} />
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
      <Button disabled={!userStatus.connected} color="bg-emerald-600 hover:bg-emerald-600/90" btnFor="building" onClickFunc={()=>buildReport()} loading={loading.building} text="Build Report" /> 
}
      {!!clipboardValue && <Button disabled={!userStatus.connected} color="bg-emerald-600 hover:bg-emerald-600/90" btnFor="go-to-reports" onClickFunc={()=>goToReport()} loading={loading.building} text="Go To Reports" /> }
      {error.building && <Error text={error.building}/>}

    </>
  );
};

export default Incorporate;
