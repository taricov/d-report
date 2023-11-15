import { SwitchProps } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

export interface TreportConfig extends SwitchProps {
  // rowSelection: any
  [key: string]: any
}

export interface TDaftraWorkflow {
  name: string
  status: number
  singular_title: string
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
export interface TsiteData {
  subdomain: string;
  apikey: string;
  siteFirstName: string;
  siteLastName: string;
  siteBusinessName: string;
  siteID: string;
  siteEmail: string;
  siteLogoURL: string;
  fromForm: boolean;
  fetching: boolean;
  sitePhone1: string
   sitePhone2: string
   siteAddress1: string
   siteAddress2: string
   siteBn1: string
   siteModuleKey: string
   siteCity: string
   siteState: string
   siteCountryCode: string
   siteCountry: string;
   siteCurrencyCode: string;
}

export interface Tconnector {
  connected: boolean;
  setConnected: Dispatch<SetStateAction<boolean>>;
  siteData: TsiteData;
  setSiteData: Dispatch<SetStateAction<TsiteData>>;
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