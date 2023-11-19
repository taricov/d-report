import { CheckIcon, Group, Radio } from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { ReportContext } from '../../App';

export const ColumnsSettings = ({id}:{id:string}) => {

  const reportInfo = useContext(ReportContext)
  const [filterMode, setFilterMode] = useState<string>("text");
  
  useEffect(() => {
  
reportInfo.setReportData(prev=>({
  ...prev, 
  columnsSettings: [...prev.columnsSettings, 
    ...prev.columnsSettings.map(t=>{
  if(t.accessorKey === id){
    console.log("true:", t)
    return {...t, [t.filterVariant]: filterMode}
  } else{
    console.log("false:", t)
    return {...t}
  } 
})]
}))
console.log("fromColumnsSettings", reportInfo.reportData)

  },[filterMode])

    return (

        <>
        <Radio.Group
        value={filterMode}
        onChange={setFilterMode}
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