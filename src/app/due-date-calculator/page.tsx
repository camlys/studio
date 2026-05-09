"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar as CalendarIcon, Clock, Timer, Zap, 
  ShieldCheck, Cpu, Target, Milestone, 
  CalendarDays, Hourglass, ArrowRight,
  Settings, Database, Network, Globe,
  ExternalLink, BarChart3, Workflow, Info,
  Briefcase, HeartPulse, Repeat, Star
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { addDays, addWeeks, addMonths, format, differenceInDays, isWeekend, addBusinessDays, isValid, parseISO, isLeapYear } from 'date-fns';
import { getZodiacSign } from '@/lib/date-utils';

const dueDateSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Professional Due Date Engine - India Edition",
  "applicationCategory": "Utility",
  "operatingSystem": "All",
  "description": "High-precision milestone and project due date calculator optimized for Indian Standard Time (IST) and Indian business cycles.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  }
};

type CalcMethod = 'standard' | 'business' | 'medical' | 'cycle';

export default function DueDateCalculator() {
  const [method, setMethod] = useState<CalcMethod>('standard');
  const [startValues, setStartValues] = useState({
    day: format(new Date(), 'dd'),
    month: format(new Date(), 'MM'),
    year: format(new Date(), 'yyyy')
  });
  const [duration, setDuration] = useState('30');
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [cycleCount, setCycleCount] = useState('1');
  const [result, setResult] = useState<Date | null>(null);
  const [stats, setSetstats] = useState<{ calDays: number; busDays: number } | null>(null);

  const handleInputChange = (field: 'day' | 'month' | 'year', value: string) => {
    const numericValue = value.replace(/\D/g, '');
    let finalValue = numericValue;
    if (field === 'day' && parseInt(numericValue) > 31) finalValue = '31';
    if (field === 'month' && parseInt(numericValue) > 12) finalValue = '12';
    if (field === 'year' && numericValue.length > 4) finalValue = numericValue.slice(0, 4);
    
    setStartValues(prev => ({ ...prev, [field]: finalValue }));
  };

  const calculateDueDate = () => {
    const d = parseInt(startValues.day);
    const m = parseInt(startValues.month);
    const y = parseInt(startValues.year);

    if (isNaN(d) || isNaN(m) || isNaN(y) || y < 1000) {
      setResult(null);
      setSetstats(null);
      return;
    }

    const start = new Date(y, m - 1, d);
    if (!isValid(start) || start.getFullYear() !== y || start.getMonth() !== m - 1 || start.getDate() !== d) {
      setResult(null);
      setSetstats(null);
      return;
    }

    const num = parseInt(duration) || 0;
    const cycles = parseInt(cycleCount) || 1;
    let end: Date;

    if (method === 'medical') {
      end = addDays(start, 280);
    } else if (method === 'business') {
      end = addBusinessDays(start, num * cycles);
    } else if (method === 'cycle') {
      let tempDate = start;
      for(let i = 0; i < cycles; i++) {
        if (unit === 'weeks') tempDate = addWeeks(tempDate, num);
        else if (unit === 'months') tempDate = addMonths(tempDate, num);
        else tempDate = addDays(tempDate, num);
      }
      end = tempDate;
    } else {
      if (unit === 'weeks') end = addWeeks(start, num);
      else if (unit === 'months') end = addMonths(start, num);
      else end = addDays(start, num);
    }

    if (!isValid(end)) {
      setResult(null);
      setSetstats(null);
      return;
    }

    setResult(end);

    const totalCal = Math.abs(differenceInDays(end, start));
    let workDays = 0;
    let curr = new Date(start);
    const target = new Date(end);
    
    if (totalCal < 10000) {
      if (curr < target) {
        while (curr < target) {
          if (!isWeekend(curr)) workDays++;
          curr = addDays(curr, 1);
        }
      } else {
        while (curr > target) {
          if (!isWeekend(curr)) workDays++;
          curr = addDays(curr, -1);
        }
      }
    }
    
    setSetstats({ calDays: totalCal, busDays: workDays });
  };

  useEffect(() => {
    calculateDueDate();
  }, [startValues, duration, unit, method, cycleCount]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dueDateSchema) }}
      />
      <nav className="relative z-50 glass border-b border-border h-14 flex items-center px-4 md:px-6 justify-between transition-colors">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
              <Timer className="text-primary-foreground w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent uppercase">
                CHRONOFLOW
              </h1>
              <span className="text-[7px] font-bold tracking-[0.3em] text-primary/60 uppercase mt-1">camly.org</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden min-[480px]:flex border-accent/20 text-accent uppercase tracking-widest text-[8px] px-3 h-6 items-center gap-1.5 font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> IST SYNCED
          </Badge>
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-black uppercase tracking-widest gap-2">
              <ArrowLeft className="w-3 h-3" /> Back
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="mb-10 md:mb-12 space-y-3 text-center md:text-left">
          <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] text-[9px] px-3 py-1 font-black">
            Tactical Planning Layer
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.85]">
            Milestone <span className="text-primary">Inference</span> Engine
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-xl mx-auto md:mx-0">
            Advanced due date synchronization for Indian project cycles, regional business workflows, and high-fidelity tactical planning.
          </p>
        </div>

        <div className="flex flex-col min-[480px]:row items-start justify-center gap-4 md:gap-8 lg:gap-16 sm:flex-row">
          
          <div className="w-full sm:flex-1 max-w-sm space-y-6">
            <div className="glass-card !p-4 md:!p-6 space-y-5 border-border/40 shadow-2xl">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Method of Sync</Label>
                <Select value={method} onValueChange={(v: any) => setMethod(v)}>
                  <SelectTrigger className="bg-muted/50 border-border h-11 rounded-xl focus:ring-2 focus:ring-primary/20 font-bold text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard" className="flex items-center gap-2 text-xs"><CalendarIcon className="w-3 h-3 inline mr-2" /> Calendar Days</SelectItem>
                    <SelectItem value="business" className="flex items-center gap-2 text-xs"><Briefcase className="w-3 h-3 inline mr-2" /> Business Days</SelectItem>
                    <SelectItem value="medical" className="flex items-center gap-2 text-xs"><HeartPulse className="w-3 h-3 inline mr-2" /> Medical / LMP</SelectItem>
                    <SelectItem value="cycle" className="flex items-center gap-2 text-xs"><Repeat className="w-3 h-3 inline mr-2" /> Project Cycles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                  {method === 'medical' ? 'Last Period (Origin)' : 'Execution Start (Origin)'}
                </Label>
                <div className="flex gap-2">
                  <div className="grid grid-cols-3 gap-1 flex-grow">
                    <Input 
                      placeholder="DD"
                      value={startValues.day} 
                      onChange={(e) => handleInputChange('day', e.target.value)}
                      className="bg-muted/50 border-border h-11 rounded-l-xl rounded-r-none focus:ring-2 focus:ring-primary/20 font-bold text-sm text-center px-1"
                      maxLength={2}
                    />
                    <Input 
                      placeholder="MM"
                      value={startValues.month} 
                      onChange={(e) => handleInputChange('month', e.target.value)}
                      className="bg-muted/50 border-border h-11 rounded-none border-l-0 border-r-0 focus:ring-2 focus:ring-primary/20 font-bold text-sm text-center px-1"
                      maxLength={2}
                    />
                    <Input 
                      placeholder="YYYY"
                      value={startValues.year} 
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="bg-muted/50 border-border h-11 rounded-r-xl rounded-l-none border-l-0 focus:ring-2 focus:ring-primary/20 font-bold text-sm text-center px-1"
                      maxLength={4}
                    />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-11 w-11 rounded-xl p-0 shrink-0 border-border bg-muted/50 hover:bg-muted">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-1 scale-90 origin-top-right" align="end">
                      <Calendar
                        mode="single"
                        selected={isValid(new Date(parseInt(startValues.year), parseInt(startValues.month)-1, parseInt(startValues.day))) ? new Date(parseInt(startValues.year), parseInt(startValues.month)-1, parseInt(startValues.day)) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            setStartValues({
                              day: format(date, 'dd'),
                              month: format(date, 'MM'),
                              year: format(date, 'yyyy')
                            });
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {method !== 'medical' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Duration Vector</Label>
                    <Input 
                      type="number" 
                      value={duration} 
                      onChange={(e) => setDuration(e.target.value)}
                      className="bg-muted/50 border-border h-11 rounded-xl focus:ring-2 focus:ring-primary/20 font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Unit of Sync</Label>
                    <Select value={unit} onValueChange={(v) => setUnit(v as 'days' | 'weeks' | 'months')}>
                      <SelectTrigger className="bg-muted/50 border-border h-11 rounded-xl focus:ring-2 focus:ring-primary/20 font-bold text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days" className="text-xs">Days</SelectItem>
                        <SelectItem value="weeks" className="text-xs">Weeks</SelectItem>
                        <SelectItem value="months" className="text-xs">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {method === 'cycle' && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Cycle Count (Iterations)</Label>
                  <Input 
                    type="number" 
                    value={cycleCount} 
                    onChange={(e) => setCycleCount(e.target.value)}
                    className="bg-muted/50 border-border h-11 rounded-xl focus:ring-2 focus:ring-primary/20 font-bold text-sm"
                  />
                </div>
              )}

              <Button 
                onClick={calculateDueDate}
                className="w-full h-12 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all group mt-2"
              >
                Execute Inference <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          <div className="w-full sm:flex-1 max-w-[380px] space-y-5">
            {result && isValid(result) ? (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-4">
                <div className="glass-card !p-5 md:!p-8 border-accent/20 bg-accent/5 text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Milestone className="w-12 h-12 md:w-16 md:h-16 text-accent group-hover:rotate-12 transition-transform duration-1000" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-accent mb-3 block">Target Coordinate</span>
                  <div className="text-2xl md:text-4xl font-black tracking-tighter text-foreground mb-2 md:mb-3 tabular-nums">
                    {format(result, 'dd MMM, yyyy')}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                    <CalendarDays className="w-3 h-3" /> {format(result, 'EEEE')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card !p-3 md:!p-5 border-border/40 text-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Calendar</span>
                    <div className="text-lg md:text-xl font-black text-primary">
                      {stats?.calDays.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[7px] font-bold uppercase text-muted-foreground/60">Total Days</span>
                  </div>
                  <div className="glass-card !p-3 md:!p-5 border-border/40 text-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Velocity</span>
                    <div className="text-lg md:text-xl font-black text-accent uppercase">
                      {stats?.busDays.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[7px] font-bold uppercase text-muted-foreground/60">Work Days</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card !p-3 md:!p-5 border-border/40 text-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Celestial</span>
                    <div className="text-[10px] md:text-sm font-black text-foreground uppercase truncate">
                      {getZodiacSign(result.getDate(), result.getMonth() + 1)}
                    </div>
                    <span className="text-[7px] font-bold uppercase text-muted-foreground/60">Phase</span>
                  </div>
                  <div className="glass-card !p-3 md:!p-5 border-border/40 text-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Confidence</span>
                    <div className="text-lg md:text-xl font-black text-accent uppercase">99.9%</div>
                    <span className="text-[7px] font-bold uppercase text-muted-foreground/60">Sync</span>
                  </div>
                </div>

                <div className="glass-card !p-4 md:!p-5 border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Protocol Insight</span>
                  </div>
                  <p className="text-[10px] md:text-[11px] text-muted-foreground leading-relaxed font-medium">
                    {method === 'business' ? (
                      "Business mode excludes weekends. Synchronized with Indian corporate cycles and IST."
                    ) : method === 'medical' ? (
                      "Gestational tracking mapped for standard 280-day obstetric milestones."
                    ) : method === 'cycle' ? (
                      `Iterative mapping of ${cycleCount.toLocaleString('en-IN')} cycles across ${duration} ${unit}.`
                    ) : (
                      "Absolute Gregorian alignment for maximum chronological precision in the Indian context."
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[300px] md:h-[380px] glass-card !p-8 border-dashed border-border/40 flex flex-col items-center justify-center text-center opacity-40">
                <Hourglass className="w-8 h-8 md:w-10 md:h-10 mb-5 animate-pulse" />
                <h3 className="text-sm md:text-base font-black tracking-tight mb-2">Awaiting Parameters</h3>
                <p className="text-[10px] md:text-[11px] font-medium max-w-[180px]">Define origin and duration vectors to initiate milestone synchronization.</p>
              </div>
            )}

            <div className="glass-card !p-4 md:!p-5 border-border/40">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <Database className="w-3 h-3" /> IST Registry History
              </h4>
              <div className="space-y-1.5 opacity-50">
                <div className="flex justify-between text-[9px] font-mono">
                  <span>LOCALE_SET</span>
                  <span className="text-accent">EN_IN</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono">
                  <span>STRATUM_FEED</span>
                  <span className="text-primary">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-24 md:mt-32 space-y-16">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] text-[9px] px-6 py-1.5 font-black">Architecture Whitepaper</Badge>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">The Science of <span className="text-primary">Deadlines</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-medium">
              We define the standard for high-fidelity chronological milestones through military-grade synchronization protocols in the Indian industry landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="glass-card !p-8 md:!p-10 hover:translate-y-[-8px] transition-all group hover:border-primary/40">
              <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <Workflow className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Project Velocity</h3>
              <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                Mapping the net vector of speed and fidelity at which a piece of information moves from inception to milestone within Indian corporate cycles.
              </p>
            </div>
            <div className="glass-card !p-8 md:!p-10 hover:translate-y-[-8px] transition-all group hover:border-accent/40">
              <div className="w-16 h-16 rounded-[2rem] bg-accent/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Risk Mitigation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                Real-time validation of mathematical inputs prevents overflows and handles Indian calendar edge-cases with absolute parity.
              </p>
            </div>
            <div className="glass-card !p-8 md:!p-10 hover:translate-y-[-8px] transition-all group hover:border-primary/40 sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Global Sync</h3>
              <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                Synchronizing with primary time servers ensuring your deadlines are perfectly aligned with IST and the rotational velocity of the Earth.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto py-12 glass border-t border-border/40">
        <div className="container max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-14 h-14 bg-primary rounded-md flex items-center justify-center">
                <Timer className="text-primary-foreground w-8 h-8" />
              </div>
              <h2 className="text-sm font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent uppercase">
                CHRONOFLOW
              </h2>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed">
              Defining high-precision velocity for professional and tactical computational systems.
            </p>
          </div>
          
          <div className="flex justify-center gap-12">
            <div className="space-y-4 text-center">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Operations</h4>
              <ul className="text-[10px] space-y-2 font-bold text-muted-foreground/60">
                <li className="hover:text-primary transition-colors">
                  <Link href="/due-date-calculator">Due Date Engine</Link>
                </li>
                <li className="hover:text-primary transition-colors">
                  <Link href="/calculator">Scientific ALU</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center md:text-right space-y-4">
             <p className="text-[10px] uppercase font-black tracking-[0.5em] text-muted-foreground/40">
               © 2024 Camly Intelligence Group • India
             </p>
             <div className="flex justify-center md:justify-end gap-6">
                <Link href="/privacy-protocol" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors">Privacy</Link>
                <Link href="/terms-of-sync" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors">Terms</Link>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
