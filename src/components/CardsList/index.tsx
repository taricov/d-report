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
};
const List = ({ children, title, onDragEnd, name }: ListProps) => {
// const [showColumnsSettings, setShowColumnsSettings] = useState<boolean>(true);

  return (
    <>
{/* <SettingsModal /> */}
    <div className="flex flex-col w-6/12 relative"> 
      <h2 className="relative text-xl mx-auto font-bold shadow-md w-fit text-slate-100 rounded-md px-5 py-4 bg-slate-600">{title}</h2>

      <div className="">
        <Droppable droppableId={name}>
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <div ref={provided.innerRef} className="h-screen">
              <div className="shadow p-5 items-center overflow-scroll rounded-md h-full bg-slate-300/40 flex flex-col gap-y-1">
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

