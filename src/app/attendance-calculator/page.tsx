"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, UserCheck, Percent, Calculator as CalcIcon, 
  Download, Zap, ShieldCheck, Database, 
  ExternalLink, LayoutGrid, CalendarDays, Timer, 
  Plus, Trash2, BookOpen, AlertTriangle, 
  CheckCircle2, AlertCircle, Info, BarChart3,
  Github, Twitter, ChevronRight, Target, GraduationCap,
  Users, Globe, Copy
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
import { useToast } from '@/hooks/use-toast';

const attendanceSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Advanced Academic Attendance Engine",
  "applicationCategory": "Education",
  "operatingSystem": "All",
  "description": "Professional multi-course attendance tracker with bunk-meter logic and target percentage inference.",
  "softwareVersion": "2.0.0",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

type Course = {
  id: string;
  name: string;
  total: number;
  attended: number;
};

export default function AttendanceCalculator() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Advanced Engineering Math', total: 40, attended: 32 },
  ]);
  const [targetPercentage, setTargetPercentage] = useState(75);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('camly_attendance_data');
    if (saved) {
      try {
        const { courses: sCourses, target } = JSON.parse(saved);
        if (sCourses) setCourses(sCourses);
        if (target) setTargetPercentage(target);
      } catch (e) {
        console.error("Failed to load attendance", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('camly_attendance_data', JSON.stringify({ courses, target: targetPercentage }));
  }, [courses, targetPercentage]);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: `New Subject ${courses.length + 1}`, total: 0, attended: 0 }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    } else {
      toast({ title: "Operation Denied", description: "At least one course must remain active.", variant: "destructive" });
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };
        if (field === 'total' && updated.attended > (value as number)) updated.attended = value as number;
        if (field === 'attended' && updated.total < (value as number)) updated.total = value as number;
        return updated;
      }
      return c;
    }));
  };

  const getInference = (course: Course) => {
    const current = course.total > 0 ? (course.attended / course.total) * 100 : 0;
    
    // Classes to attend
    let required = 0;
    if (current < targetPercentage) {
      required = Math.ceil((targetPercentage * course.total - 100 * course.attended) / (100 - targetPercentage));
    }

    // Safe to miss
    let bunkable = 0;
    if (current > targetPercentage) {
      bunkable = Math.floor((100 * course.attended / targetPercentage) - course.total);
    }

    return { current, required, bunkable };
  };

  const downloadReport = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        backgroundColor: '#f9f9f9',
      });
      const link = document.createElement('a');
      link.download = `Camly_Academic_Attendance_${format(new Date(), 'yyyyMMdd')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const globalTotal = courses.reduce((acc, c) => acc + c.total, 0);
  const globalAttended = courses.reduce((acc, c) => acc + c.attended, 0);
  const globalPercentage = globalTotal > 0 ? (globalAttended / globalTotal) * 100 : 0;

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
        <header className="mb-10 md:mb-16 space-y-4 text-center min-[480px]:text-left">
          <div className="flex flex-col min-[480px]:flex-row min-[480px]:items-end gap-4 justify-between">
            <div className="space-y-3">
              <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] text-[9px] px-3 py-1 font-black">
                Academic Integrity Layer
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.85] text-primary">
                Attendance <span className="text-foreground">Course Matrix</span>
              </h2>
              <p className="text-muted-foreground text-sm font-medium max-w-xl">
                Advanced high-fidelity curriculum tracking. Monitor multiple subjects, determine bunk allowances, and synchronize mission-critical thresholds.
              </p>
            </div>
            <div className="bg-white/5 border border-black dark:border-white p-4 rounded-2xl flex items-center gap-6 shadow-xl">
               <div className="space-y-1">
                 <Label className="text-[8px] font-black uppercase tracking-widest text-primary/60 block">Target Sync</Label>
                 <div className="flex items-center gap-3">
                   <span className="text-xl font-black text-primary">{targetPercentage}%</span>
                   <div className="flex gap-1">
                     {[75, 80, 85].map(v => (
                       <Button key={v} onClick={() => setTargetPercentage(v)} variant="ghost" size="sm" className={cn("h-6 px-2 text-[8px] font-black", targetPercentage === v && "bg-primary text-primary-foreground")}>{v}%</Button>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          {/* Main Course List */}
          <div className="w-full lg:flex-grow space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => {
                const { current, required, bunkable } = getInference(course);
                const isSafe = current >= targetPercentage;

                return (
                  <div key={course.id} className="glass-card !p-6 border-black dark:border-white border-2 shadow-2xl relative group overflow-hidden transition-all hover:scale-[1.01]">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <BookOpen className="w-16 h-16 text-primary" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-grow">
                        <Input 
                          value={course.name} 
                          onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                          className="bg-transparent border-none p-0 text-primary font-black uppercase text-xs tracking-widest focus-visible:ring-0 placeholder:text-primary/20"
                          placeholder="Course Title"
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeCourse(course.id)} className="text-muted-foreground/40 hover:text-destructive h-7 w-7">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/60">Conducted</Label>
                          <span className="text-xs font-black">{course.total}</span>
                        </div>
                        <Slider 
                          value={[course.total]} 
                          min={0} max={150} step={1} 
                          onValueChange={([v]) => updateCourse(course.id, 'total', v)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/60">Attended</Label>
                          <span className="text-xs font-black">{course.attended}</span>
                        </div>
                        <Slider 
                          value={[course.attended]} 
                          min={0} max={course.total} step={1} 
                          onValueChange={([v]) => updateCourse(course.id, 'attended', v)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-border/10">
                      <div className="shrink-0 text-center">
                        <div className={cn("text-2xl font-black tracking-tighter tabular-nums", isSafe ? "text-accent" : "text-destructive")}>
                          {current.toFixed(1)}%
                        </div>
                        <span className="text-[7px] font-bold uppercase tracking-widest opacity-40">Integrity</span>
                      </div>
                      <Separator orientation="vertical" className="h-8 opacity-10" />
                      <div className="flex-grow">
                        {required > 0 ? (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                            <p className="text-[9px] font-bold text-foreground">Attend <span className="text-destructive font-black underline">{required}</span> more to hit {targetPercentage}%</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                            <p className="text-[9px] font-bold text-foreground">You can miss <span className="text-accent font-black underline">{bunkable}</span> more classes</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <button 
                onClick={addCourse}
                className="h-full min-h-[160px] border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center justify-center gap-3 text-primary/40 hover:bg-primary/5 hover:border-primary/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Course Node</span>
              </button>
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
                ].filter(calc => calc.href !== "/attendance-calculator").map((calc) => (
                  <Link key={calc.name} href={calc.href}>
                    <Button variant="outline" className="w-full justify-start h-10 text-[9px] font-bold uppercase tracking-wider border-black hover:border-primary/40 hover:bg-primary/5 transition-all px-2 overflow-hidden">
                      <span className="truncate">{calc.name}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar Status */}
          <aside className="w-full lg:w-[320px] space-y-6 lg:sticky lg:top-24">
            <div ref={reportRef} className="space-y-6">
              <div className={cn(
                "glass-card !p-8 text-center border-2 transition-all relative overflow-hidden",
                globalPercentage >= targetPercentage ? "border-accent shadow-[0_20px_50px_rgba(16,185,129,0.1)]" : "border-destructive shadow-[0_20px_50px_rgba(239,68,68,0.1)]"
              )}>
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <GraduationCap className="w-20 h-24" />
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-[0.5em] mb-4 block",
                  globalPercentage >= targetPercentage ? "text-accent" : "text-destructive"
                )}>
                  Global Academic Status
                </span>
                <div className="text-7xl font-black tracking-tighter text-foreground mb-4 tabular-nums">
                  {globalPercentage.toFixed(1)}%
                </div>
                <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                   <Target className="w-3.5 h-3.5 text-primary" /> Target: {targetPercentage}%
                </div>

                <div className="mt-10 space-y-2">
                   <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <span>Curriculum Alignment</span>
                      <span>{Math.min(100, Math.round((globalPercentage / targetPercentage) * 100))}%</span>
                   </div>
                   <Progress value={(globalPercentage / targetPercentage) * 100} className="h-1.5 bg-muted" />
                </div>
              </div>

              <div className="glass-card !p-6 border-black dark:border-white border shadow-xl space-y-5">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Mission Logistics
                 </h4>
                 <div className="space-y-4">
                   <div className="flex justify-between items-center py-2 border-b border-border/10">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Subjects</span>
                     <Badge className="bg-primary text-primary-foreground font-black text-[10px]">{courses.length}</Badge>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-border/10">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Critical Risk</span>
                     <Badge variant="destructive" className="font-black text-[10px]">
                       {courses.filter(c => getInference(c).current < targetPercentage).length}
                     </Badge>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-border/10">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Safe Protocol</span>
                     <Badge className="bg-accent text-accent-foreground font-black text-[10px]">
                        {courses.filter(c => getInference(c).current >= targetPercentage).length}
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
              {isDownloading ? 'Capturing Matrix...' : 'Download Academic PNG'}
            </Button>

            <div className="glass-card !p-5 border-primary/20 bg-primary/5 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6 text-primary" />
               </div>
               <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Local Sovereignty</span>
                  <p className="text-[10px] font-bold text-foreground leading-relaxed">Processing handled locally. Your academic metrics remain private.</p>
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
