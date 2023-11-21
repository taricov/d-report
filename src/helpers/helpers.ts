export const schedule = (something:()=>void, xx:number): Promise<void> => {
    return new Promise(resolve => setTimeout(something,xx))
}

export const responseStatusHandler = (status:number) => {

}





// export function merge2Tables(table1: any, table2: any, aliase1: string, aliase2: string, foreignkey: string) {


//     function mergeObjectsWithPrefix(obj1: any, obj2: any, prefix1: string, prefix2: string) {
//       const result: any = {};
//       for (const key in obj1 as any) {
//           result[prefix1 + key] = obj1[key as any];
//       }
//       for (const key in obj2 as any) {
//           result[prefix2 + key] = obj2[key as any];
//       }
//       return result;
//     }
    
  
  
//     const result = [];
//     for (const item1 of table1) {
//         const commonValue = item1[foreignkey as any];
//         const matchingItem = table2.find((item2:any) => item2[foreignkey] === commonValue) || {};
//         const mergedObj = mergeObjectsWithPrefix(item1, matchingItem, aliase1, aliase2);
//         result.push(mergedObj);
//     }
  
//     for (const item2 of table2) {
//         const commonValue = item2[foreignkey];
//         const matchingItem = table1.find((item1:any) => item1[foreignkey] === commonValue) || {};
//         // Only add items from table2 that are not in table1 to avoid duplication
//         if (!table1.find((item: any) => item[foreignkey] === commonValue)) {
//             const mergedObj = mergeObjectsWithPrefix(matchingItem, item2, aliase1, aliase2);
//             result.push(mergedObj);
//         }
//     }
//     console.log("from inside", result);
//     console.log(table1, table2, aliase1, aliase2, foreignkey)
//     return result;
//   }



export function mergeObjectsWithPrefix(obj1: any, obj2: any, prefix1: any, prefix2: any) {
    const result: any = {};
    for (const key in obj1) {
        result[prefix1 + key] = obj1[key];
    }
    for (const key in obj2) {
        result[prefix2 + key] = obj2[key];
    }
    return result;
}

export function merge2Tables(arr1: any, arr2: any, prefix1: any, prefix2: any, commonKey1: any, commonKey2: any) {
    const result = [];
    const allKeys = new Set([...Object.keys(arr1[0]), ...Object.keys(arr2[0])]);

    for (const item1 of arr1) {
        const commonValue = item1[commonKey1];
        const matchingItem = arr2.find((item2: any) => item2[commonKey2] === commonValue) || {};
        const mergedObj = mergeObjectsWithPrefix(item1, matchingItem, prefix1, prefix2);
        
        // Repeat all keys to ensure the same size
        for (const key of allKeys) {
            if (!(prefix1 + key in mergedObj)) {
                mergedObj[prefix1 + key] = null;
            }
            if (!(prefix2 + key in mergedObj)) {
                mergedObj[prefix2 + key] = null;
            }
        }

        result.push(mergedObj);
    }

    for (const item2 of arr2) {
        const commonValue = item2[commonKey2];
        const matchingItem = arr1.find((item1: any) => item1[commonKey1] === commonValue) || {};
        
        // Only add items from arr2 that are not in arr1 to avoid duplication
        if (!arr1.find((item: any) => item[commonKey1] === commonValue)) {
            const mergedObj = mergeObjectsWithPrefix(matchingItem, item2, prefix1, prefix2);

            // Repeat all keys to ensure the same size
            for (const key of allKeys) {
                if (!(prefix1 + key in mergedObj)) {
                    mergedObj[prefix1 + key] = null;
                }
                if (!(prefix2 + key in mergedObj)) {
                    mergedObj[prefix2 + key] = null;
                }
            }

            result.push(mergedObj);
        }
    }
    console.log(result);
    return result;
}


