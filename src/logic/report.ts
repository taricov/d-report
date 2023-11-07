export const report = ({...props}: any) =>{
const fields = props.fields.map((f:any)=> {
    return {[f.name]: {
        "query": f.query,
        "type": f.type || "",
        "colored": f.colored || false,
      },
    }
})
const display_fields = props.display_fields.map((d:any)=> {
    return {[d.name]: d.display_name 
    }
})


// const joins = props.joins.map((j:any)=>j)
// const conditions = props.wheres.map((w:any)=>w)

    const output = {
        modelName: props.model_name,
        title: props.report_title,
        table: props.from_table,
        custom_table: props.from_table,
        alias: props.alias,
        fields,
        currency: {},
        display_fields,
        allow_removed: false,
        removed_text: "[REMOVED]",
        group_fields: {},
        total_fields: {},
        filters: {},
        joins: props.joins,
        conditions: props.conditions,
        group_by: {},
        has_summary: false,
        order_by: {},
        default_group_by: props.default_group_by
      }

return output;

}