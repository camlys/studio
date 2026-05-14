"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Share2, Bookmark, Zap, Activity, Coins, Landmark, Target, Terminal, Globe, Wallet, BarChart3, TrendingUp, PieChart, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The Masterclass on Fiscal EMI Inference: The Science of Amortized Debt Synchronization",
  "image": "https://picsum.photos/seed/emi-master/1200/630",
  "author": {
    "@type": "Organization",
    "name": "Fiscal Intelligence Unit"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Camly Inc",
    "logo": {
      "@type": "ImageObject",
      "url": "https://calculator.camly.org/logo.png"
    }
  },
  "datePublished": "2024-11-15",
  "description": "An exhaustive, high-authority whitepaper exploring loan amortization algorithms, reducing balance interest mathematics, and fiscal synchronization protocols."
};

export default function EMIMasterclass() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 h-1.5 bg-primary w-full z-[60] origin-left animate-in fade-in" style={{ transform: 'scaleX(0.02)' }} />

      <nav className="relative z-50 glass border-b border-border h-14 flex items-center px-4 md:px-8 justify-between">
        <Link href="/blog" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Back to Insights Hub</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Share2 className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Bookmark className="w-4 h-4" /></Button>
          <Link href="/emi-calculator">
             <Button size="sm" className="bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-widest px-4">Launch Fiscal Engine</Button>
          </Link>
        </div>
      </nav>

      <article className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <header className="space-y-8 mb-24 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 font-black text-[9px] tracking-widest">FISCAL SCIENCE</Badge>
            <Badge variant="outline" className="font-black text-[9px] tracking-widest uppercase">Exhaustive Authority Whitepaper</Badge>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] md:leading-[0.85] mb-8">
            The Science of <span className="text-primary">Fiscal</span> EMI Sync
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed italic border-l-8 border-primary/30 pl-8 py-6 max-w-4xl mx-auto lg:mx-0">
            "Debt is not a burden when it is synchronized. To calculate an EMI is to master the temporal flow of capital through the grid of compound amortization."
          </p>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 pt-12 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-2xl">
                <Coins className="w-8 h-8" />
              </div>
              <div className="text-[12px] uppercase font-black tracking-[0.2em] text-left">
                <div className="text-foreground">Fiscal Intelligence</div>
                <div className="text-muted-foreground">Capital Records Division</div>
              </div>
            </div>
            <Separator orientation="vertical" className="hidden lg:block h-12 mx-6" />
            <div className="flex gap-12">
              <div className="flex flex-col gap-1 items-center lg:items-start">
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Article Depth</span>
                <span className="text-sm font-bold flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> Unabridged Read</span>
              </div>
              <div className="flex flex-col gap-1 items-center lg:items-start">
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Authority Level</span>
                <span className="text-sm font-bold text-accent uppercase tracking-[0.2em]">FINANCIAL STANDARD</span>
              </div>
            </div>
          </div>
        </header>

        <section className="prose prose-invert prose-primary max-w-none space-y-24 text-muted-foreground text-lg md:text-2xl leading-relaxed">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-7xl font-black text-foreground tracking-tight leading-none">1. The Axiom of Amortization</h2>
            <p>At the intersection of time and capital lies the concept of amortization—the systematic reduction of a financial liability over a discrete temporal window. An Equated Monthly Installment (EMI) is not a static payment; it is a dynamic vector that redistributes the mass of a loan between principal and interest with absolute mathematical parity.</p>
            <p>To master EMI calculation, one must move beyond the basic periodic payment and understand the reducing balance method. Unlike simple interest, which scales linearly, amortized interest is a decaying curve. In the early stages of a loan's lifecycle, the interest component dominates the monthly payload. As the principal mass is eroded, the ratio shifts, allowing the principal repayment to accelerate toward the target maturity date.</p>
            <div className="glass p-12 rounded-[64px] border-primary/20 bg-primary/5 my-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Activity className="w-32 h-32 text-primary" />
              </div>
              <h4 className="text-2xl font-black text-foreground mb-6 uppercase tracking-widest">The Fiscal Constant</h4>
              <p className="text-lg opacity-90 leading-relaxed max-w-2xl">Ensuring that every currency unit is synchronized correctly across the entire repayment horizon for ultimate fiscal fidelity.</p>
            </div>
          </div>

          <div className="space-y-12">
             <h2 className="text-4xl md:text-7xl font-black text-foreground tracking-tight leading-none">2. The Periodic Payment Algorithm</h2>
             <p>The standard EMI algorithm is a derivation of the present value of an ordinary annuity. The formula represents a weighted average of debt service: E = [P x r x (1+r)^n] / [(1+r)^n - 1], where P is the principal origin, r is the periodic interest rate, and n is the total number of monthly intervals. This equation ensures that the borrower provides a constant payment stream while the underlying balance is handled with precision.</p>
             <p>At Camly, our engine utilizes this high-fidelity protocol as the baseline. By recalibrating the periodic rate to account for monthly compounding vs daily rests, we achieve a fiscal dashboard that aligns with actual bank ledger entries across global financial institutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
            <div className="glass p-10 rounded-[40px] border-border group hover:border-primary/50 transition-all">
              <TrendingUp className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-foreground font-black text-2xl mb-4 uppercase tracking-tighter">Reducing Balance</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Mapping the interest payload to the remaining principal mass requires a piecewise approach that respects the logarithmic decay of total debt over time.
              </p>
            </div>
            <div className="glass p-10 rounded-[40px] border-border group hover:border-accent/50 transition-all">
              <PieChart className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-foreground font-black text-2xl mb-4 uppercase tracking-tighter">Component Sync</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Our inference engine handles the complex shift between interest and principal, identifying exactly when your repayments cross the 'Fiscal Tipping Point'.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <h2 className="text-3xl md:text-6xl font-black text-foreground tracking-tight">3. The Mathematics of Prepayment Velocity</h2>
            <p>Precision in EMI calculation must account for 'prepayment drift.' When an individual injects additional capital into the principal pool, the entire amortization schedule undergoes a radical recalibration. This injection increases the 'velocity' of the loan's erosion, effectively shortening the temporal horizon or reducing the monthly payload density.</p>
            <p>Our **Fiscal Inference Engine** treats these injections as mission-critical coordinates. Users can track their progress through varying prepayment protocols, ensuring that their total interest burden is always minimized relative to their current capital state. This level of foresight is what separates professional utility tools from basic web calculators.</p>
          </div>

          <div className="p-12 bg-muted/20 border-l-8 border-primary rounded-r-[48px] my-20">
            <h4 className="text-foreground font-black mb-6 uppercase tracking-widest text-xs flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Technical Specification
            </h4>
            <p className="text-lg italic leading-relaxed text-foreground/80">
              "The EMI algorithm is a geometric series summation. If R is the repayment factor and T is the tenure vector, then the aggregate metric must preserve the net present value of all future cash flows equal to the initial principal mass."
            </p>
          </div>

          <div className="space-y-12 text-center">
            <h3 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">Synchronize Your Capital</h3>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
              Precision is the ultimate form of respect for your financial future. Experience the most accurate fiscal computation suite available today.
            </p>
            <div className="pt-12">
              <Link href="/emi-calculator">
                <Button className="w-full md:w-fit h-20 bg-primary text-primary-foreground font-black text-xl uppercase tracking-[0.2em] rounded-[32px] shadow-2xl hover:scale-[1.05] transition-all group px-16">
                  Launch the Fiscal Engine
                  <Zap className="ml-4 w-7 h-7 group-hover:fill-current transition-all" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-48 pt-24 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-16">
            <div className="space-y-4 text-center md:text-left">
              <p className="text-[14px] font-black uppercase tracking-[0.5em] text-primary">Chief Fiscal Lead</p>
              <p className="text-3xl font-black">Fiscal Intelligence Unit</p>
              <p className="text-base text-muted-foreground">© 2024 Camly Inc • calculator.camly.org • Defining Capital Velocity</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
               <Badge variant="outline" className="text-[11px] uppercase font-bold tracking-widest px-8 py-4 flex items-center gap-2 border-primary/20">
                 <ShieldCheck className="w-4 h-4 text-primary" /> Capital Registry: SECURE
               </Badge>
               <Badge variant="outline" className="text-[11px] uppercase font-bold tracking-widest px-8 py-4 flex items-center gap-2 border-accent/20">
                 <Globe className="w-4 h-4 text-accent" /> Global Parity: ACTIVE
               </Badge>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
