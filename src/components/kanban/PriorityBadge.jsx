import React from "react";

const PRIORITY_CONFIG = {
  high: { label: "High", bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
  medium: { label: "Medium", bg: "bg-amber-100", text: "text-amber-600", dot: "bg-amber-500" },
  low: { label: "Low", bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
};

export default function PriorityBadge({ priority, size = "sm" }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  const sizes = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${cfg.bg} ${cfg.text} ${sizes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}