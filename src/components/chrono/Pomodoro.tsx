"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap, Brain, Target, Plus, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { generateFocusMantra } from '@/ai/flows/generate-focus-mantra';
import { cn } from '@/lib/utils';

export type TimerMode = 'work' | 'short-break' | 'long-break';

const MODE_CONFIG: Record<TimerMode, { label: string, duration: number, color: string, glow: string, bg: string }> = {
  work: { 
    label: 'Focus Work', 
    duration: 25 * 60, 
    color: 'text-primary', 
    glow: 'shadow-primary/20',
    bg: 'bg-primary/10'
  },
  'short-break': { 
    label: 'Short Break', 
    duration: 5 * 60, 
    color: 'text-accent', 
    glow: 'shadow-accent/20',
    bg: 'bg-accent/10'
  },
  'long-break': { 
    label: 'Long Break', 
    duration: 15 * 60, 
    color: 'text-indigo-400', 
    glow: 'shadow-indigo-500/20',
    bg: 'bg-indigo-500/10'
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

  const progress = ((MODE_CONFIG[mode].duration - timeLeft) / MODE_CONFIG[mode].duration) * 100;

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Math.random().toString(36).substr(2, 9), text: newTask, completed: false }]);
    setNewTask('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-2.5 px-1">
        <div className={cn(
          "w-2.5 h-2.5 rounded-full animate-pulse shadow-lg transition-all duration-700",
          mode === 'work' ? 'bg-primary' : mode === 'short-break' ? 'bg-accent' : 'bg-indigo-400'
        )} />
        <span className="text-[10px] uppercase font-black tracking-[0.25em] text-foreground/80">Focus Performance Engine</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rectangle Timer Visualization */}
        <div className="lg:col-span-2 glass-card !p-0 flex flex-col items-center justify-between relative overflow-hidden group min-h-[450px]">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_var(--tw-gradient-from)_0%,_transparent_50%)] from-primary/5 opacity-20 pointer-events-none" />
          
          <div className="w-full p-8 flex flex-col items-center flex-grow justify-center space-y-10">
            <div className="flex gap-2 bg-muted/30 p-1.5 rounded-2xl border border-white/5">
              {(Object.keys(MODE_CONFIG) as TimerMode[]).map((m) => (
                <Button
                  key={m}
                  variant={mode === m ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => changeMode(m)}
                  className={cn(
                    "rounded-xl text-[9px] uppercase font-black tracking-widest px-6 h-9 transition-all duration-300",
                    mode === m && cn("bg-primary text-primary-foreground shadow-xl", MODE_CONFIG[m].glow)
                  )}
                >
                  {MODE_CONFIG[m].label}
                </Button>
              ))}
            </div>

            {/* Separate Clock Background Area */}
            <div className={cn(
              "relative px-12 py-10 rounded-[4rem] transition-all duration-1000 ease-in-out border border-white/10 shadow-inner group-hover:scale-[1.02]",
              mode === 'work' ? 'bg-primary/5' : mode === 'short-break' ? 'bg-accent/5' : 'bg-indigo-500/5'
            )}>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl rounded-[4rem] -z-10" />
              <div className={cn(
                "text-8xl md:text-[11rem] font-black tracking-tighter tabular-nums transition-colors duration-1000 leading-none",
                MODE_CONFIG[mode].color
              )}>
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={toggleTimer}
                className={cn(
                  "h-16 px-14 rounded-3xl font-black uppercase tracking-widest transition-all shadow-2xl hover:scale-[1.05]",
                  isActive ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground",
                  !isActive && MODE_CONFIG[mode].glow
                )}
              >
                {isActive ? <Pause className="w-6 h-6 mr-3" /> : <Play className="w-6 h-6 mr-3" />}
                {isActive ? 'Freeze' : 'Ignite'}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={resetTimer}
                className="w-16 h-16 rounded-3xl border-white/10 hover:bg-white/10 transition-all"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Linear Progress Indicator */}
          <div className="w-full px-8 pb-8">
             <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-40">
                  <span>Cycle Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={cn("h-full transition-all duration-1000 ease-linear", mode === 'work' ? 'bg-primary' : mode === 'short-break' ? 'bg-accent' : 'bg-indigo-400')}
                    style={{ width: `${progress}%` }}
                  />
                </div>
             </div>
          </div>
        </div>

        {/* Mantra & Tasks */}
        <div className="space-y-6">
          <div className="glass-card !p-6 border-accent/20 bg-accent/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Brain className="w-12 h-12 text-accent" />
            </div>
            <h3 className="text-[10px] uppercase font-black tracking-widest text-accent mb-3 flex items-center gap-2">
              <Zap className="w-3 h-3" /> Focus Insight
            </h3>
            {loadingMantra ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 bg-accent/20 rounded w-full"></div>
                <div className="h-3 bg-accent/20 rounded w-4/5"></div>
              </div>
            ) : (
              <p className="text-sm font-medium leading-relaxed italic text-foreground/80">
                "{mantra || "Clarity is the precursor to velocity. Define your target and begin."}"
              </p>
            )}
          </div>

          <div className="glass-card !p-6 border-white/5 space-y-4">
            <h3 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Target Objectives</h3>
            <form onSubmit={addTask} className="flex gap-2">
              <Input
                placeholder="Next target..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="h-10 bg-white/5 border-white/5 text-xs rounded-xl"
              />
              <Button type="submit" size="icon" className="h-10 w-10 shrink-0 bg-primary rounded-xl">
                <Plus className="w-4 h-4" />
              </Button>
            </form>

            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground/40 space-y-2">
                  <Target className="w-6 h-6 mx-auto opacity-20" />
                  <p className="text-[10px] uppercase tracking-widest">No objectives defined</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 glass border-white/5 rounded-xl group hover:border-primary/30 transition-all">
                    <button
                      onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
                      className={cn(
                        "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                        task.completed ? "bg-accent border-accent text-white" : "border-white/10 text-transparent hover:border-accent"
                      )}
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <span className={cn("text-[11px] flex-grow font-medium transition-all", task.completed && "line-through opacity-40")}>
                      {task.text}
                    </span>
                    <button
                      onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
