import React, { useState } from "react";
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
  selectedColumnsLen: number;
};
const List = ({ children, title, onDragEnd, name, selectedColumnsLen }: ListProps) => {
// const [showColumnsSettings, setShowColumnsSettings] = useState<boolean>(true);

  return (
    <>
{/* <SettingsModal /> */}
    <div className="flex flex-col w-6/12 relative"> 
      <h2 className="relative text-xl font-bold mx-auto shadow-md w-fit text-slate-100 rounded-md px-5 py-4 bg-slate-600">{title}</h2>
      <span className="absolute top-1 left-[90px] text-[10px] italic text-slate-200 block">{!!selectedColumnsLen && selectedColumnsLen}</span>

      <div className="flex-1">
        <Droppable droppableId={name}>
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <div ref={provided.innerRef} className="h-screen">
              <div className="shadow p-5 items-center h-full overflow-scroll rounded-md bg-slate-300/40 flex flex-col gap-y-1">
                {children}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </div>
    </div>
    </>
  );
};

export default List;

