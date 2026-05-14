"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Scale, Activity, HeartPulse, 
  Download, Zap, ShieldCheck, Database, 
  ExternalLink, LayoutGrid, Calculator as CalcIcon, 
  CalendarDays, Timer, Github, Twitter, ChevronRight,
  Target, BarChart3, FileType, CheckCircle2,
  TrendingUp, Ruler, User, Info, GraduationCap,
  Globe, Wallet, UserCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { InstallPWA } from '@/components/chrono/InstallPWA';
import { cn } from '@/lib/utils';
import { toPng } from 'html-to-image';
import { format } from 'date-fns';

const bmiSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Biometric Inference Engine - Advanced BMI Calculator",
  "applicationCategory": "Health",
  "operatingSystem": "All",
  "description": "Professional physiological scaling engine calculating BMI, New BMI (Oxford), BSA, and Ponderal Index.",
  "softwareVersion": "2.0.0",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

type UnitSystem = 'metric' | 'imperial';

export default function BMICalculator() {
  const [units, setUnit] = useState<UnitSystem>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState(70); // kg or lbs
  const [height, setHeight] = useState(175); // cm or inches
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const calculateMetrics = () => {
    let wKg = weight;
    let hM = height / 100;

    if (units === 'imperial') {
      wKg = weight * 0.453592;
      hM = height * 0.0254;
    }

    const standardBMI = wKg / (hM * hM);
    const newBMI = (1.3 * wKg) / Math.pow(hM, 2.5);
    const ponderalIndex = wKg / Math.pow(hM, 3);
    const bsa = Math.sqrt(((hM * 100) * wKg) / 3600); // Mosteller

    // Ideal Weights (Devine)
    const hIn = units === 'metric' ? height / 2.54 : height;
    const baseWeight = gender === 'male' ? 50 : 45.5;
    const idealWeight = baseWeight + 2.3 * Math.max(0, hIn - 60);

    return { standardBMI, newBMI, ponderalIndex, bsa, idealWeight };
  };

  const metrics = calculateMetrics();

  const getBMICategory = (val: number) => {
    if (val < 18.5) return { label: "Underweight", color: "text-blue-500", bg: "bg-blue-500/10", progress: 20 };
    if (val < 25) return { label: "Healthy Weight", color: "text-accent", bg: "bg-accent/10", progress: 50 };
    if (val < 30) return { label: "Overweight", color: "text-orange-500", bg: "bg-orange-500/10", progress: 75 };
    return { label: "Obese", color: "text-destructive", bg: "bg-destructive/10", progress: 90 };
  };

  const category = getBMICategory(metrics.standardBMI);

  const downloadReport = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        backgroundColor: '#f9f9f9',
      });
      const link = document.createElement('a');
      link.download = `Camly_Biometric_Report_${format(new Date(), 'yyyyMMdd')}.png`;
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bmiSchema) }} />
      
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
            Biometric Intelligence Layer
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.85] text-primary">
            Physiological <span className="text-foreground">Inference</span> Engine
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-xl mx-auto min-[480px]:mx-0">
            Advanced scaling protocols for body mass analysis, surface area mapping, and high-fidelity ponderal indexing across global clinical standards.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
          <div className="w-full lg:flex-grow space-y-8">
            <div className="glass-card !p-8 border-black dark:border-white border-2 shadow-2xl space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Unit Protocol</Label>
                    <Tabs value={units} onValueChange={(v: any) => setUnit(v)} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 h-10 rounded-xl bg-muted/20 border-2 border-border/10">
                        <TabsTrigger value="metric" className="text-[10px] font-black uppercase tracking-widest">Metric (kg/cm)</TabsTrigger>
                        <TabsTrigger value="imperial" className="text-[10px] font-black uppercase tracking-widest">Imperial (lb/in)</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Biological Sex</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setGender('male')}
                        className={cn("h-12 font-black uppercase text-[10px] tracking-widest border-2", gender === 'male' ? "border-primary bg-primary/5 text-primary" : "border-border")}
                      >
                        Male
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setGender('female')}
                        className={cn("h-12 font-black uppercase text-[10px] tracking-widest border-2", gender === 'female' ? "border-primary bg-primary/5 text-primary" : "border-border")}
                      >
                        Female
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Body Mass</Label>
                      <span className="text-sm font-black text-foreground">{weight} {units === 'metric' ? 'kg' : 'lbs'}</span>
                    </div>
                    <Slider value={[weight]} min={units === 'metric' ? 30 : 70} max={units === 'metric' ? 200 : 450} step={1} onValueChange={([v]) => setWeight(v)} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Vertical Stature</Label>
                      <span className="text-sm font-black text-foreground">{height} {units === 'metric' ? 'cm' : 'in'}</span>
                    </div>
                    <Slider value={[height]} min={units === 'metric' ? 100 : 40} max={units === 'metric' ? 230 : 90} step={1} onValueChange={([v]) => setHeight(v)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card !p-6 border-border/40 space-y-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">New BMI (Oxford)</span>
                </div>
                <div className="text-3xl font-black text-foreground">{metrics.newBMI.toFixed(1)}</div>
                <p className="text-[9px] text-muted-foreground leading-relaxed font-medium">Recalibrated scaling ($1.3 \times w / h^{2.5}$) accounting for height-to-mass volume laws.</p>
              </div>

              <div className="glass-card !p-6 border-border/40 space-y-4 hover:border-accent/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Ponderal Index</span>
                </div>
                <div className="text-3xl font-black text-foreground">{metrics.ponderalIndex.toFixed(1)}</div>
                <p className="text-[9px] text-muted-foreground leading-relaxed font-medium">The Corpulence Index ($kg/m^3$). A more stable metric across varying physiological statures.</p>
              </div>

              <div className="glass-card !p-6 border-border/40 space-y-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Surface Area (BSA)</span>
                </div>
                <div className="text-3xl font-black text-foreground">{metrics.bsa.toFixed(2)} m²</div>
                <p className="text-[9px] text-muted-foreground leading-relaxed font-medium">Clinical Mosteller derivation. Critical for high-precision metabolic and pharmaceutical assessment.</p>
              </div>
            </div>

            <section className="mt-12 space-y-4">
              <div className="flex items-center gap-2 px-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Quick Navigation</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { name: "Academic Sync", href: "/cgpa-calculator" },
                  { name: "Age Calculator", href: "/" },
                  { name: "Attendance Calculator", href: "/attendance-calculator" },
                  { name: "BMI Calculator", href: "/bmi-calculator" },
                  { name: "Calorie Calculator", href: "/calorie-calculator" },
                  { name: "Due Date", href: "/due-date-calculator" },
                  { name: "EMI Calculator", href: "/emi-calculator" },
                  { name: "Scientific Calculator", href: "/calculator" }
                ].map((calc) => (
                  <Link key={calc.name} href={calc.href}>
                    <Button variant="outline" className="w-full justify-start h-10 text-[9px] font-bold uppercase tracking-wider border-black hover:border-primary/40 hover:bg-primary/5 transition-all px-2 overflow-hidden">
                      <span className="truncate">{calc.name}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="w-full lg:w-[340px] lg:sticky lg:top-24 space-y-6">
            <div ref={reportRef} className="space-y-6">
              <div className={cn(
                "glass-card !p-8 text-center border-2 transition-all relative overflow-hidden group shadow-2xl",
                metrics.standardBMI >= 18.5 && metrics.standardBMI < 25 ? "border-accent bg-accent/5" : "border-destructive bg-destructive/5"
              )}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Scale className="w-20 h-20 text-primary" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground mb-4 block">Primary BMI Standard</span>
                <div className="text-7xl md:text-8xl font-black tracking-tighter text-foreground mb-4 tabular-nums">
                  {metrics.standardBMI.toFixed(1)}
                </div>
                <div className={cn("text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2", category.color)}>
                  <CheckCircle2 className="w-4 h-4" /> {category.label}
                </div>
                
                <div className="mt-10 space-y-2">
                   <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <span>Clinical Alignment</span>
                      <span>{category.progress}%</span>
                   </div>
                   <Progress value={category.progress} className="h-1.5" />
                </div>
              </div>

              <div className="glass-card !p-6 border-black border space-y-5">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <HeartPulse className="w-4 h-4" /> Target Metrics
                 </h4>
                 <div className="space-y-4">
                   <div className="flex justify-between items-center py-2 border-b border-border/10">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Ideal Weight (Devine)</span>
                     <span className="font-black text-xs">{metrics.idealWeight.toFixed(1)} {units === 'metric' ? 'kg' : 'lb'}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-border/10">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Healthy BMI Zone</span>
                     <span className="font-black text-[10px] text-accent">18.5 – 24.9</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-border/10">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Mass Logic Protocol</span>
                     <Badge variant="outline" className="font-black text-[9px] border-2 uppercase">STRATUM-01</Badge>
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
              {isDownloading ? 'Capturing Metrics...' : 'Download Biometric PNG'}
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
                Defining the standard for high-precision physiological computation. 
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
                  <Link href="/bmi-calculator">BMI Calculator</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/calorie-calculator">Calorie Engine</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/due-date-calculator">Due Date</Link>
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
