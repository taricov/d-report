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
} from 'mantine-react-table';
import { Box, Button, Flex, Menu, Text, Title } from '@mantine/core';
import { IconUserCircle, IconSend, IconDownload } from '@tabler/icons-react';
import { data } from './makeDate';
import { useMakeCols } from './Report.hooks';
import {ReportConfig } from '../../components/ReportConfig';
import { TreportConfig } from '../../types/types';

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


  useEffect(() => {
    console.log(reportConfig)
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
    // enableExpanding: false,
    // enableExpandAll: false,
    enableDensityToggle: true,
    columns: useMakeCols(),
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
    // showColumnFilters:, 
    // showGlobalFilter: reportConfig.globalSearchBar,
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    mantinePaginationProps: {
      radius: 'sm',
      size: 'md',
    },
    mantineSearchTextInputProps: {
      placeholder: 'Search...',
    },
    renderTopToolbar: ({ table }) => {
      return (
        <Flex p="md" justify="space-between">
          <Flex gap="xs">
            {/* import MRT sub-components */}
            <MRT_GlobalFilterTextInput table={table} />
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
