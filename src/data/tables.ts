import { Ttable } from "../types/types"

export const tables: Ttable = {
    invoice: {description: "This table contains all the Invoice.", from_table: "invoices", model_name:"Invoice", alias: "i", rels:["product", "work_order"]},
    work_order: {description: "This table contains all the Work Orders.", from_table: "work_order", model_name:"WorkOrder", alias: "wo", rels:["product", "invoice"]},
    product: {description: "This table contains all the Products.", from_table: "products", model_name:"Product", alias: "p", rels:["invoice", "work_order"]},
}