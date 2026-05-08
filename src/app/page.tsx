"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sun, Moon, RefreshCcw, Share2, Copy, Timer, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateInput } from '@/components/chrono/DateInput';
import { ResultCard } from '@/components/chrono/ResultCard';
import { FunFact } from '@/components/chrono/FunFact';
import { isValidDate, calculateAll, DateInputValues, CalculationResults } from '@/lib/date-utils';
import { useToast } from '@/hooks/use-toast';

export default function ChronoFlow() {
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<'diff' | 'age'>('diff');
  
  const [dob, setDob] = useState<DateInputValues>({ day: '', month: '', year: '' });
  const [fromDate, setFromDate] = useState<DateInputValues>({ day: '', month: '', year: '' });
  const [toDate, setToDate] = useState<DateInputValues>({ day: '', month: '', year: '' });
  
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tickerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedDob = localStorage.getItem('chrono_dob');
    if (savedDob) setDob(JSON.parse(savedDob));
    
    const savedFrom = localStorage.getItem('chrono_from');
    if (savedFrom) setFromDate(JSON.parse(savedFrom));
    
    const savedTo = localStorage.getItem('chrono_to');
    if (savedTo) {
      setToDate(JSON.parse(savedTo));
    } else {
      const now = new Date();
      setToDate({
        day: now.getDate().toString().padStart(2, '0'),
        month: (now.getMonth() + 1).toString().padStart(2, '0'),
        year: now.getFullYear().toString()
      });
    }

    const savedTheme = localStorage.getItem('chrono_theme');
    if (savedTheme === 'light') setTheme('light');
  }, []);

  useEffect(() => {
    localStorage.setItem('chrono_dob', JSON.stringify(dob));
    localStorage.setItem('chrono_from', JSON.stringify(fromDate));
    localStorage.setItem('chrono_to', JSON.stringify(toDate));
  }, [dob, fromDate, toDate]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('chrono_theme', theme);
  }, [theme]);

  // Real-time ticking effect
  useEffect(() => {
    if (results) {
      tickerRef.current = setInterval(() => {
        setResults(prev => {
          if (!prev) return null;
          return {
            ...prev,
            totalSeconds: prev.totalSeconds + 1,
            totalMinutes: Math.floor((prev.totalSeconds + 1) / 60),
            totalHours: Math.floor((prev.totalSeconds + 1) / 3600),
          };
        });
      }, 1000);
    } else {
      if (tickerRef.current) clearInterval(tickerRef.current);
    }
    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, [results === null]);

  const handleCalculate = useCallback(() => {
    setError(null);
    if (tickerRef.current) clearInterval(tickerRef.current);

    if (activeTab === 'age') {
      if (!isValidDate(dob.day, dob.month, dob.year)) {
        setError("Invalid date.");
        return;
      }
      const birth = new Date(parseInt(dob.year), parseInt(dob.month) - 1, parseInt(dob.day));
      if (birth > new Date()) {
        setError("Future date.");
        return;
      }
      setResults(calculateAll(birth));
    } else {
      if (!isValidDate(fromDate.day, fromDate.month, fromDate.year) || 
          !isValidDate(toDate.day, toDate.month, toDate.year)) {
        setError("Invalid dates.");
        return;
      }
      const start = new Date(parseInt(fromDate.year), parseInt(fromDate.month) - 1, parseInt(fromDate.day));
      const end = new Date(parseInt(toDate.year), parseInt(toDate.month) - 1, parseInt(toDate.day));
      setResults(calculateAll(start, end));
    }
  }, [activeTab, dob, fromDate, toDate]);

  const handleReset = () => {
    setDob({ day: '', month: '', year: '' });
    setFromDate({ day: '', month: '', year: '' });
    const now = new Date();
    setToDate({
      day: now.getDate().toString().padStart(2, '0'),
      month: (now.getMonth() + 1).toString().padStart(2, '0'),
      year: now.getFullYear().toString()
    });
    setResults(null);
    setError(null);
  };

  const handleShare = () => {
    if (!results) return;
    const text = activeTab === 'age' 
      ? `I am ${results.years}y, ${results.months}m, ${results.days}d old!`
      : `Difference: ${results.years}y, ${results.months}m, ${results.days}d.`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Results copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen animate-gradient-bg flex flex-col transition-colors duration-500 overflow-x-hidden">
      <nav className="sticky top-0 z-50 glass border-b border-white/10 h-12 flex items-center px-4 md:px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center neon-glow">
            <Timer className="text-primary-foreground w-4 h-4" />
          </div>
          <h1 className="text-sm md:text-base font-headline font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            CHRONOFLOW
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full hover:bg-white/10 w-8 h-8">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-full hover:bg-white/10 w-8 h-8">
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Mobile View: Stacks (<480px) | 5-8 Inch/Desktop: Side-by-Side (>=480px) */}
        <div className="flex flex-col min-[480px]:flex-row gap-6 items-start">
          
          <aside className="w-full min-[480px]:w-[160px] md:w-[220px] lg:w-[260px] shrink-0 space-y-4 min-[480px]:sticky min-[480px]:top-20">
            <div className="px-1">
              <h2 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-foreground/70 leading-none">
                Chrono <span className="text-primary">Engine</span>
              </h2>
            </div>

            <div className="glass-card !p-4 shadow-2xl border-white/10">
              <Tabs 
                value={activeTab}
                className="w-full" 
                onValueChange={(v) => {
                  setActiveTab(v as 'age' | 'diff');
                  setError(null);
                }}
              >
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/5 p-1 rounded-lg h-9">
                  <TabsTrigger value="diff" className="rounded-md text-[10px] md:text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                    Difference
                  </TabsTrigger>
                  <TabsTrigger value="age" className="rounded-md text-[10px] md:text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                    Age
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="diff" className="space-y-3 mt-0">
                  <DateInput label="Start Date" values={fromDate} onChange={setFromDate} />
                  <div className="flex justify-center -my-1.5">
                    <ChevronRight className="w-4 h-4 text-primary/30 rotate-90" />
                  </div>
                  <DateInput label="End Date" values={toDate} onChange={setToDate} error={activeTab === 'diff' ? error || undefined : undefined} />
                </TabsContent>

                <TabsContent value="age" className="space-y-3 mt-0">
                  <DateInput 
                    label="Birth Date" 
                    values={dob} 
                    onChange={setDob} 
                    error={activeTab === 'age' ? error || undefined : undefined} 
                  />
                </TabsContent>
              </Tabs>

              <Button 
                className="w-full h-10 mt-6 text-xs font-black uppercase tracking-widest rounded-lg bg-primary hover:bg-primary/90 transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20 neon-glow"
                onClick={handleCalculate}
              >
                Process Data
              </Button>
            </div>
          </aside>

          <div className="flex-grow w-full min-w-0">
            {results ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Status Badge */}
                <div className="flex items-center gap-2.5 px-1">
                   <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(var(--accent),0.6)]" />
                   <span className="text-[10px] uppercase font-black tracking-[0.25em] text-accent/80">Real-time Precision Feed</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  <ResultCard label="Years" value={results.years} />
                  <ResultCard label="Months" value={results.months} />
                  <ResultCard label="Days" value={results.days} />
                  <ResultCard label="Countdown" value={results.nextBirthday} subLabel="Days to Birthday" />
                </div>

                {/* Atomic Time Section (Decreasing Magnitude) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  <ResultCard label="Total Days" value={results.totalDays} />
                  <ResultCard label="Total Hours" value={results.totalHours} className="border-primary/20" />
                  <ResultCard label="Total Minutes" value={results.totalMinutes} className="border-primary/20" />
                  <ResultCard label="Total Seconds" value={results.totalSeconds} className="border-primary/20" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <ResultCard label="Zodiac Sign" value={results.zodiac} />
                  <ResultCard label="Leap Year" value={results.isLeapYear ? "Identified" : "None"} />
                </div>

                <FunFact years={results.years} months={results.months} days={results.days} />

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button variant="secondary" size="sm" className="rounded-lg h-9 px-4 gap-2 text-xs font-semibold" onClick={handleShare}>
                    <Share2 className="w-4 h-4" /> Share
                  </Button>
                  <Button variant="secondary" size="sm" className="rounded-lg h-9 px-4 gap-2 text-xs font-semibold" onClick={handleShare}>
                    <Copy className="w-4 h-4" /> Copy Results
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-3xl min-h-[300px] md:min-h-[450px] bg-white/[0.02] transition-all hover:bg-white/[0.04]">
                <div className="text-center space-y-3 px-6">
                  <Timer className="w-8 h-8 md:w-10 md:h-10 mx-auto text-muted-foreground/30 animate-spin-slow" />
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-[11px] uppercase font-black tracking-[0.3em]">Standby</p>
                    <p className="text-muted-foreground/60 text-[10px] max-w-[200px] mx-auto leading-relaxed">Awaiting input for chronological synchronization</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center border-t border-white/5 glass mt-auto">
        <p className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase font-black">
          ChronoFlow v1.5 • Atomic Precision Dashboard
        </p>
      </footer>
    </div>
  );
}
