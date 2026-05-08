"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Moon, RefreshCcw, Share2, Copy, History, Timer, Calendar, Calculator, ChevronRight, Download } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'age' | 'diff'>('age');
  
  const [dob, setDob] = useState<DateInputValues>({ day: '', month: '', year: '' });
  const [fromDate, setFromDate] = useState<DateInputValues>({ day: '', month: '', year: '' });
  const [toDate, setToDate] = useState<DateInputValues>({ day: '', month: '', year: '' });
  
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleCalculate = useCallback(() => {
    setError(null);
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
    <div className="min-h-screen animate-gradient-bg flex flex-col transition-colors duration-500">
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
          
          {/* Left Column: Calculator - Fixed side-by-side */}
          <aside className="w-[180px] sm:w-[220px] shrink-0 space-y-3 sticky top-14">
            <div className="space-y-0.5 px-1">
              <h2 className="text-sm font-headline font-extrabold tracking-tight text-foreground leading-tight">
                Timeline <span className="text-primary">Master</span>
              </h2>
            </div>

            <div className="glass-card !p-3 shadow-xl border-white/5">
              <Tabs 
                defaultValue="age" 
                className="w-full" 
                onValueChange={(v) => {
                  setActiveTab(v as 'age' | 'diff');
                  setError(null);
                }}
              >
                <TabsList className="grid w-full grid-cols-2 mb-3 bg-white/5 p-0.5 rounded-md h-7">
                  <TabsTrigger value="age" className="rounded-[4px] text-[9px] flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Age
                  </TabsTrigger>
                  <TabsTrigger value="diff" className="rounded-[4px] text-[9px] flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Diff
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="age" className="space-y-2 animate-in fade-in slide-in-from-left-1 duration-200">
                  <DateInput 
                    label="Birth Date" 
                    values={dob} 
                    onChange={setDob} 
                    error={activeTab === 'age' ? error || undefined : undefined} 
                  />
                </TabsContent>

                <TabsContent value="diff" className="space-y-2 animate-in fade-in slide-in-from-left-1 duration-200">
                  <DateInput label="Start" values={fromDate} onChange={setFromDate} />
                  <div className="flex justify-center -my-0.5 relative z-10">
                    <ChevronRight className="w-2.5 h-2.5 text-primary/40 rotate-90" />
                  </div>
                  <DateInput label="End" values={toDate} onChange={setToDate} error={activeTab === 'diff' ? error || undefined : undefined} />
                </TabsContent>
              </Tabs>

              <Button 
                className="w-full h-8 mt-3 text-[10px] font-bold rounded-md bg-primary hover:bg-primary/90 transition-all transform active:scale-[0.98] neon-glow"
                onClick={handleCalculate}
              >
                Calculate
              </Button>
            </div>
          </aside>

          {/* Right Column: Results Section */}
          <div className="flex-grow w-full">
            {results ? (
              <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  <ResultCard label="Years" value={results.years} />
                  <ResultCard label="Months" value={results.months} />
                  <ResultCard label="Days" value={results.days} />
                  <ResultCard label="Total Days" value={results.totalDays} />
                  <ResultCard label="Next Bday" value={results.nextBirthday} subLabel="Days" />
                  <ResultCard label="Zodiac" value={results.zodiac} />
                </div>

                <div className="glass-card !p-2.5 space-y-1.5">
                  <h4 className="text-[8px] uppercase tracking-widest font-bold text-foreground opacity-50">Detailed Chronometry</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <p className="text-[7px] text-muted-foreground uppercase font-bold tracking-widest">Minutes</p>
                      <p className="text-xs font-headline font-black text-primary">{results.totalMinutes.toLocaleString()}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[7px] text-muted-foreground uppercase font-bold tracking-widest">Seconds</p>
                      <p className="text-xs font-headline font-black text-accent">{results.totalSeconds.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <FunFact years={results.years} months={results.months} days={results.days} />

                <div className="flex flex-wrap gap-1 pt-0.5">
                  <Button variant="secondary" size="sm" className="rounded-md h-7 px-2 gap-1 text-[9px]" onClick={handleShare}>
                    <Share2 className="w-2.5 h-2.5" /> Share
                  </Button>
                  <Button variant="secondary" size="sm" className="rounded-md h-7 px-2 gap-1 text-[9px]" onClick={handleShare}>
                    <Copy className="w-2.5 h-2.5" /> Copy
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-xl min-h-[200px] opacity-30">
                <div className="text-center space-y-1">
                  <Timer className="w-5 h-5 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider">Awaiting Data</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-2 text-center border-t border-white/5 glass">
        <p className="text-muted-foreground text-[8px] tracking-tight">
          ChronoFlow v1.2 • Precision Engine
        </p>
      </footer>
    </div>
  );
}
