"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Share2, Bookmark, Zap, Activity, BookOpen, GraduationCap, Target, Terminal, Globe, UserCheck, BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The Masterclass on Academic Attendance Logic: The Science of Bunk-Meter Synchronization",
  "image": "https://picsum.photos/seed/attendance-master/1200/630",
  "author": {
    "@type": "Organization",
    "name": "Academic Intelligence Unit"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Camly Inc",
    "logo": {
      "@type": "ImageObject",
      "url": "https://calculator.camly.org/logo.png"
    }
  },
  "datePublished": "2025-01-15",
  "description": "An exhaustive, high-authority whitepaper exploring attendance thresholds, percentage inference models, and the mathematics of bunkable intervals."
};

export default function AttendanceLogicMasterclass() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 h-1.5 bg-primary w-full z-[60] origin-left animate-in fade-in" style={{ transform: 'scaleX(0.08)' }} />

      <nav className="relative z-50 glass border-b border-border h-14 flex items-center px-4 md:px-8 justify-between">
        <Link href="/blog" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Back to Insights Hub</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Share2 className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Bookmark className="w-4 h-4" /></Button>
          <Link href="/attendance-calculator">
             <Button size="sm" className="bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-widest px-4">Open Matrix</Button>
          </Link>
        </div>
      </nav>

      <article className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <header className="space-y-8 mb-24 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 font-black text-[9px] tracking-widest uppercase">Scholastic Science</Badge>
            <Badge variant="outline" className="font-black text-[9px] tracking-widest uppercase">Exhaustive whitepaper</Badge>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] md:leading-[0.85] mb-8">
            The Science of <span className="text-primary">Attendance</span> Logic
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed italic border-l-8 border-primary/30 pl-8 py-6 max-w-4xl mx-auto lg:mx-0">
            "Academic integrity is not just a measure of presence; it is a vector of strategic persistence and threshold synchronization."
          </p>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 pt-12 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-2xl">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div className="text-[12px] uppercase font-black tracking-[0.2em] text-left">
                <div className="text-foreground">Academic Intelligence</div>
                <div className="text-muted-foreground">Scholastic Records Division</div>
              </div>
            </div>
            <Separator orientation="vertical" className="hidden lg:block h-12 mx-6" />
            <div className="flex gap-12">
              <div className="flex flex-col gap-1 items-center lg:items-start">
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Article Depth</span>
                <span className="text-sm font-bold flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> 320 Min Read</span>
              </div>
              <div className="flex flex-col gap-1 items-center lg:items-start">
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Authority Level</span>
                <span className="text-sm font-bold text-accent uppercase tracking-[0.2em]">UNIVERSITY STANDARD</span>
              </div>
            </div>
          </div>
        </header>

        <section className="prose prose-invert prose-primary max-w-none space-y-24 text-muted-foreground text-lg md:text-2xl leading-relaxed">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-7xl font-black text-foreground tracking-tight leading-none">1. The Attendance Axiom</h2>
            <p>At the center of scholastic persistence lies the attendance coefficient—a simple percentage that belies complex temporal variables. For modern students, maintaining a specific threshold (typically 75% or 80%) is not merely a formality; it is a mission-critical requirement for academic eligibility.</p>
            <div className="glass p-12 rounded-[64px] border-primary/20 bg-primary/5 my-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <BarChart3 className="w-32 h-32 text-primary" />
              </div>
              <h4 className="text-2xl font-black text-foreground mb-6 uppercase tracking-widest">The Threshold Constant</h4>
              <p className="text-lg opacity-90 leading-relaxed max-w-2xl">Ensuring absolute synchronization between total sessions conducted and attendance events recorded for ultimate scholastic fidelity.</p>
            </div>
          </div>

          <div className="space-y-12">
             <h2 className="text-4xl md:text-7xl font-black text-foreground tracking-tight leading-none">2. Bunk-Meter Logic & Inference</h2>
             <p>The "Bunk-Meter" is a proprietary inference model used to determine the maximum number of classes a student can safely miss without breaching their target threshold. This calculation is a derivation of the required-to-conduct ratio: If C is current attended and T is total, and G is goal, the bunkable classes B = floor((100 * C / G) - T).</p>
             <p>Conversely, when a student falls below the target, the engine calculates the "Recovery Vector"—the exact number of consecutive sessions required to reach parity with the institution's mandatory threshold.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
            <div className="glass p-10 rounded-[40px] border-border group hover:border-primary/50 transition-all">
              <AlertCircle className="w-10 h-10 text-destructive mb-6" />
              <h3 className="text-foreground font-black text-2xl mb-4 uppercase tracking-tighter">Critical Risk</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Identifying when a single absence will trigger a threshold breach. Our engine utilizes sub-percent resolution to provide real-time warning signals.
              </p>
            </div>
            <div className="glass p-10 rounded-[40px] border-border group hover:border-accent/50 transition-all">
              <CheckCircle2 className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-foreground font-black text-2xl mb-4 uppercase tracking-tighter">Safe Protocols</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Mapping the safe bunkable window relative to upcoming examinations and credit-weighted sessions to ensure absolute academic safety.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <h2 className="text-3xl md:text-6xl font-black text-foreground tracking-tight leading-none">3. The Strategic Recovery Layer</h2>
            <p>Precision in attendance tracking requires accounting for "temporal drift"—the variance in class frequency across a semester. A student at 70% with 20 classes remaining has a much different recovery trajectory than one with only 5 classes remaining. Our **Attendance Matrix** provides a high-fidelity view of these vectors.</p>
            <p>By moving beyond simple averages, we allow students to synchronize their presence with the most impactful phases of their curriculum. This involves understanding that not all sessions are created equal in the eyes of the registrar.</p>
          </div>

          <div className="p-12 bg-muted/20 border-l-8 border-primary rounded-r-[48px] my-20">
            <h4 className="text-foreground font-black mb-6 uppercase tracking-widest text-xs flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Technical Specification
            </h4>
            <p className="text-lg italic leading-relaxed text-foreground/80">
              "The Attendance Inference algorithm operates on a piecewise linear interpolation. Recovery sessions S = ceil((Goal * Total - 100 * Attended) / (100 - Goal)). This ensures that the scholastic mass is preserved across the entire educational lifecycle."
            </p>
          </div>

          <div className="space-y-12 text-center">
            <h3 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">Synchronize Your Presence</h3>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
              Precision is the ultimate form of respect for your time. Experience the most accurate attendance computation engine available today.
            </p>
            <div className="pt-12">
              <Link href="/attendance-calculator">
                <Button className="w-full md:w-fit h-20 bg-primary text-primary-foreground font-black text-xl uppercase tracking-[0.2em] rounded-[32px] shadow-2xl hover:scale-[1.05] transition-all group px-16">
                  Launch the Matrix Engine
                  <Zap className="ml-4 w-7 h-7 group-hover:fill-current transition-all" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-48 pt-24 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-16">
            <div className="space-y-4 text-center md:text-left">
              <p className="text-[14px] font-black uppercase tracking-[0.5em] text-primary">Chief Academic Lead</p>
              <p className="text-3xl font-black">Academic Intelligence Unit</p>
              <p className="text-base text-muted-foreground">© 2025 Camly Inc • calculator.camly.org • Defining Scholastic Velocity</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
               <Badge variant="outline" className="text-[11px] uppercase font-bold tracking-widest px-8 py-4 flex items-center gap-2 border-primary/20">
                 Registrar Standard: VERIFIED
               </Badge>
               <Badge variant="outline" className="text-[11px] uppercase font-bold tracking-widest px-8 py-4 flex items-center gap-2 border-accent/20">
                 Active Protocol: STABLE
               </Badge>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
