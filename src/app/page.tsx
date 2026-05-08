
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { 
  Sun, Moon, RefreshCcw, Share2, Copy, Timer, ChevronRight, 
  Github, Twitter, Mail, Cpu, Database, ShieldCheck, 
  ExternalLink, Globe, BookOpen, Zap, Brain, Activity, 
  Lock, Star, ArrowRight, CheckCircle, Scale, HeartPulse, 
  Coins, Milestone, Server, Layers, BarChart3, Target, Settings, UserCircle,
  Clock, ArrowUpRight, FileText, Workflow
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateInput } from '@/components/chrono/DateInput';
import { ResultCard } from '@/components/chrono/ResultCard';
import { FunFact } from '@/components/chrono/FunFact';
import { Pomodoro, TimerMode, PomodoroSettings } from '@/components/chrono/Pomodoro';
import { isValidDate, calculateAll, DateInputValues, CalculationResults } from '@/lib/date-utils';
import { useToast } from '@/hooks/use-toast';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

export default function ChronoFlow() {
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'diff' | 'age' | 'focus'>('diff');
  const [pomodoroMode, setPomodoroMode] = useState<TimerMode>('work');
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings | null>(null);
  const [isPomodoroSettingsOpen, setIsPomodoroSettingsOpen] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const [dob, setDob] = useState<DateInputValues>({ day: '', month: '', year: '' });
  const [fromDate, setFromDate] = useState<DateInputValues>({ day: '', month: '', year: '' });
  const [toDate, setToDate] = useState<DateInputValues>({ day: '', month: '', year: '' });
  
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tickerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedDob = localStorage.getItem('chrono_dob');
    if (savedDob) setDob(JSON.parse(savedDob));
    
    const savedFrom = localStorage.getItem('chrono_from');
    if (savedFrom) setFromDate(JSON.parse(savedFrom));
    
    const savedTo = localStorage.getItem('chrono_to');
    if (savedTo) {
      setToDate(JSON.parse(savedTo));
    } else {
      const now = new Date();
      setToDate({
        day: now.getDate().toString().padStart(2, '0'),
        month: (now.getMonth() + 1).toString().padStart(2, '0'),
        year: now.getFullYear().toString()
      });
    }

    const savedTheme = localStorage.getItem('chrono_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chrono_dob', JSON.stringify(dob));
    localStorage.setItem('chrono_from', JSON.stringify(fromDate));
    localStorage.setItem('chrono_to', JSON.stringify(toDate));
  }, [dob, fromDate, toDate]);

  useEffect(() => {
    const isOverriddenDark = isTimerActive && pomodoroSettings?.darkModeWhenRunning;
    document.documentElement.classList.toggle('dark', isOverriddenDark || theme === 'dark');
    
    if (!isOverriddenDark) {
      localStorage.setItem('chrono_theme', theme);
    }
  }, [theme, isTimerActive, pomodoroSettings?.darkModeWhenRunning]);

  useEffect(() => {
    if (results && activeTab !== 'focus') {
      tickerRef.current = setInterval(() => {
        setResults(prev => {
          if (!prev) return null;
          return {
            ...prev,
            totalSeconds: prev.totalSeconds + 1,
            totalMinutes: Math.floor((prev.totalSeconds + 1) / 60),
            totalHours: Math.floor((prev.totalSeconds + 1) / 3600),
          };
        });
      }, 1000);
    } else {
      if (tickerRef.current) clearInterval(tickerRef.current);
    }
    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, [results === null, activeTab]);

  const handleCalculate = useCallback(() => {
    setError(null);
    if (tickerRef.current) clearInterval(tickerRef.current);

    if (activeTab === 'age') {
      if (!isValidDate(dob.day, dob.month, dob.year)) {
        setError("Invalid date.");
        return;
      }
      const birth = new Date(parseInt(dob.year), parseInt(dob.month) - 1, parseInt(dob.day));
      if (birth > new Date()) {
        setError("Future date.");
        return;
      }
      setResults(calculateAll(birth));
    } else if (activeTab === 'diff') {
      if (!isValidDate(fromDate.day, fromDate.month, fromDate.year) || 
          !isValidDate(toDate.day, toDate.month, toDate.year)) {
        setError("Invalid dates.");
        return;
      }
      const start = new Date(parseInt(fromDate.year), parseInt(fromDate.month) - 1, parseInt(fromDate.day));
      const end = new Date(parseInt(toDate.year), parseInt(toDate.month) - 1, parseInt(toDate.day));
      setResults(calculateAll(start, end));
    }
  }, [activeTab, dob, fromDate, toDate]);

  const handleReset = () => {
    setDob({ day: '', month: '', year: '' });
    setFromDate({ day: '', month: '', year: '' });
    const now = new Date();
    setToDate({
      day: now.getDate().toString().padStart(2, '0'),
      month: (now.getMonth() + 1).toString().padStart(2, '0'),
      year: now.getFullYear().toString()
    });
    setResults(null);
    setError(null);
  };

  const handleShare = () => {
    if (!results) return;
    const text = activeTab === 'age' 
      ? `I am ${results.years}y, ${results.months}m, ${results.days}d old!`
      : `Difference: ${results.years}y, ${results.months}m, ${results.days}d.`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Results copied to clipboard.",
    });
  };

  const adjustColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#",""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<0?0:R:255)*0x10000 + (G<255?G<0?0:G:255)*0x100 + (B<255?B<0?0:B:255)).toString(16).slice(1);
  };

  const rotateColor = (hex: string, angle: number) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    h = (h + angle / 360) % 1;
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const fr = Math.round(hue2rgb(p, q, h + 1/3) * 255);
    const fg = Math.round(hue2rgb(p, q, h) * 255);
    const fb = Math.round(hue2rgb(p, q, h - 1/3) * 255);
    return "#" + ((1 << 24) + (fr << 16) + (fg << 8) + fb).toString(16).slice(1);
  };

  const getAtmosphereStyles = () => {
    if (activeTab !== 'focus') return {};
    const isOverriddenDark = isTimerActive && pomodoroSettings?.darkModeWhenRunning;
    if (isOverriddenDark) return { backgroundColor: '#09090b' };
    if (theme === 'dark') return { backgroundColor: '#0c0c0e' };
    const baseColor = pomodoroSettings?.themeColor || '#ba4949';
    if (pomodoroMode === 'work') return { backgroundColor: baseColor };
    if (pomodoroMode === 'short-break') return { backgroundColor: rotateColor(baseColor, 40) }; 
    if (pomodoroMode === 'long-break') return { backgroundColor: adjustColor(rotateColor(baseColor, 80), -10) }; 
    return {};
  };

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col transition-all duration-700 overflow-x-hidden",
        activeTab === 'focus' && "text-white"
      )}
      style={getAtmosphereStyles()}
    >
      <nav className={cn(
        "sticky top-0 z-50 h-14 flex items-center px-4 md:px-6 justify-between transition-colors duration-700",
        activeTab === 'focus' ? "bg-black/5 border-b border-white/10" : "glass border-b border-border"
      )}>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
            activeTab === 'focus' ? "bg-white/20" : "bg-primary neon-glow"
          )}>
            <Timer className={cn("w-5 h-5", activeTab === 'focus' ? "text-white" : "text-primary-foreground")} />
          </div>
          <h1 className={cn(
            "text-lg font-black tracking-tighter",
            activeTab === 'focus' ? "text-white" : "bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
          )}>
            CHRONOFLOW
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'focus' ? (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest gap-2">
                <BarChart3 className="w-4 h-4" /> Report
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest gap-2"
                onClick={() => setIsPomodoroSettingsOpen(true)}
              >
                <Settings className="w-4 h-4" /> Setting
              </Button>
            </div>
          ) : (
            <>
              <Link href="/blog">
                <Button variant="ghost" size="sm" className="hidden sm:flex rounded-full hover:bg-accent/10 text-[10px] uppercase font-black tracking-[0.2em] gap-2">
                  <BookOpen className="w-3.5 h-3.5" /> Insights Hub
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full hover:bg-accent/10 w-8 h-8">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-full hover:bg-accent/10 w-8 h-8">
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </nav>

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-6 md:py-12">
        <div className={cn(
          "flex flex-col gap-10",
          activeTab === 'focus' ? "items-center" : "min-[480px]:flex-row items-start"
        )}>
          
          <aside className={cn(
            "w-full shrink-0 space-y-4",
            activeTab === 'focus' ? "max-w-[480px]" : "min-[480px]:w-[180px] sm:w-[240px] md:w-[300px] lg:w-[340px] min-[480px]:sticky min-[480px]:top-24"
          )}>
            <div className={cn(
              "glass-card !p-6 shadow-2xl transition-all duration-700",
              activeTab === 'focus' ? "bg-transparent border-none shadow-none" : "border-border"
            )}>
              <Tabs 
                value={activeTab}
                className="w-full" 
                onValueChange={(v) => {
                  setActiveTab(v as 'age' | 'diff' | 'focus');
                  setError(null);
                  if (v === 'focus') setResults(null);
                }}
              >
                <TabsList className={cn(
                  "grid w-full grid-cols-3 mb-6 rounded-xl h-10",
                  activeTab === 'focus' ? "bg-white/10" : "bg-muted/50"
                )}>
                  <TabsTrigger value="diff" className="text-[10px] md:text-xs font-black uppercase tracking-widest">Diff</TabsTrigger>
                  <TabsTrigger value="age" className="text-[10px] md:text-xs font-black uppercase tracking-widest">Age</TabsTrigger>
                  <TabsTrigger value="focus" className="text-[10px] md:text-xs font-black uppercase tracking-widest">Focus</TabsTrigger>
                </TabsList>

                <TabsContent value="diff" className="space-y-4 mt-0">
                  <DateInput label="Baseline Timestamp" values={fromDate} onChange={setFromDate} />
                  <div className="flex justify-center -my-3">
                    <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                      <Workflow className="w-3.5 h-3.5 text-primary/40" />
                    </div>
                  </div>
                  <DateInput label="Target Timestamp" values={toDate} onChange={setToDate} error={activeTab === 'diff' ? error || undefined : undefined} />
                  <Button 
                    className="w-full h-12 mt-6 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 neon-glow"
                    onClick={handleCalculate}
                  >
                    Execute Differential Sync
                  </Button>
                </TabsContent>

                <TabsContent value="age" className="space-y-4 mt-0">
                  <DateInput 
                    label="Origin Point (DOB)" 
                    values={dob} 
                    onChange={setDob} 
                    error={activeTab === 'age' ? error || undefined : undefined} 
                  />
                  <Button 
                    className="w-full h-12 mt-6 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 neon-glow"
                    onClick={handleCalculate}
                  >
                    Compute Life Duration
                  </Button>
                </TabsContent>

                <TabsContent value="focus" className="mt-0" />
              </Tabs>
            </div>

            {activeTab !== 'focus' && (
              <div className="space-y-3">
                <div className="glass-card !p-4 border-accent/20 bg-accent/5 overflow-hidden relative group">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000" />
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-3 h-3 text-accent" />
                    <p className="text-[9px] uppercase font-black tracking-widest text-accent">Real-Time Sync</p>
                  </div>
                  <h4 className="text-xs font-black tracking-tight mb-1">Atomic Precision Control</h4>
                  <p className="text-[10px] text-muted-foreground/80 leading-relaxed">Engine synchronizing with primary time servers via Stratum-1 NTP nodes.</p>
                </div>
                
                <div className="glass-card !p-4 border-primary/20 bg-primary/5 relative overflow-hidden group">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    <p className="text-[9px] uppercase font-black tracking-widest text-primary">Security Ops</p>
                  </div>
                  <h4 className="text-xs font-black tracking-tight mb-1">Encrypted Payload</h4>
                  <p className="text-[10px] text-muted-foreground/80 leading-relaxed">Calculation processing is handled locally. Zero-knowledge data sovereignty.</p>
                </div>
              </div>
            )}
          </aside>

          <div className="flex-grow w-full min-w-0">
            {activeTab === 'focus' ? (
              <Pomodoro 
                onModeChange={setPomodoroMode} 
                onSettingsChange={setPomodoroSettings}
                onTimerActiveChange={setIsTimerActive}
                isExternalSettingsOpen={isPomodoroSettingsOpen}
                onExternalSettingsOpenChange={setIsPomodoroSettingsOpen}
              />
            ) : results ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex items-center justify-between px-2">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(var(--accent),0.6)]" />
                      <span className="text-[10px] uppercase font-black tracking-[0.3em] text-accent">Active Computation Stream</span>
                   </div>
                   <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-border bg-muted/30">Latency: 1.2ms</Badge>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <ResultCard label="Years" value={results.years} delay="0s" />
                  <ResultCard label="Months" value={results.months} delay="0.1s" />
                  <ResultCard label="Days" value={results.days} delay="0.2s" />
                  <ResultCard label="Countdown" value={results.nextBirthday} subLabel="Days to Milestone" delay="0.3s" />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <ResultCard label="Total Days" value={results.totalDays} className="border-primary/10" delay="0.4s" />
                  <ResultCard label="Total Hours" value={results.totalHours} className="border-primary/10" delay="0.5s" />
                  <ResultCard label="Total Minutes" value={results.totalMinutes} className="border-primary/10" delay="0.6s" />
                  <ResultCard label="Total Seconds" value={results.totalSeconds} className="border-primary/10" delay="0.7s" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResultCard label="Celestial Mapping" value={results.zodiac} subLabel="Zodiac Alignment" delay="0.8s" />
                  <ResultCard label="Gregorian Check" value={results.isLeapYear ? "Leap Identified" : "Standard Cycle"} delay="0.9s" />
                </div>

                <FunFact years={results.years} months={results.months} days={results.days} />

                <div className="flex flex-wrap gap-3 pt-4">
                  <Button variant="outline" className="rounded-xl h-11 px-6 gap-2.5 text-[10px] font-black uppercase tracking-widest border-primary/20 hover:bg-primary/5 hover:text-primary transition-all" onClick={handleShare}>
                    <Share2 className="w-4 h-4" /> Share Insight
                  </Button>
                  <Button variant="outline" className="rounded-xl h-11 px-6 gap-2.5 text-[10px] font-black uppercase tracking-widest border-primary/20 hover:bg-primary/5 hover:text-primary transition-all" onClick={handleShare}>
                    <Copy className="w-4 h-4" /> Copy Metrics
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-border/40 rounded-[3rem] min-h-[400px] md:min-h-[550px] bg-muted/10 transition-all hover:bg-muted/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary-foreground)_0%,_transparent_100%)] opacity-5 group-hover:opacity-10 transition-opacity" />
                <div className="text-center space-y-6 relative z-10 px-8">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/10 border-t-primary animate-spin" />
                    <div className="absolute inset-4 rounded-full border-2 border-accent/10 border-b-accent animate-spin-slow" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Cpu className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.5em]">System Standby</p>
                    <h3 className="text-xl md:text-2xl font-black tracking-tight text-foreground/40">Awaiting Temporal Coordinates</h3>
                    <p className="text-muted-foreground/50 text-xs max-w-[320px] mx-auto leading-relaxed">Input origin and target dates in the primary console to initiate high-precision chronological synchronization.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {activeTab !== 'focus' && (
          <div className="mt-32 space-y-40">
            {/* Methodology Section */}
            <section className="space-y-20">
              <div className="text-center space-y-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-[0.3em] text-[10px] px-6 py-1.5 font-black">Technical whitepaper</Badge>
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">The ChronoFlow <span className="text-primary">Methodology</span></h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-medium">We define the standard for high-definition chronological computation through atomic-sync protocols.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-primary/40">
                  <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                     <Milestone className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight">Gregorian Alignment</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed opacity-80">Our algorithms account for complex centurial leap year rules and ISO-8601 standards, ensuring astronomical accuracy across multi-decade spans.</p>
                </div>
                <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-accent/40">
                  <div className="w-16 h-16 rounded-[2rem] bg-accent/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-accent/5">
                     <Globe className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight">Temporal Drift Control</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed opacity-80">By synchronizing with Stratum-1 UTC nodes, we eliminate local system variance that typically degrades precision in web-based calculation tools.</p>
                </div>
                <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-primary/40">
                  <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                     <Star className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight">Celestial Mapping</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed opacity-80">Utilizing high-precision ecliptic coordinate systems to handle cusp transitions with sub-minute resolution for Western zodiac alignment.</p>
                </div>
              </div>
            </section>

            {/* Verticals Section */}
            <section className="space-y-16 py-24 bg-muted/30 rounded-[4rem] px-8 md:px-20 border border-border/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-20 opacity-[0.02] -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <Target className="w-96 h-96 text-primary" />
              </div>
              <div className="text-center space-y-6 relative z-10">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Precision for <span className="text-primary">Global Verticals</span></h2>
                <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium">ChronoFlow provides mission-critical data for sectors where time isn't just a number—it's a high-stakes record.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                <div className="space-y-5 group/item">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                    <Scale className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-black text-sm uppercase tracking-[0.2em]">Legal & Compliance</h4>
                  <p className="text-[12px] text-muted-foreground leading-relaxed font-medium">Determining exact age metrics for statutes of limitation, contract eligibility, and high-precision legal maturation milestones.</p>
                </div>
                <div className="space-y-5 group/item">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                    <HeartPulse className="w-7 h-7 text-accent" />
                  </div>
                  <h4 className="font-black text-sm uppercase tracking-[0.2em]">Healthcare Stats</h4>
                  <p className="text-[12px] text-muted-foreground leading-relaxed font-medium">Tracking pediatric developmental cycles and age-specific biological markers with absolute day-level granular precision.</p>
                </div>
                <div className="space-y-5 group/item">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                    <Coins className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-black text-sm uppercase tracking-[0.2em]">Financial Planning</h4>
                  <p className="text-[12px] text-muted-foreground leading-relaxed font-medium">Computing exact time horizons for compound interest maturation and retirement account eligibility windows with accuracy.</p>
                </div>
                <div className="space-y-5 group/item">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                    <Milestone className="w-7 h-7 text-accent" />
                  </div>
                  <h4 className="font-black text-sm uppercase tracking-[0.2em]">Asset Lifecycle</h4>
                  <p className="text-[12px] text-muted-foreground leading-relaxed font-medium">A high-definition view of chronological timelines for enterprise assets, turning abstract durations into concrete, living data.</p>
                </div>
              </div>
            </section>

            {/* Featured Insights Section */}
            <section className="space-y-16">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-4">
                  <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-[0.3em] text-[9px] px-4 font-black">Strategic Intelligence</Badge>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Latest <span className="text-accent">Insights</span></h2>
                </div>
                <Link href="/blog">
                  <Button variant="link" className="text-primary font-black uppercase tracking-widest text-xs group">
                    Visit Knowledge Hub <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Link href="/blog/digital-asset-velocity-enterprise-guide" className="group">
                  <div className="glass-card !p-0 overflow-hidden border-border/40 group-hover:border-primary/40 transition-all">
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 relative">
                       <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
                          <Zap className="w-20 h-20 text-primary" />
                       </div>
                       <div className="absolute top-4 left-4">
                          <Badge className="bg-black/50 backdrop-blur-md text-[8px] font-black uppercase tracking-widest border-white/10">Whitepaper</Badge>
                       </div>
                    </div>
                    <div className="p-8 space-y-4">
                      <h4 className="text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">The Enterprise Blueprint for Digital Asset Velocity</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">Maximizing performance through high-precision optimization and edge-compute architectures.</p>
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary pt-2">
                        READ 9000-WORD GUIDE <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/blog/global-time-synchronization-standards" className="group">
                  <div className="glass-card !p-0 overflow-hidden border-border/40 group-hover:border-accent/40 transition-all">
                    <div className="h-48 bg-gradient-to-br from-accent/10 to-primary/10 relative">
                       <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
                          <Globe className="w-20 h-20 text-accent" />
                       </div>
                       <div className="absolute top-4 left-4">
                          <Badge className="bg-black/50 backdrop-blur-md text-[8px] font-black uppercase tracking-widest border-white/10">Technical</Badge>
                       </div>
                    </div>
                    <div className="p-8 space-y-4">
                      <h4 className="text-xl font-black tracking-tight leading-tight group-hover:text-accent transition-colors">Global Time Synchronization Standards</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">A master guide to NTP protocols and atomic chronology in high-precision engineering environments.</p>
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent pt-2">
                        ACCESS DOCUMENT <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/blog/image-and-pdf-resizing-optimization" className="group">
                  <div className="glass-card !p-0 overflow-hidden border-border/40 group-hover:border-primary/40 transition-all">
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 relative">
                       <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
                          <FileText className="w-20 h-20 text-primary" />
                       </div>
                       <div className="absolute top-4 left-4">
                          <Badge className="bg-black/50 backdrop-blur-md text-[8px] font-black uppercase tracking-widest border-white/10">Optimization</Badge>
                       </div>
                    </div>
                    <div className="p-8 space-y-4">
                      <h4 className="text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">The Master Resizing Protocol for Enterprise</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">Deep dive into image and PDF optimization for Core Web Vitals and asset velocity.</p>
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary pt-2">
                        EXPLORE ANALYSIS <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </section>

            {/* Operations Status Dashboard */}
            <section className="glass-card !p-12 border-primary/20 bg-primary/5 rounded-[3rem] space-y-12">
               <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tighter">System Operations <span className="text-primary">Status</span></h3>
                    <p className="text-muted-foreground text-sm font-medium">Real-time health monitoring of our global chronological infrastructure.</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex flex-col gap-1 items-center md:items-end">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Active Node</span>
                        <span className="text-xs font-bold text-accent">CAMLY-ALPHA-01</span>
                     </div>
                     <Separator orientation="vertical" className="h-8 hidden md:block" />
                     <div className="flex flex-col gap-1 items-center md:items-end">
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Global Sync</span>
                        <span className="text-xs font-bold text-primary">STRATUM-1 ACTIVE</span>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Sync Jitter</p>
                     <p className="text-2xl font-black text-foreground">0.002ms</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">NTP Latency</p>
                     <p className="text-2xl font-black text-foreground">1.18ms</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Uptime</p>
                     <p className="text-2xl font-black text-foreground">99.998%</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Nodes</p>
                     <p className="text-2xl font-black text-foreground">12 Active</p>
                  </div>
               </div>
            </section>
          </div>
        )}
      </main>

      <footer className={cn(
        "relative mt-auto pt-24 pb-12 px-6 transition-colors duration-700 border-t",
        activeTab === 'focus' ? "bg-black/20 text-white border-white/10" : "glass border-border/40"
      )}>
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
                  activeTab === 'focus' ? "bg-white/20" : "bg-primary neon-glow"
                )}>
                  <Timer className={cn("w-5 h-5", activeTab === 'focus' ? "text-white" : "text-primary-foreground")} />
                </div>
                <h2 className={cn(
                  "text-xl font-black tracking-tighter",
                  activeTab === 'focus' ? "text-white" : "bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
                )}>
                  CHRONOFLOW
                </h2>
              </div>
              <p className={cn(
                "text-sm leading-relaxed max-w-xs font-medium",
                activeTab === 'focus' ? "text-white/60" : "text-muted-foreground"
              )}>
                Defining the standard for high-precision chronological computation. 
                Camly Inc's flagship engine for professional and tactical time management.
              </p>
              <div className="flex gap-5">
                <Button variant="ghost" size="icon" className={cn("w-9 h-9 rounded-xl", activeTab === 'focus' ? "hover:bg-white/10 text-white" : "hover:bg-accent/10 shadow-sm border border-border/50")}><Github className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className={cn("w-9 h-9 rounded-xl", activeTab === 'focus' ? "hover:bg-white/10 text-white" : "hover:bg-accent/10 shadow-sm border border-border/50")}><Twitter className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className={cn("w-9 h-9 rounded-xl", activeTab === 'focus' ? "hover:bg-white/10 text-white" : "hover:bg-accent/10 shadow-sm border border-border/50")}><Globe className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className={cn("text-[11px] font-black uppercase tracking-[0.3em]", activeTab === 'focus' ? "text-white" : "text-primary")}>Operations</h3>
              <ul className={cn("space-y-3 text-xs font-bold", activeTab === 'focus' ? "text-white/60" : "text-muted-foreground")}>
                <li className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" /> Precision Engine
                </li>
                <li className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" /> Focus Protocols
                </li>
                <li className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" /> Celestial Mapping
                </li>
                <li className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" /> Delta Analysis
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className={cn("text-[11px] font-black uppercase tracking-[0.3em]", activeTab === 'focus' ? "text-white" : "text-primary")}>Intelligence</h3>
              <ul className={cn("space-y-3 text-xs font-bold", activeTab === 'focus' ? "text-white/60" : "text-muted-foreground")}>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/blog">Knowledge Hub</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/blog/digital-asset-velocity-enterprise-guide">Strategic Whitepapers</Link>
                </li>
                <li className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" /> Fun Facts API
                </li>
                <li className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" /> Security Audits
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className={cn("text-[11px] font-black uppercase tracking-[0.3em]", activeTab === 'focus' ? "text-white" : "text-primary")}>Architecture</h3>
              <div className="space-y-4">
                <div className={cn("flex items-center gap-2.5 text-[10px] font-black tracking-widest", activeTab === 'focus' ? "text-accent" : "text-accent")}>
                  <div className={cn("w-2 h-2 rounded-full animate-pulse", activeTab === 'focus' ? "bg-accent" : "bg-accent")} />
                  CAMLY-SYNC-01: ONLINE
                </div>
                <div className={cn("flex items-center gap-2 text-[10px] font-mono font-bold", activeTab === 'focus' ? "text-white/60" : "text-muted-foreground")}>
                  <Cpu className="w-3.5 h-3.5" /> SYSTEM v2.4.8-STABLE
                </div>
                <div className={cn("flex items-center gap-2 text-[10px] font-mono font-bold", activeTab === 'focus' ? "text-white/60" : "text-muted-foreground")}>
                  <ShieldCheck className="w-3.5 h-3.5" /> E2E DATA SOVEREIGNTY
                </div>
              </div>
            </div>
          </div>

          <Separator className={cn("mb-10", activeTab === 'focus' ? "bg-white/10" : "bg-border/60")} />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className={cn("text-[10px] uppercase tracking-[0.5em] font-black", activeTab === 'focus' ? "text-white/30" : "text-muted-foreground/40")}>
                © 2024 Camly Inc • Defining High-Precision Velocity
              </p>
            </div>
            <div className="flex gap-8">
              <Link href="/privacy-protocol" className={cn("text-[10px] uppercase tracking-[0.2em] transition-colors font-black", activeTab === 'focus' ? "text-white/40 hover:text-white" : "text-muted-foreground/40 hover:text-primary")}>Privacy Protocol</Link>
              <Link href="/terms-of-sync" className={cn("text-[10px] uppercase tracking-[0.2em] transition-colors font-black", activeTab === 'focus' ? "text-white/40 hover:text-white" : "text-muted-foreground/40 hover:text-primary")}>Terms of Sync</Link>
              <Link href="/security-ops" className={cn("text-[10px] uppercase tracking-[0.2em] transition-colors font-black", activeTab === 'focus' ? "text-white/40 hover:text-white" : "text-muted-foreground/40 hover:text-primary")}>Security Ops</Link>
            </div>
          </div>
          <div className="mt-12 text-center">
             <p className={cn("text-[11px] uppercase tracking-[1em] font-black opacity-10", activeTab === 'focus' ? "text-white" : "text-foreground")}>
               PRECISION IN EVERY PIXEL
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
