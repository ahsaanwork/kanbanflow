import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { sounds } from "@/utils/soundEffects";

export default function QuickAddTask({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    sounds.playClick();
    setOpen(true);
  };

  const submit = async (e) => {
    e?.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    try {
      await onAdd(trimmed);
      setTitle("");
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="w-full flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 active:scale-[0.98] transition-all text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Add task
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="px-1 animate-in fade-in-50 zoom-in-95 duration-150">
      <textarea
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) submit(e);
          if (e.key === "Escape") {
            setTitle("");
            setOpen(false);
          }
        }}
        placeholder="Task title…"
        rows={2}
        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200/50 resize-none shadow-sm"
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {saving ? "Adding…" : "Add task"}
        </button>
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setTitle("");
            setOpen(false);
          }}
          className="text-slate-400 hover:text-slate-600 active:scale-90 p-1 rounded-lg transition-transform"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}