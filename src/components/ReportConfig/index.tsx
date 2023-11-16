import { Switch } from "@mantine/core";
import { TreportConfig } from "../../types/types";
import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import AnimateHeight from "react-animate-height";
import { ReportContext } from "../../App";



export const ReportConfig = ({config, setConfig}: {config:TreportConfig, setConfig: Dispatch<SetStateAction<TreportConfig>>}) => {
  
  const reportInfo = useContext(ReportContext)

  // const AppSwitch = ({stateProp, label}:any)=> {
  //   return(
  //         <Switch checked={stateProp} label={label} onChange={(e:ChangeEvent<HTMLInputElement>)=>setConfig(prev=>({...prev, stateProp: e.target.checked}))} labelPosition="left" size="sm" onLabel="ON" offLabel="OFF" />
  //   )
  // }

  useEffect(()=>{
    reportInfo.setReportData(prev=>({...prev, reportConfig: config}))
  },[config])

  const toggleAdvancedFilters = (e:ChangeEvent<HTMLInputElement>) =>{
    e.target.checked ? setConfig(prev=>({...prev, advancedColumnFilters: e.target.checked, basicColumnFilters: true})) : setConfig(prev=>({...prev, advancedColumnFilters: e.target.checked}))
  }
  const toggleColumnsGrouping = (e:ChangeEvent<HTMLInputElement>) =>{
    e.target.checked ? setConfig(prev=>({...prev, columnGrouping: e.target.checked, columnReorder: true})) : setConfig(prev=>({...prev, columnGrouping: e.target.checked}))
  }

  const [height, setHeight] = useState<string | number | any>(0);

  return (
    <div className="w-full mt-40">
      <div className="mx-auto shadow-md w-fit text-slate-100 rounded-md bg-slate-600">
    <button 
    onClick={() => setHeight(height === 0 ? 'auto' : 0)}
    className="px-10 py-3 mx-auto text-center leading-4 text-2xl">
      <div className="font-bold">
        Table Settings
        </div>
    <span className="text-xs text-center">
      (Click to show settings)
      </span>
    </button>
      </div>
      <AnimateHeight
        id="example-panel"
        duration={500}
        height={height} // see props documentation below
      >
    <div className={`py-4 px-10 mx-auto bg-slate-200/60 w-10/12 flex flex-col items-center justify-center rounded-md`}>
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
      </AnimateHeight>
    </div>

  );
};

