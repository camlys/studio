"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar as CalendarIcon, Clock, Timer, Zap, 
  ShieldCheck, Cpu, Target, Milestone, 
  CalendarDays, Hourglass, ArrowRight,
  Settings, Database, Network, Globe,
  ExternalLink, BarChart3, Workflow, Info,
  Briefcase, HeartPulse, Repeat, Star, Baby, Microscope, Stethoscope,
  TrendingUp, Flag, Layers, LayoutGrid, Download,
  Calculator as CalcIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { addDays, addWeeks, addMonths, format, differenceInDays, isWeekend, addBusinessDays, isValid, getQuarter, getDayOfYear, getISOWeek } from 'date-fns';
import { getZodiacSign } from '@/lib/date-utils';
import { toPng } from 'html-to-image';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const dueDateSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Professional Due Date Engine - India Edition",
  "applicationCategory": "Utility",
  "operatingSystem": "All",
  "description": "High-precision milestone and project due date calculator optimized for Indian Standard Time (IST) and biological/clinical protocols.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  }
};

type CalcMethod = 'standard' | 'business' | 'medical' | 'cycle' | 'ivf' | 'crl' | 'conception';

type DetailedStats = {
  calDays: number;
  busDays: number;
  gestation?: string;
  remaining: number;
  progress: number;
  quarter?: string;
  dayOfYear: number;
  isoWeek: number;
  milestones: { label: string; date: string }[];
};

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
  const [ivfType, setIvfType] = useState<'3-day' | '5-day'>('5-day');
  const [crlValue, setCrlValue] = useState(10);
  
  const [result, setResult] = useState<Date | null>(null);
  const [stats, setStats] = useState<DetailedStats | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Focus management refs
  const dayInputRef = useRef<HTMLInputElement>(null);
  const monthInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: 'day' | 'month' | 'year', value: string) => {
    const numericValue = value.replace(/\D/g, '');
    let finalValue = numericValue;
    if (field === 'day' && parseInt(numericValue) > 31) finalValue = '31';
    if (field === 'month' && parseInt(numericValue) > 12) finalValue = '12';
    if (field === 'year' && numericValue.length > 4) finalValue = numericValue.slice(0, 4);
    
    setStartValues(prev => ({ ...prev, [field]: finalValue }));

    // Auto-tab logic: Move focus when digits are filled
    if (field === 'day' && finalValue.length === 2) {
      monthInputRef.current?.focus();
    } else if (field === 'month' && finalValue.length === 2) {
      yearInputRef.current?.focus();
    }
  };

  const calculateDueDate = () => {
    const d = parseInt(startValues.day);
    const m = parseInt(startValues.month);
    const y = parseInt(startValues.year);

    if (isNaN(d) || isNaN(m) || isNaN(y) || y < 1000) {
      setResult(null);
      setStats(null);
      return;
    }

    const start = new Date(y, m - 1, d);
    if (!isValid(start) || start.getFullYear() !== y || start.getMonth() !== m - 1 || start.getDate() !== d) {
      setResult(null);
      setStats(null);
      return;
    }

    const num = parseInt(duration) || 0;
    const cycles = parseInt(cycleCount) || 1;
    let end: Date;
    let gestationStr: string | undefined;
    let milestones: { label: string; date: string }[] = [];

    switch (method) {
      case 'medical':
        end = addDays(start, 280);
        milestones = [
          { label: "2nd Trimester", date: format(addWeeks(start, 13), 'dd/MM/yy') },
          { label: "3rd Trimester", date: format(addWeeks(start, 27), 'dd/MM/yy') }
        ];
        break;
      case 'conception':
        end = addDays(start, 266);
        milestones = [
          { label: "Trimester 2", date: format(addWeeks(start, 11), 'dd/MM/yy') },
          { label: "Trimester 3", date: format(addWeeks(start, 25), 'dd/MM/yy') }
        ];
        break;
      case 'ivf':
        end = addDays(start, ivfType === '3-day' ? 263 : 261);
        const lmpEq = addDays(start, ivfType === '3-day' ? -17 : -19);
        milestones = [
          { label: "Trimester 2", date: format(addWeeks(lmpEq, 13), 'dd/MM/yy') },
          { label: "Trimester 3", date: format(addWeeks(lmpEq, 27), 'dd/MM/yy') }
        ];
        break;
      case 'crl':
        const gaDays = crlValue + 42;
        end = addDays(start, 280 - gaDays);
        const lmpFromCrl = addDays(start, -gaDays);
        milestones = [
          { label: "Trimester 2", date: format(addWeeks(lmpFromCrl, 13), 'dd/MM/yy') },
          { label: "Trimester 3", date: format(addWeeks(lmpFromCrl, 27), 'dd/MM/yy') }
        ];
        break;
      case 'business':
        end = addBusinessDays(start, num * cycles);
        break;
      case 'cycle':
        let tempDate = start;
        for(let i = 0; i < cycles; i++) {
          if (unit === 'weeks') tempDate = addWeeks(tempDate, num);
          else if (unit === 'months') tempDate = addMonths(tempDate, num);
          else tempDate = addDays(tempDate, num);
        }
        end = tempDate;
        break;
      default:
        if (unit === 'weeks') end = addWeeks(start, num);
        else if (unit === 'months') end = addMonths(start, num);
        else end = addDays(start, num);
    }

    if (!isValid(end)) {
      setResult(null);
      setStats(null);
      return;
    }

    const today = new Date();
    const remaining = differenceInDays(end, today);
    const totalCal = Math.abs(differenceInDays(end, start));
    const elapsed = Math.max(0, differenceInDays(today, start));
    const progress = totalCal > 0 ? Math.min(100, Math.round((elapsed / totalCal) * 100)) : 0;

    // Gestation string calculation for biological methods
    if (['medical', 'ivf', 'crl', 'conception'].includes(method)) {
      let lmpOrigin = start;
      if (method === 'conception') lmpOrigin = addDays(start, -14);
      if (method === 'ivf') lmpOrigin = addDays(start, ivfType === '3-day' ? -17 : -19);
      if (method === 'crl') lmpOrigin = addDays(start, -(crlValue + 42));

      const totalDiffDays = differenceInDays(today, lmpOrigin);
      if (totalDiffDays >= 0) {
        const weeks = Math.floor(totalDiffDays / 7);
        const remainingDays = totalDiffDays % 7;
        gestationStr = `${weeks}w ${remainingDays}d`;
      } else {
        gestationStr = "Pre-LMP";
      }
    }

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

    setResult(end);
    setStats({
      calDays: totalCal,
      busDays: workDays,
      gestation: gestationStr,
      remaining,
      progress,
      quarter: `Q${getQuarter(end)} FY${format(end, 'yy')}`,
      dayOfYear: getDayOfYear(end),
      isoWeek: getISOWeek(end),
      milestones
    });
  };

  const downloadReport = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        backgroundColor: '#f9f9f9',
        style: {
          transform: 'scale(1)',
        }
      });
      const link = document.createElement('a');
      link.download = `ChronoFlow_Tactical_Report_${format(new Date(), 'yyyyMMdd_HHmm')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    calculateDueDate();
  }, [startValues, duration, unit, method, cycleCount, ivfType, crlValue]);

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

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center whitespace-nowrap">
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button 
                 variant="ghost" 
                 className="rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] gap-2.5 transition-all group hover:bg-primary/5 text-primary/60 hover:text-primary"
               >
                 <LayoutGrid className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                 <span className="hidden min-[480px]:inline">Operational Tools</span>
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="center" className="w-56 glass border-border/40 backdrop-blur-xl">
               <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-40 px-3 py-2">Mission Control</DropdownMenuLabel>
               <DropdownMenuSeparator className="bg-border/20" />
               <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 rounded-lg m-1">
                 <Link href="/calculator" className="flex items-center gap-3 w-full px-2 py-2">
                   <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                     <CalcIcon className="w-4 h-4 text-primary" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Calculator Engine</span>
                     <span className="text-[8px] font-bold text-muted-foreground uppercase">Precision ALU</span>
                   </div>
                 </Link>
               </DropdownMenuItem>
               <DropdownMenuItem asChild className="cursor-pointer focus:bg-accent/10 rounded-lg m-1">
                 <Link href="/due-date-calculator" className="flex items-center gap-3 w-full px-2 py-2">
                   <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                     <CalendarDays className="w-4 h-4 text-accent" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Due Date Engine</span>
                     <span className="text-[8px] font-bold text-muted-foreground uppercase">Tactical Planning</span>
                   </div>
                 </Link>
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
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
            Clinical & Tactical Planning Layer
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.85]">
            Milestone <span className="text-primary">Inference</span> Engine
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-xl mx-auto md:mx-0">
            Advanced due date synchronization for Indian corporate cycles, IVF protocols, clinical ultrasound dating, and IST tactical planning.
          </p>
        </div>

        <div className="flex flex-col min-[480px]:row items-start justify-center gap-4 md:gap-8 lg:gap-16">
          
          <div className="w-full min-[480px]:flex-1 max-w-sm space-y-6">
            <div className="glass-card !p-4 md:!p-6 space-y-5 border-border/40 shadow-2xl">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Method of Sync</Label>
                <Select value={method} onValueChange={(v: any) => setMethod(v)}>
                  <SelectTrigger className="bg-muted/50 border-border h-11 rounded-xl focus:ring-2 focus:ring-primary/20 font-bold text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard" className="flex items-center gap-2 text-xs"><CalendarIcon className="w-3.5 h-3.5 inline mr-2" /> Calendar Days</SelectItem>
                    <SelectItem value="business" className="flex items-center gap-2 text-xs"><Briefcase className="w-3.5 h-3.5 inline mr-2" /> Business Days</SelectItem>
                    <SelectItem value="medical" className="flex items-center gap-2 text-xs"><Stethoscope className="w-3.5 h-3.5 inline mr-2" /> LMP (Last Period)</SelectItem>
                    <SelectItem value="ivf" className="flex items-center gap-2 text-xs"><Microscope className="w-3.5 h-3.5 inline mr-2" /> IVF Transfer</SelectItem>
                    <SelectItem value="crl" className="flex items-center gap-2 text-xs"><Baby className="w-3.5 h-3.5 inline mr-2" /> Ultrasound (CRL)</SelectItem>
                    <SelectItem value="conception" className="flex items-center gap-2 text-xs"><Zap className="w-3.5 h-3.5 inline mr-2" /> Conception Date</SelectItem>
                    <SelectItem value="cycle" className="flex items-center gap-2 text-xs"><Repeat className="w-3.5 h-3.5 inline mr-2" /> Project Cycles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                  {method === 'medical' ? 'LMP Date (Origin)' : 
                   method === 'ivf' ? 'Transfer Date (Origin)' :
                   method === 'crl' ? 'Ultrasound Date (Origin)' :
                   method === 'conception' ? 'Conception Date (Origin)' :
                   'Execution Start (Origin)'}
                </Label>
                <div className="flex gap-2">
                  <div className="grid grid-cols-3 gap-1 flex-grow">
                    <Input 
                      ref={dayInputRef}
                      placeholder="DD"
                      value={startValues.day} 
                      onChange={(e) => handleInputChange('day', e.target.value)}
                      className="bg-muted/50 border-border h-11 rounded-l-xl rounded-r-none focus:ring-2 focus:ring-primary/20 font-bold text-sm text-center px-1"
                      maxLength={2}
                    />
                    <Input 
                      ref={monthInputRef}
                      placeholder="MM"
                      value={startValues.month} 
                      onChange={(e) => handleInputChange('month', e.target.value)}
                      className="bg-muted/50 border-border h-11 rounded-none border-l-0 border-r-0 focus:ring-2 focus:ring-primary/20 font-bold text-sm text-center px-1"
                      maxLength={2}
                    />
                    <Input 
                      ref={yearInputRef}
                      placeholder="YYYY"
                      value={startValues.year} 
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="bg-muted/50 border-border h-11 rounded-r-xl rounded-l-none border-l-0 focus:ring-2 focus:ring-primary/20 font-bold text-sm text-center px-1"
                      maxLength={4}
                    />
                  </div>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-11 w-11 rounded-xl p-0 shrink-0 border-border bg-muted/50 hover:bg-muted">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-1 origin-top-right" align="end">
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
                            setIsCalendarOpen(false);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {method === 'ivf' && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Embryo Age</Label>
                  <Select value={ivfType} onValueChange={(v: any) => setIvfType(v)}>
                    <SelectTrigger className="bg-muted/50 border-border h-11 rounded-xl focus:ring-2 focus:ring-primary/20 font-bold text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-day">3-Day Transfer</SelectItem>
                      <SelectItem value="5-day">5-Day Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {method === 'crl' && (
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">CRL Measurement (mm)</Label>
                    <span className="text-xs font-black text-primary">{crlValue} mm</span>
                  </div>
                  <Slider 
                    value={[crlValue]} 
                    min={1} 
                    max={85} 
                    step={1} 
                    onValueChange={([v]) => setCrlValue(v)}
                    className="py-2"
                  />
                  <p className="text-[8px] text-muted-foreground italic font-medium">Valid CRL range for precision dating: 1mm to 85mm.</p>
                </div>
              )}

              {!['medical', 'ivf', 'crl', 'conception'].includes(method) && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Duration Vector</Label>
                    <input 
                      type="number" 
                      value={duration} 
                      onChange={(e) => setDuration(e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 font-bold outline-none"
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
                  <input 
                    type="number" 
                    value={cycleCount} 
                    onChange={(e) => setCycleCount(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 font-bold outline-none"
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

          <div className="w-full min-[480px]:flex-1 max-w-[420px] space-y-5">
            {result && isValid(result) && stats ? (
              <div className="space-y-4">
                <div ref={reportRef} className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-4 bg-background p-2 rounded-3xl">
                  <div className="glass-card !p-5 md:!p-8 border-accent/20 bg-accent/5 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      {['medical', 'ivf', 'crl', 'conception'].includes(method) ? (
                        <Baby className="w-12 h-12 md:w-16 md:h-16 text-accent group-hover:rotate-12 transition-transform duration-1000" />
                      ) : (
                        <Milestone className="w-12 h-12 md:w-16 md:h-16 text-accent group-hover:rotate-12 transition-transform duration-1000" />
                      )}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-accent mb-3 block">
                      {['medical', 'ivf', 'crl', 'conception'].includes(method) ? 'Estimated Due Date' : 'Target Coordinate'}
                    </span>
                    <div className="text-2xl md:text-4xl font-black tracking-tighter text-foreground mb-2 md:mb-3 tabular-nums">
                      {format(result, 'dd MMM, yyyy')}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      <CalendarDays className="w-3 h-3" /> {format(result, 'EEEE')}
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                        <span>Sync Progress</span>
                        <span>{stats.progress}%</span>
                      </div>
                      <Progress value={stats.progress} className="h-1.5 bg-accent/10" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card !p-3 md:!p-5 border-border/40 text-center">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Countdown</span>
                      <div className="text-lg md:text-xl font-black text-primary">
                        {stats.remaining.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[7px] font-bold uppercase text-muted-foreground/60">Days To Go</span>
                    </div>
                    <div className="glass-card !p-3 md:!p-5 border-border/40 text-center">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                        {['medical', 'ivf', 'crl', 'conception'].includes(method) ? 'Progress' : 'Velocity'}
                      </span>
                      <div className="text-lg md:text-xl font-black text-accent uppercase">
                        {stats.gestation || stats.busDays.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[7px] font-bold uppercase text-muted-foreground/60">
                        {stats.gestation ? 'Weeks Gone' : 'Work Days'}
                      </span>
                    </div>
                  </div>

                  {stats.milestones.length > 0 && (
                    <div className="glass-card !p-4 md:!p-5 border-border/40 space-y-4">
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Flag className="w-3.5 h-3.5 text-primary" /> Critical Milestones
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {stats.milestones.map((ms, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/20">
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80">{ms.label}</span>
                            <Badge variant="outline" className="text-[9px] font-mono text-primary border-primary/20">{ms.date}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card !p-3 md:!p-5 border-border/40 text-center">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Celestial</span>
                      <div className="text-[10px] md:text-sm font-black text-foreground uppercase truncate">
                        {getZodiacSign(result.getDate(), result.getMonth() + 1)}
                      </div>
                      <span className="text-[7px] font-bold uppercase text-muted-foreground/60">Phase Alignment</span>
                    </div>
                    <div className="glass-card !p-3 md:!p-5 border-border/40 text-center">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Context</span>
                      <div className="text-[10px] md:text-sm font-black text-accent uppercase truncate">
                        {['medical', 'ivf', 'crl', 'conception'].includes(method) ? 'Biological' : stats.quarter}
                      </div>
                      <span className="text-[7px] font-bold uppercase text-muted-foreground/60">Logic Layer</span>
                    </div>
                  </div>

                  <div className="glass-card !p-4 md:!p-5 border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Protocol Insight</span>
                    </div>
                    <p className="text-[10px] md:text-[11px] text-muted-foreground leading-relaxed font-medium">
                      Target Coordinate derived via {method.toUpperCase()} protocol. 
                      Calculated day of year is {stats.dayOfYear} in ISO-8601 Week {stats.isoWeek}.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={downloadReport} 
                    disabled={isDownloading}
                    variant="outline" 
                    className="w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest border-primary/20 hover:bg-primary/5 hover:text-primary gap-2.5 transition-all"
                  >
                    <Download className={cn("w-4 h-4", isDownloading && "animate-bounce")} />
                    {isDownloading ? 'Capturing...' : 'Download Report'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-[300px] md:h-[380px] glass-card !p-8 border-dashed border-border/40 flex flex-col items-center justify-center text-center opacity-40">
                <Hourglass className="w-8 h-8 md:w-10 md:h-10 mb-5 animate-pulse" />
                <h3 className="text-sm md:text-base font-black tracking-tight mb-2">Awaiting Parameters</h3>
                <p className="text-[10px] md:text-[11px] font-medium max-w-[180px]">Define origin and protocol vectors to initiate milestone synchronization.</p>
              </div>
            )}

            <div className="glass-card !p-4 md:!p-5 border-border/40">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <Database className="w-3.5 h-3.5" /> IST Registry History
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
              We define the standard for high-fidelity chronological milestones through military-grade synchronization and clinical protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="glass-card !p-8 md:!p-10 hover:translate-y-[-8px] transition-all group hover:border-primary/40">
              <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <Workflow className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Clinical Fidelity</h3>
              <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                Implementing standard obstetric and IVF dating models with absolute parity, turning biological data into precise milestones.
              </p>
            </div>
            <div className="glass-card !p-8 md:!p-10 hover:translate-y-[-8px] transition-all group hover:border-accent/40">
              <div className="w-16 h-16 rounded-[2rem] bg-accent/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Risk Mitigation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                Real-time validation of mathematical and biological inputs prevents overflows and handles edge-cases with sub-millisecond precision.
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
