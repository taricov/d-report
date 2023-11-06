import React from "react";
import { TtablesObj } from "../../types/types";

// type Props = {
//   children?: React.ReactNode;
//   data: {
//     id: number;
//     uuid: string;
//     title: string;
//     subtitle: string;
//     updatedAt: string;
//   };
// };

const Chip = ({ data }: TtablesObj) => {
  return (
    <>
     {/* <div className="shadow-lg flex  cursor-pointer py-2  px-3 rounded-md bg-slate-300"> */}
        {/* <p className="">{data}</p> */}
        <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">{data}</span>

        {/* <input id=`checkbox` v-model="selectedChips" type="checkbox" :value="t"> <label :for="`checkbox-${i}`" :class="{ '!w-[100px]': selectedChips.includes(t) }" class="relative w-[80px] overflow-hidden transition-all duration-300"><div class="flex items-center justify-center space-x-3"><div v-if="selectedChips.includes(t)" class="tranform absolute left-4 top-1/2 inline-block transition-all duration-300 -translate-x-1/2 -translate-y-1/2" i-carbon-checkmark /><span>{{ t }}</span></div></label> */}

{/* </div> */}
    </>
  );
};

export default Chip;
