import { Checkbox } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import { ReportContext } from "../../App";
import { ColumnsSettings } from "../ColumnsSettings";
import { TtableVariables } from "../../types/types";

const Card = ({...colData}: any) => {
 
  const [tableTitle, setTableTitle] = useState<string>(colData.columnName);
  const [currency, setCurrency] = useState<boolean>(false);
  const [editTableTitle, setEditTableTitle] = useState<boolean>(false);
  const [height, setHeight] = useState<string | number | any>(0);
  const reportInfo = useContext(ReportContext)

  useEffect(() => {
    if(tableTitle.length < 1) setEditTableTitle(true)
  },[tableTitle])

  const changeTableTitle = (e:any) =>{
    setTableTitle(e.target.value)

    reportInfo.setReportData(prev =>(
      {...prev, columnsSettings: [...prev.columnsSettings.map(column =>
          column.accessorKey === column.alias+"_"+colData.text
          ? {...column, header: e.target.value} 
          : {...column}
      )]}
      ))

  }
  return (
    <div className="relative shadow-lg flex w-full cursor-pointer">
      <button onClick={()=>setHeight(()=> height === 0 ? "auto" : 0 )} className="absolute top-0 right-0 transform translate-y-0 translate-x-0 transiton hover:bg-slate-400/20 hover:shadow duration-200 fill-slate-700 rounded-md rounded-tl-none rounded-br-none px-[6px] py-[3px]">
      <svg className="w-4" viewBox="0 0 24 24"><title>cogs</title><path d="M15.9,18.45C17.25,18.45 18.35,17.35 18.35,16C18.35,14.65 17.25,13.55 15.9,13.55C14.54,13.55 13.45,14.65 13.45,16C13.45,17.35 14.54,18.45 15.9,18.45M21.1,16.68L22.58,17.84C22.71,17.95 22.75,18.13 22.66,18.29L21.26,20.71C21.17,20.86 21,20.92 20.83,20.86L19.09,20.16C18.73,20.44 18.33,20.67 17.91,20.85L17.64,22.7C17.62,22.87 17.47,23 17.3,23H14.5C14.32,23 14.18,22.87 14.15,22.7L13.89,20.85C13.46,20.67 13.07,20.44 12.71,20.16L10.96,20.86C10.81,20.92 10.62,20.86 10.54,20.71L9.14,18.29C9.05,18.13 9.09,17.95 9.22,17.84L10.7,16.68L10.65,16L10.7,15.31L9.22,14.16C9.09,14.05 9.05,13.86 9.14,13.71L10.54,11.29C10.62,11.13 10.81,11.07 10.96,11.13L12.71,11.84C13.07,11.56 13.46,11.32 13.89,11.15L14.15,9.29C14.18,9.13 14.32,9 14.5,9H17.3C17.47,9 17.62,9.13 17.64,9.29L17.91,11.15C18.33,11.32 18.73,11.56 19.09,11.84L20.83,11.13C21,11.07 21.17,11.13 21.26,11.29L22.66,13.71C22.75,13.86 22.71,14.05 22.58,14.16L21.1,15.31L21.15,16L21.1,16.68M6.69,8.07C7.56,8.07 8.26,7.37 8.26,6.5C8.26,5.63 7.56,4.92 6.69,4.92A1.58,1.58 0 0,0 5.11,6.5C5.11,7.37 5.82,8.07 6.69,8.07M10.03,6.94L11,7.68C11.07,7.75 11.09,7.87 11.03,7.97L10.13,9.53C10.08,9.63 9.96,9.67 9.86,9.63L8.74,9.18L8,9.62L7.81,10.81C7.79,10.92 7.7,11 7.59,11H5.79C5.67,11 5.58,10.92 5.56,10.81L5.4,9.62L4.64,9.18L3.5,9.63C3.41,9.67 3.3,9.63 3.24,9.53L2.34,7.97C2.28,7.87 2.31,7.75 2.39,7.68L3.34,6.94L3.31,6.5L3.34,6.06L2.39,5.32C2.31,5.25 2.28,5.13 2.34,5.03L3.24,3.47C3.3,3.37 3.41,3.33 3.5,3.37L4.63,3.82L5.4,3.38L5.56,2.19C5.58,2.08 5.67,2 5.79,2H7.59C7.7,2 7.79,2.08 7.81,2.19L8,3.38L8.74,3.82L9.86,3.37C9.96,3.33 10.08,3.37 10.13,3.47L11.03,5.03C11.09,5.13 11.07,5.25 11,5.32L10.03,6.06L10.06,6.5L10.03,6.94Z" /></svg>
</button>
      <main className={`py-3 rounded-md shadow px-5 rounded-r-md w-full text-black ${colData.bgColor}`}>
        <span className="flex flex-row justify-between">
        <sub className="">{colData.idx+1}</sub>
        </span>
        <div className="flex align-center justify-center">
        { editTableTitle ?
        <input
            className="rounded-md block bg-slate-100/20 underline text-center outline-0 border-0 mx-auto"
            type="text"
            value={tableTitle}
            onChange={changeTableTitle}
            onBlur={()=>setEditTableTitle(tableTitle.length < 1 ? true : false)}
            onKeyDown={(e:React.KeyboardEvent)=>setEditTableTitle(()=>{
            if(tableTitle.length < 1) return true;
              return e.code === "Enter" ? false : true
            })}
            autoFocus
          />
          :
        <h1 onDoubleClick={()=>setEditTableTitle(true)} className="font-bold text-md text-center capitalize">
          {tableTitle.split("_").join(" ")}</h1>
          }
          <span className="italic text-[10px] text-slate-700/60 self-end">{colData.isNull ? "(empty)" : ""}</span>
          </div>
          {tableTitle.length < 1 && <div className="rounded-md text-slate-100 bg-red-600 px-3 py-1 text-[9px] text-center mt-1">Table Title can not set empty.</div>}
      <AnimateHeight
        id="column-settings"
        duration={500}
        height={height}
      >
        <Checkbox className="" classNames={{root:"my-1 opacity-50",label:"px-2 text-slate-900", input:"!border-slate-500 checked:bg-slate-700 border-2 bg-transparent disabled:bg-transparent"}} disabled={true} checked={currency} onChange={(event) => setCurrency(event.currentTarget.checked)} label="Currency?"/>
        <ColumnsSettings id={colData.alias+"_"+colData.columnName} />
      </AnimateHeight>
      </main>
      
    </div>
  );
};

export default Card;
