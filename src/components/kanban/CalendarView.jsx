import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CHIP_STYLES = {
  high: "bg-red-100 text-red-700 hover:bg-red-200",
  medium: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  low: "bg-slate-100 text-slate-600 hover:bg-slate-200",
};

function toKey(dateStr) {
  // normalize YYYY-MM-DD to local date key
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function CalendarView({ tasks, onTaskClick }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      if (!t.due_date) return;
      const key = toKey(t.due_date);
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const grid = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];
    // leading days from prev month
    for (let i = startWeekday - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, month: viewMonth - 1, year: viewYear, current: false });
    }
    // current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, month: viewMonth, year: viewYear, current: true });
    }
    // trailing days to fill 6 rows (42 cells)
    let nextDay = 1;
    while (cells.length < 42) {
      cells.push({ day: nextDay++, month: viewMonth + 1, year: viewYear, current: false });
    }
    return cells;
  }, [viewMonth, viewYear]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isToday = (cell) =>
    cell.current &&
    cell.day === today.getDate() &&
    cell.month === today.getMonth() &&
    cell.year === today.getFullYear();

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
      {/* Calendar header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">
          {MONTHS[viewMonth]} {viewYear}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setViewMonth(today.getMonth());
              setViewYear(today.getFullYear());
            }}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-slate-100">
        {WEEKDAYS.map((d) => (
          <div key={d} className="px-2 py-2.5 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {grid.map((cell, idx) => {
          const key = `${cell.year}-${cell.month}-${cell.day}`;
          const dayTasks = tasksByDate[key] || [];
          return (
            <div
              key={idx}
              className={`min-h-[104px] p-1.5 border-b border-r border-slate-100 ${
                cell.current ? "bg-white" : "bg-slate-50/60"
              } ${(idx + 1) % 7 === 0 ? "border-r-0" : ""}`}
            >
              <div className="flex justify-end mb-1">
                <span
                  className={`text-xs w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday(cell)
                      ? "bg-slate-900 text-white font-semibold"
                      : cell.current
                      ? "text-slate-600"
                      : "text-slate-300"
                  }`}
                >
                  {cell.day}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {dayTasks.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onTaskClick(t)}
                    className={`text-left text-[11px] font-medium px-2 py-1 rounded-md truncate transition-colors ${
                      CHIP_STYLES[t.priority] || CHIP_STYLES.medium
                    } ${t.stage === "done" ? "line-through opacity-60" : ""}`}
                    title={t.title}
                  >
                    {t.title}
                  </button>
                ))}
                {dayTasks.length > 3 && (
                  <span className="text-[10px] text-slate-400 px-1.5">+{dayTasks.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}