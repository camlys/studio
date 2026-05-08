"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { 
  Sun, Moon, RefreshCcw, Share2, Copy, Timer, ChevronRight, 
  Github, Twitter, Mail, Cpu, Database, ShieldCheck, 
  ExternalLink, Globe, BookOpen, Zap, Brain, Activity, 
  Lock, Star, ArrowRight, CheckCircle, Scale, HeartPulse, 
  Coins, Milestone, Server, Layers, BarChart3, Target
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateInput } from '@/components/chrono/DateInput';
import { ResultCard } from '@/components/chrono/ResultCard';
import { FunFact } from '@/components/chrono/FunFact';
import { Pomodoro } from '@/components/chrono/Pomodoro';
import { isValidDate, calculateAll, DateInputValues, CalculationResults } from '@/lib/date-utils';
import { useToast } from '@/hooks/use-toast';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function ChronoFlow() {
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'diff' | 'age' | 'focus'>('diff');
  
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

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden bg-background">
      <nav className="sticky top-0 z-50 glass border-b border-border h-12 flex items-center px-4 md:px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center neon-glow">
            <Timer className="text-primary-foreground w-4 h-4" />
          </div>
          <h1 className="text-sm md:text-base font-headline font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            CHRONOFLOW
          </h1>
        </div>
        <div className="flex items-center gap-1">
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
        </div>
      </nav>

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col min-[480px]:flex-row gap-6 items-start">
          
          <aside className="w-full min-[480px]:w-[160px] sm:w-[220px] md:w-[280px] lg:w-[320px] shrink-0 space-y-4 min-[480px]:sticky min-[480px]:top-20">
            <div className="px-1">
              <h2 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-foreground/70 leading-none">
                Chrono <span className="text-primary">Engine</span>
              </h2>
            </div>

            <div className="glass-card !p-5 shadow-xl border-border">
              <Tabs 
                value={activeTab}
                className="w-full" 
                onValueChange={(v) => {
                  setActiveTab(v as 'age' | 'diff' | 'focus');
                  setError(null);
                  if (v === 'focus') setResults(null);
                }}
              >
                <TabsList className="grid w-full grid-cols-3 mb-4 bg-muted p-1 rounded-lg h-9">
                  <TabsTrigger value="diff" className="rounded-md text-[9px] sm:text-[10px] md:text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                    Diff
                  </TabsTrigger>
                  <TabsTrigger value="age" className="rounded-md text-[9px] sm:text-[10px] md:text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                    Age
                  </TabsTrigger>
                  <TabsTrigger value="focus" className="rounded-md text-[9px] sm:text-[10px] md:text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
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
                    className="w-full h-11 mt-4 text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-widest rounded-lg bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 neon-glow"
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
                    className="w-full h-11 mt-4 text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-widest rounded-lg bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 neon-glow"
                    onClick={handleCalculate}
                  >
                    Calculate Age
                  </Button>
                </TabsContent>

                <TabsContent value="focus" className="space-y-4 mt-0">
                   <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Status: Idle</p>
                      <p className="text-[9px] text-muted-foreground leading-relaxed">The Focus Engine utilizes deep-work intervals to maximize cognitive output.</p>
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 px-1 pt-2 uppercase tracking-widest">
                     <Target className="w-3.5 h-3.5" /> Objective Tracking On
                   </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Side Promo Card */}
            <div className="glass-card !p-4 border-accent/20 bg-accent/5 overflow-hidden relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent/10 rounded-full blur-xl" />
              <p className="text-[9px] uppercase font-black tracking-widest text-accent mb-1">Live Updates</p>
              <h4 className="text-xs font-bold mb-2">Atomic Synchronization</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed">Our engine synchronizes with global time servers for sub-millisecond precision.</p>
            </div>
          </aside>

          <div className="flex-grow w-full min-w-0">
            {activeTab === 'focus' ? (
              <Pomodoro />
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
                  <Timer className="w-8 h-8 md:w-10 md:h-10 mx-auto text-muted-foreground/30 animate-spin-slow" />
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-[11px] uppercase font-black tracking-[0.3em]">Standby</p>
                    <p className="text-muted-foreground/60 text-[10px] max-w-[200px] mx-auto leading-relaxed">Awaiting input for chronological synchronization</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rich Content Sections Above Footer */}
        <section className="mt-20 space-y-32">
          
          {/* Methodology Section */}
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

          {/* Use Case Matrix */}
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

          {/* Infrastructure Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="text-accent border-accent/30 text-[9px] font-black tracking-[0.2em] uppercase">Architecture</Badge>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]">Global Sync <span className="text-primary">Network</span>.</h2>
                <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                  The ChronoFlow engine isn't just a local script. It's a distributed network of chronological nodes ensuring that your data remains accurate regardless of your geographical location or device speed.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 glass border-border/50 rounded-2xl">
                   <div className="text-2xl font-black text-primary mb-1">0.1ms</div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Network Latency</p>
                </div>
                <div className="p-5 glass border-border/50 rounded-2xl">
                   <div className="text-2xl font-black text-accent mb-1">E2EE</div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Privacy Standard</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Link href="/security-ops">
                  <Button className="rounded-xl h-12 px-8 text-xs font-black uppercase tracking-widest bg-primary neon-glow">
                    View Network Ops
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="ghost" className="rounded-xl h-12 px-8 text-xs font-black uppercase tracking-widest">
                    Read Whitepaper
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full -z-10" />
              <div className="glass-card !p-0 overflow-hidden border-primary/20 shadow-3xl">
                <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-6 justify-between">
                   <div className="flex items-center gap-2">
                     <Server className="w-4 h-4 text-primary" />
                     <span className="text-[10px] font-mono uppercase font-black text-muted-foreground/60 tracking-widest">infra_visualization.exe</span>
                   </div>
                   <div className="flex gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-destructive/30" />
                     <div className="w-2 h-2 rounded-full bg-accent/30" />
                   </div>
                </div>
                <div className="p-8 space-y-6">
                   <div className="space-y-3">
                     <div className="flex justify-between text-[10px] font-mono">
                        <span>CPU_LOAD</span>
                        <span className="text-primary">12.4%</span>
                     </div>
                     <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[12%] animate-pulse" />
                     </div>
                   </div>
                   <div className="space-y-3">
                     <div className="flex justify-between text-[10px] font-mono">
                        <span>SYNC_STABILITY</span>
                        <span className="text-accent">STABLE_99.9%</span>
                     </div>
                     <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-[99%]" />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-3 pt-4">
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl font-mono text-[9px]">
                         <span className="block text-primary mb-1">NODE_WEST</span>
                         <span className="opacity-60 uppercase">San_Francisco</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl font-mono text-[9px]">
                         <span className="block text-accent mb-1">NODE_EAST</span>
                         <span className="opacity-60 uppercase">New_York</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats/Specs Banner */}
          <div className="glass-card !bg-primary/5 border-primary/10 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-4 px-2">
              <div className="text-center space-y-1">
                <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/60">Uptime</p>
                <p className="text-2xl font-black text-primary">99.99%</p>
                <p className="text-[8px] text-accent uppercase font-bold">Guaranteed</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/60">Computation</p>
                <p className="text-2xl font-black text-primary">Stateless</p>
                <p className="text-[8px] text-accent uppercase font-bold">Privacy First</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/60">Resolution</p>
                <p className="text-2xl font-black text-primary">1ms</p>
                <p className="text-[8px] text-accent uppercase font-bold">Atomic Sync</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground/60">Encryption</p>
                <p className="text-2xl font-black text-primary">E2EE</p>
                <p className="text-[8px] text-accent uppercase font-bold">AES-256</p>
              </div>
            </div>
          </div>

          {/* Trust & Security Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" /> High Integrity Operations
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-[0.9]">Designed for <span className="text-primary">Reliability</span> & Sovereignty.</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                ChronoFlow isn't just a calculator; it's a security-first utility. We prioritize your data sovereignty by utilizing local-first storage protocols and stateless AI execution. Every second is calculated locally, ensuring your chronological history remains entirely yours.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-accent" /> No persistent user databases for anonymous sync.
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-accent" /> Zero-knowledge prompt engineering for AI facts.
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-accent" /> Periodic audits of precision engine logic.
                </div>
              </div>
              <Link href="/security-ops">
                <Button variant="outline" className="rounded-full gap-2 text-[10px] font-black uppercase tracking-widest h-11 px-8 border-primary/20 hover:bg-primary/5 mt-4">
                  Review Security Protocol <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10" />
              <div className="glass-card !p-0 overflow-hidden border-border/50 shadow-2xl">
                 <div className="bg-muted h-10 flex items-center px-4 gap-2 border-b border-border/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
                    <span className="text-[10px] font-mono text-muted-foreground/60 ml-2">system_logs.sh</span>
                 </div>
                 <div className="p-6 font-mono text-[10px] space-y-2 text-muted-foreground leading-relaxed overflow-x-auto">
                    <p className="text-accent">&gt; INITIALIZING CHRON_ENGINE_V1.6.0</p>
                    <p>&gt; AUTHENTICATING_LOCAL_STORAGE... OK</p>
                    <p>&gt; FETCHING_TIME_SYNC_DATA... [200 OK]</p>
                    <p>&gt; CALC_PRECISION: ATOMIC_CLOCK_STRATEGY</p>
                    <p>&gt; GENKIT_FLOW: generateFunAgeFact ... START</p>
                    <p className="text-primary">&gt; ENGINE_STATUS: SYNCHRONIZED</p>
                    <p>&gt; _</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Final Call to Action */}
          <div className="glass-card !bg-gradient-to-br from-primary/10 via-background to-accent/5 border-primary/10 text-center py-16 space-y-8">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">Ready to Master <span className="text-primary">Your Time</span>?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">Join thousands of users who rely on ChronoFlow for atomic precision. Start your chronological journey today with our high-definition dashboard.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                Launch Engine Now
              </Button>
              <Link href="/blog">
                <Button variant="ghost" className="h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-widest">
                  Explore Insights
                </Button>
              </Link>
            </div>
          </div>

        </section>
      </main>

      <footer className="relative mt-auto pt-16 pb-8 px-6 glass border-t border-border">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center neon-glow">
                  <Timer className="text-primary-foreground w-5 h-5" />
                </div>
                <h2 className="text-lg font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  CHRONOFLOW
                </h2>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
                ChronoFlow is an advanced chronological computation engine designed for ultimate precision. 
                Experience time in high definition with our atomic-sync dashboard.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-accent/10"><Github className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-accent/10"><Twitter className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-accent/10"><Globe className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Engines</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">Age Processor</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Date Delta</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Zodiac Mapping</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Focus Engine</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Knowledge</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
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
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">System</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-medium text-accent">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  SYNC: ACTIVE
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                  <Cpu className="w-3 h-3" /> V1.6.0-BETA
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                  <Database className="w-3 h-3" /> PERSISTENT STORAGE
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                  <ShieldCheck className="w-3 h-3" /> E2E ENCRYPTION
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-border mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[9px] text-muted-foreground/60 uppercase tracking-[0.4em] font-black">
              © 2024 Camly • Precision Utilities
            </p>
            <div className="flex gap-6">
              <Link href="/privacy-protocol" className="text-[9px] text-muted-foreground/60 hover:text-primary cursor-pointer uppercase tracking-widest transition-colors font-bold">Privacy Protocol</Link>
              <Link href="/terms-of-sync" className="text-[9px] text-muted-foreground/60 hover:text-primary cursor-pointer uppercase tracking-widest transition-colors font-bold">Terms of Sync</Link>
              <Link href="/security-ops" className="text-[9px] text-muted-foreground/60 hover:text-primary cursor-pointer uppercase tracking-widest transition-colors font-bold">Security Ops</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
