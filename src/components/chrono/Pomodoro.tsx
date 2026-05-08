
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Brain, Zap, Target, Plus, Check, X, Settings, BarChart3, UserCircle, Clock, Volume2, Palette, Bell, Share2, ExternalLink, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateFocusMantra } from '@/ai/flows/generate-focus-mantra';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export type TimerMode = 'work' | 'short-break' | 'long-break';

export type PomodoroSettings = {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
  autoCheckTasks: boolean;
  checkToBottom: boolean;
  alarmSound: string;
  alarmVolume: number;
  alarmRepeat: number;
  focusSound: string;
  focusVolume: number;
  hourFormat: '12' | '24';
  darkModeWhenRunning: boolean;
  reminderMode: 'last' | 'first';
  reminderTime: number;
};

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  autoCheckTasks: false,
  checkToBottom: true,
  alarmSound: 'kitchen',
  alarmVolume: 50,
  alarmRepeat: 1,
  focusSound: 'none',
  focusVolume: 50,
  hourFormat: '24',
  darkModeWhenRunning: false,
  reminderMode: 'last',
  reminderTime: 0,
};

interface PomodoroProps {
  onModeChange?: (mode: TimerMode) => void;
  isExternalSettingsOpen?: boolean;
  onExternalSettingsOpenChange?: (open: boolean) => void;
}

export function Pomodoro({ onModeChange, isExternalSettingsOpen, onExternalSettingsOpenChange }: PomodoroProps) {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mantra, setMantra] = useState<string | null>(null);
  const [loadingMantra, setLoadingMantra] = useState(false);
  const [tasks, setTasks] = useState<{ id: string, text: string, completed: boolean }[]>([]);
  const [newTask, setNewTask] = useState('');
  const [localSettingsOpen, setLocalSettingsOpen] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pomodoroCountRef = useRef(0);

  useEffect(() => {
    const savedSettings = localStorage.getItem('chrono_pomodoro_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Merge with DEFAULT_SETTINGS to ensure new keys aren't undefined
        const mergedSettings = { ...DEFAULT_SETTINGS, ...parsed };
        setSettings(mergedSettings);
        
        const duration = mode === 'work' ? mergedSettings.workDuration : 
                         mode === 'short-break' ? mergedSettings.shortBreakDuration : 
                         mergedSettings.longBreakDuration;
        setTimeLeft(duration * 60);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const isSettingsOpen = isExternalSettingsOpen !== undefined ? isExternalSettingsOpen : localSettingsOpen;
  const setSettingsOpen = (open: boolean) => {
    if (onExternalSettingsOpenChange) {
      onExternalSettingsOpenChange(open);
    } else {
      setLocalSettingsOpen(open);
    }
  };

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

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (mode === 'work') {
      pomodoroCountRef.current += 1;
      const nextMode = pomodoroCountRef.current % settings.longBreakInterval === 0 ? 'long-break' : 'short-break';
      setMode(nextMode);
      
      const duration = nextMode === 'work' ? settings.workDuration : 
                       nextMode === 'short-break' ? settings.shortBreakDuration : 
                       settings.longBreakDuration;
      setTimeLeft(duration * 60);

      if (settings.autoStartBreaks) setIsActive(true);
    } else {
      setMode('work');
      setTimeLeft(settings.workDuration * 60);
      if (settings.autoStartPomodoros) setIsActive(true);
    }
  }, [mode, settings]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, handleTimerComplete]);

  useEffect(() => {
    fetchMantra(mode, tasks.find(t => !t.completed)?.text);
    if (onModeChange) onModeChange(mode);
  }, [mode, fetchMantra, onModeChange]);

  const toggleTimer = () => setIsActive(!isActive);

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    const duration = newMode === 'work' ? settings.workDuration : 
                     newMode === 'short-break' ? settings.shortBreakDuration : 
                     newMode === 'long-break' ? settings.longBreakDuration : DEFAULT_SETTINGS.workDuration;
    setTimeLeft(duration * 60);
    setIsActive(false);
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

  const updateSettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    localStorage.setItem('chrono_pomodoro_settings', JSON.stringify(newSettings));
    
    if (!isActive) {
      const duration = mode === 'work' ? newSettings.workDuration : 
                       mode === 'short-break' ? newSettings.shortBreakDuration : 
                       newSettings.longBreakDuration;
      setTimeLeft(duration * 60);
    }
  };

  const sortedTasks = settings.checkToBottom 
    ? [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed))
    : tasks;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start justify-center py-4 animate-in fade-in duration-500">
      
      <div className="w-full lg:w-[540px] space-y-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-10 flex flex-col items-center transition-all duration-500 shadow-2xl">
          <div className="flex gap-1 mb-8">
            <button onClick={() => changeMode('work')} className={cn("px-3 py-1.5 rounded-md text-xs md:text-sm font-bold transition-all text-white", mode === 'work' ? "bg-black/15" : "hover:bg-black/5")}>Pomodoro</button>
            <button onClick={() => changeMode('short-break')} className={cn("px-3 py-1.5 rounded-md text-xs md:text-sm font-bold transition-all text-white", mode === 'short-break' ? "bg-black/15" : "hover:bg-black/5")}>Short Break</button>
            <button onClick={() => changeMode('long-break')} className={cn("px-3 py-1.5 rounded-md text-xs md:text-sm font-bold transition-all text-white", mode === 'long-break' ? "bg-black/15" : "hover:bg-black/5")}>Long Break</button>
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

      <div className="flex-grow w-full lg:max-w-[440px] space-y-4">
        <div className="flex items-center justify-between border-b border-white/30 pb-3">
          <h3 className="text-lg font-bold text-white uppercase tracking-widest text-xs">Focus Objectives</h3>
          
          <Dialog open={isSettingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <button className="bg-white/20 hover:bg-white/30 p-1.5 rounded transition-colors">
                <Settings className="w-4 h-4 text-white" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-center uppercase tracking-widest text-muted-foreground text-[10px] border-b pb-4">Setting</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-8 py-4">
                {/* Timer Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground/40 text-[9px] font-black uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" /> Timer
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground/80">Time (minutes)</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground/60 font-bold">Pomodoro</span>
                        <Input 
                          type="number" 
                          value={settings.workDuration ?? 25} 
                          onChange={(e) => updateSettings({...settings, workDuration: parseInt(e.target.value, 10) || 0})}
                          className="bg-muted border-none h-10 font-bold text-sm"
                          min={1}
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground/60 font-bold">Short Break</span>
                        <Input 
                          type="number" 
                          value={settings.shortBreakDuration ?? 5} 
                          onChange={(e) => updateSettings({...settings, shortBreakDuration: parseInt(e.target.value, 10) || 0})}
                          className="bg-muted border-none h-10 font-bold text-sm"
                          min={1}
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground/60 font-bold">Long Break</span>
                        <Input 
                          type="number" 
                          value={settings.longBreakDuration ?? 15} 
                          onChange={(e) => updateSettings({...settings, longBreakDuration: parseInt(e.target.value, 10) || 0})}
                          className="bg-muted border-none h-10 font-bold text-sm"
                          min={1}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1 pt-2">
                    <Label className="text-xs font-bold text-muted-foreground/80">Auto Start Breaks</Label>
                    <Switch 
                      checked={settings.autoStartBreaks ?? false} 
                      onCheckedChange={(v) => updateSettings({...settings, autoStartBreaks: v})} 
                    />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <Label className="text-xs font-bold text-muted-foreground/80">Auto Start Pomodoros</Label>
                    <Switch 
                      checked={settings.autoStartPomodoros ?? false} 
                      onCheckedChange={(v) => updateSettings({...settings, autoStartPomodoros: v})} 
                    />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <Label className="text-xs font-bold text-muted-foreground/80">Long Break interval</Label>
                    <Input 
                      type="number" 
                      value={settings.longBreakInterval ?? 4} 
                      onChange={(e) => updateSettings({...settings, longBreakInterval: parseInt(e.target.value, 10) || 1})}
                      className="bg-muted border-none h-10 w-16 font-bold text-right text-sm"
                      min={1}
                    />
                  </div>
                </div>

                <Separator />

                {/* Sound Settings */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-muted-foreground/40 text-[9px] font-black uppercase tracking-widest">
                    <Volume2 className="w-3.5 h-3.5" /> Sound
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-muted-foreground/80">Alarm Sound</Label>
                      <div className="flex items-center gap-2">
                         <Select value={settings.alarmSound ?? 'kitchen'} onValueChange={(v) => updateSettings({...settings, alarmSound: v})}>
                          <SelectTrigger className="w-[140px] bg-muted border-none text-xs font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kitchen">Kitchen</SelectItem>
                            <SelectItem value="bell">Bell</SelectItem>
                            <SelectItem value="digital">Digital</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pl-1">
                      <span className="text-[10px] font-bold text-muted-foreground/40 w-5">{settings.alarmVolume ?? 50}</span>
                      <Slider 
                        value={[settings.alarmVolume ?? 50]} 
                        max={100} 
                        step={1} 
                        onValueChange={([v]) => updateSettings({...settings, alarmVolume: v})}
                        className="flex-grow"
                      />
                      <div className="flex items-center gap-2 ml-2">
                         <span className="text-[9px] font-black text-muted-foreground/40 uppercase">repeat</span>
                         <Input 
                            type="number" 
                            value={settings.alarmRepeat ?? 1} 
                            onChange={(e) => updateSettings({...settings, alarmRepeat: parseInt(e.target.value, 10) || 1})}
                            className="bg-muted border-none h-8 w-12 font-bold text-center text-xs"
                          />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-muted-foreground/80">Focus Sound</Label>
                      <Select value={settings.focusSound ?? 'none'} onValueChange={(v) => updateSettings({...settings, focusSound: v})}>
                        <SelectTrigger className="w-[140px] bg-muted border-none text-xs font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="white-noise">White Noise</SelectItem>
                          <SelectItem value="rain">Rain</SelectItem>
                          <SelectItem value="waves">Waves</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-4 pl-1">
                      <span className="text-[10px] font-bold text-muted-foreground/40 w-5">{settings.focusVolume ?? 50}</span>
                      <Slider 
                        value={[settings.focusVolume ?? 50]} 
                        max={100} 
                        step={1} 
                        onValueChange={([v]) => updateSettings({...settings, focusVolume: v})}
                        className="flex-grow"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Theme Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground/40 text-[9px] font-black uppercase tracking-widest">
                    <Palette className="w-3.5 h-3.5" /> Theme
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-muted-foreground/80">Color Themes</Label>
                    <div className="flex gap-2">
                       <div className="w-6 h-6 rounded-md bg-[#ba4949] cursor-pointer ring-offset-2 ring-primary/20" />
                       <div className="w-6 h-6 rounded-md bg-[#38858a] cursor-pointer" />
                       <div className="w-6 h-6 rounded-md bg-[#397097] cursor-pointer" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-muted-foreground/80">Hour Format</Label>
                    <Select value={settings.hourFormat ?? '24'} onValueChange={(v: '12' | '24') => updateSettings({...settings, hourFormat: v})}>
                      <SelectTrigger className="w-[140px] bg-muted border-none text-xs font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24-hour</SelectItem>
                        <SelectItem value="12">12-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-muted-foreground/80">Dark Mode when running</Label>
                    <Switch 
                      checked={settings.darkModeWhenRunning ?? false} 
                      onCheckedChange={(v) => updateSettings({...settings, darkModeWhenRunning: v})} 
                    />
                  </div>
                </div>

                <Separator />

                {/* Notification Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground/40 text-[9px] font-black uppercase tracking-widest">
                    <Bell className="w-3.5 h-3.5" /> Notification
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-muted-foreground/80">Reminder</Label>
                    <div className="flex items-center gap-2">
                       <Select value={settings.reminderMode ?? 'last'} onValueChange={(v: 'last' | 'first') => updateSettings({...settings, reminderMode: v})}>
                          <SelectTrigger className="w-[80px] bg-muted border-none text-xs font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="last">Last</SelectItem>
                            <SelectItem value="first">First</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input 
                          type="number" 
                          value={settings.reminderTime ?? 0} 
                          onChange={(e) => updateSettings({...settings, reminderTime: parseInt(e.target.value, 10) || 0})}
                          className="bg-muted border-none h-10 w-16 font-bold text-center text-xs"
                          min={0}
                        />
                        <span className="text-[10px] font-bold text-muted-foreground/60">min</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Integration Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground/40 text-[9px] font-black uppercase tracking-widest">
                    <Zap className="w-3.5 h-3.5" /> Integration
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-muted-foreground/80 flex items-center gap-1.5">
                      Todoist <InfoIcon className="w-3 h-3 opacity-30" />
                    </Label>
                    <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase tracking-widest font-black gap-2 opacity-60">
                      Connect <Lock className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-muted-foreground/80 flex items-center gap-1.5">
                      Webhook <InfoIcon className="w-3 h-3 opacity-30" />
                    </Label>
                    <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase tracking-widest font-black gap-2 opacity-60">
                      Add <Lock className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setSettingsOpen(false)} className="bg-[#444] hover:bg-[#333] text-white font-black text-[10px] uppercase tracking-[0.2em] px-10 rounded-md h-10 transition-all">OK</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 && (
            <div className="bg-white/5 border border-dashed border-white/20 rounded-md p-8 text-center">
              <p className="text-white/40 text-xs italic">No objectives defined for this session.</p>
            </div>
          )}
          
          {sortedTasks.map((task) => (
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
          {newTask && newTask.trim() !== '' ? (
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

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}
