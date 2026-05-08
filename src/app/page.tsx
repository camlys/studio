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
  
  // States for Age Calculator
  const [dob, setDob] = useState<DateInputValues>({ day: '', month: '', year: '' });
  
  // States for Difference Calculator
  const [fromDate, setFromDate] = useState<DateInputValues>({ day: '', month: '', year: '' });
  const [toDate, setToDate] = useState<DateInputValues>({ day: '', month: '', year: '' });
  
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedDob = localStorage.getItem('chrono_dob');
    if (savedDob) setDob(JSON.parse(savedDob));
    
    const savedFrom = localStorage.getItem('chrono_from');
    if (savedFrom) setFromDate(JSON.parse(savedFrom));
    
    const savedTo = localStorage.getItem('chrono_to');
    if (savedTo) setToDate(JSON.parse(savedTo));

    const savedTheme = localStorage.getItem('chrono_theme');
    if (savedTheme === 'light') setTheme('light');
  }, []);

  // Persist to local storage
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
        setError("Please enter a valid date of birth.");
        return;
      }
      const birth = new Date(parseInt(dob.year), parseInt(dob.month) - 1, parseInt(dob.day));
      if (birth > new Date()) {
        setError("Date of birth cannot be in the future.");
        return;
      }
      setResults(calculateAll(birth));
    } else {
      if (!isValidDate(fromDate.day, fromDate.month, fromDate.year) || 
          !isValidDate(toDate.day, toDate.month, toDate.year)) {
        setError("Please enter valid 'From' and 'To' dates.");
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
    setToDate({ day: '', month: '', year: '' });
    setResults(null);
    setError(null);
  };

  const handleShare = () => {
    if (!results) return;
    const text = `I am ${results.years} years, ${results.months} months, and ${results.days} days old! Calculated with ChronoFlow.`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "You can now share your results with others.",
    });
  };

  return (
    <div className="min-h-screen animate-gradient-bg flex flex-col transition-colors duration-500">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-white/10 h-16 flex items-center px-4 md:px-8 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center neon-glow">
            <Timer className="text-primary-foreground w-6 h-6" />
          </div>
          <h1 className="text-2xl font-headline font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            CHRONOFLOW
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full hover:bg-white/10"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-full hover:bg-white/10">
            <RefreshCcw className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      <main className="flex-grow container max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tight text-foreground">
              Master Your <span className="text-primary">Timeline</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Precision age and date difference calculations with a premium, glassmorphism interface.
            </p>
          </div>

          {/* Calculator Section */}
          <section className="glass-card max-w-2xl mx-auto">
            <Tabs 
              defaultValue="age" 
              className="w-full" 
              onValueChange={(v) => {
                setActiveTab(v as 'age' | 'diff');
                setResults(null);
                setError(null);
              }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-10 bg-white/5 p-1 rounded-2xl h-14">
                <TabsTrigger value="age" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  <Calculator className="w-4 h-4" />
                  Age
                </TabsTrigger>
                <TabsTrigger value="diff" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                  <Calendar className="w-4 h-4" />
                  Difference
                </TabsTrigger>
              </TabsList>

              <TabsContent value="age" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <DateInput 
                  label="Date of Birth" 
                  values={dob} 
                  onChange={setDob} 
                  error={activeTab === 'age' ? error || undefined : undefined} 
                />
              </TabsContent>

              <TabsContent value="diff" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <DateInput 
                  label="From Date" 
                  values={fromDate} 
                  onChange={setFromDate} 
                />
                <div className="flex justify-center -my-4 relative z-10">
                  <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <DateInput 
                  label="To Date" 
                  values={toDate} 
                  onChange={setToDate} 
                  error={activeTab === 'diff' ? error || undefined : undefined}
                />
              </TabsContent>
            </Tabs>

            <Button 
              className="w-full h-16 mt-10 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 transition-all transform active:scale-[0.98] neon-glow"
              onClick={handleCalculate}
            >
              Calculate {activeTab === 'age' ? 'Age' : 'Difference'}
            </Button>
          </section>

          {/* Results Section */}
          {results && (
            <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
              <div className="text-center">
                <h3 className="text-2xl font-headline font-bold text-foreground mb-8">Calculation Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  <ResultCard label="Years" value={results.years} delay="0s" />
                  <ResultCard label="Months" value={results.months} delay="0.1s" />
                  <ResultCard label="Days" value={results.days} delay="0.2s" />
                  <ResultCard label="Total Weeks" value={results.totalWeeks} delay="0.3s" className="md:col-span-1" />
                  <ResultCard label="Total Days" value={results.totalDays} delay="0.4s" />
                  <ResultCard label="Total Hours" value={results.totalHours} delay="0.5s" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card flex items-center gap-6 group hover:neon-glow transition-all duration-300">
                  <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                    <History className="text-accent w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Next Birthday</p>
                    <p className="text-2xl font-bold text-foreground">{results.nextBirthday} Days</p>
                  </div>
                </div>
                <div className="glass-card flex items-center gap-6 group hover:neon-glow transition-all duration-300">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Calendar className="text-primary w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Zodiac Sign</p>
                    <p className="text-2xl font-bold text-foreground">{results.zodiac}</p>
                  </div>
                </div>
              </div>

              {/* Precise Time Breakdown */}
              <div className="glass-card text-center space-y-6">
                <h4 className="text-xl font-bold text-foreground">Precise Timeline</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Minutes Lived</p>
                    <p className="text-3xl font-headline font-black text-primary">{results.totalMinutes.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Seconds Lived</p>
                    <p className="text-3xl font-headline font-black text-accent">{results.totalSeconds.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* GenAI Fun Fact */}
              <FunFact years={results.years} months={results.months} days={results.days} />

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button variant="secondary" className="rounded-xl h-12 px-6 flex items-center gap-2 hover:bg-secondary/80" onClick={handleShare}>
                  <Share2 className="w-4 h-4" /> Share Results
                </Button>
                <Button variant="secondary" className="rounded-xl h-12 px-6 flex items-center gap-2 hover:bg-secondary/80" onClick={handleShare}>
                  <Copy className="w-4 h-4" /> Copy Text
                </Button>
                <Button variant="secondary" className="rounded-xl h-12 px-6 flex items-center gap-2 hover:bg-secondary/80">
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center border-t border-white/5 glass">
        <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
          Crafted with <span className="text-destructive">❤</span> by ChronoFlow Team
        </p>
      </footer>
    </div>
  );
}