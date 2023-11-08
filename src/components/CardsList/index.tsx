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
};

const List = ({ children, title, onDragEnd, name }: ListProps) => {
  return (
    <div className="flex flex-col w-6/12"> 
      <h2 className="text-2xl font-bold mb-2 mx-5">{title}</h2>
      <div className="">
        <Droppable droppableId={name}>
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <div ref={provided.innerRef} className="h-screen">
              <div className="shadow p-5  overflow-scroll rounded-md h-full bg-slate-300/40 flex flex-col gap-y-1">
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
