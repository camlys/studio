"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Brain, Zap, Target, Plus, Check, X, Settings, BarChart3, UserCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateFocusMantra } from '@/ai/flows/generate-focus-mantra';
import { cn } from '@/lib/utils';

export type TimerMode = 'work' | 'short-break' | 'long-break';

const MODE_CONFIG: Record<TimerMode, { label: string, duration: number, color: string }> = {
  work: { 
    label: 'Pomodoro', 
    duration: 25 * 60, 
    color: 'bg-[#ba4949]'
  },
  'short-break': { 
    label: 'Short Break', 
    duration: 5 * 60, 
    color: 'bg-[#38858a]'
  },
  'long-break': { 
    label: 'Long Break', 
    duration: 15 * 60, 
    color: 'bg-[#397097]'
  },
};

interface PomodoroProps {
  onModeChange?: (mode: TimerMode) => void;
}

export function Pomodoro({ onModeChange }: PomodoroProps) {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(MODE_CONFIG['work'].duration);
  const [isActive, setIsActive] = useState(false);
  const [mantra, setMantra] = useState<string | null>(null);
  const [loadingMantra, setLoadingMantra] = useState(false);
  const [tasks, setTasks] = useState<{ id: string, text: string, completed: boolean }[]>([]);
  const [newTask, setNewTask] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMantra = useCallback(async (currentMode: TimerMode, currentTask?: string) => {
    setLoadingMantra(true);
    try {
      const result = await generateFocusMantra({ mode: currentMode, task: currentTask });
      setMantra(result.mantra);
    } catch (error) {
      console.error("Mantra generation failed", error);
    } finally {
      setLoadingMantra(false);
    }
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    fetchMantra(mode, tasks.find(t => !t.completed)?.text);
    if (onModeChange) onModeChange(mode);
  }, [mode, fetchMantra, onModeChange]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODE_CONFIG[mode].duration);
  };

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(MODE_CONFIG[newMode].duration);
    setIsActive(false);
    if (onModeChange) onModeChange(newMode);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Math.random().toString(36).substr(2, 9), text: newTask, completed: false }]);
    setNewTask('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start justify-center py-4 animate-in fade-in duration-500">
      
      {/* Left Column: Timer and Mantra */}
      <div className="w-full lg:w-[540px] space-y-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-10 flex flex-col items-center transition-all duration-500 shadow-2xl">
          <div className="flex gap-1 mb-8">
            {(Object.keys(MODE_CONFIG) as TimerMode[]).map((m) => (
              <button
                key={m}
                onClick={() => changeMode(m)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs md:text-sm font-bold transition-all text-white",
                  mode === m ? "bg-black/15" : "hover:bg-black/5"
                )}
              >
                {MODE_CONFIG[m].label}
              </button>
            ))}
          </div>

          <div className="text-[100px] sm:text-[130px] md:text-[160px] leading-none font-black text-white tabular-nums mb-12 select-none tracking-tighter">
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={toggleTimer}
            className={cn(
              "w-56 h-16 bg-white rounded-md text-2xl font-black uppercase tracking-widest transition-all active:translate-y-1 shadow-[0_6px_0_rgb(235,235,235)] active:shadow-none",
              mode === 'work' ? "text-[#ba4949]" : mode === 'short-break' ? "text-[#38858a]" : "text-[#397097]"
            )}
          >
            {isActive ? 'STOP' : 'START'}
          </button>
        </div>

        {/* Status and Mantra */}
        <div className="text-center text-white space-y-4">
          <div className="space-y-1">
            <p className="text-xs opacity-60">#{tasks.filter(t => t.completed).length + 1}</p>
            <p className="text-base font-bold">
              {isActive ? (mode === 'work' ? 'Time to focus!' : 'Taking a break!') : (mode === 'work' ? 'Ready to focus?' : 'Break time!')}
            </p>
          </div>

          {mantra && (
            <div className="bg-black/10 rounded-xl p-6 text-center border border-white/10 backdrop-blur-sm">
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 mb-2">Focus Mantra</h4>
              <p className="text-sm md:text-base font-medium italic text-white leading-relaxed">"{mantra}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Tasks Section */}
      <div className="flex-grow w-full lg:max-w-[440px] space-y-4">
        <div className="flex items-center justify-between border-b border-white/30 pb-3">
          <h3 className="text-lg font-bold text-white uppercase tracking-widest text-xs">Focus Objectives</h3>
          <button className="bg-white/20 hover:bg-white/30 p-1.5 rounded transition-colors">
            <Settings className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 && (
            <div className="bg-white/5 border border-dashed border-white/20 rounded-md p-8 text-center">
              <p className="text-white/40 text-xs italic">No objectives defined for this session.</p>
            </div>
          )}
          
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="group flex items-center gap-3 bg-white rounded-md p-4 transition-all hover:translate-x-1 shadow-md"
            >
              <button
                onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                  task.completed ? "bg-accent border-accent text-white" : "border-gray-200 text-transparent hover:border-gray-400"
                )}
              >
                <Check className="w-4 h-4" />
              </button>
              <span className={cn(
                "flex-grow font-bold text-gray-700 text-sm",
                task.completed && "line-through opacity-40"
              )}>
                {task.text}
              </span>
              <button
                onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={addTask} className="relative pt-2">
          {newTask ? (
            <div className="bg-white rounded-md p-4 space-y-4 animate-in slide-in-from-top-2 shadow-xl">
              <Input
                placeholder="What are you working on?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="border-none shadow-none text-base font-bold p-0 focus-visible:ring-0 placeholder:text-gray-300"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setNewTask('')}
                  className="text-gray-500 font-bold h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gray-800 text-white font-bold px-6 h-8 text-xs"
                >
                  Save Objective
                </Button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setNewTask(' ')}
              className="w-full h-14 border-2 border-dashed border-white/40 rounded-md flex items-center justify-center gap-2 text-white/80 font-bold hover:bg-white/10 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">Add Objective</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
