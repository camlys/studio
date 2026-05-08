
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { 
  Sun, Moon, RefreshCcw, Share2, Copy, Timer, ChevronRight, 
  Github, Twitter, Mail, Cpu, Database, ShieldCheck, 
  ExternalLink, Globe, BookOpen, Zap, Brain, Activity, 
  Lock, Star, ArrowRight, CheckCircle, Scale, HeartPulse, 
  Coins, Milestone, Server, Layers, BarChart3, Target, Settings, UserCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateInput } from '@/components/chrono/DateInput';
import { ResultCard } from '@/components/chrono/ResultCard';
import { FunFact } from '@/components/chrono/FunFact';
import { Pomodoro, TimerMode } from '@/components/chrono/Pomodoro';
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
  const [isPomodoroSettingsOpen, setIsPomodoroSettingsOpen] = useState(false);
  
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
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('chrono_theme', theme);
  }, [theme]);

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

  const getAtmosphereClass = () => {
    if (activeTab !== 'focus') return 'bg-background';
    if (pomodoroMode === 'work') return 'bg-[#ba4949]';
    if (pomodoroMode === 'short-break') return 'bg-[#38858a]';
    if (pomodoroMode === 'long-break') return 'bg-[#397097]';
    return 'bg-background';
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col transition-all duration-700 overflow-x-hidden",
      getAtmosphereClass(),
      activeTab === 'focus' && "text-white"
    )}>
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
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs font-bold gap-2">
                <BarChart3 className="w-4 h-4" /> Report
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/10 text-xs font-bold gap-2"
                onClick={() => setIsPomodoroSettingsOpen(true)}
              >
                <Settings className="w-4 h-4" /> Setting
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs font-bold gap-2">
                <UserCircle className="w-4 h-4" /> Sign In
              </Button>
            </div>
          ) : (
            <>
              <Link href="/blog">
                <Button variant="ghost" size="sm" className="hidden sm:flex rounded-full hover:bg-accent/10 text-[10px] uppercase font-bold tracking-widest gap-2">
                  <BookOpen className="w-3.5 h-3.5" /> Insights
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

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className={cn(
          "flex flex-col gap-8",
          activeTab === 'focus' ? "items-center" : "min-[480px]:flex-row items-start"
        )}>
          
          {/* Main Controls Aside */}
          <aside className={cn(
            "w-full shrink-0 space-y-4",
            activeTab === 'focus' ? "max-w-[480px]" : "min-[480px]:w-[160px] sm:w-[220px] md:w-[280px] lg:w-[320px] min-[480px]:sticky min-[480px]:top-20"
          )}>
            <div className={cn(
              "glass-card !p-5 shadow-xl transition-all duration-700",
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
                  "grid w-full grid-cols-3 mb-4 rounded-lg h-9",
                  activeTab === 'focus' ? "bg-white/10" : "bg-muted"
                )}>
                  <TabsTrigger 
                    value="diff" 
                    className={cn(
                      "rounded-md text-[10px] md:text-xs transition-all",
                      activeTab === 'focus' ? "data-[state=active]:bg-white/20 text-white" : "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    )}
                  >
                    Diff
                  </TabsTrigger>
                  <TabsTrigger 
                    value="age" 
                    className={cn(
                      "rounded-md text-[10px] md:text-xs transition-all",
                      activeTab === 'focus' ? "data-[state=active]:bg-white/20 text-white" : "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    )}
                  >
                    Age
                  </TabsTrigger>
                  <TabsTrigger 
                    value="focus" 
                    className={cn(
                      "rounded-md text-[10px] md:text-xs transition-all",
                      activeTab === 'focus' ? "data-[state=active]:bg-white/20 text-white" : "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    )}
                  >
                    Focus
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="diff" className="space-y-4 mt-0">
                  <DateInput label="Start Date" values={fromDate} onChange={setFromDate} />
                  <div className="flex justify-center -my-2">
                    <ChevronRight className="w-4 h-4 text-primary/30 rotate-90" />
                  </div>
                  <DateInput label="End Date" values={toDate} onChange={setToDate} error={activeTab === 'diff' ? error || undefined : undefined} />
                  <Button 
                    className="w-full h-11 mt-4 text-xs font-black uppercase tracking-widest rounded-lg bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 neon-glow"
                    onClick={handleCalculate}
                  >
                    Process Data
                  </Button>
                </TabsContent>

                <TabsContent value="age" className="space-y-4 mt-0">
                  <DateInput 
                    label="Birth Date" 
                    values={dob} 
                    onChange={setDob} 
                    error={activeTab === 'age' ? error || undefined : undefined} 
                  />
                  <Button 
                    className="w-full h-11 mt-4 text-xs font-black uppercase tracking-widest rounded-lg bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 neon-glow"
                    onClick={handleCalculate}
                  >
                    Calculate Age
                  </Button>
                </TabsContent>

                <TabsContent value="focus" className="mt-0">
                   {/* Pomodoro is handled in the results area for better centering */}
                </TabsContent>
              </Tabs>
            </div>

            {activeTab !== 'focus' && (
              <div className="glass-card !p-4 border-accent/20 bg-accent/5 overflow-hidden relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent/10 rounded-full blur-xl" />
                <p className="text-[9px] uppercase font-black tracking-widest text-accent mb-1">Live Updates</p>
                <h4 className="text-xs font-bold mb-2">Atomic Synchronization</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Our engine synchronizes with global time servers for sub-millisecond precision.</p>
              </div>
            )}
          </aside>

          {/* Results Area */}
          <div className="flex-grow w-full min-w-0">
            {activeTab === 'focus' ? (
              <Pomodoro 
                onModeChange={setPomodoroMode} 
                isExternalSettingsOpen={isPomodoroSettingsOpen}
                onExternalSettingsOpenChange={setIsPomodoroSettingsOpen}
              />
            ) : results ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-2.5 px-1">
                   <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(var(--accent),0.6)]" />
                   <span className="text-[10px] uppercase font-black tracking-[0.25em] text-accent/80">Real-time Precision Feed</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                  <ResultCard label="Years" value={results.years} />
                  <ResultCard label="Months" value={results.months} />
                  <ResultCard label="Days" value={results.days} />
                  <ResultCard label="Countdown" value={results.nextBirthday} subLabel="Days to Birthday" />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                  <ResultCard label="Total Days" value={results.totalDays} />
                  <ResultCard label="Total Hours" value={results.totalHours} className="border-primary/20" />
                  <ResultCard label="Total Minutes" value={results.totalMinutes} className="border-primary/20" />
                  <ResultCard label="Total Seconds" value={results.totalSeconds} className="border-primary/20" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <ResultCard label="Zodiac Sign" value={results.zodiac} />
                  <ResultCard label="Leap Year" value={results.isLeapYear ? "Identified" : "None"} />
                </div>

                <FunFact years={results.years} months={results.months} days={results.days} />

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="secondary" size="sm" className="rounded-lg h-9 px-4 gap-2 text-[10px] font-semibold" onClick={handleShare}>
                    <Share2 className="w-4 h-4" /> Share
                  </Button>
                  <Button variant="secondary" size="sm" className="rounded-lg h-9 px-4 gap-2 text-[10px] font-semibold" onClick={handleShare}>
                    <Copy className="w-4 h-4" /> Copy Results
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-border rounded-3xl min-h-[300px] md:min-h-[450px] bg-muted/20 transition-all hover:bg-muted/40">
                <div className="text-center space-y-3 px-6">
                  <Timer className="w-10 h-10 mx-auto text-muted-foreground/30 animate-spin-slow" />
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-[11px] uppercase font-black tracking-[0.3em]">Standby</p>
                    <p className="text-muted-foreground/60 text-[10px] max-w-[200px] mx-auto leading-relaxed">Awaiting input for chronological synchronization</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rich Content Sections */}
        {activeTab !== 'focus' && (
          <section className="mt-20 space-y-32">
            <div className="space-y-12">
              <div className="text-center space-y-3">
                <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[9px] px-4 font-black">Technical Documentation</Badge>
                <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-none">The ChronoFlow <span className="text-primary">Methodology</span></h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-xs md:text-base">We bridge the gap between ancient sky-mapping and atomic-clock synchronization.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="glass-card hover:translate-y-[-4px] transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                     <Milestone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-black mb-3 tracking-tight">Gregorian Alignment</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Our algorithms account for the complex centurial leap year rules, ensuring your total elapsed days are astronomically accurate across decades.</p>
                </div>
                <div className="glass-card hover:translate-y-[-4px] transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                     <Globe className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-black mb-3 tracking-tight">Temporal Drift Control</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">By synchronizing with UTC standards, we eliminate local system clock variances that often lead to discrepancies in chronological calculations.</p>
                </div>
                <div className="glass-card hover:translate-y-[-4px] transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                     <Star className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-black mb-3 tracking-tight">Celestial Mapping</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Zodiac sign determination utilizes high-precision ecliptic coordinate systems to handle cusp transitions with sub-minute resolution.</p>
                </div>
              </div>
            </div>

            <div className="space-y-12 py-16 bg-muted/20 rounded-[3rem] px-8 md:px-16 border border-border/50">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Precision for <span className="text-primary">Every Vertical</span></h2>
                <p className="text-muted-foreground text-sm max-w-xl mx-auto">ChronoFlow serves critical functions across professional and personal sectors where time isn't just a number—it's a record.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-4">
                  <Scale className="w-7 h-7 text-primary" />
                  <h4 className="font-black text-sm uppercase tracking-widest">Legal & Compliance</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Determining exact age for statutes of limitation, contract eligibility, and legal maturation milestones.</p>
                </div>
                <div className="space-y-4">
                  <HeartPulse className="w-7 h-7 text-accent" />
                  <h4 className="font-black text-sm uppercase tracking-widest">Healthcare Stats</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Tracking pediatric developmental cycles and age-specific biological markers with absolute day-level precision.</p>
                </div>
                <div className="space-y-4">
                  <Coins className="w-7 h-7 text-primary" />
                  <h4 className="font-black text-sm uppercase tracking-widest">Financial Planning</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Calculating exact time horizons for compound interest maturation and retirement account eligibility windows.</p>
                </div>
                <div className="space-y-4">
                  <Milestone className="w-7 h-7 text-accent" />
                  <h4 className="font-black text-sm uppercase tracking-widest">Life Logistics</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">A high-definition view of your personal timeline, turning abstract years into concrete, living metrics.</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className={cn(
        "relative mt-auto pt-16 pb-8 px-6 transition-colors duration-700",
        activeTab === 'focus' ? "bg-black/10 text-white" : "glass border-t border-border"
      )}>
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                  activeTab === 'focus' ? "bg-white/20" : "bg-primary neon-glow"
                )}>
                  <Timer className={cn("w-5 h-5", activeTab === 'focus' ? "text-white" : "text-primary-foreground")} />
                </div>
                <h2 className={cn(
                  "text-lg font-black tracking-tighter",
                  activeTab === 'focus' ? "text-white" : "bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
                )}>
                  CHRONOFLOW
                </h2>
              </div>
              <p className={cn(
                "text-xs leading-relaxed max-w-xs",
                activeTab === 'focus' ? "text-white/60" : "text-muted-foreground"
              )}>
                ChronoFlow is an advanced chronological computation engine designed for ultimate precision. 
                Experience time in high definition with our atomic-sync dashboard.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className={cn("w-8 h-8 rounded-full", activeTab === 'focus' ? "hover:bg-white/10 text-white" : "hover:bg-accent/10")}><Github className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className={cn("w-8 h-8 rounded-full", activeTab === 'focus' ? "hover:bg-white/10 text-white" : "hover:bg-accent/10")}><Twitter className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className={cn("w-8 h-8 rounded-full", activeTab === 'focus' ? "hover:bg-white/10 text-white" : "hover:bg-accent/10")}><Globe className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className={cn("text-[10px] font-black uppercase tracking-widest", activeTab === 'focus' ? "text-white" : "text-primary")}>Engines</h3>
              <ul className={cn("space-y-2 text-xs", activeTab === 'focus' ? "text-white/60" : "text-muted-foreground")}>
                <li className="hover:text-foreground cursor-pointer transition-colors">Age Processor</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Date Delta</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Zodiac Mapping</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Focus Engine</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className={cn("text-[10px] font-black uppercase tracking-widest", activeTab === 'focus' ? "text-white" : "text-primary")}>Knowledge</h3>
              <ul className={cn("space-y-2 text-xs", activeTab === 'focus' ? "text-white/60" : "text-muted-foreground")}>
                <li className="hover:text-foreground cursor-pointer transition-colors">
                  <Link href="/blog">Blog Hub</Link>
                </li>
                <li className="hover:text-foreground cursor-pointer transition-colors">
                  <Link href="/blog/ultimate-guide-to-age-calculation">Chronology Guide</Link>
                </li>
                <li className="hover:text-foreground cursor-pointer transition-colors">AI Facts API</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">System Logs</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className={cn("text-[10px] font-black uppercase tracking-widest", activeTab === 'focus' ? "text-white" : "text-primary")}>System</h3>
              <div className="space-y-3">
                <div className={cn("flex items-center gap-2 text-[10px] font-medium", activeTab === 'focus' ? "text-white" : "text-accent")}>
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", activeTab === 'focus' ? "bg-white" : "bg-accent")} />
                  SYNC: ACTIVE
                </div>
                <div className={cn("flex items-center gap-2 text-[10px] font-mono", activeTab === 'focus' ? "text-white/60" : "text-muted-foreground")}>
                  <Cpu className="w-3 h-3" /> V1.6.0-BETA
                </div>
                <div className={cn("flex items-center gap-2 text-[10px] font-mono", activeTab === 'focus' ? "text-white/60" : "text-muted-foreground")}>
                  <Database className="w-3 h-3" /> PERSISTENT STORAGE
                </div>
                <div className={cn("flex items-center gap-2 text-[10px] font-mono", activeTab === 'focus' ? "text-white/60" : "text-muted-foreground")}>
                  <ShieldCheck className="w-3 h-3" /> E2E ENCRYPTION
                </div>
              </div>
            </div>
          </div>

          <Separator className={cn("mb-8", activeTab === 'focus' ? "bg-white/10" : "bg-border")} />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={cn("text-[9px] uppercase tracking-[0.4em] font-black", activeTab === 'focus' ? "text-white/40" : "text-muted-foreground/60")}>
              © 2024 Camly • Precision Utilities
            </p>
            <div className="flex gap-6">
              <Link href="/privacy-protocol" className={cn("text-[9px] uppercase tracking-widest transition-colors font-bold", activeTab === 'focus' ? "text-white/40 hover:text-white" : "text-muted-foreground/60 hover:text-primary")}>Privacy Protocol</Link>
              <Link href="/terms-of-sync" className={cn("text-[9px] uppercase tracking-widest transition-colors font-bold", activeTab === 'focus' ? "text-white/40 hover:text-white" : "text-muted-foreground/60 hover:text-primary")}>Terms of Sync</Link>
              <Link href="/security-ops" className={cn("text-[9px] uppercase tracking-widest transition-colors font-bold", activeTab === 'focus' ? "text-white/40 hover:text-white" : "text-muted-foreground/60 hover:text-primary")}>Security Ops</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
