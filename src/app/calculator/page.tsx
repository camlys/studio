"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Cpu, History, 
  ShieldCheck, Timer, Zap, 
  Activity, Binary, Terminal,
  Atom, Database
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

export default function PrecisionCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isScientific, setIsScientific] = useState(true);
  const [isRadians, setIsRadians] = useState(true);
  const [memory, setMemory] = useState<number>(0);
  const [entropy, setEntropy] = useState(0.000);

  // Simulated system entropy for high-tech feel
  useEffect(() => {
    const interval = setInterval(() => {
      setEntropy(Math.random() * 0.05);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatResult = (num: number): string => {
    if (isNaN(num)) return "Error";
    if (!isFinite(num)) return "Infinity";
    
    // If number is very large or very small (but not 0), use scientific notation with fixed precision
    if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-7 && num !== 0)) {
      return num.toExponential(6);
    }
    
    // Otherwise, use standard notation and strip trailing zeros
    return parseFloat(num.toFixed(10)).toString();
  };

  const handleNumber = (num: string) => {
    setDisplay(prev => {
      if (prev === '0' && num !== '.') return num;
      if (prev.includes('.') && num === '.') return prev;
      if (prev.length > 18) return prev; // Capped for visual sanity
      return prev + num;
    });
  };

  const handleOperator = (op: string) => {
    setExpression(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const factorial = (n: number): number => {
    if (n < 0 || n > 170) return NaN; // JS infinity after 170!
    if (n === 0) return 1;
    let res = 1;
    for (let i = 1; i <= n; i++) res *= i;
    return res;
  };

  const calculate = () => {
    try {
      const fullExpression = expression + display;
      const cleanExpr = fullExpression.replace('×', '*').replace('÷', '/');
      // Note: Eval is used for simplified logic in this MVP.
      const result = eval(cleanExpr);
      const formattedResult = formatResult(result);
      
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
      let val = parseFloat(display);
      let res = 0;
      
      const trigVal = isRadians ? val : val * (Math.PI / 180);

      switch (func) {
        case 'sin': res = Math.sin(trigVal); break;
        case 'cos': res = Math.cos(trigVal); break;
        case 'tan': res = Math.tan(trigVal); break;
        case 'asin': res = Math.asin(val); if (!isRadians) res *= (180 / Math.PI); break;
        case 'acos': res = Math.acos(val); if (!isRadians) res *= (180 / Math.PI); break;
        case 'atan': res = Math.atan(val); if (!isRadians) res *= (180 / Math.PI); break;
        case 'log': res = Math.log10(val); break;
        case 'ln': res = Math.log(val); break;
        case 'sqrt': res = Math.sqrt(val); break;
        case 'pow2': res = Math.pow(val, 2); break;
        case 'fact': res = factorial(val); break;
        case 'abs': res = Math.abs(val); break;
        case 'pi': setDisplay(Math.PI.toString()); return;
        case 'c': setDisplay('299792458'); return;
      }
      setDisplay(formatResult(res));
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleMemory = (action: 'M+' | 'MR' | 'MC') => {
    if (action === 'M+') setMemory(prev => prev + parseFloat(display));
    if (action === 'MR') setDisplay(formatResult(memory));
    if (action === 'MC') setMemory(0);
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="relative glass border-b border-border h-14 flex items-center px-4 md:px-6 justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
              <Timer className="text-primary-foreground w-5 h-5" />
            </div>
            <h1 className="text-lg font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent uppercase">
              CHRONOFLOW
            </h1>
          </Link>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
           <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.3em] text-[10px] px-6 py-1.5 font-black">
             Advanced Precision Hub
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

      <main className="flex-grow container max-w-6xl mx-auto px-6 py-8 md:py-16">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-12 lg:gap-20">
          
          {/* Info Section (LEFT on Desktop) */}
          <div className="flex-grow max-w-md text-center md:text-left space-y-8 pt-4 animate-in slide-in-from-left-8 duration-1000">
            <div className="space-y-4">
              <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-[0.4em] text-[9px] px-3 py-1 font-black">
                Mission-Critical Logic
              </Badge>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.85]">
                Scientific <span className="text-primary">Inference</span> Engine
              </h2>
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed font-medium">
                Proprietary mathematical compute layer designed for high-resolution tactical analysis and sub-atomic precision.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Binary className="w-4 h-4 text-primary" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Logic Tier</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">FP-128 parity enabled for consistent cross-node telemetry.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Atom className="w-4 h-4 text-accent" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Constants</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Pre-loaded physics constants for accelerated workflow.</p>
              </div>
            </div>

            <div className="glass-card !p-5 border-border/40 bg-muted/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> System Logs
                </span>
                <span className="text-[9px] font-bold text-accent animate-pulse">LIVE SYNCING</span>
              </div>
              <div className="space-y-2 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instruction Entropy:</span>
                  <span className="text-foreground">{entropy.toFixed(4)} Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ALU Latency:</span>
                  <span className="text-foreground">0.02ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precision Level:</span>
                  <span className="text-foreground text-primary">IEEE-754v2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Section (RIGHT on Desktop) */}
          <div className="w-full max-w-[380px] flex flex-col gap-4 animate-in slide-in-from-right-8 duration-700">
            <div className="w-full glass-card !p-0 overflow-hidden shadow-2xl border-border/40">
              {/* Display Area */}
              <div className="bg-black/5 dark:bg-black/20 p-5 text-right space-y-1 border-b border-border/40 min-h-[100px] flex flex-col justify-end">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex gap-2">
                    <Badge variant="outline" className={cn("text-[8px] px-2 py-0 h-4 uppercase font-black tracking-widest", isRadians ? "text-primary border-primary/20" : "text-muted-foreground")}>RAD</Badge>
                    <Badge variant="outline" className={cn("text-[8px] px-2 py-0 h-4 uppercase font-black tracking-widest", !isRadians ? "text-primary border-primary/20" : "text-muted-foreground")}>DEG</Badge>
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50 h-3 truncate max-w-[200px]">
                    {expression}
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black tracking-tight tabular-nums overflow-hidden text-ellipsis whitespace-nowrap">
                  {display}
                </div>
              </div>

              {/* Advanced Mode Toggles */}
              <div className="flex border-b border-border/20 bg-muted/30">
                <button 
                  onClick={() => setIsRadians(!isRadians)} 
                  className="flex-1 py-2 text-[8px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors border-r border-border/10"
                >
                  {isRadians ? 'Set Degrees' : 'Set Radians'}
                </button>
                <button 
                  onClick={() => setIsScientific(!isScientific)} 
                  className="flex-1 py-2 text-[8px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
                >
                  {isScientific ? 'Hide Scientific' : 'Show Scientific'}
                </button>
              </div>

              {/* Controls Grid */}
              <div className="p-1 grid grid-cols-4 gap-1 bg-muted/10">
                {isScientific && (
                  <>
                    <CalcButton onClick={() => handleScientific('sin')} className="text-primary/70">sin</CalcButton>
                    <CalcButton onClick={() => handleScientific('cos')} className="text-primary/70">cos</CalcButton>
                    <CalcButton onClick={() => handleScientific('tan')} className="text-primary/70">tan</CalcButton>
                    <CalcButton onClick={() => handleScientific('sqrt')} className="text-primary/70">√</CalcButton>
                    
                    <CalcButton onClick={() => handleScientific('asin')} className="text-accent/70 text-[10px]">asin</CalcButton>
                    <CalcButton onClick={() => handleScientific('acos')} className="text-accent/70 text-[10px]">acos</CalcButton>
                    <CalcButton onClick={() => handleScientific('atan')} className="text-accent/70 text-[10px]">atan</CalcButton>
                    <CalcButton onClick={() => handleScientific('fact')} className="text-accent/70">x!</CalcButton>

                    <CalcButton onClick={() => handleScientific('log')} className="text-primary/70">log</CalcButton>
                    <CalcButton onClick={() => handleScientific('ln')} className="text-primary/70">ln</CalcButton>
                    <CalcButton onClick={() => handleScientific('pow2')} className="text-primary/70">x²</CalcButton>
                    <CalcButton onClick={() => handleScientific('abs')} className="text-primary/70">|x|</CalcButton>

                    <CalcButton onClick={() => handleScientific('pi')} className="bg-primary/5 text-primary">π</CalcButton>
                    <CalcButton onClick={() => handleScientific('c')} className="bg-primary/5 text-primary">c</CalcButton>
                    <CalcButton onClick={() => handleMemory('M+')} className="bg-accent/5 text-accent">M+</CalcButton>
                    <CalcButton onClick={() => handleMemory('MR')} className="bg-accent/5 text-accent">MR</CalcButton>
                  </>
                )}

                <CalcButton onClick={clear} className="bg-destructive/10 text-destructive font-black">AC</CalcButton>
                <CalcButton onClick={() => setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')} className="bg-muted/30">C</CalcButton>
                <CalcButton onClick={() => handleMemory('MC')} className="bg-muted/30">MC</CalcButton>
                <CalcButton onClick={() => handleOperator('/')} className="bg-accent/10 text-accent">÷</CalcButton>

                <CalcButton onClick={() => handleNumber('7')}>7</CalcButton>
                <CalcButton onClick={() => handleNumber('8')}>8</CalcButton>
                <CalcButton onClick={() => handleNumber('9')}>9</CalcButton>
                <CalcButton onClick={() => handleOperator('*')} className="bg-accent/10 text-accent">×</CalcButton>

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

            {/* Sub-status Section */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card !p-4 border-border/40">
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-3 h-3 text-primary" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Cache Registry</span>
                </div>
                <div className="space-y-2">
                  {history.length === 0 ? (
                    <p className="text-[9px] text-muted-foreground/30 italic">No operational data</p>
                  ) : (
                    history.slice(0, 3).map((item, i) => (
                      <p key={i} className="text-[10px] font-mono text-muted-foreground/80 truncate border-l border-primary/20 pl-2">{item}</p>
                    ))
                  )}
                </div>
              </div>
              <div className="glass-card !p-4 border-accent/20 bg-accent/5">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-3 h-3 text-accent" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-accent">Node Parameters</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">Mode</span>
                    <span className="text-[9px] font-black text-accent">{isRadians ? 'RADIAN' : 'DEGREE'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">Memory</span>
                    <span className="text-[9px] font-black text-accent truncate max-w-[60px]">{formatResult(memory)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">Uptime</span>
                    <span className="text-[9px] font-black text-accent">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-auto py-8 glass border-t border-border/40 text-center">
        <div className="flex items-center justify-center gap-6 mb-4 opacity-30">
           <Zap className="w-4 h-4" />
           <Activity className="w-4 h-4" />
           <ShieldCheck className="w-4 h-4" />
        </div>
        <p className="text-[10px] uppercase font-black tracking-[0.5em] text-muted-foreground/60">
          Camly Intelligence • High-Fidelity Compute • © 2024
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
        "h-10 md:h-11 flex items-center justify-center text-xs md:text-sm font-bold transition-all hover:bg-white/5 active:scale-95 rounded-md",
        className
      )}
    >
      {children}
    </button>
  );
}
