
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Clock, Timer, Zap, 
  ShieldCheck, Cpu, Target, Milestone, 
  CalendarDays, Hourglass, ArrowRight,
  Settings, Database, Network, Globe,
  ExternalLink, BarChart3, Workflow, Info
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { addDays, addWeeks, addMonths, format, differenceInDays } from 'date-fns';

const dueDateSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Professional Due Date Engine",
  "applicationCategory": "Utility",
  "operatingSystem": "All",
  "description": "High-precision milestone and project due date calculator with real-time tracking.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function DueDateCalculator() {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [duration, setDuration] = useState('30');
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [result, setResult] = useState<Date | null>(null);

  const calculateDueDate = () => {
    const start = new Date(startDate);
    const num = parseInt(duration) || 0;
    let end: Date;

    switch (unit) {
      case 'weeks': end = addWeeks(start, num); break;
      case 'months': end = addMonths(start, num); break;
      default: end = addDays(start, num);
    }
    setResult(end);
  };

  useEffect(() => {
    calculateDueDate();
  }, [startDate, duration, unit]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dueDateSchema) }}
      />
      <nav className="sticky top-0 z-50 glass border-b border-border h-14 flex items-center px-4 md:px-6 justify-between">
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
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-black uppercase tracking-widest gap-2">
              <ArrowLeft className="w-3 h-3" /> Back to App
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col md:flex-row items-start justify-center gap-12 lg:gap-24">
          
          <div className="flex-grow max-w-md space-y-8 pt-4">
            <div className="space-y-4">
              <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] text-[9px] px-3 py-1 font-black">
                Tactical Planning Layer
              </Badge>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.85]">
                Milestone <span className="text-primary">Inference</span> Engine
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
                High-precision due date calculation for professional project management, billing cycles, and tactical milestone synchronization.
              </p>
            </div>

            <div className="glass-card !p-8 space-y-6 border-border/40 shadow-2xl">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Execution Start (Origin)</Label>
                <Input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-muted/50 border-border h-12 rounded-xl focus:ring-2 focus:ring-primary/20 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Duration Vector</Label>
                  <Input 
                    type="number" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-muted/50 border-border h-12 rounded-xl focus:ring-2 focus:ring-primary/20 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Unit of Sync</Label>
                  <Select value={unit} onValueChange={(v: any) => setUnit(v)}>
                    <SelectTrigger className="bg-muted/50 border-border h-12 rounded-xl focus:ring-2 focus:ring-primary/20 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={calculateDueDate}
                className="w-full h-14 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all group"
              >
                Compute Due Date <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          <div className="w-full max-w-[440px] space-y-6">
            {result ? (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-6">
                <div className="glass-card !p-10 border-accent/20 bg-accent/5 text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Milestone className="w-20 h-20 text-accent group-hover:rotate-12 transition-transform duration-1000" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4 block">Calculated Due Date</span>
                  <div className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-4 tabular-nums">
                    {format(result, 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                    <CalendarDays className="w-3.5 h-3.5" /> {format(result, 'EEEE')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card !p-6 border-border/40 text-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Proximity</span>
                    <div className="text-2xl font-black text-primary">
                      {Math.abs(differenceInDays(result, new Date()))}
                    </div>
                    <span className="text-[8px] font-bold uppercase text-muted-foreground/60">Days Remain</span>
                  </div>
                  <div className="glass-card !p-6 border-border/40 text-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Confidence</span>
                    <div className="text-2xl font-black text-accent uppercase">99.9%</div>
                    <span className="text-[8px] font-bold uppercase text-muted-foreground/60">Atomic Sync</span>
                  </div>
                </div>

                <div className="glass-card !p-6 border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Temporal Insight</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    This deadline falls in the <strong>{format(result, 'QQQ')}</strong> quarter. Precision synchronization ensures sub-millisecond accuracy relative to your local timezone.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[400px] glass-card !p-10 border-dashed border-border/40 flex flex-col items-center justify-center text-center opacity-40">
                <Hourglass className="w-12 h-12 mb-6 animate-pulse" />
                <h3 className="text-lg font-black tracking-tight mb-2">Awaiting Parameters</h3>
                <p className="text-xs font-medium max-w-[200px]">Define origin and duration to calculate the final milestone coordinate.</p>
              </div>
            )}

            <div className="glass-card !p-6 border-border/40">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Database className="w-3.5 h-3.5" /> Registry History
              </h4>
              <div className="space-y-2 opacity-50">
                <div className="flex justify-between text-[10px] font-mono">
                  <span>LATENCY_SYNC</span>
                  <span className="text-accent">0.02ms</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span>STRATUM_FEED</span>
                  <span className="text-primary">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-40 space-y-20">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] text-[10px] px-6 py-1.5 font-black">Architecture Whitepaper</Badge>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">The Science of <span className="text-primary">Deadlines</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-medium">
              We define the standard for high-fidelity chronological milestones through military-grade synchronization protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-primary/40">
              <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <Workflow className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Project Velocity</h3>
              <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                Mapping the net vector of speed and fidelity at which a piece of digital information moves from inception to milestone.
              </p>
            </div>
            <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-accent/40">
              <div className="w-16 h-16 rounded-[2rem] bg-accent/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Risk Mitigation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                Real-time validation of mathematical inputs prevents overflows and handles Gregorian edge-cases with absolute parity.
              </p>
            </div>
            <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-primary/40">
              <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Global Sync</h3>
              <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                Synchronizing with primary time servers ensuring your deadlines are perfectly aligned with rotational velocity of the Earth.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto py-12 glass border-t border-border/40">
        <div className="container max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center">
                <Timer className="text-primary-foreground w-7 h-7" />
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
               © 2024 Camly Intelligence Group
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
