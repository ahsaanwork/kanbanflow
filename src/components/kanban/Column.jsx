import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import QuickAddTask from "./QuickAddTask";

const COLUMN_STYLES = {
  backlog: { dot: "bg-slate-300", label: "Backlog" },
  todo: { dot: "bg-blue-400", label: "To Do" },
  in_progress: { dot: "bg-amber-400", label: "In Progress" },
  done: { dot: "bg-emerald-500", label: "Done" },
};

export default function Column({ columnId, tasks, onAddTask, onCardClick }) {
  const style = COLUMN_STYLES[columnId];
  return (
    <div className="flex flex-col w-[300px] flex-shrink-0">
      <div className="flex items-center gap-2 px-1 mb-3">
        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
        <h2 className="text-sm font-semibold text-slate-700">{style.label}</h2>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded-xl p-1.5 transition-colors min-h-[120px] ${
              snapshot.isDraggingOver ? "bg-slate-200/50" : "bg-transparent"
            }`}
          >
            <div className="flex flex-col gap-2">
              {tasks.map((task, index) => (
                <TaskCardWrapper key={task.id} task={task} index={index} onCardClick={onCardClick} />
              ))}
              {provided.placeholder}
            </div>
            <div className="mt-1.5">
              <QuickAddTask onAdd={(title) => onAddTask(columnId, title)} />
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}

import TaskCard from "./TaskCard";

const TaskCardWrapper = ({ task, index, onCardClick }) => {
  return <TaskCard task={{ ...task, _index: index }} onClick={() => onCardClick(task)} />;
};