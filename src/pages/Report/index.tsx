/* eslint-disable react/jsx-pascal-case */
import { useEffect, useMemo, useState } from 'react';
import { useParams } from "react-router-dom";
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_TableHeadCellResizeHandle,
  MRT_ToggleFullScreenButton,
} from 'mantine-react-table';
import { Box, Button, Flex, Menu, Text, Title } from '@mantine/core';
import { IconUserCircle, IconSend, IconDownload } from '@tabler/icons-react';
import { data } from './makeDate';
import { useMakeCols } from './Report.hooks';
import {ReportConfig } from '../../components/ReportConfig';
import { TreportConfig } from '../../types/types';
import { localStorageHandler } from '../../logic/localStorageHandler';

export type Employee = {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  salary: number;
  startDate: string;
  signatureCatchPhrase: string;
  avatar: string;
};

const Report = () => {
  const [reportConfig, setReportConfig] = useState<TreportConfig>({
    rowSelection: true, 
    basicColumnFilters: false,
    advancedColumnFilters: false,
    columnReorder: false,
    globalSearchBar: true,
    columnPinning: true,
    columnGrouping: true,
    columnSorting: true,
  })
  

  const {id} = useParams();

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
         {
          accessorKey: 'firstName',
          header: 'Employee',
          filterVariant: "checkbox",
          size: 200,
         },
         {
          accessorKey: 'firstName',
          header: 'E',
          filterVariant: "autocomplete",
          size: 200,
         },
          {
            accessorKey: 'email',
            enableClickToCopy: true,
            header: 'Email',
            size: 200,
          },
      {
            accessorKey: 'salary',
            header: 'Salary',
            size: 200,
            filterVariant: 'range-slider',
          },
          {
            accessorKey: 'jobTitle', //hey a simple column for once
            header: 'Job Title',
            filterVariant: 'multi-select',
            size: 350,
          },
          {
            id: 'startDate',
            header: 'Start Date',
            filterVariant: 'date-range',
            sortingFn: 'datetime',
      },
    ],
    [],
  );
  useEffect(() => {
    const storedConfig = localStorageHandler.read("report-config")
    setReportConfig(storedConfig);
  },[])
  useEffect(() => {
    console.log(reportConfig)
    localStorageHandler.write("report-config", reportConfig)
  },[reportConfig])


  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExportRowsPDF = (rows: any) => {
    const doc = new jsPDF();
    const tableData = rows.map((row:any) => Object.values(row.original));
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const tableHeaders = useMakeCols().map((c) => c.header);
    

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
    enableFilterMatchHighlighting: true,
    enableColumnFilterModes: reportConfig.advancedColumnFilters,
    enableFilters: reportConfig.basicColumnFilters,
    enableColumnOrdering: reportConfig.columnReorder,
    enableFacetedValues: true, 
    enableGrouping: reportConfig.columnGrouping,
    enablePinning: reportConfig.columnPinning,
    enableRowActions: false,
    enableRowSelection: reportConfig.rowSelection,
    enableSorting: reportConfig.columnSorting,
    enableTopToolbar:true,
    // enableGlobalFilter: true,
    enableFullScreenToggle: true,
    initialState:{
      density: 'xs',
      showGlobalFilter: reportConfig.globalSearchBar,
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
            <MRT_GlobalFilterTextInput table={table} />
            <MRT_ToggleDensePaddingButton table={table} />
            <MRT_ToggleFullScreenButton table={table} />
            <MRT_ShowHideColumnsButton table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Flex>
          <Flex sx={{ gap: '8px' }}>
          <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRowsPDF(table.getPrePaginationRowModel().rows)
          }
          leftIcon={<IconDownload />}
          variant="default"
        >
          Export PDF (All)
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRowsCSV(table.getPrePaginationRowModel().rows)
          }
          leftIcon={<IconDownload />}
          variant="subtle"
        >
          Export CSV (Filtered/Sorted)
        </Button>
          </Flex>
        </Flex>
      );
    },
  });

  return <>
  <ReportConfig config={reportConfig} setConfig={setReportConfig}/>
  <div className="mt-10 !w-screen"><MantineReactTable table={table} /></div>
  </>
};

export default Report;
