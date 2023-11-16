import { MRT_ColumnDef } from "mantine-react-table"
import { useMemo, useState } from "react";


export const useCreateReportColumns = (headers:any) => {
const [colHeaders, setColHeaders] = useState<any>()
  const cols = useMemo<MRT_ColumnDef<any>[]>(
    () => headers.map((header:string) => ({ 
      accessorKey: header,
      header: header
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(" "),
      filterVariant: "autocomplete",
      size: 200})),
      [],
      );

    setColHeaders(cols)
    return { colHeaders, setColHeaders}

    }