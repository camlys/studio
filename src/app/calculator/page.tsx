
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

  useEffect(() => {
    const interval = setInterval(() => {
      setEntropy(Math.random() * 0.05);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatResult = (num: number): string => {
    if (isNaN(num)) return "Error";
    if (!isFinite(num)) return "Infinity";
    if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-7 && num !== 0)) {
      return num.toExponential(6);
    }
    return parseFloat(num.toFixed(10)).toString();
  };

  const handleNumber = (num: string) => {
    setDisplay(prev => {
      if (prev === '0' && num !== '.') return num;
      if (prev.includes('.') && num === '.') return prev;
      if (prev.length > 18) return prev;
      return prev + num;
    });
  };

  const handleOperator = (op: string) => {
    setExpression(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const factorial = (n: number): number => {
    if (n < 0 || n > 170) return NaN;
    if (n === 0) return 1;
    let res = 1;
    for (let i = 1; i <= n; i++) res *= i;
    return res;
  };

  const calculate = () => {
    try {
      const fullExpression = expression + display;
      const cleanExpr = fullExpression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/mod/g, '%');
      
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
        case 'sinh': res = Math.sinh(val); break;
        case 'cosh': res = Math.cosh(val); break;
        case 'tanh': res = Math.tanh(val); break;
        case 'asin': res = Math.asin(val); if (!isRadians) res *= (180 / Math.PI); break;
        case 'acos': res = Math.acos(val); if (!isRadians) res *= (180 / Math.PI); break;
        case 'atan': res = Math.atan(val); if (!isRadians) res *= (180 / Math.PI); break;
        case 'log': res = Math.log10(val); break;
        case 'log2': res = Math.log2(val); break;
        case 'ln': res = Math.log(val); break;
        case 'sqrt': res = Math.sqrt(val); break;
        case 'pow2': res = Math.pow(val, 2); break;
        case 'inv': res = 1 / val; break;
        case 'fact': res = factorial(val); break;
        case 'abs': res = Math.abs(val); break;
        case 'sign': res = val * -1; break;
        case 'pi': setDisplay(Math.PI.toString()); return;
        case 'e': setDisplay(Math.E.toString()); return;
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
            <h1 className="text-xs sm:text-lg font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent uppercase">
              CHRONOFLOW
            </h1>
          </Link>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center whitespace-nowrap">
           <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.1em] md:tracking-[0.3em] text-[7px] md:text-[10px] px-2 md:px-6 py-1 font-black">
             Precision Hub
           </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest gap-2 h-8 px-2 md:px-3">
              <ArrowLeft className="w-3 h-3" /> <span className="hidden min-[480px]:inline">Back</span>
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 lg:gap-20">
          
          <div className="flex-grow max-w-md text-center md:text-left space-y-6 pt-4 order-2 md:order-1">
            <div className="space-y-4">
              <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-[0.4em] text-[9px] px-3 py-1 font-black">
                Mission-Critical Logic
              </Badge>
              <h2 className="text-3xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.85]">
                Scientific <span className="text-primary">Inference</span> Engine
              </h2>
              <p className="text-muted-foreground text-xs md:text-base leading-relaxed font-medium">
                Advanced mathematical compute layer with support for hyperbolic functions, precision logarithms, and high-fidelity physics constants.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Binary className="w-4 h-4 text-primary" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Instruction Set</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Full support for transcendental and hyperbolic operations.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Atom className="w-4 h-4 text-accent" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Constants Cache</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Pre-loaded Speed of Light (c) and Euler's Number (e).</p>
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
              </div>
            </div>
          </div>

          <div className="w-full max-w-[420px] flex flex-col gap-4 order-1 md:order-2">
            <div className="w-full glass-card !p-0 overflow-hidden shadow-2xl border-border/40">
              <div className="bg-black/5 dark:bg-black/20 p-4 text-right space-y-1 border-b border-border/40 min-h-[90px] flex flex-col justify-end">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex gap-1.5">
                    <Badge variant="outline" className={cn("text-[7px] px-1.5 py-0 h-3.5 uppercase font-black", isRadians ? "text-primary border-primary/20" : "text-muted-foreground")}>RAD</Badge>
                    <Badge variant="outline" className={cn("text-[7px] px-1.5 py-0 h-3.5 uppercase font-black", !isRadians ? "text-primary border-primary/20" : "text-muted-foreground")}>DEG</Badge>
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50 h-3 truncate max-w-[200px]">
                    {expression}
                  </div>
                </div>
                <div className="text-2xl font-black tracking-tight tabular-nums overflow-hidden text-ellipsis">
                  {display}
                </div>
              </div>

              <div className="flex border-b border-border/20 bg-muted/30">
                <button onClick={() => setIsRadians(!isRadians)} className="flex-1 py-1.5 text-[7px] font-black uppercase tracking-widest hover:bg-white/5 border-r border-border/10 transition-colors">
                  {isRadians ? 'Set Degrees' : 'Set Radians'}
                </button>
                <button onClick={() => setIsScientific(!isScientific)} className="flex-1 py-1.5 text-[7px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors">
                  {isScientific ? 'Standard' : 'Scientific'}
                </button>
              </div>

              <div className="p-0.5 grid grid-cols-5 gap-0.5 bg-muted/10">
                {isScientific && (
                  <>
                    <CalcButton onClick={() => handleScientific('sin')} className="text-primary/70 text-[10px]">sin</CalcButton>
                    <CalcButton onClick={() => handleScientific('cos')} className="text-primary/70 text-[10px]">cos</CalcButton>
                    <CalcButton onClick={() => handleScientific('tan')} className="text-primary/70 text-[10px]">tan</CalcButton>
                    <CalcButton onClick={() => handleScientific('log')} className="text-primary/70 text-[10px]">log</CalcButton>
                    <CalcButton onClick={() => handleScientific('ln')} className="text-primary/70 text-[10px]">ln</CalcButton>
                    
                    <CalcButton onClick={() => handleScientific('sinh')} className="text-accent/70 text-[9px]">sinh</CalcButton>
                    <CalcButton onClick={() => handleScientific('cosh')} className="text-accent/70 text-[9px]">cosh</CalcButton>
                    <CalcButton onClick={() => handleScientific('tanh')} className="text-accent/70 text-[9px]">tanh</CalcButton>
                    <CalcButton onClick={() => handleScientific('log2')} className="text-accent/70 text-[9px]">log2</CalcButton>
                    <CalcButton onClick={() => handleScientific('inv')} className="text-accent/70 text-[10px]">1/x</CalcButton>

                    <CalcButton onClick={() => handleScientific('asin')} className="text-muted-foreground text-[8px]">asin</CalcButton>
                    <CalcButton onClick={() => handleScientific('acos')} className="text-muted-foreground text-[8px]">acos</CalcButton>
                    <CalcButton onClick={() => handleScientific('atan')} className="text-muted-foreground text-[8px]">atan</CalcButton>
                    <CalcButton onClick={() => handleScientific('pi')} className="text-muted-foreground text-[10px]">π</CalcButton>
                    <CalcButton onClick={() => handleScientific('e')} className="text-muted-foreground text-[10px]">e</CalcButton>

                    <CalcButton onClick={() => handleScientific('sqrt')} className="text-primary/70 text-[10px]">√</CalcButton>
                    <CalcButton onClick={() => handleScientific('pow2')} className="text-primary/70 text-[10px]">x²</CalcButton>
                    <CalcButton onClick={() => handleOperator('^')} className="text-primary/70 text-[10px]">xʸ</CalcButton>
                    <CalcButton onClick={() => handleScientific('abs')} className="text-primary/70 text-[10px]">|x|</CalcButton>
                    <CalcButton onClick={() => handleScientific('fact')} className="text-primary/70 text-[10px]">n!</CalcButton>
                  </>
                )}
                <CalcButton onClick={clear} className="bg-destructive/10 text-destructive font-black text-[10px]">AC</CalcButton>
                <CalcButton onClick={() => setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')} className="bg-muted/30 text-[10px]">C</CalcButton>
                <CalcButton onClick={() => handleScientific('sign')} className="bg-muted/30 text-[10px]">+/-</CalcButton>
                <CalcButton onClick={() => handleOperator('mod')} className="bg-accent/10 text-accent text-[10px]">mod</CalcButton>
                <CalcButton onClick={() => handleOperator('/')} className="bg-accent/10 text-accent text-[10px]">÷</CalcButton>

                {[7,8,9].map(n => <CalcButton key={n} onClick={() => handleNumber(n.toString())}>{n}</CalcButton>)}
                <CalcButton onClick={() => handleMemory('MC')} className="bg-muted/30 text-[9px]">MC</CalcButton>
                <CalcButton onClick={() => handleOperator('*')} className="bg-accent/10 text-accent text-[10px]">×</CalcButton>
                
                {[4,5,6].map(n => <CalcButton key={n} onClick={() => handleNumber(n.toString())}>{n}</CalcButton>)}
                <CalcButton onClick={() => handleMemory('MR')} className="bg-muted/30 text-[9px]">MR</CalcButton>
                <CalcButton onClick={() => handleOperator('-')} className="bg-accent/10 text-accent text-[10px]">-</CalcButton>
                
                {[1,2,3].map(n => <CalcButton key={n} onClick={() => handleNumber(n.toString())}>{n}</CalcButton>)}
                <CalcButton onClick={() => handleMemory('M+')} className="bg-muted/30 text-[9px]">M+</CalcButton>
                <CalcButton onClick={() => handleOperator('+')} className="bg-accent/10 text-accent text-[10px]">+</CalcButton>
                
                <CalcButton onClick={() => handleNumber('0')} className="col-span-2">0</CalcButton>
                <CalcButton onClick={() => handleNumber('.')}>.</CalcButton>
                <CalcButton onClick={calculate} className="bg-primary text-primary-foreground font-black col-span-2 text-[10px]">=</CalcButton>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card !p-3 border-border/40">
                <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1 mb-2">
                  <History className="w-2.5 h-2.5" /> Registry
                </span>
                <div className="space-y-1">
                  {history.slice(0, 2).map((item, i) => (
                    <p key={i} className="text-[9px] font-mono text-muted-foreground/80 truncate border-l border-primary/20 pl-1.5">{item}</p>
                  ))}
                </div>
              </div>
              <div className="glass-card !p-3 border-accent/20 bg-accent/5">
                <span className="text-[7px] font-black uppercase tracking-widest text-accent flex items-center gap-1 mb-2">
                  <Database className="w-2.5 h-2.5" /> Parameters
                </span>
                <div className="space-y-1 text-[8px] font-bold">
                  <div className="flex justify-between">
                    <span className="opacity-40 uppercase">Mode</span>
                    <span className="text-accent">{isRadians ? 'RAD' : 'DEG'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-40 uppercase">Mem</span>
                    <span className="text-accent truncate max-w-[40px]">{formatResult(memory)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 glass border-t border-border/40 text-center">
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
        "h-12 flex items-center justify-center text-xs font-bold transition-all active:bg-white/10 active:scale-95 rounded-sm focus:outline-none focus:bg-transparent select-none",
        className
      )}
    >
      {children}
    </button>
  );
}
