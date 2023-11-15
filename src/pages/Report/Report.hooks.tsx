import { Box } from "@mantine/core";
import { MRT_ColumnDef } from "mantine-react-table"
import { useMemo } from "react";

export const useMakeCols = () => {


  return  useMemo<MRT_ColumnDef<any>[]>(
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

}