"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Coins, PieChart, Landmark, 
  Download, Zap, ShieldCheck, Database, 
  ExternalLink, LayoutGrid, Calculator as CalcIcon, 
  CalendarDays, Timer, Github, Twitter, ChevronRight,
  Target, BarChart3, FileType, CheckCircle2, TrendingUp,
  GraduationCap, Info, Wallet
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  PieChart as RePieChart, 
  Pie as RePie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as ReTooltip,
  Legend as ReLegend
} from 'recharts';
import { InstallPWA } from '@/components/chrono/InstallPWA';
import { cn } from '@/lib/utils';
import { toPng } from 'html-to-image';
import { format } from 'date-fns';

const emiSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Financial Inference Engine - EMI Calculator",
  "applicationCategory": "Finance",
  "operatingSystem": "All",
  "description": "Professional EMI calculator with amortization schedules and fiscal breakdown analytics.",
  "softwareVersion": "1.0.0",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(5); // in years
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const calculateEMI = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureUnit === 'years' ? tenure * 12 : tenure;
    
    if (r === 0) return p / n;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return emi;
  };

  const emi = calculateEMI();
  const totalMonths = tenureUnit === 'years' ? tenure * 12 : tenure;
  const totalAmount = emi * totalMonths;
  const totalInterest = totalAmount - loanAmount;

  const chartData = [
    { name: 'Principal', value: loanAmount },
    { name: 'Interest', value: totalInterest },
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))'];

  const getAmortizationSchedule = () => {
    let balance = loanAmount;
    const r = interestRate / 12 / 100;
    const schedule = [];

    for (let i = 1; i <= Math.min(totalMonths, 120); i++) { // Cap at 120 months for preview
      const interest = balance * r;
      const principal = emi - interest;
      balance -= principal;
      schedule.push({
        month: i,
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        balance: Math.max(0, balance).toFixed(2)
      });
    }
    return schedule;
  };

  const downloadReport = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        backgroundColor: '#f9f9f9',
      });
      const link = document.createElement('a');
      link.download = `Camly_Fiscal_Report_${format(new Date(), 'yyyyMMdd_HHmm')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(emiSchema) }} />
      
      <nav className="relative z-50 glass border-b border-border h-14 flex items-center px-4 md:px-6 justify-between transition-colors">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center transition-all group-hover:scale-110">
              <Image src="/camly.png" alt="Camly" width={40} height={40} priority className="object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent uppercase font-roboto-slab">
                CALCULATOR
              </h1>
              <span className="text-[7px] font-bold tracking-[0.3em] text-primary/60 uppercase mt-1">camly.org</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest gap-2">
              <ArrowLeft className="w-3 h-3" /> Back
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="mb-10 md:mb-12 space-y-3 text-center min-[480px]:text-left">
          <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] text-[9px] px-3 py-1 font-black">
            Financial Performance Layer
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.85]">
            Fiscal <span className="text-primary">Inference</span> Engine
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-xl mx-auto min-[480px]:mx-0">
            Advanced amortization synchronization for personal loans, mortgages, and high-fidelity debt management.
          </p>
        </div>

        <div className="flex flex-col min-[480px]:flex-row items-start gap-6 md:gap-8 lg:gap-16">
          <div className="w-full min-[480px]:flex-grow space-y-8">
            <div className="glass-card !p-8 border-black dark:border-white border-2 shadow-2xl space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Loan Principal (Origin)</Label>
                  <span className="text-sm font-black text-foreground">₹{loanAmount.toLocaleString()}</span>
                </div>
                <Slider 
                  value={[loanAmount]} 
                  min={10000} 
                  max={10000000} 
                  step={10000} 
                  onValueChange={([v]) => setLoanAmount(v)}
                />
                <div className="flex justify-between text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                  <span>10k</span>
                  <span>1 Cr</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Annual Interest Rate (%)</Label>
                  <span className="text-sm font-black text-foreground">{interestRate}%</span>
                </div>
                <Slider 
                  value={[interestRate]} 
                  min={1} 
                  max={25} 
                  step={0.1} 
                  onValueChange={([v]) => setInterestRate(v)}
                />
                <div className="flex justify-between text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                  <span>1%</span>
                  <span>25%</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Tenure ({tenureUnit.toUpperCase()})</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-foreground mr-2">{tenure}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setTenureUnit(tenureUnit === 'years' ? 'months' : 'years')}
                      className="h-7 text-[8px] font-black uppercase"
                    >
                      Swap Unit
                    </Button>
                  </div>
                </div>
                <Slider 
                  value={[tenure]} 
                  min={1} 
                  max={tenureUnit === 'years' ? 30 : 360} 
                  step={1} 
                  onValueChange={([v]) => setTenure(v)}
                />
                <div className="flex justify-between text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                  <span>1</span>
                  <span>{tenureUnit === 'years' ? '30y' : '360m'}</span>
                </div>
              </div>
            </div>

            <div className="glass-card !p-6 border-border/40">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-6">
                <BarChart3 className="w-4 h-4 text-primary" /> Amortization Preview (First 12 Months)
              </h4>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/10">
                      <TableHead className="text-[9px] font-black uppercase tracking-widest">Month</TableHead>
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-right">Principal</TableHead>
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-right">Interest</TableHead>
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getAmortizationSchedule().slice(0, 12).map((row) => (
                      <TableRow key={row.month} className="border-border/5 hover:bg-muted/5">
                        <TableCell className="text-xs font-bold text-muted-foreground/60">{row.month}</TableCell>
                        <TableCell className="text-xs font-bold text-right">₹{parseFloat(row.principal).toLocaleString()}</TableCell>
                        <TableCell className="text-xs font-bold text-right text-accent">₹{parseFloat(row.interest).toLocaleString()}</TableCell>
                        <TableCell className="text-xs font-bold text-right">₹{parseFloat(row.balance).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Quick Navigation Section */}
            <section className="mt-12 space-y-4">
              <div className="flex items-center gap-2 px-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Quick Navigation</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { name: "Academic Sync", href: "/cgpa-calculator" },
                  { name: "Age Calculator", href: "/" },
                  { name: "Attendance Calculator", href: "/attendance-calculator" },
                  { name: "Calorie Calculator", href: "/calorie-calculator" },
                  { name: "Due Date", href: "/due-date-calculator" },
                  { name: "EMI Calculator", href: "/emi-calculator" },
                  { name: "Scientific Calculator", href: "/calculator" }
                ].map((calc) => (
                  <Link key={calc.name} href={calc.href}>
                    <Button variant="outline" className="w-full justify-start h-10 text-[10px] font-bold uppercase tracking-widest border-black hover:border-primary/40 hover:bg-primary/5 transition-all">
                      {calc.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="w-full min-[480px]:w-[320px] lg:w-[380px] space-y-6 min-[480px]:sticky min-[480px]:top-24">
            <div ref={reportRef} className="space-y-6">
              <div className="glass-card !p-8 border-accent/20 bg-accent/5 text-center relative overflow-hidden group shadow-2xl border-2">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Coins className="w-24 h-24 text-accent" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-accent mb-4 block">Monthly Installment</span>
                <div className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-4 tabular-nums">
                  ₹{Math.round(emi).toLocaleString()}
                </div>
                <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                  <Target className="w-4 h-4" /> Fixed Rate
                  <Separator orientation="vertical" className="h-4 bg-accent/20" />
                  <Zap className="w-4 h-4" /> Real-time Sync
                </div>
              </div>

              <div className="glass-card !p-6 border-border/40 space-y-6">
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <RePie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </RePie>
                      <ReTooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase text-primary tracking-widest block">Principal</span>
                      <p className="text-xs font-black">₹{loanAmount.toLocaleString()}</p>
                   </div>
                   <div className="space-y-1 text-right">
                      <span className="text-[8px] font-black uppercase text-accent tracking-widest block">Total Interest</span>
                      <p className="text-xs font-black">₹{Math.round(totalInterest).toLocaleString()}</p>
                   </div>
                </div>
                <Separator className="bg-border/10" />
                <div className="flex justify-between items-center">
                   <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Total Repayment</span>
                   <p className="text-sm font-black text-foreground">₹{Math.round(totalAmount).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={downloadReport} 
              disabled={isDownloading}
              className="w-full h-12 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-xl hover:scale-[1.02] transition-all group gap-3 border-black border-2"
            >
              <Download className={cn("w-4 h-4", isDownloading && "animate-bounce")} />
              {isDownloading ? 'Capturing...' : 'Download Fiscal Report'}
            </Button>

            <div className="glass-card !p-5 border-primary/20 bg-primary/5 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Database className="w-6 h-6 text-primary" />
               </div>
               <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Fiscal Protocol</span>
                  <p className="text-[10px] font-bold text-foreground leading-relaxed">Local-first inference. Your financial data is never transmitted.</p>
               </div>
            </div>
          </aside>
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
                Defining the standard for high-precision chronological, academic, and fiscal computation. 
                Camly Inc's flagship engine for professional asset management.
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
                   <Link href="/emi-calculator">EMI Calculator</Link>
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
