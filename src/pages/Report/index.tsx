import { useMemo } from 'react';
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
  

  const {id} = useParams();
  console.log("params are: ", id)


  const columns = useMemo<MRT_ColumnDef<Employee>[]>(
    () => [
      {
        id: 'employee', //id used to define `group` column
        header: 'Employee',
        columns: [
          {
            accessorFn: (row) => `${row.firstName} ${row.lastName}`, //accessorFn used to join multiple data into a single cell
            id: 'name', //id is still required when using accessorFn instead of accessorKey
            header: 'Name',
            size: 250,
            filterVariant: 'autocomplete',
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <img
                  alt="avatar"
                  height={30}
                  src={row.original.avatar}
                  style={{ borderRadius: '50%' }}
                />
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: 'email', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            header: 'Email',
            size: 300,
          },
        ],
      },
      {
        id: 'id',
        header: 'Job Info',
        columns: [
          {
            accessorKey: 'salary',
            header: 'Salary',
            size: 200,
            filterVariant: 'range-slider',
            mantineFilterRangeSliderProps: {
              color: 'indigo',
              label: (value) =>
                value?.toLocaleString?.('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }),
            },
            //custom conditional format and styling
            Cell: ({ cell }) => (
              <Box
                sx={(theme) => ({
                  backgroundColor:
                    cell.getValue<number>() < 50_000
                      ? theme.colors.red[9]
                      : cell.getValue<number>() >= 50_000 &&
                        cell.getValue<number>() < 75_000
                      ? theme.colors.yellow[9]
                      : theme.colors.green[9],
                  borderRadius: '4px',
                  color: '#fff',
                  maxWidth: '9ch',
                  padding: '4px',
                })}
              >
                {cell.getValue<number>()?.toLocaleString?.('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Box>
            ),
          },
          {
            accessorKey: 'jobTitle', //hey a simple column for once
            header: 'Job Title',
            filterVariant: 'multi-select',
            size: 350,
          },
          {
            accessorFn: (row) => {
              //convert to Date for sorting and filtering
              const sDay = new Date(row.startDate);
              sDay.setHours(0, 0, 0, 0); // remove time from date (useful if filter by equals exact date)
              return sDay;
            },
            id: 'startDate',
            header: 'Start Date',
            filterVariant: 'date-range',
            sortingFn: 'datetime',
            enableColumnFilterModes: false, //keep this as only date-range filter with between inclusive filterFn
            Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(), //render Date as a string
            Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
          },
        ],
      },
    ],
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
    enableExpanding: false,
    enableExpandAll: false,
    enableDensityToggle: true,
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    // enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableFacetedValues: true, 
    enableGrouping: true,
    enablePinning: true,
    // enableRowActions: true,
    enableRowSelection: true,
    initialState: { showColumnFilters: true, showGlobalFilter: true },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    mantinePaginationProps: {
      radius: 'sm',
      size: 'lg',
    },
    mantineSearchTextInputProps: {
      placeholder: 'Search...',
    },
    // renderDetailPanel: ({ row }) => (
    //   <Box
    //     sx={{
    //       display: 'flex',
    //       justifyContent: 'flex-start',
    //       alignItems: 'center',
    //       gap: '16px',
    //       padding: '16px',
    //     }}
    //   >
    //     <img
    //       alt="avatar"
    //       height={200}
    //       src={row.original.avatar}
    //       style={{ borderRadius: '50%' }}
    //     />
    //     <Box sx={{ textAlign: 'center' }}>
    //       <Title>Signature Catch Phrase:</Title>
    //       <Text>&quot;{row.original.signatureCatchPhrase}&quot;</Text>
    //     </Box>
    //   </Box>
    // ),
    // renderRowActionMenuItems: () => (
    //   <>
    //     <Menu.Item icon={<IconUserCircle />}>View Profile</Menu.Item>
    //     <Menu.Item icon={<IconSend />}>Send Email</Menu.Item>
    //   </>
    // ),
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
            {/* <Button
              color="red"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleDeactivate}
              variant="filled"
            >
              Deactivate
            </Button>
            <Button
              color="green"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleActivate}
              variant="filled"
            >
              Activate
            </Button>
            <Button
              color="blue"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleContact}
              variant="filled"
            >
              Contact
            </Button> */}
          </Flex>
        </Flex>
      );
    },
  });

  return <div className="mt-32 !w-screen"><MantineReactTable table={table} /></div>;
};

export default Report;
