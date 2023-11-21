import { CheckIcon, Group, Radio } from '@mantine/core';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { ReportContext } from '../../App';
import {  TfilterVariant } from '../../types/types';

export const ColumnsSettings = ({id}:{id:string}) => {

  const reportInfo = useContext(ReportContext)
  const [filterMode, setFilterMode] = useState<TfilterVariant>("text");

  useEffect(() => {
  

    reportInfo.setReportData(prev=>({...prev, columnsSettings: [...reportInfo.reportData.selectedColumns.map(c=> c.columnName).map((header:string) => ({ 
      accessorKey: header,
      header: header
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(" "),
      filterVariant: "text" as TfilterVariant,
      size: 200}))]}))
  

  },[]);

  const changeColumnsSettings:any = (e:any) =>{
    setFilterMode(e)
    
    reportInfo.setReportData(prev=>({...prev, columnsSettings: [...prev.columnsSettings.map(s => s.accessorKey === id ? {...s, filterVariant: e} : {...s})]}))
    
  }

    return (

        <>
        <Radio.Group
        value={filterMode}
        onChange={changeColumnsSettings}
      name={id}
      label="Select Filter Mode:"
      description="How you will be able to filter on the column."
      classNames={{description:"text-slate-700"}}
    >
        <Group mt="xs">
          <Radio icon={CheckIcon} label="Text" value="text"  />
          <Radio icon={CheckIcon} label="Autocomplete" value="autocomplete"  />
          <Radio icon={CheckIcon} label="Muti-Select" value="muti-select"  />
          <Radio icon={CheckIcon} label="Select" value="select"  />
          <Radio icon={CheckIcon} label="Checkbox" value="checkbox"  />
          <Radio icon={CheckIcon} label="Range" value="range"  />
          <Radio icon={CheckIcon} label="Range-Slider" value="range-slider"  />
          <Radio icon={CheckIcon} label="Date" value="date"  />
          <Radio icon={CheckIcon} label="Date-Range" value="date-range"  />
        </Group>
    </Radio.Group>
        </>
    )
}