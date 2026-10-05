import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Calendar, AlignLeft } from "lucide-react";
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
  return (
    <Draggable draggableId={task.id} index={task._index ?? 0}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`group bg-white rounded-xl border border-slate-200/80 p-3.5 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-slate-300 ${
            snapshot.isDragging ? "shadow-lg rotate-1 border-slate-300" : ""
          }`}
        >
          <p className="text-sm font-medium text-slate-800 leading-snug mb-2">{task.title}</p>
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
                  overdue ? "text-red-600" : "text-slate-400"
                }`}
              >
                <Calendar className="w-3 h-3" />
                {formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}