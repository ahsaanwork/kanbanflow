import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import QuickAddTask from "./QuickAddTask";
import TaskCard from "./TaskCard";

const COLUMN_STYLES = {
  backlog: { dot: "bg-slate-300", label: "Backlog", dragBg: "bg-slate-200/50 ring-slate-300" },
  todo: { dot: "bg-blue-400", label: "To Do", dragBg: "bg-blue-50/70 ring-blue-300/50" },
  in_progress: { dot: "bg-amber-400", label: "In Progress", dragBg: "bg-amber-50/70 ring-amber-300/50" },
  done: { dot: "bg-emerald-500", label: "Done", dragBg: "bg-emerald-50/70 ring-emerald-300/50" },
};

export default function Column({ columnId, tasks, onAddTask, onCardClick }) {
  const style = COLUMN_STYLES[columnId] || { dot: "bg-slate-300", label: columnId, dragBg: "bg-slate-200/50 ring-slate-300" };

  return (
    <div className="flex flex-col w-[300px] flex-shrink-0">
      <div className="flex items-center gap-2 px-1 mb-3">
        <span className={`w-2.5 h-2.5 rounded-full ${style.dot} transition-transform`} />
        <h2 className="text-sm font-semibold text-slate-700">{style.label}</h2>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded-2xl p-2 transition-colors duration-200 min-h-[140px] border border-dashed ${
              snapshot.isDraggingOver
                ? `${style.dragBg} ring-2 border-indigo-300/80 shadow-sm`
                : "bg-transparent border-transparent"
            }`}
          >
            <div className="flex flex-col gap-2.5">
              {tasks.map((task, index) => (
                <TaskCardWrapper key={task.id} task={task} index={index} onCardClick={onCardClick} />
              ))}
              {provided.placeholder}
            </div>
            <div className="mt-2">
              <QuickAddTask onAdd={(title) => onAddTask(columnId, title)} />
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}

const TaskCardWrapper = ({ task, index, onCardClick }) => {
  return <TaskCard task={{ ...task, _index: index }} onClick={() => onCardClick(task)} />;
};