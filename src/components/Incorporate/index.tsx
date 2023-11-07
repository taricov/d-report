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
// import {
//   useQuery,
// } from 'react-query'

// const allTables = () => {

    
//   const result = tables.map(async(table)=>( await GET_tablesCols({SUBDOMAIN, API_KEY, method, table})))
//   return result
// }

const Incorporate = () => {
const [tablesData, setTablesData] = useState<TtablesObj>()
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

  const [loading, setLoading] = useState<boolean>(false)
const consoleData = () => {
  setLoading(true)
  setTimeout(()=>setLoading(false),3000)
}


  const itemsNormal = {
    available: [
      {
        id: 1,
        uuid: "52f9df20-9393-4c4d-b72c-7bfa4398a4477",
        title: "What is Lorem Ipsum?",
        subtitle: "Lorem Ipsum is simply dummy",
        updatedAt: "6 days ago",
      },
      {
        id: 2,
        uuid: "52f9df20-9393-4c4d-b72c-7bfa4398a448",
        title: "Why do we use it?",
        subtitle: "The point of using at its layout",
        updatedAt: "2 days ago",
      },
      {
        id: 3,
        uuid: "52f9df20-9393-4c4d-b72c-7bfa4398a449",
        title: "Where does it come from?",
        subtitle: "Contrary to popular belief, Lorem Ipsum is not simply",
        updatedAt: "3 days ago",
      },
    ],

    assigned: [
      {
        id: 5,
        uuid: "52f9df20-9393-4c4d-b72c-7bfa4398a450",
        title: "Where can I get some?",
        subtitle: "There are many variations",
        updatedAt: "6 days ago",
      },
      {
        id: 6,
        uuid: "52f9df20-9393-4c4d-b72c-7bfa4398a451",
        title: "Morbi sagittis tellus a efficitur",
        subtitle: "Etiam mollis eros eget mi.",
        updatedAt: "2 days ago",
      },
    ],
  };

  const [items, setItems] = useState(itemsNormal);

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
    const listCopy: any = { ...items };
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
    setItems(listCopy);
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
  console.log(e.target.value)
  setReportVariables((prev:TreportVariables)=> ({...prev, joins: {...prev.joins, [e.target.value.split("-")[0]]: e.target.value.split("-")[1]}})) 
}

useEffect(() => {
  console.log(reportVariables)

},[reportVariables])
  return (
    <>
<div className="w-[100%] m-auto flex justify-center items-center gap-4">
<ul className="flex flex-col gap-2 w-[40%]">
  <h2 className="bg-slate-500/30 m-auto rounded-md w-fit px-5 py-3 font-bold text-slate-600">Select 1st Table</h2>
    {Object.entries(tables).map((table, idx) =>(
<li key={idx}>
        <input name="from-table" type="radio" id={table[0]+"-"+idx} value={table[0]} onChange={selectTable} className="hidden peer" required={true} />
        <label htmlFor={table[0]+"-"+idx} className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-slate-600 peer-checked:text-slate-200 hover:text-gray-600 dark:peer-checked:text-gray-300  hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
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
            <input type="radio" name="join-rel" checked={reportVariables.joins[table] === "outer"} disabled={Object.keys(reportVariables.joins).includes(table)} id={"outer"} value={table+"-outer"} onChange={selectJoinRelation} className="hidden peer" />
        <label htmlFor={"outer"} className="inline-flex items-center justify-between p-[4px] text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-slate-600 peer-checked:text-slate-200 hover:text-gray-600 dark:peer-checked:text-gray-300hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
  
            <svg className="fill-slate-600"  width="20" viewBox="0 0 24 24"><path fill="currentColor" d="M9 5c1.04 0 2.06.24 3 .68c.94-.44 1.96-.68 3-.68a7 7 0 0 1 7 7a7 7 0 0 1-7 7c-1.04 0-2.06-.24-3-.68c-.94.44-1.96.68-3 .68a7 7 0 0 1-7-7a7 7 0 0 1 7-7m-.5 7c0 1.87.79 3.56 2.06 4.75l1-.46c-1.25-1-2.06-2.55-2.06-4.29c0-1.74.81-3.29 2.06-4.29l-1-.46A6.491 6.491 0 0 0 8.5 12m7 0c0-1.87-.79-3.56-2.06-4.75l-1 .46c1.25 1 2.06 2.55 2.06 4.29c0 1.74-.81 3.29-2.06 4.29l1 .46A6.491 6.491 0 0 0 15.5 12Z"/></svg>
            </label>
            <input type="radio" name="join-rel" checked={reportVariables.joins[table] === "left"} id={"left"} value={table+"-left"} onChange={selectJoinRelation} className="hidden peer" />
        <label htmlFor={"left"} className="inline-flex items-center justify-between p-[4px] text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-slate-600 peer-checked:text-slate-200 hover:text-gray-600 dark:peer-checked:text-gray-300hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">  
            <svg className="fill-slate-600" width="20" viewBox="0 0 24 24"><path fill="currentColor" d="M9 5c1.04 0 2.06.24 3 .68c.94-.44 1.96-.68 3-.68a7 7 0 0 1 7 7a7 7 0 0 1-7 7c-1.04 0-2.06-.24-3-.68c-.94.44-1.96.68-3 .68a7 7 0 0 1-7-7a7 7 0 0 1 7-7m6 2l-1 .11c1.28 1.3 2 3.06 2 4.89c0 1.83-.72 3.59-2 4.9l1 .1a5 5 0 0 0 5-5a5 5 0 0 0-5-5m-6.5 5c0 1.87.79 3.56 2.06 4.75l1-.46c-1.25-1-2.06-2.55-2.06-4.29c0-1.74.81-3.29 2.06-4.29l-1-.46A6.491 6.491 0 0 0 8.5 12Z"/></svg>

            </label>
            <input type="radio" name="join-rel" checked={reportVariables.joins[table] === "right"} id={"right"} value={table+"-right"} onChange={selectJoinRelation} className="hidden peer" />
        <label htmlFor={"right"} className="inline-flex items-center justify-between p-[4px] text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-slate-600 peer-checked:text-slate-200 hover:text-gray-600 dark:peer-checked:text-gray-300hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">  
            <svg className="fill-slate-600"  width="20" viewBox="0 0 24 24"><path fill="currentColor" d="M15 19c-1.04 0-2.06-.24-3-.68c-.94.44-1.96.68-3 .68a7 7 0 0 1-7-7a7 7 0 0 1 7-7c1.04 0 2.06.24 3 .68c.94-.44 1.96-.68 3-.68a7 7 0 0 1 7 7a7 7 0 0 1-7 7m-6-2l1-.11c-1.28-1.3-2-3.06-2-4.89c0-1.83.72-3.59 2-4.9L9 7a5 5 0 0 0-5 5a5 5 0 0 0 5 5m6.5-5c0-1.87-.79-3.56-2.06-4.75l-1 .46c1.25 1 2.06 2.55 2.06 4.29c0 1.74-.81 3.29-2.06 4.29l1 .46A6.491 6.491 0 0 0 15.5 12Z"/></svg>
            </label>
            <input type="radio" name="join-rel" checked={reportVariables.joins[table] === "inner"} id={"inner"} value={table+"-inner"} onChange={selectJoinRelation} className="hidden peer" />
        <label htmlFor={"inner"} className="inline-flex items-center justify-between p-[4px] text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:bg-slate-600 peer-checked:text-slate-200 hover:text-gray-600 dark:peer-checked:text-gray-300hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">  
            <svg className="fill-slate-600"  width="20" viewBox="0 0 24 24"><path fill="currentColor" d="M9 5a7 7 0 0 0-7 7a7 7 0 0 0 7 7c1.04 0 2.06-.24 3-.68c.94.44 1.96.68 3 .68a7 7 0 0 0 7-7a7 7 0 0 0-7-7c-1.04 0-2.06.24-3 .68c-.94-.44-1.96-.68-3-.68m0 2c.34 0 .67.03 1 .1c-1.28 1.31-2 3.07-2 4.9c0 1.83.72 3.59 2 4.89c-.33.07-.66.11-1 .11a5 5 0 0 1-5-5a5 5 0 0 1 5-5m6 0a5 5 0 0 1 5 5a5 5 0 0 1-5 5c-.34 0-.67-.03-1-.1c1.28-1.31 2-3.07 2-4.9c0-1.83-.72-3.59-2-4.89c.33-.07.66-.11 1-.11Z"/></svg>

            </label>
            </div>
    
    </li>
    ))}
    </ul>
    </div>

<div>

<button onClick={()=>consoleData()} type="button" className="text-white bg-[#2557D6] hover:bg-[#2557D6]/90  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center outline-none">
  {loading ? <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg> :
    <svg className="inline w-5 mr-3 text-white"  viewBox="0 0 24 24"><path fill="currentColor" d="M9 4h6v8h4.84L12 19.84L4.16 12H9V4Z"/></svg>
  }
  Check Available Columns
</button>


</div>


      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex row p-12">
          <List title="All Attrs" onDragEnd={onDragEnd} name="available">
          {/* {isLoading && <div>Loading...</div>}
          {isError && <div>{error}</div>} */}
          {/* {tablesData && 
          Object.keys(tablesData).forEach(tbl => {
              Object.values(tablesData[tbl]).map((prop, idx) =>(
              <Draggable key={tbl + "-" + prop} draggableId={prop + ""} index={idx}>
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
                      <Chip text={prop} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))
            })} */}
          </List>
          <List title="Used Attrs" onDragEnd={onDragEnd} name="assigned">
            {items.assigned.map((item, index) => (
              <Draggable draggableId={item.uuid} index={index} key={item.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card data={item} />
                  </div>
                )}
              </Draggable>
            ))}
          </List>
        </div>
      </DragDropContext>
    </>
  );
};

export default Incorporate;
