
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sun, Moon, RefreshCcw, Share2, Copy, Timer, ChevronRight, Activity } from 'lucide-react';
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
      <nav className="sticky top-0 z-50 glass border-b border-white/10 h-10 flex items-center px-3 justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center neon-glow">
            <Timer className="text-primary-foreground w-3 h-3" />
          </div>
          <h1 className="text-sm font-headline font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            CHRONOFLOW
          </h1>
        </div>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full hover:bg-white/10 w-7 h-7">
            {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-full hover:bg-white/10 w-7 h-7">
            <RefreshCcw className="w-3 h-3" />
          </Button>
        </div>
      </nav>

      <main className="flex-grow container max-w-[900px] mx-auto px-2 py-3">
        <div className="flex flex-row gap-3 items-start h-full">
          
          <aside className="w-[110px] sm:w-[160px] shrink-0 space-y-2 sticky top-14">
            <div className="px-1">
              <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-tighter text-foreground/80 leading-none">
                Chrono <span className="text-primary">Engine</span>
              </h2>
            </div>

            <div className="glass-card !p-1.5 sm:!p-2.5 shadow-xl border-white/5">
              <Tabs 
                value={activeTab}
                className="w-full" 
                onValueChange={(v) => {
                  setActiveTab(v as 'age' | 'diff');
                  setError(null);
                }}
              >
                <TabsList className="grid w-full grid-cols-2 mb-2 bg-white/5 p-0.5 rounded-md h-6 sm:h-7">
                  <TabsTrigger value="diff" className="rounded-[4px] text-[7px] sm:text-[9px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                    Diff
                  </TabsTrigger>
                  <TabsTrigger value="age" className="rounded-[4px] text-[7px] sm:text-[9px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                    Age
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="diff" className="space-y-1 mt-0">
                  <DateInput label="From" values={fromDate} onChange={setFromDate} />
                  <div className="flex justify-center -my-0.5">
                    <ChevronRight className="w-2 h-2 text-primary/30 rotate-90" />
                  </div>
                  <DateInput label="To" values={toDate} onChange={setToDate} error={activeTab === 'diff' ? error || undefined : undefined} />
                </TabsContent>

                <TabsContent value="age" className="space-y-1 mt-0">
                  <DateInput 
                    label="Birth" 
                    values={dob} 
                    onChange={setDob} 
                    error={activeTab === 'age' ? error || undefined : undefined} 
                  />
                </TabsContent>
              </Tabs>

              <Button 
                className="w-full h-7 sm:h-8 mt-2.5 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-md bg-primary hover:bg-primary/90 transition-all transform active:scale-95 neon-glow"
                onClick={handleCalculate}
              >
                Calculate
              </Button>
            </div>
          </aside>

          <div className="flex-grow w-full min-w-0">
            {results ? (
              <div className="space-y-2 animate-in fade-in slide-in-from-right-2 duration-300">
                {/* Live Ticker Status */}
                <div className="flex items-center gap-1.5 px-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                   <span className="text-[8px] uppercase font-bold tracking-[0.2em] text-accent">Real-time Precision Active</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5">
                  <ResultCard label="Years" value={results.years} />
                  <ResultCard label="Months" value={results.months} />
                  <ResultCard label="Days" value={results.days} />
                  <ResultCard label="Next Bday" value={results.nextBirthday} subLabel="Days" />
                </div>

                {/* Digital Clock Section (Decreasing Order) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5">
                  <ResultCard label="Total Days" value={results.totalDays} />
                  <ResultCard label="Total Hours" value={results.totalHours} className="border-primary/20" />
                  <ResultCard label="Total Minutes" value={results.totalMinutes} className="border-primary/20" />
                  <ResultCard label="Total Seconds" value={results.totalSeconds} className="border-primary/20" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <ResultCard label="Zodiac" value={results.zodiac} />
                  <ResultCard label="Leap Year" value={results.isLeapYear ? "Yes" : "No"} />
                </div>

                <FunFact years={results.years} months={results.months} days={results.days} />

                <div className="flex flex-wrap gap-1 pt-0.5">
                  <Button variant="secondary" size="sm" className="rounded-md h-6 sm:h-7 px-2 gap-1 text-[8px] sm:text-[9px]" onClick={handleShare}>
                    <Share2 className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> Share
                  </Button>
                  <Button variant="secondary" size="sm" className="rounded-md h-6 sm:h-7 px-2 gap-1 text-[8px] sm:text-[9px]" onClick={handleShare}>
                    <Copy className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> Copy
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-xl min-h-[180px] sm:min-h-[220px] opacity-30">
                <div className="text-center space-y-1">
                  <Timer className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-muted-foreground animate-spin-slow" />
                  <p className="text-muted-foreground text-[8px] sm:text-[9px] uppercase font-bold tracking-widest">System Ready</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-2 text-center border-t border-white/5 glass">
        <p className="text-muted-foreground text-[7px] sm:text-[8px] tracking-widest uppercase font-medium">
          ChronoFlow v1.5 • Atomic Precision Engine
        </p>
      </footer>
    </div>
  );
}

