"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Flame, Scale, Activity, 
  Download, Zap, ShieldCheck, Database, 
  ExternalLink, LayoutGrid, Calculator as CalcIcon, 
  CalendarDays, Timer, Github, Twitter, ChevronRight,
  Target, BarChart3, FileType, CheckCircle2,
  TrendingUp, Utensils, HeartPulse, Beef, Wheat, Droplets,
  ArrowRight, Info, GraduationCap, Wallet, UserCheck, Globe
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InstallPWA } from '@/components/chrono/InstallPWA';
import { cn } from '@/lib/utils';
import { toPng } from 'html-to-image';
import { format } from 'date-fns';

const calorieSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Metabolic Inference Engine - Calorie Calculator",
  "applicationCategory": "Health",
  "operatingSystem": "All",
  "description": "Professional TDEE and Macro-nutrient calculator with goal-based metabolic synchronization.",
  "softwareVersion": "1.0.0",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

type Goal = 'loss' | 'maintain' | 'gain';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extra';
type MacroSplit = 'balanced' | 'high-protein' | 'low-carb';

export default function CalorieCalculator() {
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState(70); // kg
  const [height, setHeight] = useState(175); // cm
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [split, setSplit] = useState<MacroSplit>('balanced');
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const calculateMetabolics = () => {
    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;

    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extra: 1.9
    };

    const tdee = bmr * activityMultipliers[activity];

    let targetCalories = tdee;
    if (goal === 'loss') targetCalories = tdee - 500;
    if (goal === 'gain') targetCalories = tdee + 500;

    const splits: Record<MacroSplit, { p: number, c: number, f: number }> = {
      balanced: { p: 0.3, c: 0.4, f: 0.3 },
      'high-protein': { p: 0.4, c: 0.3, f: 0.3 },
      'low-carb': { p: 0.4, c: 0.2, f: 0.4 }
    };

    const currentSplit = splits[split];
    const macros = {
      protein: (targetCalories * currentSplit.p) / 4,
      carbs: (targetCalories * currentSplit.c) / 4,
      fats: (targetCalories * currentSplit.f) / 9
    };

    const bmi = weight / Math.pow(height / 100, 2);

    return { bmr, tdee, targetCalories, macros, bmi };
  };

  const results = calculateMetabolics();

  const downloadReport = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        backgroundColor: '#f9f9f9',
      });
      const link = document.createElement('a');
      link.download = `Camly_Metabolic_Report_${format(new Date(), 'yyyyMMdd')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calorieSchema) }} />
      
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
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest gap-2">
              <ArrowLeft className="w-3 h-3" /> Back
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8 md:py-16">
        <header className="mb-10 md:mb-12 space-y-3 text-center min-[480px]:text-left">
          <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] text-[9px] px-3 py-1 font-black">
            Metabolic Performance Layer
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.85] text-primary">
            Calorie <span className="text-foreground">Inference</span> Engine
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-xl mx-auto min-[480px]:mx-0">
            Advanced physiological synchronization for TDEE profiling, macro-nutrient optimization, and high-fidelity nutritional tracking.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
          <div className="w-full lg:flex-grow space-y-8">
            <div className="glass-card !p-8 border-black dark:border-white border-2 shadow-2xl space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Biometric Age</Label>
                    <span className="text-sm font-black text-foreground">{age} Yrs</span>
                  </div>
                  <Slider value={[age]} min={15} max={80} step={1} onValueChange={([v]) => setAge(v)} />
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Biological Sex</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setGender('male')}
                        className={cn("flex-1 h-10 font-black uppercase text-[10px] tracking-widest border-2", gender === 'male' ? "border-primary bg-primary/5 text-primary" : "border-border")}
                      >
                        Male
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setGender('female')}
                        className={cn("flex-1 h-10 font-black uppercase text-[10px] tracking-widest border-2", gender === 'female' ? "border-primary bg-primary/5 text-primary" : "border-border")}
                      >
                        Female
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Current Mass (kg)</Label>
                    <span className="text-sm font-black text-foreground">{weight} kg</span>
                  </div>
                  <Slider value={[weight]} min={40} max={200} step={1} onValueChange={([v]) => setWeight(v)} />

                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Vertical Stature (cm)</Label>
                    <span className="text-sm font-black text-foreground">{height} cm</span>
                  </div>
                  <Slider value={[height]} min={120} max={230} step={1} onValueChange={([v]) => setHeight(v)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/10">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Activity Protocol</Label>
                  <Select value={activity} onValueChange={(v: ActivityLevel) => setActivity(v)}>
                    <SelectTrigger className="h-12 border-2 border-border font-bold text-sm bg-muted/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (Office/Desk)</SelectItem>
                      <SelectItem value="light">Light (1-2 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                      <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                      <SelectItem value="extra">Extra Active (Elite/Athlete)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Strategic Objective</Label>
                  <div className="flex gap-2">
                    {(['loss', 'maintain', 'gain'] as Goal[]).map(g => (
                      <Button 
                        key={g}
                        variant="outline"
                        onClick={() => setGoal(g)}
                        className={cn("flex-1 h-12 font-black uppercase text-[9px] tracking-widest border-2", goal === g ? "border-primary bg-primary/5 text-primary" : "border-border")}
                      >
                        {g === 'loss' ? 'Fat Loss' : g === 'maintain' ? 'Maintenance' : 'Muscle Gain'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card !p-8 border-border/40 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-primary" /> Macro-Nutrient Calibration
                </h4>
                <div className="flex gap-2">
                  {(['balanced', 'high-protein', 'low-carb'] as MacroSplit[]).map(s => (
                    <Badge 
                      key={s} 
                      onClick={() => setSplit(s)}
                      className={cn("cursor-pointer px-3 py-1 font-black text-[9px] uppercase", split === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80")}
                    >
                      {s.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Beef className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Proteins</span>
                  </div>
                  <div className="text-3xl font-black text-primary">{Math.round(results.macros.protein)}g</div>
                  <Progress value={(results.macros.protein * 4 / results.targetCalories) * 100} className="h-1.5" />
                </div>
                <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Wheat className="w-5 h-5 text-accent" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Carbohydrates</span>
                  </div>
                  <div className="text-3xl font-black text-accent">{Math.round(results.macros.carbs)}g</div>
                  <Progress value={(results.macros.carbs * 4 / results.targetCalories) * 100} className="h-1.5 bg-accent/10" style={{ "--progress-foreground": "hsl(var(--accent))" } as any} />
                </div>
                <div className="p-6 rounded-2xl bg-muted/10 border border-border/40 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Lipids (Fats)</span>
                  </div>
                  <div className="text-3xl font-black text-foreground">{Math.round(results.macros.fats)}g</div>
                  <Progress value={(results.macros.fats * 9 / results.targetCalories) * 100} className="h-1.5 bg-muted" />
                </div>
              </div>
            </div>

            <section className="mt-12 space-y-4">
              <div className="flex items-center gap-2 px-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Quick Navigation</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { name: "Age Calculator", href: "/" },
                  { name: "Attendance Calculator", href: "/attendance-calculator" },
                  { name: "BMI Calculator", href: "/bmi-calculator" },
                  { name: "Calorie Calculator", href: "/calorie-calculator" },
                  { name: "CGPA Calculator", href: "/cgpa-calculator" },
                  { name: "Due Date Calculator", href: "/due-date-calculator" },
                  { name: "EMI Calculator", href: "/emi-calculator" },
                  { name: "Scientific Calculator", href: "/calculator" }
                ].filter(calc => calc.href !== "/calorie-calculator").map((calc) => (
                  <Link key={calc.name} href={calc.href}>
                    <Button variant="outline" className="w-full justify-start h-10 text-[9px] font-black uppercase tracking-wider border-black hover:border-primary/40 hover:bg-primary/5 transition-all px-2 overflow-hidden group">
                      <span className="truncate text-primary group-hover:text-primary/80 transition-colors">{calc.name}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="w-full lg:w-[320px] lg:sticky lg:top-24 space-y-6">
            <div ref={reportRef} className="space-y-6">
              <div className="glass-card !p-8 text-center border-2 border-primary bg-primary/5 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Flame className="w-20 h-20 text-primary" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-primary mb-4 block">Daily Energy Sync</span>
                <div className="text-6xl md:text-7xl font-black tracking-tighter text-foreground mb-4 tabular-nums">
                  {Math.round(results.targetCalories)}
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                  <Target className="w-3.5 h-3.5 text-primary" /> kcal / day
                </div>
                
                <div className="mt-8 space-y-2">
                   <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <span>TDEE Alignment</span>
                      <span>{Math.round((results.targetCalories / results.tdee) * 100)}%</span>
                   </div>
                   <Progress value={(results.targetCalories / results.tdee) * 100} className="h-1.5" />
                </div>
              </div>

              <div className="glass-card !p-6 border-black border space-y-5">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Metabolic Metrics
                 </h4>
                 <div className="space-y-4">
                   <div className="flex justify-between items-center py-2 border-b border-border/10">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Basal Rate (BMR)</span>
                     <span className="font-black text-xs">{Math.round(results.bmr)}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-border/10">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Total Expenditure</span>
                     <span className="font-black text-xs">{Math.round(results.tdee)}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-border/10">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Body Mass Index</span>
                     <Badge variant="outline" className={cn("font-black text-[10px] border-2", results.bmi > 25 ? "border-destructive text-destructive" : "border-accent text-accent")}>
                        {results.bmi.toFixed(1)}
                     </Badge>
                   </div>
                 </div>
              </div>
            </div>

            <Button 
              onClick={downloadReport} 
              disabled={isDownloading}
              className="w-full h-14 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all group gap-3 border-black border-2"
            >
              <Download className={cn("w-4 h-4", isDownloading && "animate-bounce")} />
              {isDownloading ? 'Capturing Metabolism...' : 'Download Report'}
            </Button>

            <div className="glass-card !p-5 border-primary/20 bg-primary/5 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6 text-primary" />
               </div>
               <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Local Sovereignty</span>
                  <p className="text-[10px] font-bold text-foreground leading-relaxed">Processing handled locally. Your physiological data remains private.</p>
               </div>
            </div>
          </aside>
        </div>
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
                Defining the standard for high-precision metabolic computation. 
                Camly Inc's flagship engine for professional health management.
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
                  <Link href="/calorie-calculator">Calorie Engine</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" />
                   <Link href="/cgpa-calculator">Academic Sync</Link>
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
                   <ChevronRight className="w-3 h-3 opacity-30" /> Insights API
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
