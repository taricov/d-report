import { Dispatch, SetStateAction } from "react";

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
}

export interface Tconnector {
  connected: boolean;
  setConnected: Dispatch<SetStateAction<boolean>>;
  siteData: TsiteData;
  setSiteData: Dispatch<SetStateAction<TsiteData>>;
}


export type TErrors = {
    fetching: string;
    building: string;
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
        rels: string[];
        from_table: string;
         model_name:string;
         alias: string;

    }
}
export interface TtableCol {
    subdomain: string;
    apikey: string;
    table: string;
    method: string;
}
// interface TtableObj{

// }
export interface TtablesObj{ 
    // [key: string]: TtableObj;
    [key: string]: string[];

}