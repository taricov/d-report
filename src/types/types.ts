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
  loading: boolean;
  disconnecting: boolean;
  error: string;
}


type Td = typeof accountAttributes[number]
export type TsiteData = {[K in Td]: K extends "fetching" | "submitting" ? boolean :  string}

export interface TsiteData0 {
  subdomain: string;
  apikey: string;
  first_name: string;
  last_name: string;
  business_name: string;
  id: string;
  email: string;
  logo_url: string;
  submitting: boolean;
  fetching: boolean;
  phone1: string
  phone2: string
  address1: string
  address2: string
  bn1: string
  module_key: string
  city: string
  state: string
  country_code: string
  country: string;
  currency_code: string;
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