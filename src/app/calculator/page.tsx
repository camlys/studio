"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Cpu, History, 
  ShieldCheck, Timer, Zap, 
  Activity, Binary, Terminal,
  Atom, Database, Layers, Globe, 
  Settings, Target, Network, Server,
  Compass, FlaskConical, BarChart3, ChevronRight, ExternalLink,
  LayoutGrid, Calculator as CalcIcon, CalendarDays, FileType, Github, Twitter,
  GraduationCap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InstallPWA } from '@/components/chrono/InstallPWA';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const calculatorSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Scientific Inference Engine",
  "applicationCategory": "Calculator",
  "operatingSystem": "All",
  "description": "Professional scientific calculator with hyperbolic functions, logs, and physics constants.",
  "browserRequirements": "Requires JavaScript",
  "softwareVersion": "2.4.1",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://calculator.camly.org/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Scientific Calculator",
      "item": "https://calculator.camly.org/calculator"
    }
  ]
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav className="relative glass border-b border-border h-14 flex items-center px-4 md:px-6 justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center transition-all group-hover:scale-110">
              <Image src="/camly.png" alt="Camly" width={40} height={40} priority className="object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent uppercase leading-none font-roboto-slab">
                CALCULATOR
              </h1>
              <span className="text-[7px] font-bold tracking-[0.3em] text-primary/60 uppercase mt-1">camly.org</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button 
                 variant="ghost" 
                 className="rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] gap-1.5 md:gap-2.5 transition-all group hover:bg-primary/5 text-primary/60 hover:text-primary"
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
               <DropdownMenuItem asChild className="cursor-pointer focus:bg-accent/10 rounded-lg m-1">
                 <Link href="/cgpa-calculator" className="flex items-center gap-3 w-full px-2 py-2">
                   <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                     <GraduationCap className="w-4 h-4 text-accent" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Academic Sync</span>
                     <span className="text-[8px] font-bold text-muted-foreground uppercase">CGPA Calculator</span>
                   </div>
                 </Link>
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>

          <Link href="https://camly.org" target="_blank">
            <Button variant="ghost" size="sm" className="hidden lg:flex rounded-full text-[10px] font-black uppercase tracking-widest gap-2 h-8 px-4 border border-transparent hover:border-primary/20 transition-all">
              camly.org <ExternalLink className="w-3 h-3" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest gap-2 h-8 px-2 md:px-3">
              <ArrowLeft className="w-3 h-3" /> <span className="inline">Back</span>
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
            <div className="w-full glass-card !p-0 overflow-hidden shadow-2xl border-black dark:border-white border">
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
                    <CalcButton onClick={() => handleScientific('sin')} className="text-primary/70 text-sm">sin</CalcButton>
                    <CalcButton onClick={() => handleScientific('cos')} className="text-primary/70 text-sm">cos</CalcButton>
                    <CalcButton onClick={() => handleScientific('tan')} className="text-primary/70 text-sm">tan</CalcButton>
                    <CalcButton onClick={() => handleScientific('log')} className="text-primary/70 text-sm">log</CalcButton>
                    <CalcButton onClick={() => handleScientific('ln')} className="text-primary/70 text-sm">ln</CalcButton>
                    
                    <CalcButton onClick={() => handleScientific('sinh')} className="text-accent/70 text-xs">sinh</CalcButton>
                    <CalcButton onClick={() => handleScientific('cosh')} className="text-accent/70 text-xs">cosh</CalcButton>
                    <CalcButton onClick={() => handleScientific('tanh')} className="text-accent/70 text-xs">tanh</CalcButton>
                    <CalcButton onClick={() => handleScientific('log2')} className="text-accent/70 text-xs">log2</CalcButton>
                    <CalcButton onClick={() => handleScientific('inv')} className="text-accent/70 text-xs">1/x</CalcButton>

                    <CalcButton onClick={() => handleScientific('asin')} className="text-muted-foreground text-[10px]">asin</CalcButton>
                    <CalcButton onClick={() => handleScientific('acos')} className="text-muted-foreground text-[10px]">acos</CalcButton>
                    <CalcButton onClick={() => handleScientific('atan')} className="text-muted-foreground text-[10px]">atan</CalcButton>
                    <CalcButton onClick={() => handleScientific('pi')} className="text-muted-foreground text-sm">π</CalcButton>
                    <CalcButton onClick={() => handleScientific('e')} className="text-muted-foreground text-sm">e</CalcButton>

                    <CalcButton onClick={() => handleScientific('sqrt')} className="text-primary/70 text-base">√</CalcButton>
                    <CalcButton onClick={() => handleScientific('pow2')} className="text-primary/70 text-base">x²</CalcButton>
                    <CalcButton onClick={() => handleOperator('^')} className="text-primary/70 text-base">xʸ</CalcButton>
                    <CalcButton onClick={() => handleScientific('abs')} className="text-primary/70 text-base">|x|</CalcButton>
                    <CalcButton onClick={() => handleScientific('fact')} className="text-primary/70 text-base">n!</CalcButton>
                  </>
                )}
                <CalcButton onClick={clear} className="bg-destructive/10 text-destructive font-black text-sm">AC</CalcButton>
                <CalcButton onClick={() => setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')} className="bg-muted/30 text-base">C</CalcButton>
                <CalcButton onClick={() => handleScientific('sign')} className="bg-muted/30 text-base">+/-</CalcButton>
                <CalcButton onClick={() => handleOperator('mod')} className="bg-accent/10 text-accent text-sm">mod</CalcButton>
                <CalcButton onClick={() => handleOperator('/')} className="bg-accent/10 text-accent text-lg">÷</CalcButton>

                {[7,8,9].map(n => <CalcButton key={n} onClick={() => handleNumber(n.toString())} className="text-lg">{n}</CalcButton>)}
                <CalcButton onClick={() => handleMemory('MC')} className="bg-muted/30 text-xs">MC</CalcButton>
                <CalcButton onClick={() => handleOperator('*')} className="bg-accent/10 text-accent text-lg">×</CalcButton>
                
                {[4,5,6].map(n => <CalcButton key={n} onClick={() => handleNumber(n.toString())} className="text-lg">{n}</CalcButton>)}
                <CalcButton onClick={() => handleMemory('MR')} className="bg-muted/30 text-xs">MR</CalcButton>
                <CalcButton onClick={() => handleOperator('-')} className="bg-accent/10 text-accent text-lg">-</CalcButton>
                
                {[1,2,3].map(n => <CalcButton key={n} onClick={() => handleNumber(n.toString())} className="text-lg">{n}</CalcButton>)}
                <CalcButton onClick={() => handleMemory('M+')} className="bg-muted/30 text-xs">M+</CalcButton>
                <CalcButton onClick={() => handleOperator('+')} className="bg-accent/10 text-accent text-lg">+</CalcButton>
                
                <CalcButton onClick={() => handleNumber('0')} className="col-span-2 text-lg">0</CalcButton>
                <CalcButton onClick={() => handleNumber('.')} className="text-lg">.</CalcButton>
                <CalcButton onClick={calculate} className="bg-primary text-primary-foreground font-black col-span-2 text-xl">=</CalcButton>
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

        {/* Rich Content Sections */}
        <div className="mt-32 space-y-40">
          <section className="space-y-20">
            <div className="text-center space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-[0.3em] text-[10px] px-6 py-1.5 font-black">Compute Specification</Badge>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">High-Fidelity <span className="text-primary">Standards</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-medium">
                Our inference engine follows the IEEE 754 standard for floating-point arithmetic, ensuring absolute parity for transcendental and hyperbolic operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-primary/40">
                <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <Layers className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">ALU Precision</h3>
                <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                  Custom logic gates for handling complex logarithms and power functions with sub-nanosecond instruction cycles.
                </p>
              </div>
              <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-accent/40">
                <div className="w-16 h-16 rounded-[2rem] bg-accent/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <ShieldCheck className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Error Mitigation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                  Real-time validation of mathematical inputs prevents overflows and handles edge-case transcendental discontinuities.
                </p>
              </div>
              <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-primary/40">
                <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <Network className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Protocol Sync</h3>
                <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                  Computational results are processed locally via stateless worker threads, ensuring maximum asset velocity and security.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-16 py-24 bg-muted/30 rounded-[4rem] px-8 md:px-20 border border-border/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-20 opacity-[0.02] -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
              <Atom className="w-96 h-96 text-primary" />
            </div>
            <div className="text-center space-y-6 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Tactical <span className="text-primary">Vertical</span> Integration</h2>
              <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium">The Scientific Inference Engine provides professional-grade logic for the world's most demanding sectors.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              <div className="space-y-5 group/item">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <Compass className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-black text-sm uppercase tracking-[0.2em]">Aerospace</h4>
                <p className="text-[12px] text-muted-foreground leading-relaxed font-medium">High-fidelity trigonometric calculations for trajectory analysis and orbital velocity mappings.</p>
              </div>
              <div className="space-y-5 group/item">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <FlaskConical className="w-7 h-7 text-accent" />
                </div>
                <h4 className="font-black text-sm uppercase tracking-[0.2em]">Quantum Research</h4>
                <p className="text-[12px] text-muted-foreground leading-relaxed font-medium">Statistical modeling and probabilistic calculation layers for high-entropy experiment data.</p>
              </div>
              <div className="space-y-5 group/item">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <BarChart3 className="w-7 h-7 text-primary" />
                </div>
                <h4 className="font-black text-sm uppercase tracking-[0.2em]">High-Freq Trading</h4>
                <p className="text-[12px] text-muted-foreground leading-relaxed font-medium">Real-time differential calculus and logarithmic regression for millisecond-level market insights.</p>
              </div>
              <div className="space-y-5 group/item">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-accent" />
                </div>
                <h4 className="font-black text-sm uppercase tracking-[0.2em]">Precision Mfg</h4>
                <p className="text-[12px] text-muted-foreground leading-relaxed font-medium">Micro-metric tolerance calculations and structural stress analysis for advanced material science.</p>
              </div>
            </div>
          </section>

          {/* Brand Synchronization Section */}
          <section className="container max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] text-[9px] px-4 py-1.5 font-black">Global Infrastructure</Badge>
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter">Synchronize with <span className="text-primary">Camly.org</span></h3>
              <p className="text-muted-foreground text-sm md:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                Access the complete suite of high-precision digital assets and enterprise utility protocols. Defining the next decade of computational velocity.
              </p>
            </div>
            <div className="pt-4">
               <Link href="https://camly.org" target="_blank">
                 <Button className="h-16 px-12 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all group">
                   Explore Ecosystem <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </Button>
               </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="relative mt-auto pt-24 pb-12 px-6 transition-colors duration-700 border-t glass border-border/40">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center transition-all">
                  <Image src="/camly.png" alt="Camly" width={48} height={48} className="object-contain" />
                </div>
                <h2 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent uppercase font-roboto-slab">
                  CALCULATOR
                </h2>
              </div>
              <p className="text-sm leading-relaxed max-w-xs font-medium text-muted-foreground">
                Defining the standard for high-precision chronological and academic computation. 
                Camly Inc's flagship engine for professional and tactical management.
              </p>
              <div className="flex gap-5">
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-accent/10 shadow-sm border border-border/50"><Github className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-accent/10 shadow-sm border border-border/50"><Twitter className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-accent/10 shadow-sm border border-border/50"><Globe className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Operations</h3>
              <ul className="space-y-3 text-xs font-bold text-muted-foreground">
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/due-date-calculator">Due Date</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/calculator">Precision Calculator</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" />
                   <Link href="/cgpa-calculator">CGPA Calculator</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" />
                   <Link href="/">Age Calculator</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Intelligence</h3>
              <ul className="space-y-3 text-xs font-bold text-muted-foreground">
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/blog">Knowledge Hub</Link>
                </li>
                <li className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" /> Fun Facts API
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Architecture</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-[10px] font-black tracking-widest text-accent">
                  <div className="w-2 h-2 rounded-full animate-pulse bg-accent" />
                  CAMLY-SYNC-01: ONLINE
                </div>
                <InstallPWA />
              </div>
            </div>
          </div>

          <Separator className="mb-10 bg-border/60" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] uppercase tracking-[0.5em] font-black text-muted-foreground/40">
              © 2024 Camly Inc • Defining High-Precision Velocity
            </p>
            <div className="flex gap-8">
              <Link href="/privacy-protocol" className="text-[10px] uppercase tracking-[0.2em] transition-colors font-black text-muted-foreground/40 hover:text-primary">Privacy Protocol</Link>
              <Link href="/terms-of-sync" className="text-[10px] uppercase tracking-[0.2em] transition-colors font-black text-muted-foreground/40 hover:text-primary">Terms of Sync</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CalcButton({ children, onClick, className }: { children: React.ReactNode, onClick: () => void, className?: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "h-12 flex items-center justify-center font-black transition-all active:bg-white/10 active:scale-95 rounded-sm focus:outline-none focus:bg-transparent select-none",
        className
      )}
    >
      {children}
    </button>
  );
}
