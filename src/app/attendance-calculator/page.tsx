"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, UserCheck, Percent, Calculator as CalcIcon, 
  Download, Zap, ShieldCheck, Database, 
  ExternalLink, LayoutGrid, CalendarDays, Timer, 
  Github, Twitter, ChevronRight, Target, 
  BarChart3, FileType, CheckCircle2, AlertCircle,
  GraduationCap, Wallet, Info, Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
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

const attendanceSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Academic Attendance Engine",
  "applicationCategory": "Education",
  "operatingSystem": "All",
  "description": "High-precision attendance threshold calculator with target percentage inference and class allowance logic.",
  "softwareVersion": "1.0.0",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function AttendanceCalculator() {
  const [totalClasses, setTotalClasses] = useState(40);
  const [attendedClasses, setAttendedClasses] = useState(30);
  const [targetPercentage, setTargetPercentage] = useState(75);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = React.useRef<HTMLDivElement>(null);

  const currentPercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
  
  // Logic for classes to attend
  const getRequiredToAttend = () => {
    if (currentPercentage >= targetPercentage) return 0;
    // (attended + x) / (total + x) = target / 100
    // x = (target*total - 100*attended) / (100 - target)
    const needed = Math.ceil((targetPercentage * totalClasses - 100 * attendedClasses) / (100 - targetPercentage));
    return Math.max(0, needed);
  };

  // Logic for classes safe to miss
  const getSafeToMiss = () => {
    if (currentPercentage <= targetPercentage) return 0;
    // attended / (total + x) = target / 100
    // x = (100 * attended / target) - total
    const possible = Math.floor((100 * attendedClasses / targetPercentage) - totalClasses);
    return Math.max(0, possible);
  };

  const requiredToAttend = getRequiredToAttend();
  const safeToMiss = getSafeToMiss();

  const downloadReport = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        backgroundColor: '#f9f9f9',
      });
      const link = document.createElement('a');
      link.download = `Camly_Attendance_Report_${format(new Date(), 'yyyyMMdd_HHmm')}.png`;
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(attendanceSchema) }} />
      
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
        <div className="mb-10 md:mb-12 space-y-3 text-center min-[480px]:text-left">
          <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] text-[9px] px-3 py-1 font-black">
            Academic Integrity Layer
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.85]">
            Attendance <span className="text-primary">Inference</span> Engine
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-xl mx-auto min-[480px]:mx-0">
            High-precision threshold calculations for university attendance. Determine missing-class allowances and target synchronization milestones.
          </p>
        </div>

        <div className="flex flex-col min-[480px]:flex-row items-start gap-6 md:gap-8 lg:gap-16">
          <div className="w-full min-[480px]:flex-grow space-y-8">
            <div className="glass-card !p-8 border-black dark:border-white border shadow-2xl space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Total Conducted Classes</Label>
                  <span className="text-sm font-black text-foreground">{totalClasses}</span>
                </div>
                <Slider 
                  value={[totalClasses]} 
                  min={1} 
                  max={200} 
                  step={1} 
                  onValueChange={([v]) => {
                    setTotalClasses(v);
                    if (attendedClasses > v) setAttendedClasses(v);
                  }}
                />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Classes Attended</Label>
                  <span className="text-sm font-black text-foreground">{attendedClasses}</span>
                </div>
                <Slider 
                  value={[attendedClasses]} 
                  min={0} 
                  max={totalClasses} 
                  step={1} 
                  onValueChange={([v]) => setAttendedClasses(v)}
                />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Target Threshold (%)</Label>
                  <span className="text-sm font-black text-foreground">{targetPercentage}%</span>
                </div>
                <Slider 
                  value={[targetPercentage]} 
                  min={1} 
                  max={99} 
                  step={1} 
                  onValueChange={([v]) => setTargetPercentage(v)}
                />
                <div className="flex gap-2">
                  {[75, 80, 85, 90].map(p => (
                    <Button 
                      key={p} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setTargetPercentage(p)}
                      className={cn("h-7 text-[8px] font-black uppercase", targetPercentage === p && "bg-primary text-primary-foreground border-primary")}
                    >
                      {p}%
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Navigation Section */}
            <section className="mt-12 space-y-4">
              <div className="flex items-center gap-2 px-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Quick Navigation</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { name: "Academic Sync", href: "/cgpa-calculator" },
                  { name: "Age Calculator", href: "/" },
                  { name: "Attendance Calculator", href: "/attendance-calculator" },
                  { name: "Due Date", href: "/due-date-calculator" },
                  { name: "EMI Calculator", href: "/emi-calculator" },
                  { name: "Scientific Calculator", href: "/calculator" }
                ].map((calc) => (
                  <Link key={calc.name} href={calc.href}>
                    <Button variant="outline" className="w-full justify-start h-10 text-[10px] font-bold uppercase tracking-widest border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all">
                      {calc.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="w-full min-[480px]:w-[320px] lg:w-[380px] space-y-6 min-[480px]:sticky min-[480px]:top-24">
            <div ref={reportRef} className="space-y-6">
              <div className={cn(
                "glass-card !p-8 text-center relative overflow-hidden group shadow-2xl border transition-colors",
                currentPercentage >= targetPercentage ? "border-accent/20 bg-accent/5" : "border-destructive/20 bg-destructive/5"
              )}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Percent className={cn("w-24 h-24", currentPercentage >= targetPercentage ? "text-accent" : "text-destructive")} />
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-[0.5em] mb-4 block",
                  currentPercentage >= targetPercentage ? "text-accent" : "text-destructive"
                )}>
                  Current Integrity
                </span>
                <div className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-4 tabular-nums">
                  {currentPercentage.toFixed(1)}%
                </div>
                <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                  <Target className="w-4 h-4" /> Threshold: {targetPercentage}%
                  <Separator orientation="vertical" className="h-4 bg-border" />
                  <StatusBadge current={currentPercentage} target={targetPercentage} />
                </div>

                <div className="mt-10 space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <span>Threshold Alignment</span>
                      <span>{Math.min(100, Math.round((currentPercentage / targetPercentage) * 100))}%</span>
                   </div>
                   <Progress value={(currentPercentage / targetPercentage) * 100} className="h-2 bg-muted" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {requiredToAttend > 0 ? (
                  <div className="glass-card !p-6 border-destructive/20 bg-destructive/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
                       <AlertCircle className="w-6 h-6 text-destructive" />
                    </div>
                    <div className="space-y-1">
                       <span className="text-[8px] font-black uppercase tracking-widest text-destructive/60">Mission Critical</span>
                       <p className="text-[11px] font-bold text-foreground leading-tight">
                         Attend <span className="text-destructive font-black text-sm">{requiredToAttend}</span> more classes to reach {targetPercentage}%.
                       </p>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card !p-6 border-accent/20 bg-accent/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                       <CheckCircle2 className="w-6 h-6 text-accent" />
                    </div>
                    <div className="space-y-1">
                       <span className="text-[8px] font-black uppercase tracking-widest text-accent/60">Safety protocol</span>
                       <p className="text-[11px] font-bold text-foreground leading-tight">
                         You can miss <span className="text-accent font-black text-sm">{safeToMiss}</span> more classes and stay above {targetPercentage}%.
                       </p>
                    </div>
                  </div>
                )}

                <div className="glass-card !p-5 border-border/40 space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" /> Metric Overview
                   </h4>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center py-2 border-b border-border/10">
                       <span className="text-xs font-bold text-foreground/70">Attended</span>
                       <Badge variant="outline" className="text-[10px] font-black border-primary/20 text-primary">{attendedClasses}</Badge>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-border/10">
                       <span className="text-xs font-bold text-foreground/70">Total Classes</span>
                       <Badge variant="outline" className="text-[10px] font-black border-primary/20 text-primary">{totalClasses}</Badge>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={downloadReport} 
              disabled={isDownloading}
              className="w-full h-12 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl hover:scale-[1.02] transition-all group gap-3 border-black dark:border-white border"
            >
              <Download className={cn("w-4 h-4", isDownloading && "animate-bounce")} />
              {isDownloading ? 'Capturing...' : 'Download Academic Report'}
            </Button>

            <div className="glass-card !p-5 border-primary/20 bg-primary/5 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6 text-primary" />
               </div>
               <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Local Sovereignty</span>
                  <p className="text-[10px] font-bold text-foreground leading-relaxed">Processing handled locally. Your records remain private.</p>
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
                Defining the standard for high-precision academic computation. 
                Camly Inc's flagship engine for professional student management.
              </p>
              <div className="flex gap-5">
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-accent/10 shadow-sm border border-border/50"><Github className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-accent/10 shadow-sm border border-border/50"><Twitter className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-accent/10 shadow-sm border border-border/50"><Users className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Operations</h3>
              <ul className="space-y-3 text-xs font-bold text-muted-foreground">
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/attendance-calculator">Attendance</Link>
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

function StatusBadge({ current, target }: { current: number, target: number }) {
  if (current >= target) return <span className="text-accent font-black">SAFE</span>;
  if (current >= target - 5) return <span className="text-primary font-black">CRITICAL</span>;
  return <span className="text-destructive font-black">UNSAFE</span>;
}
