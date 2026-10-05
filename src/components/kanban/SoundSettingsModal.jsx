import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Volume2, VolumeX, Play, RotateCcw, Sliders } from "lucide-react";
import { sounds, SOUND_OPTIONS } from "@/utils/soundEffects";

const ACTION_LABELS = [
  {
    key: "grab",
    title: "Holding / Grabbing Card",
    description: "Plays when you click and hold a card to start dragging",
  },
  {
    key: "drag",
    title: "Dragging over Columns",
    description: "Plays as the card hovers across different columns",
  },
  {
    key: "release",
    title: "Card Dropped / Released",
    description: "Plays when dropping a card into a column",
  },
  {
    key: "done",
    title: "Task Done / Completed",
    description: "Celebratory fanfare when moving a task to Done",
  },
  {
    key: "add",
    title: "Add Task",
    description: "Plays when creating a new task",
  },
  {
    key: "delete",
    title: "Delete Task",
    description: "Plays when deleting a task",
  },
];

export default function SoundSettingsModal({ open, onClose, onConfigChange }) {
  const [config, setConfig] = useState(() => sounds.getConfig());

  const handleSelectSound = (action, soundId) => {
    sounds.setActionSound(action, soundId);
    sounds.playSound(action, soundId);
    const updated = sounds.getConfig();
    setConfig(updated);
    if (onConfigChange) onConfigChange(updated);
  };

  const handlePreview = (action, soundId) => {
    sounds.playSound(action, soundId);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    sounds.setVolume(val);
    const updated = sounds.getConfig();
    setConfig(updated);
    if (onConfigChange) onConfigChange(updated);
  };

  const handleToggleMute = () => {
    const nextMuted = sounds.toggleMute();
    const updated = sounds.getConfig();
    setConfig(updated);
    if (!nextMuted) {
      sounds.playClick();
    }
    if (onConfigChange) onConfigChange(updated);
  };

  const handleReset = () => {
    const def = sounds.resetDefaults();
    setConfig(def);
    sounds.playDone();
    if (onConfigChange) onConfigChange(def);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">Sound Customizer</DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Choose custom sound effects for each Kanban interaction
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Master Volume & Global Mute */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleMute}
                className={`p-2.5 rounded-xl border transition-all active:scale-95 flex items-center gap-2 text-xs font-semibold ${
                  config.muted
                    ? "bg-slate-200 text-slate-600 border-slate-300"
                    : "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200"
                }`}
              >
                {config.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{config.muted ? "Muted" : "Sound Enabled"}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 flex-1 sm:max-w-xs">
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Volume:</span>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={config.volume}
                onChange={handleVolumeChange}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700 w-9 text-right">
                {Math.round(config.volume * 100)}%
              </span>
            </div>
          </div>

          {/* Action Sound Customization List */}
          <div className="space-y-4">
            {ACTION_LABELS.map(({ key, title, description }) => {
              const currentSound = config[key];
              const options = SOUND_OPTIONS[key] || [];

              return (
                <div
                  key={key}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 hover:border-slate-300 transition-colors shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                      <p className="text-xs text-slate-400">{description}</p>
                    </div>
                    <button
                      onClick={() => handlePreview(key, currentSound)}
                      title="Preview sound"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95 text-xs font-medium transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Preview</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                    {options.map((opt) => {
                      const selected = currentSound === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectSound(key, opt.id)}
                          className={`text-xs px-2.5 py-2 rounded-xl border text-center transition-all font-medium active:scale-95 truncate ${
                            selected
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-slate-50/80 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-white"
                          }`}
                        >
                          {opt.label.replace(" (Default)", "")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to defaults
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
