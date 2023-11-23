import React from "react";
import {
  Droppable,
  DragDropContext,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";

type ListProps = {
  children?: React.ReactNode;
  title: string;
  onDragEnd: (data: any) => void;
  name: string;
  availableColumnsLen?: number;
};

const List = ({ children, title, onDragEnd, name, availableColumnsLen}: ListProps) => {
  return (
    <div className="flex flex-col w-6/12"> 
      <h2 className="relative text-xl font-bold mx-auto shadow-md w-fit text-slate-100 rounded-md px-5 py-4 bg-slate-600">
        {title}
        <span className="absolute -top-1 left-1 text-[10px] italic text-slate-200 block">{!!availableColumnsLen && availableColumnsLen}</span>
        
        </h2>
      <div className="">
        <Droppable droppableId={name}>
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <div ref={provided.innerRef} className="h-screen">
              <div className="flex items-center justify-center shadow p-5 overflow-scroll rounded-md h-full bg-slate-300/40 flex-wrap gap-x-1">
                {children}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default List;
