import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "react-hot-toast";
import Sidebar from "@/components/kanban/Sidebar";
import StatsStrip from "@/components/kanban/StatsStrip";
import Column from "@/components/kanban/Column";
import TaskDetailModal from "@/components/kanban/TaskDetailModal";
import CalendarView from "@/components/kanban/CalendarView";

const COLUMNS = ["backlog", "todo", "in_progress", "done"];

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState("board");

  const loadTasks = useCallback(async () => {
    try {
      const data = await base44.entities.Task.list("-created_date", 200);
      setTasks(data);
    } catch (e) {
      toast.error("Could not load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const tasksByColumn = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q ?
    tasks.filter(
      (t) =>
      (t.title || "").toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q)
    ) :
    tasks;
    const grouped = { backlog: [], todo: [], in_progress: [], done: [] };
    filtered.forEach((t) => {
      if (grouped[t.stage]) grouped[t.stage].push(t);
    });
    COLUMNS.forEach((c) => {
      grouped[c].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });
    return grouped;
  }, [tasks, search]);

  const addTask = async (stage, title) => {
    try {
      const order = tasksByColumn[stage].length;
      const created = await base44.entities.Task.create({ title, stage, order });
      setTasks((prev) => [created, ...prev]);
    } catch (e) {
      toast.error("Could not add task");
      throw e;
    }
  };

  const updateTask = async (id, patch) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...patch } : t));
    if (selectedTask?.id === id) {
      setSelectedTask((prev) => prev ? { ...prev, ...patch } : prev);
    }
    try {
      await base44.entities.Task.update(id, patch);
    } catch (e) {
      toast.error("Could not save change");
      await loadTasks();
    }
  };

  const deleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await base44.entities.Task.delete(id);
      toast.success("Task deleted");
    } catch (e) {
      toast.error("Could not delete task");
      await loadTasks();
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    const sourceTasks = [...tasksByColumn[sourceCol]];
    const [moved] = sourceTasks.splice(source.index, 1);
    if (!moved) return;

    const newStage = destCol;
    const updatedMoved = { ...moved, stage: newStage };

    let destTasks;
    if (sourceCol === destCol) {
      destTasks = sourceTasks;
    } else {
      destTasks = [...tasksByColumn[destCol]];
    }
    destTasks.splice(destination.index, 0, updatedMoved);

    // Optimistic update
    setTasks((prev) => {
      const others = prev.filter((t) => t.id !== moved.id);
      return [...others, updatedMoved];
    });

    // Persist stage change + reorder
    try {
      await base44.entities.Task.update(moved.id, { stage: newStage });
    } catch (e) {
      toast.error("Could not move task");
      await loadTasks();
    }
  };

  const openTask = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#F4F4F4] overflow-hidden">
      <Sidebar view={view} onViewChange={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/40 backdrop-blur-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Puffy Todos </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="relative w-56 hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks by title or details…"
              className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-slate-400" />
            
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <StatsStrip tasks={tasks} />
          {loading ?
          <div className="flex items-center justify-center h-64">
              <div className="w-7 h-7 border-[3px] border-slate-200 border-t-slate-700 rounded-full animate-spin" />
            </div> :
          view === "calendar" ?
          <CalendarView tasks={tasks} onTaskClick={openTask} /> :

          <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {COLUMNS.map((col) =>
              <Column
                key={col}
                columnId={col}
                tasks={tasksByColumn[col]}
                onAddTask={addTask}
                onCardClick={openTask} />

              )}
              </div>
            </DragDropContext>
          }
        </div>
      </div>

      <TaskDetailModal
        task={selectedTask}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={updateTask}
        onDelete={deleteTask} />
      
    </div>);

}