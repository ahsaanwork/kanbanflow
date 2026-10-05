import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, X } from "lucide-react";

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function TaskDetailModal({ task, open, onClose, onUpdate, onDelete }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [saveTimer, setSaveTimer] = useState(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "medium");
      setDueDate(task.due_date || "");
    }
  }, [task?.id]);

  const scheduleSave = (patch) => {
    if (saveTimer) clearTimeout(saveTimer);
    const t = setTimeout(() => {
      onUpdate(task.id, patch);
    }, 500);
    setSaveTimer(t);
  };

  const onTitleChange = (v) => {
    setTitle(v);
    scheduleSave({ title: v });
  };
  const onDescriptionChange = (v) => {
    setDescription(v);
    scheduleSave({ description: v });
  };
  const onPriorityChange = (v) => {
    setPriority(v);
    onUpdate(task.id, { priority: v });
  };
  const onDueDateChange = (v) => {
    setDueDate(v);
    onUpdate(task.id, { due_date: v || null });
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="sr-only">Task details</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogHeader>
        <div className="px-6 pb-6 space-y-5">
          <input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Task title"
            className="w-full text-lg font-semibold text-slate-900 bg-transparent outline-none placeholder-slate-300"
          />

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Add details…"
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-slate-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                Due date
              </label>
              <input
                type="date"
                value={dueDate || ""}
                onChange={(e) => onDueDateChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                Priority
              </label>
              <div className="flex gap-1.5">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => onPriorityChange(p.value)}
                    className={`flex-1 text-xs font-medium px-2 py-2 rounded-lg border transition-colors ${
                      priority === p.value
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete task
            </button>
            <span className="text-xs text-slate-400">Changes save automatically</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}