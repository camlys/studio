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
        setError("Please enter a valid date.");
        return;
      }
      const birth = new Date(parseInt(dob.year), parseInt(dob.month) - 1, parseInt(dob.day));
      if (birth > new Date()) {
        setError("Date cannot be in the future.");
        return;
      }
      setResults(calculateAll(birth));
    } else {
      if (!isValidDate(fromDate.day, fromDate.month, fromDate.year) || 
          !isValidDate(toDate.day, toDate.month, toDate.year)) {
        setError("Please enter valid dates.");
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
      ? `I am ${results.years} years, ${results.months} months, and ${results.days} days old! Calculated with ChronoFlow.`
      : `The difference is ${results.years} years, ${results.months} months, and ${results.days} days! Calculated with ChronoFlow.`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Results copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen animate-gradient-bg flex flex-col transition-colors duration-500">
      <nav className="sticky top-0 z-50 glass border-b border-white/10 h-14 flex items-center px-4 md:px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center neon-glow">
            <Timer className="text-primary-foreground w-5 h-5" />
          </div>
          <h1 className="text-xl font-headline font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            CHRONOFLOW
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full hover:bg-white/10 w-9 h-9">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-full hover:bg-white/10 w-9 h-9">
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      <main className="flex-grow container max-w-[1200px] mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Header + Calculator */}
          <aside className="w-full lg:w-[340px] shrink-0 space-y-6 sticky lg:top-20">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-headline font-extrabold tracking-tight text-foreground leading-tight">
                Master Your <br /><span className="text-primary">Timeline</span>
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs">
                Precision age and date calculations.
              </p>
            </div>

            <div className="glass-card !p-5 shadow-xl border-white/5">
              <Tabs 
                defaultValue="age" 
                className="w-full" 
                onValueChange={(v) => {
                  setActiveTab(v as 'age' | 'diff');
                  setError(null);
                }}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5 p-1 rounded-xl h-10">
                  <TabsTrigger value="age" className="rounded-lg text-xs flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Calculator className="w-3.5 h-3.5" />
                    Age
                  </TabsTrigger>
                  <TabsTrigger value="diff" className="rounded-lg text-xs flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    Diff
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="age" className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                  <DateInput 
                    label="Date of Birth" 
                    values={dob} 
                    onChange={setDob} 
                    error={activeTab === 'age' ? error || undefined : undefined} 
                  />
                </TabsContent>

                <TabsContent value="diff" className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                  <DateInput label="From Date" values={fromDate} onChange={setFromDate} />
                  <div className="flex justify-center -my-2 relative z-10">
                    <div className="w-6 h-6 glass rounded-full flex items-center justify-center border-white/10">
                      <ChevronRight className="w-3 h-3 text-primary rotate-90 lg:rotate-0" />
                    </div>
                  </div>
                  <DateInput label="To Date" values={toDate} onChange={setToDate} error={activeTab === 'diff' ? error || undefined : undefined} />
                </TabsContent>
              </Tabs>

              <Button 
                className="w-full h-11 mt-6 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 transition-all transform active:scale-[0.98] neon-glow"
                onClick={handleCalculate}
              >
                Calculate
              </Button>
            </div>
          </aside>

          {/* Right Column: Results Section */}
          <div className="flex-grow w-full">
            {results ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
                <div>
                  <h3 className="text-xl font-headline font-bold text-foreground mb-4">Calculation Results</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <ResultCard label="Years" value={results.years} delay="0s" />
                    <ResultCard label="Months" value={results.months} delay="0.1s" />
                    <ResultCard label="Days" value={results.days} delay="0.2s" />
                    <ResultCard label="Weeks" value={results.totalWeeks} delay="0.3s" />
                    <ResultCard label="Total Days" value={results.totalDays} delay="0.4s" />
                    <ResultCard label="Hours" value={results.totalHours} delay="0.5s" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="glass-card !p-4 flex items-center gap-4 hover:neon-glow transition-all duration-300">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <History className="text-accent w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Next Birthday</p>
                      <p className="text-lg font-bold text-foreground">{results.nextBirthday} Days</p>
                    </div>
                  </div>
                  <div className="glass-card !p-4 flex items-center gap-4 hover:neon-glow transition-all duration-300">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Calendar className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Zodiac Sign</p>
                      <p className="text-lg font-bold text-foreground">{results.zodiac}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card !p-5 space-y-3">
                  <h4 className="text-base font-bold text-foreground">Timeline Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Minutes</p>
                      <p className="text-xl font-headline font-black text-primary">{results.totalMinutes.toLocaleString()}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Seconds</p>
                      <p className="text-xl font-headline font-black text-accent">{results.totalSeconds.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <FunFact years={results.years} months={results.months} days={results.days} />

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="secondary" size="sm" className="rounded-lg h-9 px-4 gap-2 text-xs" onClick={handleShare}>
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </Button>
                  <Button variant="secondary" size="sm" className="rounded-lg h-9 px-4 gap-2 text-xs" onClick={handleShare}>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg h-9 px-4 gap-2 text-xs border-white/5 bg-white/5 hover:bg-white/10">
                    <Download className="w-3.5 h-3.5" /> PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl min-h-[300px] opacity-40">
                <div className="text-center space-y-3">
                  <Timer className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm italic font-medium">Calculation details will appear here...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center border-t border-white/5 glass">
        <p className="text-muted-foreground text-[10px] flex items-center justify-center gap-2">
          Precision Engineering • ChronoFlow v1.2
        </p>
      </footer>
    </div>
  );
}
