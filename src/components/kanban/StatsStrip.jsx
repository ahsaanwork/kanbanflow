import React from "react";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";

function isOverdue(task) {
  if (!task.due_date || task.stage === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.due_date) < today;
}

export default function StatsStrip({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.stage === "done").length;
  const active = tasks.filter((t) => t.stage === "todo" || t.stage === "in_progress").length;
  const overdue = tasks.filter(isOverdue).length;

  const stats = [
    { label: "Total", value: total, icon: Circle, color: "text-slate-500", bg: "bg-slate-100" },
    { label: "Active", value: active, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Completed", value: completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Overdue", value: overdue, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
              <Icon className={`w-4.5 h-4.5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 leading-none">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}