import { Ttable } from "../types/types"

export const tables: Ttable = {
    invoice: {
        description: "This table contains all the Invoice.", 
        from_table: "invoices", 
        model_name:"Invoice", 
        alias: "i", 
        primary_key: "id",
        foreign_key: "invoice_id",
        rels:
            [
                {table: "product", foreign_key: "product_id",}, 
                {table: "work_order", foreign_key: "work_order_id"}, 
                {table: "client", foreign_key: "client_id"}, 
                {table: "invoice_item", foreign_key: "invoice_item_id"},
                {table: "staff", foreign_key: "staff_id"},
                {table: "branch", foreign_key: "branch_id"},
                {table: "requisition", foreign_key: "requisition_id"},
            ]
        },
    invoice_item:{
        description: "This table contains all Invoice Items.", 
        from_table: "invoice_item", 
        model_name:"Invoice", 
        alias: "ii", 
        primary_key: "id",
        foreign_key: "product_id",
        rels:
            [
                {table: "product", foreign_key: "product_id",}, 
                {table: "work_order", foreign_key: "work_order_id"}, 
                {table: "client", foreign_key: "client_id"}, 
                {table: "invoice_item", foreign_key: "invoice_item_id"},
                {table: "staff", foreign_key: "staff_id"},
                {table: "branch", foreign_key: "branch_id"},
                {table: "store", foreign_key: "store_id"},
                {table: "requisition", foreign_key: "requisition_id"},
            ]
        },
        work_order: {
            description: "This table contains all the Work Orders.", 
            from_table: "work_order", 
            model_name:"WorkOrder", 
            alias: "wo", 
            primary_key: "id",
            foreign_key: "work_order_id",
            rels:
            [
                {table: "invoice", foreign_key: "invoice_id"}, 
                {table: "product", foreign_key: "product_id"}, 
                {table: "staff", foreign_key: "staff_id"},
                {table: "store", foreign_key: "store_id"},
                {table: "branch", foreign_key: "branch_id"},
            ]
        },
        product: {
            description: "This table contains all the Products.", 
            from_table: "products", 
            model_name:"Product",
            alias: "p", 
            primary_key: "id",
            foreign_key: "product_id",
            rels:
            [
                {table: "invoice", foreign_key: "invoice_id"}, 
                {table: "work_order", foreign_key: "work_order_id"}, 
                {table: "invoice_item", foreign_key: "invoice_item_id"},
                {table: "store", foreign_key: "store_id"},
                {table: "branch", foreign_key: "branch_id"},
            ]
        },
        client: {
        description: "This table contains all the Clients.", 
        from_table: "clients", 
        model_name:"Client",
        alias: "c", 
        primary_key: "id",
        foreign_key: "client_id",
        rels:
            [
                {table: "invoice", foreign_key: "invoice_id"}, 
                {table: "work_order", foreign_key: "work_order_id"}, 
                {table: "invoice_item", foreign_key: "invoice_item_id"},
                {table: "staff", foreign_key: "staff_id"},
                {table: "branch", foreign_key: "branch_id"},
            ]
    },
    staff: {
        description: "This table contains all the Staff.", 
        from_table: "staff", 
        model_name:"Staff",
        alias: "s", 
        primary_key: "id",
        foreign_key: "staff_id",
        rels:
            [
                {table: "invoice", foreign_key: "invoice_id"}, 
                {table: "work_order", foreign_key: "work_order_id"}, 
            ]
    },
    requisition: {
        description: "This table contains all the Requisitions.", 
        from_table: "reuquisitions", 
        model_name:"Reuquisition",
        alias: "req", 
        primary_key: "id",
        foreign_key: "requisition_id",
        rels:
            [
                {table: "invoice", foreign_key: "invoice_id"}, 
                {table: "work_order", foreign_key: "work_order_id"}, 
                {table: "staff", foreign_key: "staff_id"}, 
                {table: "product", foreign_key: "product_id"}, 
            ]
    },
    store: {
        description: "This table contains all the Stores/Warehouses.", 
        from_table: "stores", 
        model_name:"Store",
        alias: "s", 
        primary_key: "id",
        foreign_key: "store_id",
        rels:
            [
                {table: "invoice", foreign_key: "invoice_id"}, 
                {table: "work_order", foreign_key: "work_order_id"}, 
                {table: "product", foreign_key: "product_id"}, 
            ]
    },
    branch: {
        description: "This table contains all the Branches.", 
        from_table: "branches", 
        model_name:"Branch",
        alias: "b", 
        primary_key: "id",
        foreign_key: "branch_id",
        rels:
            [
                {table: "invoice", foreign_key: "invoice_id"}, 
                {table: "work_order", foreign_key: "work_order_id"}, 
                {table: "product", foreign_key: "product_id"}, 
                {table: "store", foreign_key: "store_id"}, 
                {table: "client", foreign_key: "client_id"}, 
            ]
    },
}