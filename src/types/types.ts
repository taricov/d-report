import { SwitchProps } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";
import { accountAttributes } from "../data/attrs";

export interface TreportConfig extends SwitchProps {
  [key: string]: any
}

export interface TDaftraWorkflow {
  name: string
  status: number
  singular_title: string
}


interface TcolumnSettings {
    accessorKey: string;
    header: string;
    filterVariant: string;
    size: number;
  }
export type TcolumnsSettings = TcolumnSettings[]

export interface TreportData {
  reportConfig: TreportConfig;
  columnsSettings: TcolumnsSettings;
  selectedColumns: {[key: string]: string}[]
} 


export type Tloading = {
    fetching: boolean;
    building: boolean;
}

export interface TformProps {
  submitting: boolean;
  disconnecting: boolean;
  error: string;
  subdomain: string;
  apikey: string;
  workflowTitle: string;
}


type Td = typeof accountAttributes[number]
export type TsiteData = {[K in Td]: K extends "fetching" | "submitting" ? boolean : K extends "id" | "language_code" ? number :  string}



export const TSNACKBAR_STATES = {
    SUCCESS: 'success',
    ERROR: 'error',
}
export interface TCONTEXT_Connector {
  connected: boolean;
  setConnected: Dispatch<SetStateAction<boolean>>;
  siteData: TsiteData;
  setSiteData: Dispatch<SetStateAction<TsiteData>>;
}
export interface TCONTEXT_ReportData {
  reportData: TreportData;
  setReportData: Dispatch<SetStateAction<TreportData>>;
}


export type TErrors = {
    fetching: boolean;
    reportTitle: boolean;
    building: boolean;
}
  export interface TtableVariables {
    available: {[key: string]: string}[];
    selected: {[key: string]: string}[];
}
  export interface TreportVariables {
    joins: {[key: string]: string};
    report_title: string;
    from_table: string
  }

export type Ttable = {
    [key: string]: {
        description: string;
        primary_key: string;
        foreign_key: string;
        rels: {table: string, foreign_key: string}[];
        from_table: string;
         model_name:string;
         alias: string;

    }
}
export interface TtableCol {
    subdomain: string;
    apikey: string;
    table: string;
    method?: string;
    limit?: number;
}
// interface TtableObj{

// }
export interface TtablesObj{ 
    // [key: string]: TtableObj;
    [key: string]: string[];

}