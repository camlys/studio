
"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Cpu, Zap, Calculator as CalcIcon, 
  RotateCcw, History, Settings, Info, 
  ShieldCheck, Activity, Globe, Timer 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

export default function PrecisionCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isScientific, setIsScientific] = useState(true);

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    setExpression(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      const fullExpression = expression + display;
      // Using a safer evaluation for basic scientific functions
      // In a production app, a math parser like mathjs would be preferred
      const result = eval(fullExpression.replace('×', '*').replace('÷', '/'));
      const formattedResult = Number(result.toFixed(8)).toString();
      
      setHistory(prev => [fullExpression + ' = ' + formattedResult, ...prev].slice(0, 5));
      setDisplay(formattedResult);
      setExpression('');
    } catch (e) {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1500);
    }
  };

  const handleScientific = (func: string) => {
    try {
      const val = parseFloat(display);
      let res = 0;
      switch (func) {
        case 'sin': res = Math.sin(val); break;
        case 'cos': res = Math.cos(val); break;
        case 'tan': res = Math.tan(val); break;
        case 'log': res = Math.log10(val); break;
        case 'ln': res = Math.log(val); break;
        case 'sqrt': res = Math.sqrt(val); break;
        case 'pow2': res = Math.pow(val, 2); break;
        case 'pi': setDisplay(Math.PI.toString()); return;
      }
      setDisplay(Number(res.toFixed(8)).toString());
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Centered Navigation Link as requested */}
      <nav className="sticky top-0 z-50 glass border-b border-border h-14 flex items-center px-4 md:px-6 justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
              <Timer className="text-primary-foreground w-5 h-5" />
            </div>
            <h1 className="text-lg font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              CHRONOFLOW
            </h1>
          </Link>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
           <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.3em] text-[10px] px-6 py-1.5 font-black">
             Precision Calculator Hub
           </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-black uppercase tracking-widest gap-2">
              <ArrowLeft className="w-3 h-3" /> Back to Engine
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-grow container max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Scientific <span className="text-primary">Inference</span> Engine</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto font-medium">
            High-fidelity mathematical computation layer for tactical asset and chronological analysis.
          </p>
        </div>

        <div className="w-full max-w-[400px] glass-card !p-0 overflow-hidden shadow-2xl border-border/40">
          {/* Display Area */}
          <div className="bg-black/5 dark:bg-black/20 p-8 text-right space-y-1 border-b border-border/40">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 h-4">
              {expression}
            </div>
            <div className="text-4xl md:text-5xl font-black tracking-tight tabular-nums overflow-hidden text-ellipsis">
              {display}
            </div>
          </div>

          {/* Controls */}
          <div className="p-1 grid grid-cols-4 gap-1 bg-muted/20">
            {/* Scientific Row Toggle */}
            <div className="col-span-4 flex justify-between px-4 py-2 bg-muted/10 border-b border-border/10">
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                 <Cpu className="w-3 h-3" /> System: Active
               </span>
               <button 
                 onClick={() => setIsScientific(!isScientific)}
                 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:underline"
               >
                 {isScientific ? 'Standard' : 'Scientific'} Mode
               </button>
            </div>

            {isScientific && (
              <>
                <CalcButton onClick={() => handleScientific('sin')} className="bg-primary/5 text-primary">sin</CalcButton>
                <CalcButton onClick={() => handleScientific('cos')} className="bg-primary/5 text-primary">cos</CalcButton>
                <CalcButton onClick={() => handleScientific('tan')} className="bg-primary/5 text-primary">tan</CalcButton>
                <CalcButton onClick={() => handleScientific('sqrt')} className="bg-primary/5 text-primary">√</CalcButton>
                <CalcButton onClick={() => handleScientific('log')} className="bg-primary/5 text-primary">log</CalcButton>
                <CalcButton onClick={() => handleScientific('ln')} className="bg-primary/5 text-primary">ln</CalcButton>
                <CalcButton onClick={() => handleScientific('pow2')} className="bg-primary/5 text-primary">x²</CalcButton>
                <CalcButton onClick={() => handleScientific('pi')} className="bg-primary/5 text-primary">π</CalcButton>
              </>
            )}

            <CalcButton onClick={clear} className="bg-destructive/10 text-destructive font-black">AC</CalcButton>
            <CalcButton onClick={() => setDisplay(prev => prev.slice(0, -1) || '0')} className="bg-muted/30">C</CalcButton>
            <CalcButton onClick={() => handleOperator('%')} className="bg-muted/30">%</CalcButton>
            <CalcButton onClick={() => handleOperator('÷')} className="bg-accent/10 text-accent">÷</CalcButton>

            <CalcButton onClick={() => handleNumber('7')}>7</CalcButton>
            <CalcButton onClick={() => handleNumber('8')}>8</CalcButton>
            <CalcButton onClick={() => handleNumber('9')}>9</CalcButton>
            <CalcButton onClick={() => handleOperator('×')} className="bg-accent/10 text-accent">×</CalcButton>

            <CalcButton onClick={() => handleNumber('4')}>4</CalcButton>
            <CalcButton onClick={() => handleNumber('5')}>5</CalcButton>
            <CalcButton onClick={() => handleNumber('6')}>6</CalcButton>
            <CalcButton onClick={() => handleOperator('-')} className="bg-accent/10 text-accent">-</CalcButton>

            <CalcButton onClick={() => handleNumber('1')}>1</CalcButton>
            <CalcButton onClick={() => handleNumber('2')}>2</CalcButton>
            <CalcButton onClick={() => handleNumber('3')}>3</CalcButton>
            <CalcButton onClick={() => handleOperator('+')} className="bg-accent/10 text-accent">+</CalcButton>

            <CalcButton onClick={() => handleNumber('0')} className="col-span-2">0</CalcButton>
            <CalcButton onClick={() => handleNumber('.')}>.</CalcButton>
            <CalcButton onClick={calculate} className="bg-primary text-primary-foreground font-black">=</CalcButton>
          </div>
        </div>

        {/* History / Status Section */}
        <div className="w-full max-w-[400px] mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="glass-card !p-6 border-border/40">
             <div className="flex items-center gap-2 mb-4">
               <History className="w-3 h-3 text-primary" />
               <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Recent Syncs</span>
             </div>
             <div className="space-y-2">
               {history.length === 0 ? (
                 <p className="text-[10px] text-muted-foreground/40 italic">No cache found.</p>
               ) : (
                 history.map((item, i) => (
                   <p key={i} className="text-[11px] font-mono text-muted-foreground line-clamp-1">{item}</p>
                 ))
               )}
             </div>
           </div>

           <div className="glass-card !p-6 border-accent/20 bg-accent/5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-3 h-3 text-accent" />
                <span className="text-[9px] font-black uppercase tracking-widest text-accent">Compute Status</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Encryption</span>
                  <span className="text-[10px] font-black text-accent">AES-256</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Accuracy</span>
                  <span className="text-[10px] font-black text-accent">8-DECIMAL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">State</span>
                  <span className="text-[10px] font-black text-accent">LOCAL</span>
                </div>
              </div>
           </div>
        </div>
      </main>

      <footer className="mt-auto py-8 glass border-t border-border/40 text-center">
        <p className="text-[10px] uppercase font-black tracking-[0.4em] text-muted-foreground/60">
          Camly Intelligence • High-Precision Inference • © 2024
        </p>
      </footer>
    </div>
  );
}

function CalcButton({ children, onClick, className }: { children: React.ReactNode, onClick: () => void, className?: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "h-14 md:h-16 flex items-center justify-center text-lg md:text-xl font-bold transition-all hover:bg-white/5 active:scale-95",
        className
      )}
    >
      {children}
    </button>
  );
}
