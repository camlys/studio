"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, GraduationCap, BookOpen, Plus, Trash2, 
  Download, Zap, ShieldCheck, Database, Globe,
  ExternalLink, LayoutGrid, Calculator as CalcIcon, 
  CalendarDays, Timer, Github, Twitter, ChevronRight,
  Target, BarChart3, FileType, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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
import { Progress } from "@/components/ui/progress";
import { InstallPWA } from '@/components/chrono/InstallPWA';
import { cn } from '@/lib/utils';
import { toPng } from 'html-to-image';
import { format } from 'date-fns';

const cgpaSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Academic Inference Engine - CGPA Calculator",
  "applicationCategory": "Education",
  "operatingSystem": "All",
  "description": "Professional CGPA and SGPA calculator with multi-semester support and credit-weighted inference logic.",
  "softwareVersion": "1.0.0",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

type Grade = 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'P' | 'F';

const GRADE_POINTS: Record<Grade, number> = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0
};

type Course = {
  id: string;
  name: string;
  credits: number;
  grade: Grade;
};

type Semester = {
  id: string;
  name: string;
  courses: Course[];
};

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: 'sem-1', name: 'Semester 1', courses: [{ id: 'c-1', name: '', credits: 3, grade: 'A+' }] }
  ]);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const addSemester = () => {
    const newId = `sem-${semesters.length + 1}`;
    setSemesters([...semesters, { 
      id: newId, 
      name: `Semester ${semesters.length + 1}`, 
      courses: [{ id: `c-${Date.now()}`, name: '', credits: 3, grade: 'A+' }] 
    }]);
  };

  const removeSemester = (semId: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== semId));
    }
  };

  const addCourse = (semId: string) => {
    setSemesters(semesters.map(s => {
      if (s.id === semId) {
        return {
          ...s,
          courses: [...s.courses, { id: `c-${Date.now()}`, name: '', credits: 3, grade: 'A+' }]
        };
      }
      return s;
    }));
  };

  const removeCourse = (semId: string, courseId: string) => {
    setSemesters(semesters.map(s => {
      if (s.id === semId && s.courses.length > 1) {
        return {
          ...s,
          courses: s.courses.filter(c => c.id !== courseId)
        };
      }
      return s;
    }));
  };

  const updateCourse = (semId: string, courseId: string, field: keyof Course, value: any) => {
    setSemesters(semesters.map(s => {
      if (s.id === semId) {
        return {
          ...s,
          courses: s.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c)
        };
      }
      return s;
    }));
  };

  const calculateSGPA = (semester: Semester) => {
    let totalPoints = 0;
    let totalCredits = 0;
    semester.courses.forEach(c => {
      totalPoints += GRADE_POINTS[c.grade] * c.credits;
      totalCredits += c.credits;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const calculateCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    semesters.forEach(s => {
      s.courses.forEach(c => {
        totalPoints += GRADE_POINTS[c.grade] * c.credits;
        totalCredits += c.credits;
      });
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
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
      link.download = `Camly_Academic_Report_${format(new Date(), 'yyyyMMdd_HHmm')}.png`;
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cgpaSchema) }} />
      
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
            Academic Performance Layer
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.85]">
            CGPA <span className="text-primary">Inference</span> Engine
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-xl mx-auto min-[480px]:mx-0">
            Advanced academic synchronization for university grades, credit-weighted milestones, and high-fidelity educational tracking.
          </p>
        </div>

        <div className="flex flex-col min-[480px]:flex-row items-start gap-6 md:gap-8 lg:gap-16">
          <div className="w-full min-[480px]:flex-grow space-y-8">
            {semesters.map((sem, sIdx) => (
              <div key={sem.id} className="glass-card !p-6 border-black dark:border-white border shadow-2xl relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                       <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight">{sem.name}</h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SGPA: {calculateSGPA(sem)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeSemester(sem.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-2">
                    <span>Course Name</span>
                    <span>Credits</span>
                    <span>Grade</span>
                    <span className="w-8"></span>
                  </div>
                  {sem.courses.map((course) => (
                    <div key={course.id} className="grid grid-cols-[2fr_1fr_1.5fr_auto] gap-3 items-center">
                      <Input 
                        placeholder="e.g. Data Structures" 
                        value={course.name} 
                        onChange={(e) => updateCourse(sem.id, course.id, 'name', e.target.value)}
                        className="bg-muted/50 h-10 rounded-lg border-border font-bold text-sm"
                      />
                      <Input 
                        type="number" 
                        value={course.credits} 
                        onChange={(e) => updateCourse(sem.id, course.id, 'credits', parseInt(e.target.value) || 0)}
                        className="bg-muted/50 h-10 rounded-lg border-border font-bold text-sm text-center"
                      />
                      <Select value={course.grade} onValueChange={(v: Grade) => updateCourse(sem.id, course.id, 'grade', v)}>
                        <SelectTrigger className="bg-muted/50 h-10 rounded-lg border-border font-bold text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(GRADE_POINTS).map(g => (
                            <SelectItem key={g} value={g} className="font-bold">{g} ({GRADE_POINTS[g as Grade]})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" onClick={() => removeCourse(sem.id, course.id)} className="text-muted-foreground/40 hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => addCourse(sem.id)} 
                  className="w-full mt-6 h-10 border-dashed border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/10"
                >
                  <Plus className="w-3.5 h-3.5 mr-2" /> Add Course
                </Button>
              </div>
            ))}

            <Button 
              onClick={addSemester}
              className="w-full h-14 bg-foreground text-background font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.01] transition-all"
            >
              <Plus className="mr-2 w-5 h-5" /> Initialize New Semester Sync
            </Button>

            {/* Quick Navigation Section */}
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

          <aside className="w-full min-[480px]:w-[320px] lg:w-[380px] space-y-6 min-[480px]:sticky min-[480px]:top-24">
            <div ref={reportRef} className="space-y-6">
              <div className="glass-card !p-8 border-accent/20 bg-accent/5 text-center relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <GraduationCap className="w-24 h-24 text-accent" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-accent mb-4 block">Cumulative Average</span>
                <div className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-4 tabular-nums">
                  {calculateCGPA()}
                </div>
                <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                  <Target className="w-4 h-4" /> High-Fidelity
                  <Separator orientation="vertical" className="h-4 bg-accent/20" />
                  <Zap className="w-4 h-4" /> Weighted Sync
                </div>

                <div className="mt-10 space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <span>Performance Index</span>
                      <span>{Math.round((parseFloat(calculateCGPA()) / 10) * 100)}%</span>
                   </div>
                   <Progress value={(parseFloat(calculateCGPA()) / 10) * 100} className="h-2 bg-accent/10" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card !p-5 border-border/40 text-center">
                   <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Total Semesters</span>
                   <div className="text-2xl font-black text-primary">{semesters.length}</div>
                </div>
                <div className="glass-card !p-5 border-border/40 text-center">
                   <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Total Credits</span>
                   <div className="text-2xl font-black text-primary">
                     {semesters.reduce((acc, s) => acc + s.courses.reduce((ca, c) => ca + c.credits, 0), 0)}
                   </div>
                </div>
              </div>

              <div className="glass-card !p-6 border-border/40 space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" /> Registry Overview
                 </h4>
                 <div className="space-y-3">
                   {semesters.map(s => (
                     <div key={s.id} className="flex justify-between items-center py-2 border-b border-border/10 last:border-0">
                       <span className="text-xs font-bold text-foreground/70">{s.name}</span>
                       <Badge variant="outline" className="text-[10px] font-black border-primary/20 text-primary">{calculateSGPA(s)}</Badge>
                     </div>
                   ))}
                 </div>
              </div>
            </div>

            <Button 
              onClick={downloadReport} 
              disabled={isDownloading}
              className="w-full h-12 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl hover:scale-[1.02] transition-all group gap-3 border-black border-2"
            >
              <Download className={cn("w-4 h-4", isDownloading && "animate-bounce")} />
              {isDownloading ? 'Capturing...' : 'Download Academic Report'}
            </Button>

            <div className="glass-card !p-5 border-primary/20 bg-primary/5 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6 text-primary" />
               </div>
               <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Sovereignty Protocol</span>
                  <p className="text-[10px] font-bold text-foreground leading-relaxed">Local-first-first processing. Your grades are never transmitted.</p>
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
                Defining the standard for high-precision chronological and academic computation. 
                Camly Inc's flagship engine for professional time and academic management.
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
