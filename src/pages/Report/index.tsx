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
import { useContext, useEffect, useMemo, useState } from 'react';
import { ReportConfig } from '../../components/ReportConfig';
import { ReportContext, UserContext } from '../../App';
import { GET_tablesCols, GETcurrentReport } from '../../api/api_funcs';
import { merge2Tables, useQueryParams } from '../../helpers/helpers';
import Spinner from '../../components/Spinner';
import { localStorageHandler } from '../../logic/localStorageHandler';

const Report = () => {
  const userInfo = useContext(UserContext)
  const reportInfo = useContext(ReportContext)
const [metadata, setMetadata] = useState<any>()
const [data, setData] = useState<any[]>([])
const [fetchingData, setFetchingData] = useState<boolean>(true)
  const id: string | null = useQueryParams("id")

  useEffect(() => {

  let tablesData: any = {}
  const foreignKey = reportInfo.reportData.foreignKey
  const requiredTables: string[] = [reportInfo.reportData.fromTable, ...Object.keys(reportInfo.reportData.joins)] 


    GETcurrentReport(userInfo.siteData.subdomain, userInfo.siteData.apikey, userInfo.siteData.dreport_module_key, id as string)
    .then(response => response.json())
    .then(data =>{ 
    console.log("report data", data)
      reportInfo.setReportData(JSON.parse(data.description))
    setMetadata(data)
  }
    ).then(() =>{
      requiredTables.map(async(table:any, i:number)=>{
      GET_tablesCols({subdomain: userInfo.siteData.subdomain, apikey: userInfo.siteData.apikey, table, limit:1000}).then(res => res.json()).then(data => {
        tablesData[table] = data.data
        console.log("json:", tablesData)})
      })
    }).then(() =>{
      const rez = merge2Tables(tablesData[Object.keys(tablesData)[0]], tablesData[Object.keys(tablesData)[1]], "ii_", "p_", foreignKey, "id");
      console.log(rez);
      setData(tablesData)
      console.log("data", data)
      setFetchingData(true)
    })



  },[userInfo.siteData.subdomain, userInfo.siteData.apikey, userInfo.siteData.dreport_module_key, metadata, id])







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
    [],
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
            <MRT_ToggleFiltersButton classNames={{root:""}} table={table} />
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

{[...new Map(reportInfo.reportData.selectedColumns.map(c=>([c.tableName, c]))).values()].map((t,i)=>{
  return i===0 ?
<>
  <div className={`${t.bgColor} inline-flex items-center px-5 py-1.5 text-xs font-bold text-center rounded-lg shadow`}>{t.tableName.split("_").map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(" ")}</div>
  <svg className="w-6 fill-slate-500" viewBox="0 0 24 24"><title>arrow-right-thin</title><path d="M14 16.94V12.94H5.08L5.05 10.93H14V6.94L19 11.94Z" /></svg> 
</>
  :
  <div className={`${t.bgColor} inline-flex items-center px-5 py-1.5 text-xs font-bold text-center rounded-lg shadow`}>{t.tableName.split("_").map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(" ")}</div>
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
