"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Calendar as CalendarIcon, CalendarDays, Zap, 
  ShieldCheck, Milestone, 
  Hourglass, ArrowRight,
  Database, Globe,
  ExternalLink, Workflow, 
  Briefcase, Baby, Microscope, Stethoscope,
  Flag, LayoutGrid, Download,
  Calculator as CalcIcon, Timer,
  Clock, Dna, Activity, Scaling, HeartPulse, Sparkles,
  FileType, Github, Twitter, ChevronRight, GraduationCap
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
import { InstallPWA } from '@/components/chrono/InstallPWA';
import { cn } from '@/lib/utils';
import { addDays, addWeeks, addMonths, format, differenceInDays, isWeekend, addBusinessDays, isValid, getQuarter, getDayOfYear, getISOWeek, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
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
  "softwareVersion": "3.2.0",
  "browserRequirements": "Requires JavaScript",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://calculator.camly.org/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Due Date Engine",
      "item": "https://calculator.camly.org/due-date-calculator"
    }
  ]
};

type CalcMethod = 'standard' | 'business' | 'medical' | 'cycle' | 'ivf' | 'crl' | 'conception';

type DetailedStats = {
  calDays: number;
  busDays: number;
  gestation?: string;
  trimester?: string;
  fetalAge?: string;
  remaining: number;
  remHours: number;
  remMinutes: number;
  remSeconds: number;
  progress: number;
  quarter?: string;
  dayOfYear: number;
  isoWeek: number;
  milestones: { label: string; date: string; category?: string }[];
  bioInsight?: string;
  sizeComparison?: string;
};

export default function DueDateCalculator() {
  const [method, setMethod] = useState<CalcMethod>('medical');
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
    let trimesterStr: string | undefined;
    let fetalAgeStr: string | undefined;
    let bioInsight: string | undefined;
    let sizeComparison: string | undefined;
    let milestones: { label: string; date: string; category?: string }[] = [];

    switch (method) {
      case 'medical':
        end = addDays(start, 280);
        milestones = [
          { label: "Organogenesis Begins", date: format(addWeeks(start, 5), 'dd MMM'), category: 'Biological' },
          { label: "1st Trimester Completion", date: format(addWeeks(start, 12), 'dd MMM'), category: 'Phase' },
          { label: "2nd Trimester Begins", date: format(addWeeks(start, 13), 'dd MMM'), category: 'Phase' },
          { label: "Anatomy Scan (Typical)", date: format(addWeeks(start, 20), 'dd MMM'), category: 'Clinical' },
          { label: "Threshold of Viability", date: format(addWeeks(start, 24), 'dd MMM'), category: 'Critical' },
          { label: "3rd Trimester Begins", date: format(addWeeks(start, 27), 'dd MMM'), category: 'Phase' },
          { label: "Full Term Threshold", date: format(addWeeks(start, 37), 'dd MMM'), category: 'Phase' }
        ];
        break;
      case 'conception':
        end = addDays(start, 266);
        const lmpEquiv = addDays(start, -14);
        milestones = [
          { label: "First Trimester Ends", date: format(addWeeks(lmpEquiv, 12), 'dd MMM') },
          { label: "Second Trimester Ends", date: format(addWeeks(lmpEquiv, 26), 'dd MMM') }
        ];
        break;
      case 'ivf':
        end = addDays(start, ivfType === '3-day' ? 263 : 261);
        const lmpEqiv = addDays(start, ivfType === '3-day' ? -17 : -19);
        milestones = [
          { label: "Heartbeat Detectable", date: format(addWeeks(lmpEqiv, 6), 'dd MMM') },
          { label: "Glucose Screening", date: format(addWeeks(lmpEqiv, 26), 'dd MMM') }
        ];
        break;
      case 'crl':
        const gaDays = crlValue + 42;
        end = addDays(start, 280 - gaDays);
        const lmpFromCrl = addDays(start, -gaDays);
        milestones = [
          { label: "Neural Tube Complete", date: format(addWeeks(lmpFromCrl, 6), 'dd MMM') },
          { label: "Surfactant Production", date: format(addWeeks(lmpFromCrl, 28), 'dd MMM') }
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
    const remHours = differenceInHours(end, today);
    const remMinutes = differenceInMinutes(end, today);
    const remSeconds = differenceInSeconds(end, today);
    const totalCal = Math.abs(differenceInDays(end, start));
    const elapsed = Math.max(0, differenceInDays(today, start));
    const progress = totalCal > 0 ? Math.min(100, Math.round((elapsed / totalCal) * 100)) : 0;

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
        
        if (weeks < 13) trimesterStr = "1st Trimester";
        else if (weeks < 27) trimesterStr = "2nd Trimester";
        else trimesterStr = "3rd Trimester";

        const fetalAgeStr = `${weeks > 2 ? weeks - 2 : 0}w ${remainingDays}d`;

        if (weeks >= 4 && weeks < 9) { bioInsight = "Organogenesis Phase"; sizeComparison = "Blueberry"; }
        else if (weeks >= 9 && weeks < 13) { bioInsight = "Fetal Transition"; sizeComparison = "Grape"; }
        else if (weeks >= 13 && weeks < 20) { bioInsight = "Active Growth"; sizeComparison = "Lemon"; }
        else if (weeks >= 20 && weeks < 28) { bioInsight = "Viability Window"; sizeComparison = "Banana"; }
        else if (weeks >= 28 && weeks < 37) { bioInsight = "Rapid Maturation"; sizeComparison = "Cabbage"; }
        else if (weeks >= 37) { bioInsight = "Full Term Ready"; sizeComparison = "Pumpkin"; }
        else { bioInsight = "Cellular Assembly"; sizeComparison = "Poppy Seed"; }
      } else {
        gestationStr = "Pre-LMP";
        trimesterStr = "Pre-Conception";
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
      trimester: trimesterStr,
      fetalAge: fetalAgeStr,
      remaining,
      remHours,
      remMinutes,
      remSeconds,
      progress,
      quarter: `Q${getQuarter(end)} FY${format(end, 'yy')}`,
      dayOfYear: getDayOfYear(end),
      isoWeek: getISOWeek(end),
      milestones,
      bioInsight,
      sizeComparison
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
      link.download = `Camly_Tactical_Report_${format(new Date(), 'yyyyMMdd_HHmm')}.png`;
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav className="relative z-50 glass border-b border-border h-14 flex items-center px-4 md:px-6 justify-between transition-colors">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center transition-all group-hover:scale-110">
              <Image src="/camly.png" alt="Camly" width={40} height={40} priority className="object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent uppercase font-roboto-slab">
                CALCULATOR
              </h1>
              <span className="text-[7px] font-bold tracking-[0.3em] text-primary/60 uppercase mt-1">camly.org</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button 
                 variant="ghost" 
                 className="rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] gap-1.5 md:gap-2.5 transition-all group hover:bg-primary/5 text-primary/60 hover:text-primary"
               >
                 <LayoutGrid className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                 <span className="hidden min-[480px]:inline">Operational Tools</span>
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-56 glass border-border/40 backdrop-blur-xl">
               <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/5 rounded-lg m-1 mb-0">
                 <Link href="https://camly.org" target="_blank" className="flex items-center gap-3 w-full px-2 py-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileType className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">camly.org</span>
                      <span className="text-[7px] font-bold text-muted-foreground uppercase">Image & PDF Resizer</span>
                    </div>
                    <ExternalLink className="w-2.5 h-2.5 ml-auto opacity-30" />
                 </Link>
               </DropdownMenuItem>
               <DropdownMenuSeparator className="bg-border/10 mx-2" />
               <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 rounded-lg m-1">
                 <Link href="/calculator" className="flex items-center gap-3 w-full px-2 py-2">
                   <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                     <CalcIcon className="w-4 h-4 text-primary" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Calculator</span>
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
                     <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Due Date</span>
                     <span className="text-[8px] font-bold text-muted-foreground uppercase">Tactical Planning</span>
                   </div>
                 </Link>
               </DropdownMenuItem>
               <DropdownMenuItem asChild className="cursor-pointer focus:bg-accent/10 rounded-lg m-1">
                 <Link href="/cgpa-calculator" className="flex items-center gap-3 w-full px-2 py-2">
                   <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                     <GraduationCap className="w-4 h-4 text-accent" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Academic Sync</span>
                     <span className="text-[8px] font-bold text-muted-foreground uppercase">CGPA Calculator</span>
                   </div>
                 </Link>
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>

          <Badge variant="outline" className="hidden min-[480px]:flex border-accent/20 text-accent uppercase tracking-widest text-[8px] px-3 h-6 items-center gap-1.5 font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> IST SYNCED
          </Badge>
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest gap-2">
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

        <div className="flex flex-col min-[480px]:flex-row items-start justify-center gap-6 md:gap-8 lg:gap-16">
          
          <div className="w-full min-[480px]:flex-1 max-w-sm space-y-6">
            <div className="glass-card !p-4 md:!p-6 space-y-5 border-black dark:border-white border shadow-2xl">
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
                    <SelectItem value="cycle" className="flex items-center gap-2 text-xs"><CalcIcon className="w-3.5 h-3.5 inline mr-2" /> Project Cycles</SelectItem>
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

              <Button 
                onClick={calculateDueDate}
                className="w-full h-12 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all group mt-2"
              >
                Execute Inference <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="glass-card !p-4 border-border/40">
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

          <div className="w-full min-[480px]:flex-1 max-w-[540px] space-y-5">
            {result && isValid(result) && stats ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div ref={reportRef} className="space-y-5 bg-background p-2 rounded-3xl">
                  {/* Primary Target Coordinate */}
                  <div className="glass-card !p-6 md:!p-10 border-accent/20 bg-accent/5 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      {['medical', 'ivf', 'crl', 'conception'].includes(method) ? (
                        <Baby className="w-16 h-16 md:w-24 md:h-24 text-accent group-hover:rotate-12 transition-transform duration-1000" />
                      ) : (
                        <Milestone className="w-16 h-16 md:w-24 md:h-24 text-accent group-hover:rotate-12 transition-transform duration-1000" />
                      )}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-accent mb-4 block">
                      {['medical', 'ivf', 'crl', 'conception'].includes(method) ? 'Estimated Due Date' : 'Target Coordinate'}
                    </span>
                    <div className="text-3xl md:text-6xl font-black tracking-tighter text-foreground mb-4 tabular-nums">
                      {format(result, 'dd MMM, yyyy')}
                    </div>
                    <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      <CalendarIcon className="w-4 h-4" /> {format(result, 'EEEE')}
                      <Separator orientation="vertical" className="h-4 bg-accent/20" />
                      <Clock className="w-4 h-4" /> IST Sync
                    </div>

                    <div className="mt-8 space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        <span>Synchronization Progress</span>
                        <span>{stats.progress}%</span>
                      </div>
                      <Progress value={stats.progress} className="h-2 bg-accent/10" />
                    </div>
                  </div>

                  {/* Biological Deep Dive (Only for Clinical methods) */}
                  {['medical', 'ivf', 'crl', 'conception'].includes(method) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="glass-card !p-5 border-primary/20 bg-primary/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                           <Dna className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Clinical Phase</span>
                          <p className="text-sm font-black text-foreground uppercase">{stats.trimester}</p>
                        </div>
                      </div>
                      <div className="glass-card !p-5 border-accent/20 bg-accent/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                           <Scaling className="w-6 h-6 text-accent" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Bio Comparison</span>
                          <p className="text-sm font-black text-foreground uppercase">Size of a {stats.sizeComparison}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detailed Countdown Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="glass-card !p-4 border-border/40 text-center">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Days</span>
                      <div className="text-xl font-black text-primary">{stats.remaining.toLocaleString()}</div>
                    </div>
                    <div className="glass-card !p-4 border-border/40 text-center">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Hours</span>
                      <div className="text-xl font-black text-primary">{stats.remHours.toLocaleString()}</div>
                    </div>
                    <div className="glass-card !p-4 border-border/40 text-center">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Minutes</span>
                      <div className="text-lg font-black text-primary truncate px-1">{stats.remMinutes.toLocaleString()}</div>
                    </div>
                    <div className="glass-card !p-4 border-border/40 text-center">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Progress</span>
                      <div className="text-xl font-black text-accent">{stats.gestation || stats.busDays}</div>
                    </div>
                  </div>

                  {/* High-Authority Milestone Matrix */}
                  {stats.milestones.length > 0 && (
                    <div className="glass-card !p-5 border-border/40 space-y-5">
                      <div className="flex items-center justify-between">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                           <Flag className="w-4 h-4 text-primary" /> Authority Milestone Matrix
                         </h4>
                         <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20 text-primary">IST Calibrated</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {stats.milestones.map((ms, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/20 group hover:border-primary/40 transition-colors">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-black uppercase tracking-widest text-foreground/80">{ms.label}</span>
                              <p className="text-[7px] font-bold text-muted-foreground uppercase">{ms.category || 'Clinical'}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-mono font-black text-primary">{ms.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Celestial & Phase Synchronization */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="glass-card !p-4 border-border/40 text-center col-span-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Zodiac Mapping</span>
                      <div className="text-xs font-black text-foreground uppercase truncate flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-accent" /> {getZodiacSign(result.getDate(), result.getMonth() + 1)}
                      </div>
                    </div>
                    <div className="glass-card !p-4 border-border/40 text-center col-span-1 md:col-span-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Biological Inference</span>
                      <div className="text-xs font-black text-accent uppercase truncate flex items-center justify-center gap-1.5">
                        <HeartPulse className="w-3.5 h-3.5" /> {stats.bioInsight || 'Corporate Tactical Sync'}
                      </div>
                    </div>
                  </div>

                  {/* Precision Logic Feed */}
                  <div className="glass-card !p-5 border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center shrink-0 animate-spin-slow">
                       <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                       <h5 className="text-[10px] font-black uppercase tracking-widest text-primary">Instruction Execution Log</h5>
                       <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                         Target Coordinate derived via {method.toUpperCase()} protocol. Absolute parity with Stratum-1 nodes maintained. 
                         Calculated day of year is {stats.dayOfYear} in ISO-8601 Week {stats.isoWeek}.
                       </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={downloadReport} 
                    disabled={isDownloading}
                    className="w-full h-12 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all group gap-3"
                  >
                    <Download className={cn("w-4 h-4", isDownloading && "animate-bounce")} />
                    {isDownloading ? 'Capturing Report...' : 'Download Detailed PNG'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-[400px] md:h-[600px] glass-card !p-12 border-dashed border-border/40 flex flex-col items-center justify-center text-center opacity-30">
                <div className="relative w-24 h-24 mb-8">
                   <div className="absolute inset-0 rounded-full border-2 border-primary/10 border-t-primary animate-spin" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Hourglass className="w-10 h-10 text-primary/40" />
                   </div>
                </div>
                <h3 className="text-xl font-black tracking-tight mb-3">Awaiting Temporal Coordinates</h3>
                <p className="text-xs font-medium max-w-[240px] font-medium leading-relaxed">Input origin and protocol parameters to initiate high-precision milestone synchronization.</p>
              </div>
            )}
          </div>
        </div>

        {/* Science of Deadlines Section */}
        <section className="mt-32 space-y-20">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] text-[10px] px-6 py-1.5 font-black">Architecture Whitepaper</Badge>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">The Science of <span className="text-primary">Chronology</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-medium">
              We define the global standard for high-fidelity chronological milestones through military-grade synchronization and clinical protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-primary/40">
              <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <Workflow className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Clinical Fidelity</h3>
              <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                Implementing standard obstetric and IVF dating models with absolute parity, turning biological data into precise milestones.
              </p>
            </div>
            <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-accent/40">
              <div className="w-16 h-16 rounded-[2rem] bg-accent/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Risk Mitigation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                Real-time validation of mathematical and biological inputs prevents overflows and handles edge-cases with sub-millisecond precision.
              </p>
            </div>
            <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-primary/40">
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

      <footer className="relative mt-auto pt-24 pb-12 px-6 transition-colors duration-700 border-t glass border-border/40">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center transition-all">
                  <Image src="/camly.png" alt="Camly" width={48} height={48} className="object-contain" />
                </div>
                <h2 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent uppercase font-roboto-slab">
                  CALCULATOR
                </h2>
              </div>
              <p className="text-sm leading-relaxed max-w-xs font-medium text-muted-foreground">
                Defining the standard for high-precision chronological and academic computation. 
                Camly Inc's flagship engine for professional and tactical management.
              </p>
              <div className="flex gap-5">
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-accent/10 shadow-sm border border-border/50"><Github className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-accent/10 shadow-sm border border-border/50"><Twitter className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-accent/10 shadow-sm border border-border/50"><Globe className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Operations</h3>
              <ul className="space-y-3 text-xs font-bold text-muted-foreground">
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/due-date-calculator">Due Date</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/calculator">Precision Calculator</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" />
                   <Link href="/cgpa-calculator">CGPA Calculator</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" />
                   <Link href="/">Age Calculator</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Intelligence</h3>
              <ul className="space-y-3 text-xs font-bold text-muted-foreground">
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/blog">Knowledge Hub</Link>
                </li>
                <li className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" /> Fun Facts API
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Architecture</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-[10px] font-black tracking-widest text-accent">
                  <div className="w-2 h-2 rounded-full animate-pulse bg-accent" />
                  CAMLY-SYNC-01: ONLINE
                </div>
                <InstallPWA />
              </div>
            </div>
          </div>

          <Separator className="mb-10 bg-border/60" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] uppercase tracking-[0.5em] font-black text-muted-foreground/40">
              © 2024 Camly Inc • Defining High-Precision Velocity
            </p>
            <div className="flex gap-8">
              <Link href="/privacy-protocol" className="text-[10px] uppercase tracking-[0.2em] transition-colors font-black text-muted-foreground/40 hover:text-primary">Privacy Protocol</Link>
              <Link href="/terms-of-sync" className="text-[10px] uppercase tracking-[0.2em] transition-colors font-black text-muted-foreground/40 hover:text-primary">Terms of Sync</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
