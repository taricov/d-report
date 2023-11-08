
export interface RootObject {
    base_table: string;
    join_1: string;
    join_2: string;
    join_3: string;
  }

 export type TtableVariables = {
    available: string[],
    selected: string[]
  }
  
  export interface Texpressions {
        label: string;
        symbol: string;
        val: string;
  }
  export interface TreportVariables {
    // joins: {table_name: string, join_type: string, on: string}[];
    joins: {[key:string]: string}[];
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