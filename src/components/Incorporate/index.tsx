import Card from "../Card/index";
import Chip from "../Chip/index";
import List from "../List/index";
import { tables } from "../../data/tables"
// import { report } from "../../logic/report"
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { ChangeEvent, useCallback, useEffect, useState} from "react";
import { GET_tablesCols } from "../../api/api_funcs";
import type { RootObject, TreportVariables, TtablesObj } from "../../types/types";
import CardsList from "../CardsList";
import { Button } from "../Button";
// import {
//   useQuery,
// } from 'react-query'

// const allTables = () => {

    
//   const result = tables.map(async(table)=>( await GET_tablesCols({SUBDOMAIN, API_KEY, method, table})))
//   return result
// }

const expressions = [
  {label: "Greater Than", symbol: ">", val: "gt"},
  {label: "Greater Than or Equals", symbol: ">=", val: "gte"},
  {label: "Less Than", symbol: "<", val: "lt"},
  {label: "Less Than or Equals", symbol: "<=", val: "lte"},
  {label: "Equals", symbol: "=", val: "eq"},
]

type TtableVariables = {
  available: string[],
  selected: string[]
}

const Incorporate = () => {
const [tablesVariables, setTablesVariables] = useState<any>({available:[], selected: []})
// const [tablesVariables, setTablesVariables] = useState<TtableVariables>({available:[], selected: []})
// const [selectedTables, setSelectedTable] = useState<RootObject>({base_table:"", join_1: "", join_2: "", join_3: ""})
const [reportVariables, setReportVariables] = useState<TreportVariables>({joins:{}, conditions: [], report_title: "", from_table: ""})

  // const { status, data, error, isError, isLoading } = useQuery('TABLES_DATA',allTables)

// if (status === 'success') {
//   setTablesData({...tablesData, [table]: Object.keys(data.data[0] ?? {})})
//   console.log(status, tablesData)
// }

// const newFUNC = () => {

// }

//   const SUBDOMAIN: string = "taricov"
//   const API_KEY: string = "24b476fdd8aa43091e0963ba01b98762155c9dd4"
//   const method: string = "GET"
//   const tables: string[] = ["invoice", "product"]
//   tables.map(async(table) =>{
//     const data = await GET_tablesCols({SUBDOMAIN, API_KEY, method, table})
//     data.then(()=>setTablesData((prev:any)=>({...prev, [table]: Object.keys(data.data[0] ?? {})})))
//   })
// }
  // setTablesData({[table]: Object.keys(data?.data[0] || {})})
  // console.log(status, data)

  const [loading, setLoading] = useState<{[key:string]: boolean}>({fetching: false, building: false})
const GETtablesVariables = () => {
  setLoading((prev:{[key: string]: boolean})=>({...prev, fetching: true}))
  setTimeout(()=>setLoading((prev:{[key: string]: boolean})=>({...prev, fetching: false})),3000)
  const tables: string[]= [reportVariables.from_table, ...Object.keys(reportVariables.joins)]
  console.log(tables)
    const SUBDOMAIN: string = "taricov"
  const API_KEY: string = "24b476fdd8aa43091e0963ba01b98762155c9dd4"
  const method: string = "GET"
  tables.map(async(table) =>{
    GET_tablesCols({SUBDOMAIN, API_KEY, method, table}).then((data)=>{
      
      setTablesVariables((prev:any)=>({"available":[...prev.available,
        ...Object.keys(data.data[0]).map((b:string)=>({name:b, table})
      )], "selected": []}))
      // setTablesVariables(()=>({"available":[...Object.keys(data.data[0] ?? {})], "selected": []}))
    })
  })

  }

const buildReport = () => {
  setLoading((prev:{[key: string]: boolean})=>({...prev, building: true}))
  setTimeout(()=>setLoading((prev:{[key: string]: boolean})=>({...prev, building: false})),8000)
  // const redirectURL = ""
  // window.open(redirectURL.toString())
}

  const [conditions, setConditions] = useState<Object[]>([{first_table: "", expression:"", input_type: "", value: ""}])

const addMoreConditions = () => { 
setConditions((prev:any)=>[...prev, {first_table: "", expression:"", input_type: "", value: ""}])
}
  // const itemsNormal = {
  //   available: [
  //     {
  //       id: 1,
  //       uuid: "52f9df20-9393-4c4d-b72c-7bfa4398a4477",
  //       title: "What is Lorem Ipsum?",
  //       subtitle: "Lorem Ipsum is simply dummy",
  //       updatedAt: "6 days ago",
  //     },
  //     {
  //       id: 2,
  //       uuid: "52f9df20-9393-4c4d-b72c-7bfa4398a448",
  //       title: "Why do we use it?",
  //       subtitle: "The point of using at its layout",
  //       updatedAt: "2 days ago",
  //     },
  //     {
  //       id: 3,
  //       uuid: "52f9df20-9393-4c4d-b72c-7bfa4398a449",
  //       title: "Where does it come from?",
  //       subtitle: "Contrary to popular belief, Lorem Ipsum is not simply",
  //       updatedAt: "3 days ago",
  //     },
  //   ],

  //   assigned: [
  //     {
  //       id: 5,
  //       uuid: "52f9df20-9393-4c4d-b72c-7bfa4398a450",
  //       title: "Where can I get some?",
  //       subtitle: "There are many variations",
  //       updatedAt: "6 days ago",
  //     },
  //     {
  //       id: 6,
  //       uuid: "52f9df20-9393-4c4d-b72c-7bfa4398a451",
  //       title: "Morbi sagittis tellus a efficitur",
  //       subtitle: "Etiam mollis eros eget mi.",
  //       updatedAt: "2 days ago",
  //     },
  //   ],
  // };

  // const [items, setItems] = useState(itemsNormal);

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

const selectJoinRelation = (e: ChangeEvent<HTMLInputElement>) => {
  setReportVariables((prev:TreportVariables)=> ({...prev, joins: {...prev.joins, [e.target.value]: e.target.id.split("-")[0]}})) 
  // setReportVariables((prev:TreportVariables)=> ({...prev, joins: {...prev.joins, [e.target.value.split("-")[0]]: e.target.value.split("-")[1]}})) 
}

useEffect(() => {
      console.log(tablesVariables)
      console.log(reportVariables)
      console.log(conditions)

},[reportVariables, tablesVariables, conditions])
  return (
    <>
<div className="w-[100%] m-auto flex justify-center items-center gap-4">
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

    <svg width="100" viewBox="0 0 24 24" className="fill-slate-600"><path  d="M4 15V9h8V4.16L19.84 12L12 19.84V15H4Z"/></svg>

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



            {/* relations */}
            <div className="flex flex-col items-center justify-center">
            <input type="radio" name={"join-rel-"+table} required={true}  checked={reportVariables.joins[table] === "outer"} disabled={!Object.keys(reportVariables.joins).includes(table)} id={"outer-"+table} value={table} onChange={selectJoinRelation} className="hidden disabled peer" />
        <label htmlFor={"outer-"+table} className="peer-disabled:opacity-50 inline-flex items-center justify-between p-[4px] text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-slate-600 peer-checked:text-slate-200 hover:text-gray-600 dark:peer-checked:text-gray-300 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
  
            <svg className="fill-slate-600"  width="20" viewBox="0 0 24 24"><path fill="currentColor" d="M9 5c1.04 0 2.06.24 3 .68c.94-.44 1.96-.68 3-.68a7 7 0 0 1 7 7a7 7 0 0 1-7 7c-1.04 0-2.06-.24-3-.68c-.94.44-1.96.68-3 .68a7 7 0 0 1-7-7a7 7 0 0 1 7-7m-.5 7c0 1.87.79 3.56 2.06 4.75l1-.46c-1.25-1-2.06-2.55-2.06-4.29c0-1.74.81-3.29 2.06-4.29l-1-.46A6.491 6.491 0 0 0 8.5 12m7 0c0-1.87-.79-3.56-2.06-4.75l-1 .46c1.25 1 2.06 2.55 2.06 4.29c0 1.74-.81 3.29-2.06 4.29l1 .46A6.491 6.491 0 0 0 15.5 12Z"/></svg>
            </label>
            <input type="radio" name={"join-rel-"+table} required={true}  checked={reportVariables.joins[table] === "left"} id={"left-"+table} value={table} onChange={selectJoinRelation} disabled={!Object.keys(reportVariables.joins).includes(table)} className="hidden disabled peer" />
        <label htmlFor={"left-"+table} className="peer-disabled:opacity-50 inline-flex items-center justify-between p-[4px] text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-slate-600 peer-checked:text-slate-200 hover:text-gray-600 dark:peer-checked:text-gray-300hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">  
            <svg className="fill-slate-600" width="20" viewBox="0 0 24 24"><path fill="currentColor" d="M9 5c1.04 0 2.06.24 3 .68c.94-.44 1.96-.68 3-.68a7 7 0 0 1 7 7a7 7 0 0 1-7 7c-1.04 0-2.06-.24-3-.68c-.94.44-1.96.68-3 .68a7 7 0 0 1-7-7a7 7 0 0 1 7-7m6 2l-1 .11c1.28 1.3 2 3.06 2 4.89c0 1.83-.72 3.59-2 4.9l1 .1a5 5 0 0 0 5-5a5 5 0 0 0-5-5m-6.5 5c0 1.87.79 3.56 2.06 4.75l1-.46c-1.25-1-2.06-2.55-2.06-4.29c0-1.74.81-3.29 2.06-4.29l-1-.46A6.491 6.491 0 0 0 8.5 12Z"/></svg>

            </label>
            <input type="radio" name={"join-rel-"+table} required={true} disabled={!Object.keys(reportVariables.joins).includes(table)} checked={reportVariables.joins[table] === "right"} id={"right-"+table} value={table} onChange={selectJoinRelation} className="hidden disabled peer" />
        <label htmlFor={"right-"+table} className="peer-disabled:opacity-50 inline-flex items-center justify-between p-[4px] text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-slate-600 peer-checked:text-slate-200 hover:text-gray-600 dark:peer-checked:text-gray-300hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">  
            <svg className="fill-slate-600"  width="20" viewBox="0 0 24 24"><path fill="currentColor" d="M15 19c-1.04 0-2.06-.24-3-.68c-.94.44-1.96.68-3 .68a7 7 0 0 1-7-7a7 7 0 0 1 7-7c1.04 0 2.06.24 3 .68c.94-.44 1.96-.68 3-.68a7 7 0 0 1 7 7a7 7 0 0 1-7 7m-6-2l1-.11c-1.28-1.3-2-3.06-2-4.89c0-1.83.72-3.59 2-4.9L9 7a5 5 0 0 0-5 5a5 5 0 0 0 5 5m6.5-5c0-1.87-.79-3.56-2.06-4.75l-1 .46c1.25 1 2.06 2.55 2.06 4.29c0 1.74-.81 3.29-2.06 4.29l1 .46A6.491 6.491 0 0 0 15.5 12Z"/></svg>
            </label>
            <input type="radio" name={"join-rel-"+table} disabled={!Object.keys(reportVariables.joins).includes(table)} required={true}  checked={reportVariables.joins[table] === "inner"} id={"inner-"+table} value={table} onChange={selectJoinRelation} className="hidden disabled peer" />
        <label htmlFor={"inner-"+table} className="peer-disabled:opacity-50 inline-flex items-center justify-between p-[4px] text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-slate-600 peer-checked:text-slate-200 hover:text-gray-600 dark:peer-checked:text-gray-300hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">  
            <svg className="fill-slate-600"  width="20" viewBox="0 0 24 24"><path fill="currentColor" d="M9 5a7 7 0 0 0-7 7a7 7 0 0 0 7 7c1.04 0 2.06-.24 3-.68c.94.44 1.96.68 3 .68a7 7 0 0 0 7-7a7 7 0 0 0-7-7c-1.04 0-2.06.24-3 .68c-.94-.44-1.96-.68-3-.68m0 2c.34 0 .67.03 1 .1c-1.28 1.31-2 3.07-2 4.9c0 1.83.72 3.59 2 4.89c-.33.07-.66.11-1 .11a5 5 0 0 1-5-5a5 5 0 0 1 5-5m6 0a5 5 0 0 1 5 5a5 5 0 0 1-5 5c-.34 0-.67-.03-1-.1c1.28-1.31 2-3.07 2-4.9c0-1.83-.72-3.59-2-4.89c.33-.07.66-.11 1-.11Z"/></svg>

            </label>
            </div>
    
    </li>
    ))}
    </ul>
    </div>


<div className="mt-9">
<Button color="bg-slate-500 hover:bg-slate-500/90" btnFor="fetching" onClickFunc={()=>GETtablesVariables()} loading={loading.fetching} text="Check Available Columns" />
</div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex row w-full p-12 gap-x-4">
          <List title="Available Columns" onDragEnd={onDragEnd} name="available">
            {
              tablesVariables.available.map((v:any,i:number) =>(
              <Draggable key={v.table+"-"+v.name} draggableId={v+ "-"+i} index={i}>
                {(
                  provided: DraggableProvided | any,
                  snapshot: DraggableStateSnapshot
                ) => (
                  <div>
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Chip text={v.table+"-"+v.name} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))
            }
          </List>
          <CardsList title="Selected Columns" onDragEnd={onDragEnd} name="assigned">
            {Object.values(tablesVariables.selected).map((v, i) => (
              <Draggable draggableId={v+"-"+i} index={i} key={"selected-"+v}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {/* <Card text={v.name} /> */}
                  </div>
                )}
              </Draggable>
            ))}
          </CardsList>
        </div>

      </DragDropContext>


      <h3 className="text-xl font-bold">Add Conditions</h3>
        <ul className="w-10/12">
          {conditions.map((c:any, i:number)=> (

     <li key={"key-"+i} className="relative flex w-full justify-around py-4 px-8 mb-2 text-slate-800 bg-slate-300 mx-auto rounded-lg dark:bg-gray-800 dark:text-blue-400">
      <button id={JSON.stringify(i)} className="absolute p-1 top-2 left-2 cursor-pointer bg-slate-500/30 hover:bg-slate-500/70 transition duration-150 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" className="" width="15"  viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg></button>
<div>
        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Column</label>
<select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
  <option selected>Choose Table</option>           
{tablesVariables.selected?.map((col:{[key:string]:string}) => <option value={col.val}>{col.name}</option>)}
</select>
</div>

<div>
<label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Expression</label>
<select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
  <option selected>Choose Expression</option>
  {expressions.map(ex => <option value={ex.val}>{ex.label}</option>)}
  <option value="US">f</option>
</select>
</div>
<div>
<label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Input Type</label>
<select id="countries" onChange={(e:ChangeEvent<HTMLSelectElement>)=>setConditions((prev:any)=>conditions.map((con:any, ci)=>ci === i ? {...prev, input_type: e.target.value}: {...con}))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
  <option selected>Choose Input Type</option>
  <option value="text">Text</option>
  <option value="number">Number</option>
  <option value="date">Date</option>
</select>
</div>
<div>
            <label htmlFor="expreassion_value" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Value</label>
            <input type={c.input_type} onChange={()=>""} id="expreassion_value" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="New Value" required/>
        </div>
</li>
))
}
        </ul>
        <div className="w-10/12">

<button onClick={()=>addMoreConditions()} className="underline text-blue-600 ">Add more conditions</button>
        </div>

      <Button color="bg-emerald-600 hover:bg-emerald-600/90" btnFor="building" onClickFunc={()=>buildReport()} loading={loading.building} text="Build Report" /> 
    </>
  );
};

export default Incorporate;
