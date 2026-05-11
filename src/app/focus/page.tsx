"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Timer, ExternalLink, Sun, Moon, 
  LayoutGrid, Settings, BarChart3, ArrowLeft,
  FileType, Calculator as CalcIcon, CalendarDays, ArrowRight,
  Github, Twitter, Globe, ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pomodoro, TimerMode, PomodoroSettings } from '@/components/chrono/Pomodoro';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { InstallPWA } from '@/components/chrono/InstallPWA';

const focusSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Pomodoro Focus Engine",
  "applicationCategory": "Productivity",
  "operatingSystem": "All",
  "description": "High-precision Pomodoro timer with AI-driven focus mantras and deep integration with the ChronoFlow engine.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

function FocusPageContent() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('chrono_theme') as 'light' | 'dark' | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const getAtmosphereStyles = () => {
    const isOverriddenDark = isTimerActive && pomodoroSettings?.darkModeWhenRunning;
    if (isOverriddenDark) return { backgroundColor: '#09090b' };
    if (theme === 'dark') return { backgroundColor: '#0c0c0e' };
    const baseColor = pomodoroSettings?.themeColor || '#ba4949';
    return { backgroundColor: baseColor };
  };

  const isFocusModeDark = (isTimerActive && pomodoroSettings?.darkModeWhenRunning) || theme === 'dark';

  return (
    <div 
      className="min-h-screen flex flex-col transition-all duration-700 overflow-x-hidden text-white"
      style={getAtmosphereStyles()}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(focusSchema) }}
      />
      
      <nav className="relative z-50 h-14 flex items-center px-4 md:px-6 justify-between transition-colors duration-700 bg-black/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-all bg-white/20 group-hover:scale-110">
              <Image src="/camly.png" alt="Camly Calculator" width={28} height={28} priority className="object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tighter leading-none font-roboto-slab uppercase text-white">
                CALCULATOR
              </h1>
              <span className="text-[7px] font-bold tracking-[0.3em] uppercase mt-1 text-white/60">
                CAMLY.ORG
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button 
                 variant="ghost" 
                 className="rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] gap-1.5 md:gap-2.5 transition-all group text-white hover:bg-white/10"
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
               <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 rounded-lg m-1">
                 <Link href="/focus" className="flex items-center gap-3 w-full px-2 py-2">
                   <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                     <Timer className="w-4 h-4 text-primary" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Focus Mode</span>
                     <span className="text-[8px] font-bold text-muted-foreground uppercase">Pomodoro</span>
                   </div>
                 </Link>
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>

           <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest gap-2">
                <BarChart3 className="w-4 h-4" /> Report
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest gap-2"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="w-4 h-4" /> Setting
              </Button>
            </div>
        </div>
      </nav>

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col items-center gap-10">
          <aside className="w-full shrink-0 space-y-4 max-w-[480px]">
            <div className="glass-card !p-6 shadow-none border-none transition-all duration-700 bg-transparent">
              <Tabs 
                value="focus"
                className="w-full" 
                onValueChange={(v) => {
                  if (v === 'age') router.push('/');
                  if (v === 'calculator') router.push('/calculator');
                  if (v === 'due-date') router.push('/due-date-calculator');
                }}
              >
                <TabsList className="grid w-full grid-cols-4 mb-6 rounded-xl h-10 bg-white/10">
                  <TabsTrigger value="age" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Age</TabsTrigger>
                  <TabsTrigger value="focus" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Focus</TabsTrigger>
                  <TabsTrigger value="calculator" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Calc</TabsTrigger>
                  <TabsTrigger value="due-date" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Due</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </aside>

          <div className="flex-grow w-full min-0">
            <Pomodoro 
              onSettingsChange={setSettingsChange => setPomodoroSettings(setSettingsChange)}
              onTimerActiveChange={setIsTimerActive}
              isExternalSettingsOpen={isSettingsOpen}
              onExternalSettingsOpenChange={setIsSettingsOpen}
            />
          </div>
        </div>
      </main>

      <footer className="relative mt-auto pt-24 pb-12 px-6 transition-colors duration-700 border-t bg-black/5 border-white/10">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all bg-white/20">
                  <Image src="/camly.png" alt="Camly Calculator" width={32} height={32} className="object-contain" />
                </div>
                <h2 className="text-xl font-black tracking-tighter text-white uppercase font-roboto-slab">
                  FOCUS ENGINE
                </h2>
              </div>
              <p className="text-sm leading-relaxed max-w-xs font-medium text-white/60">
                High-precision focus synchronization for deep work and biological rest.
                Synchronize your workflow with absolute parity.
              </p>
              <div className="flex gap-5">
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white/10 border border-white/20"><Github className="w-4 h-4 text-white" /></Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white/10 border border-white/20"><Twitter className="w-4 h-4 text-white" /></Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white/10 border border-white/20"><Globe className="w-4 h-4 text-white" /></Button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60">Operations</h3>
              <ul className="space-y-3 text-xs font-bold text-white/40">
                <li className="hover:text-white transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/due-date-calculator">Due Date</Link>
                </li>
                <li className="hover:text-white transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/calculator">Precision Calculator</Link>
                </li>
                <li className="hover:text-white transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/focus">Focus Mode</Link>
                </li>
                <li className="hover:text-white transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" />
                   <Link href="/">Age Calculator</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60">Intelligence</h3>
              <ul className="space-y-3 text-xs font-bold text-white/40">
                <li className="hover:text-white transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/blog">Knowledge Hub</Link>
                </li>
                <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" /> Fun Facts API
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60">Architecture</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-[10px] font-black tracking-widest text-white/80">
                  <div className="w-2 h-2 rounded-full animate-pulse bg-white" />
                  CAMLY-SYNC-01: ONLINE
                </div>
                <InstallPWA />
              </div>
            </div>
          </div>

          <Separator className="mb-10 bg-white/10" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] uppercase tracking-[0.5em] font-black text-white/30">
              © 2024 Camly Inc • Defining High-Precision Velocity
            </p>
            <div className="flex gap-8">
              <Link href="/privacy-protocol" className="text-[10px] uppercase tracking-[0.2em] transition-colors font-black text-white/30 hover:text-white">Privacy Protocol</Link>
              <Link href="/terms-of-sync" className="text-[10px] uppercase tracking-[0.2em] transition-colors font-black text-white/30 hover:text-white">Terms of Sync</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function FocusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#ba4949] flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white/20">Initializing Focus Engine...</div>}>
      <FocusPageContent />
    </Suspense>
  );
}
