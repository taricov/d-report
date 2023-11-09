
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
    SUBDOMAIN: string;
    API_KEY: string;
    table: string;
    method: string;
}
// interface TtableObj{

// }
export interface TtablesObj{ 
    // [key: string]: TtableObj;
    [key: string]: string[];

}