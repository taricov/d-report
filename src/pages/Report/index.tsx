/* eslint-disable react/jsx-pascal-case */
import { Button, Flex } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { download, generateCsv, mkConfig } from 'export-to-csv'; //or use your library of choice here
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
import {
  MRT_GlobalFilterTextInput,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef
} from 'mantine-react-table';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ReportConfig } from '../../components/ReportConfig';
import { ReportContext, UserContext } from '../../App';
import { GET_tablesCols, GETcurrentReport } from '../../api/api_funcs';
import { extractDataObj, flattenObject, merge2Tables, useQueryParams } from '../../helpers/helpers';
import Spinner from '../../components/Spinner';
import { localStorageHandler } from '../../logic/localStorageHandler';
import { useMakeData } from '../../hooks/useMakeData';


const Report = () => {
  const userInfo = useContext(UserContext)
  const reportInfo = useContext(ReportContext)
// const [metadata, setMetadata] = useState<any>(null)
// const [allData, setAllData] = useState<any>({})
// const [data, setData] = useState<any[]>([])
// const [reportTables, setTables] = useState<any[]>([])
// const [fetchingData, setFetchingData] = useState<boolean>(true)
//   const id: string | null = useQueryParams("id")



//   async function r(){
//     let tablesData: any = {}
//     // if(!!reportInfo.reportData.fromTable){
//       const requiredTables: string[] = [reportInfo.reportData.fromTable, ...Object.keys(reportInfo.reportData.joins)] 
//       console.log(requiredTables)
//     // }
//       try{

//    Promise.allSettled(requiredTables.reverse().map(async(table:any, i:number)=> GET_tablesCols({subdomain: userInfo.siteData.subdomain, apikey: userInfo.siteData.apikey, table, limit:1000})
//     .then(res => res.json())
//     .then(data => {    
//         tablesData[table] = data.data
//     console.log(table, "json:", tablesData)
//   })
//   )).then((data) => {
//       setAllData(tablesData)
//       console.log("alldata: ", allData)
//       console.log("metadata: ", metadata)
//       console.log("data: ", data)

//     })
//   }catch(err) {console.log(err)}
//   }


//   async function s(){
    
//     const firstRes = await GETcurrentReport(userInfo.siteData.subdomain, userInfo.siteData.apikey, userInfo.siteData.dreport_module_key, id as string)
//     const fData = await firstRes.json()
//     reportInfo.setReportData(JSON.parse(fData.description))
//     if(!metadata)setMetadata(fData)
//   }

// // eslint-disable-next-line react-hooks/exhaustive-deps
// const ss = async () =>{
//   // setTables([...new Set([reportInfo.reportData.fromTable, ...reportInfo.reportData.selectedColumns.map(c=>c.tableName)])])

//   return await Promise.all([...new Set([reportInfo.reportData.fromTable, ...reportInfo.reportData.selectedColumns.map(c=>c.tableName)])].map(async (table) => {
//     try {
//       const response:any = await GET_tablesCols({subdomain: userInfo.siteData.subdomain, apikey: userInfo.siteData.apikey, table, limit:1})
//       const data:any = await response.json()
//       const flattenData = data.data.map((record:any)=>flattenObject(record))
//       setAllData((prev: any) =>({...prev, [table]: flattenData}))
//       // console.log("allData: " +  )
//       // [...new Set([reportInfo.reportData.fromTable, ...reportInfo.reportData.selectedColumns.map(c=>c.tableName)])].map(table=>{
//         // const r = 
      
//       // return [table, flattenData]
//     } catch (error) {
//       console.error(`Error fetching data for ${table}:`, error);
//     }
    
//   }))
// }
  // Wait for all promises to resolve
    // if(Object.keys(allData).length === requiredTables.length) return;
//     await Promise.all(promises).then(()=>{
//       setData(rez)
//       console.log(rez);
//       console.log("data", data)
//       setFetchingData(false)
//     })
  


 const {metadata, data, fetchingData} = useMakeData()
 

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => reportInfo.reportData.columnsSettings,
    // () => [
    //      {
    //       accessorKey: 'firstName',
    //       header: 'Employee',
    //       filterVariant: "checkbox",
    //       size: 200,
    //      },
    //      {
    //       accessorKey: 'firstNamee',
    //       header: 'E',
    //       filterVariant: "autocomplete",
    //       size: 200,
    //      },
    //       {
    //         accessorKey: 'email',
    //         enableClickToCopy: true,
    //         header: 'Email',
    //         size: 200,
    //       },
    //   {
    //         accessorKey: 'salary',
    //         header: 'Salary',
    //         size: 200,
    //         filterVariant: 'range-slider',
    //       },
    //       {
    //         accessorKey: 'jobTitle', //hey a simple column for once
    //         header: 'Job Title',
    //         filterVariant: 'multi-select',
    //         size: 350,
    //       },
    //       {
    //         id: 'startDate',
    //         header: 'Start Date',
    //         filterVariant: 'date-range',
    //         sortingFn: 'datetime',
    //   },
    // ],
    [reportInfo.reportData.columnsSettings],
  );


  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExportRowsPDF = (rows: any) => {
    const doc = new jsPDF();
    const tableData = rows.map((row:any) => Object.values(row.original));
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const tableHeaders = columns.map((c) => c.header);
    

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save('mrt-pdf-example.pdf');
  };
  const handleExportRowsCSV = (rows: any) => {
    const rowData = rows.map((row:any) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };
  const table = useMantineReactTable({
    columns,
    data,
    state:{isLoading: fetchingData},
    enableFilterMatchHighlighting: true,
    enableColumnFilterModes: reportInfo.reportData.reportConfig.advancedColumnFilters,
    enableFilters: reportInfo.reportData.reportConfig.basicColumnFilters,
    enableColumnOrdering: reportInfo.reportData.reportConfig.columnReorder,
    enableFacetedValues: true, 
    // globalFilterFn: 'fuzzy',
    enableGrouping: reportInfo.reportData.reportConfig.columnGrouping,
    enablePinning: reportInfo.reportData.reportConfig.columnPinning,
    enableRowActions: false,
    enableRowSelection: reportInfo.reportData.reportConfig.rowSelection,
    enableSorting: reportInfo.reportData.reportConfig.columnSorting,
    enableTopToolbar:true,
    // enableGlobalFilter: true,
    enableFullScreenToggle: true,
    initialState:{
      density: 'xs',
      showGlobalFilter: reportInfo.reportData.reportConfig.globalSearchBar,
    },
    mantineSearchTextInputProps:{
      placeholder: `Search ${data.length} rows`,
      sx: { minWidth: '300px' },
      variant: 'filled',
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    mantinePaginationProps: {
      radius: 'sm',
      size: 'md',
    },
    renderTopToolbar: ({ table }) => {
      return (
        <Flex p="md" justify="space-between">
          <Flex gap="xs">
            {/* import MRT sub-components */}
            <div className="w-full bg-slate-200/70 text-slate-100 hover:bg-slate-200/70 rounded-md transition duration-200">
            <MRT_GlobalFilterTextInput table={table} />
            </div>
            <div className="w-full bg-slate-200/70 text-slate-100 hover:bg-slate-200/70 rounded-md transition duration-200">
            <MRT_ToggleDensePaddingButton table={table} />
            </div>
            <div className="w-full bg-slate-200/70 text-slate-100 hover:bg-slate-200/70 rounded-md transition duration-200">
            <MRT_ToggleFullScreenButton table={table} />
            </div>
            <div className="w-full bg-slate-200/70 text-slate-100 hover:bg-slate-200/70 rounded-md transition duration-200">
            <MRT_ShowHideColumnsButton table={table} />
            </div>
            <div className="w-full bg-slate-200/70 text-slate-100 hover:bg-slate-200/70 rounded-md transition duration-200">
            <MRT_ToggleFiltersButton  table={table} />
            </div>
          </Flex>
          <Flex sx={{ gap: '8px' }}>
          <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRowsPDF(table.getPrePaginationRowModel().rows)
          }
          leftIcon={<IconDownload />}

          classNames={{root:"bg-slate-700 text-slate-100 hover:bg-slate-700/80 transition duration-200  pb-1", label:"flex flex-col justify-center gap-[2px]"}}
        >
          <div className=''>Export PDF</div>
          <div className="text-[9px]">(Filtered/Sorted)</div>
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRowsCSV(table.getPrePaginationRowModel().rows)
          }
          leftIcon={<IconDownload />}

          classNames={{root:"bg-slate-700 text-slate-100 hover:bg-slate-700/80 transition duration-200  pb-1", label:"flex flex-col justify-center gap-[2px]"}}
        >
          <div className=''>Export CSV</div>
          <div className="text-[9px]">(Filtered/Sorted)</div>
        </Button>
          </Flex>
        </Flex>
      );
    },
  });

  return <>
  <ReportConfig 
  // config={reportConfig} setConfig={setReportConfig}
  />
      <div className={`my-10 py-4 px-10 mx-auto bg-slate-200/60 w-10/12 flex flex-col items-center justify-center rounded-md`}>
  {!metadata &&
      <div className="w-screen flex align-center justify-center">
      <Spinner size="w-10" />
      </div>
}
{metadata &&
<>
  <h1 className='text-2xl font-bold text-slate-600'>{metadata?.title}</h1>
  <p className='text-sm text-slate-600'>Created at: {metadata?.start_date}</p>

<div className="flex items-center justify-center my-2">

{[...new Map(reportInfo.reportData.selectedColumns.map(c=>([c.tableName, c]))).values()].reverse().map((t,i)=>{
  return i===0 ?
<div key={t.tableName} className='flex items-center justify-center'>
  <div className={`${t.bgColor} inline-flex items-center px-5 py-1.5 text-xs font-bold text-center rounded-lg shadow`}>{t.tableName.split("_").map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(" ")}</div>
  <svg  className="w-6 fill-slate-500" viewBox="0 0 24 24"><title>arrow-right-thin</title><path d="M14 16.94V12.94H5.08L5.05 10.93H14V6.94L19 11.94Z" /></svg> 
</div>
  :
  <div key={t.tableName} className={`${t.bgColor} inline-flex items-center px-5 py-1.5 text-xs font-bold text-center rounded-lg shadow mx-[2px]`}>{t.tableName.split("_").map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(" ")}</div>
})}
</div>
</>
}
</div>

  <div className="mt-10 !w-screen">
    <MantineReactTable table={table} />
  </div>
  </>
};

export default Report;
