import React from "react";
import { LayoutGrid, Calendar, BarChart3, Settings, CheckSquare, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const ICONS = [
  { icon: LayoutGrid, key: "board", label: "Board" },
  { icon: Calendar, key: "calendar", label: "Calendar" },
  { icon: BarChart3, key: "stats", label: "Stats" },
  { icon: Settings, key: "settings", label: "Settings" },
];

export default function Sidebar({ view, onViewChange }) {
  const { logout, user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col items-center w-14 py-5 border-r border-slate-200 bg-white/50">
      <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center mb-6">
        <CheckSquare className="w-5 h-5 text-white" />
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        {ICONS.map(({ icon: Icon, key, label }) => {
          const active = view === key;
          return (
            <button
              key={key}
              title={label}
              onClick={() => onViewChange(key)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                active ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </nav>
      <div className="pt-2">
        <button
          title={`Log out (${user?.email || ""})`}
          onClick={() => logout()}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}