import React from "react";
import ReactDOM from "react-dom";
import { Draggable } from "@hello-pangea/dnd";
import { Calendar, AlignLeft, CheckCircle2 } from "lucide-react";
import PriorityBadge from "./PriorityBadge";

function isOverdue(dueDate, stage) {
  if (!dueDate || stage === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
}

function formatDate(dueDate) {
  if (!dueDate) return "";
  const d = new Date(dueDate);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TaskCard({ task, onClick }) {
  const overdue = isOverdue(task.due_date, task.stage);
  const isDone = task.stage === "done";

  return (
    <Draggable draggableId={task.id} index={task._index ?? 0}>
      {(provided, snapshot) => {
        const usePortal = snapshot.isDragging;

        const content = (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={onClick}
            style={provided.draggableProps.style}
            className="outline-none"
          >
            <div
              className={`group select-none rounded-xl border p-3.5 cursor-grab active:cursor-grabbing transition-shadow duration-150 ${
                snapshot.isDragging
                  ? "bg-white shadow-2xl ring-2 ring-indigo-400/50 border-indigo-400/60 z-[99999]"
                  : isDone
                  ? "bg-white/85 hover:bg-white border-emerald-100 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.99]"
                  : "bg-white hover:bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.99]"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p
                  className={`text-sm font-medium leading-snug transition-colors ${
                    isDone ? "text-slate-400 line-through decoration-emerald-400/70" : "text-slate-800"
                  }`}
                >
                  {task.title}
                </p>
                {isDone && (
                  <span className="flex-shrink-0 mt-0.5 inline-flex items-center text-emerald-500 animate-in zoom-in-50 duration-200">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
              </div>

              {task.description && (
                <div className="flex items-center gap-1 text-slate-400 mb-2">
                  <AlignLeft className="w-3 h-3" />
                  <span className="text-[11px] truncate">Details</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <PriorityBadge priority={task.priority} />
                {task.due_date && (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                      overdue ? "text-red-600 font-semibold" : "text-slate-400"
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    {formatDate(task.due_date)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );

        if (usePortal) {
          return ReactDOM.createPortal(content, document.body);
        }
        return content;
      }}
    </Draggable>
  );
}