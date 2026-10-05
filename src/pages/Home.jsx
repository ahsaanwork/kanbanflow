import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Search, Volume2, VolumeX, Sliders } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { toast } from "react-hot-toast";
import Sidebar from "@/components/kanban/Sidebar";
import StatsStrip from "@/components/kanban/StatsStrip";
import Column from "@/components/kanban/Column";
import TaskDetailModal from "@/components/kanban/TaskDetailModal";
import CalendarView from "@/components/kanban/CalendarView";
import SoundSettingsModal from "@/components/kanban/SoundSettingsModal";
import { sounds } from "@/utils/soundEffects";
import { fireDoneConfetti } from "@/utils/confetti";

const COLUMNS = ["backlog", "todo", "in_progress", "done"];

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [soundModalOpen, setSoundModalOpen] = useState(false);
  const [view, setView] = useState("board");
  const [soundMuted, setSoundMuted] = useState(() => sounds.isMuted());

  const lastHoveredDroppableRef = useRef(null);

  const toggleSound = () => {
    const nextMuted = sounds.toggleMute();
    setSoundMuted(nextMuted);
    if (!nextMuted) {
      sounds.playClick();
      toast.success("Sound effects enabled", { id: "sound-toast", duration: 1500 });
    } else {
      toast("Sound effects muted", { id: "sound-toast", duration: 1500 });
    }
  };

  const handleViewChange = (v) => {
    if (v === "settings") {
      sounds.playClick();
      setSoundModalOpen(true);
    } else {
      setView(v);
    }
  };

  const loadTasks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;
      setTasks(data || []);
    } catch (e) {
      console.error(e);
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
    const filtered = q
      ? tasks.filter(
          (t) =>
            (t.title || "").toLowerCase().includes(q) ||
            (t.description || "").toLowerCase().includes(q)
        )
      : tasks;
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
      const order = tasksByColumn[stage]?.length || 0;
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ title, stage, order }])
        .select()
        .single();

      if (error) throw error;
      setTasks((prev) => [data, ...prev]);
      sounds.playAdd();
    } catch (e) {
      console.error(e);
      toast.error("Could not add task");
      throw e;
    }
  };

  const updateTask = async (id, patch) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    if (selectedTask?.id === id) {
      setSelectedTask((prev) => (prev ? { ...prev, ...patch } : prev));
    }
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    } catch (e) {
      console.error(e);
      toast.error("Could not save change");
      await loadTasks();
    }
  };

  const deleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    sounds.playDelete();
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
      toast.success("Task deleted");
    } catch (e) {
      console.error(e);
      toast.error("Could not delete task");
      await loadTasks();
    }
  };

  const onDragStart = (start) => {
    lastHoveredDroppableRef.current = start.source.droppableId;
    sounds.playGrab();
  };

  const onDragUpdate = (update) => {
    if (update.destination && update.destination.droppableId !== lastHoveredDroppableRef.current) {
      lastHoveredDroppableRef.current = update.destination.droppableId;
      sounds.playDragHover();
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) {
      sounds.playRelease();
      return;
    }
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      sounds.playRelease();
      return;
    }

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    // Check if task landed in Done column
    if (destCol === "done" && sourceCol !== "done") {
      sounds.playDone();
      fireDoneConfetti();
    } else {
      sounds.playRelease();
    }

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
      const { error } = await supabase
        .from("tasks")
        .update({ stage: newStage, updated_at: new Date().toISOString() })
        .eq("id", moved.id);

      if (error) throw error;
    } catch (e) {
      console.error(e);
      toast.error("Could not move task");
      await loadTasks();
    }
  };

  const openTask = (task) => {
    sounds.playClick();
    setSelectedTask(task);
    setModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#F4F4F4] overflow-hidden">
      <Sidebar view={view} onViewChange={handleViewChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/40 backdrop-blur-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Puffy Todos</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Sound Toggle & Customizer Button */}
            <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-full p-1 shadow-sm">
              <button
                onClick={toggleSound}
                title={soundMuted ? "Unmute sound effects" : "Mute sound effects"}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-xs font-semibold ${
                  soundMuted
                    ? "bg-slate-100 text-slate-400 hover:text-slate-600"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{soundMuted ? "Muted" : "Sound On"}</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setSoundModalOpen(true);
                }}
                title="Customize sound effects for each action"
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors active:scale-90"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative w-56 hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks by title or details…"
                className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <StatsStrip tasks={tasks} />
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-7 h-7 border-[3px] border-slate-200 border-t-slate-700 rounded-full animate-spin" />
            </div>
          ) : view === "calendar" ? (
            <CalendarView tasks={tasks} onTaskClick={openTask} />
          ) : (
            <DragDropContext
              onDragStart={onDragStart}
              onDragUpdate={onDragUpdate}
              onDragEnd={onDragEnd}
            >
              <div className="flex gap-4 overflow-x-auto pb-4">
                {COLUMNS.map((col) => (
                  <Column
                    key={col}
                    columnId={col}
                    tasks={tasksByColumn[col]}
                    onAddTask={addTask}
                    onCardClick={openTask}
                  />
                ))}
              </div>
            </DragDropContext>
          )}
        </div>
      </div>

      <TaskDetailModal
        task={selectedTask}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />

      <SoundSettingsModal
        open={soundModalOpen}
        onClose={() => setSoundModalOpen(false)}
        onConfigChange={(cfg) => setSoundMuted(cfg.muted)}
      />
    </div>
  );
}