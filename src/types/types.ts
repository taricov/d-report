export type Ttable = string[]
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