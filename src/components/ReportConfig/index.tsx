import { Switch } from "@mantine/core";
import { TreportConfig } from "../../types/types";
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";



export const ReportConfig = ({config, setConfig}: {config:TreportConfig, setConfig: Dispatch<SetStateAction<TreportConfig>>}) => {
  

  // const AppSwitch = ({stateProp, label}:any)=> {
  //   return(
  //         <Switch checked={stateProp} label={label} onChange={(e:ChangeEvent<HTMLInputElement>)=>setConfig(prev=>({...prev, stateProp: e.target.checked}))} labelPosition="left" size="sm" onLabel="ON" offLabel="OFF" />
  //   )
  // }

  useEffect(()=>{
    console.log(config)
  },[config])

  const toggleAdvancedFilters = (e:ChangeEvent<HTMLInputElement>) =>{
      setConfig(prev=>({...prev, advancedColumnFilters: e.target.checked, basicColumnFilters: true}))
  }
  const toggleColumnsGrouping = (e:ChangeEvent<HTMLInputElement>) =>{
          setConfig(prev=>({...prev, columnGrouping: e.target.checked, columnReorder: true}))
  }
  
  return (
    <div className="w-full mt-40">
      <div className="mx-auto shadow-md w-fit text-slate-100 rounded-md px-10 py-3 bg-slate-600">
    <h2 className="mx-auto text-center leading-5 text-2xl font-bold">
      Table Settings
    </h2>
    <span className="text-xs text-center">
      {/* (To Toggle The Search Bar) */}
      </span>
      </div>
    <div className="px-10 mx-auto mb-9 py-4 bg-slate-200/60 w-10/12 flex flex-col items-center justify-center rounded-md">
<ul className="flex flex-wrap gap-3 justify-center">
      <li className="min-w-md block px-4 py-2 bg-slate-300/50 rounded-md">
  {/* <AppSwitch label="Row Selection" stateProp={config.rowSelection}/> */}
          <Switch checked={config.rowSelection} label="Row Selection" onChange={(e:ChangeEvent<HTMLInputElement>)=>setConfig(prev=>({...prev, rowSelection: e.target.checked}))} labelPosition="left" size="sm" onLabel="ON" offLabel="OFF" />
  </li>
      <li className="min-w-md block px-4 py-2 bg-slate-300/50 rounded-md">
          <Switch checked={config.basicColumnFilters} label="Basic Column Filters" onChange={(e:ChangeEvent<HTMLInputElement>)=>setConfig(prev=>({...prev, basicColumnFilters: e.target.checked}))} labelPosition="left" size="sm" onLabel="ON" offLabel="OFF" />
    </li>
      <li className="min-w-md block px-4 py-2 bg-slate-300/50 rounded-md">
          <Switch checked={config.advancedColumnFilters} label="Advanced Column Filters" onChange={toggleAdvancedFilters} labelPosition="left" size="sm" onLabel="ON" offLabel="OFF" />
    </li>
      
      {/* <li className="min-w-md block px-4 py-2 bg-slate-300/50 rounded-md">
          <Switch checked={config.globalSearchBar} label="Global Search Bar" onChange={(e:ChangeEvent<HTMLInputElement>)=>setConfig(prev=>({...prev, globalSearchBar: e.target.checked}))} labelPosition="left" size="sm" onLabel="ON" offLabel="OFF" />
    </li> */}
    
      <li className="min-w-md block px-4 py-2 bg-slate-300/50 rounded-md">
          <Switch checked={config.columnReorder} label="Column Re-Order" onChange={(e:ChangeEvent<HTMLInputElement>)=>setConfig(prev=>({...prev, columnReorder: e.target.checked}))} labelPosition="left" size="sm" onLabel="ON" offLabel="OFF" />
    </li>

    <li className="min-w-md block px-4 py-2 bg-slate-300/50 rounded-md">
          <Switch checked={config.columnGrouping} label="Group By Column" onChange={toggleColumnsGrouping} labelPosition="left" size="sm" onLabel="ON" offLabel="OFF" />
    </li>
    <li className="min-w-md block px-4 py-2 bg-slate-300/50 rounded-md">
          <Switch checked={config.columnSorting} label="Sort Columns" onChange={(e:ChangeEvent<HTMLInputElement>)=>setConfig(prev=>({...prev, columnSorting: e.target.checked}))} labelPosition="left" size="sm" onLabel="ON" offLabel="OFF" />
    </li>
      <li className="min-w-md block px-4 py-2 bg-slate-300/50 rounded-md">
          <Switch checked={config.columnPinning} label="Pin Columns" onChange={(e:ChangeEvent<HTMLInputElement>)=>setConfig(prev=>({...prev, columnPinning: e.target.checked}))} labelPosition="left" size="sm" onLabel="ON" offLabel="OFF" />
    </li>
      </ul>
      </div>
    </div>

  );
};

