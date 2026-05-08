"use client";

import React from 'react';
import Link from 'next/link';
import { Scale, ArrowLeft, Clock, ShieldCheck, Zap, Info, AlertCircle, FileText, Landmark, Globe, Hammer, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const termsSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "ChronoFlow Terms of Sync",
  "description": "Comprehensive legal and operational terms for the ChronoFlow High-Precision Chronological Engine.",
  "publisher": {
    "@type": "Organization",
    "name": "ChronoFlow Operations"
  }
};

export default function TermsOfSyncPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
      />
      
      <nav className="sticky top-0 z-50 glass border-b border-border h-14 flex items-center px-4 md:px-8 justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Back to Engine</span>
        </Link>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-widest text-[9px] px-3 py-1">
            Agreement v2.1.0 Active
          </Badge>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <header className="space-y-6 mb-16">
          <div className="flex gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20">Legal Framework</Badge>
            <Badge variant="outline">Service Level Agreement</Badge>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.95] md:leading-[0.85]">
            The ChronoFlow <span className="text-primary">Terms of Sync</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-6 py-2">
            "By engaging with the ChronoFlow Engine, you enter into a synchronization agreement based on mathematical precision and mutual respect for data sovereignty."
          </p>
          <div className="flex items-center gap-6 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white">
                <Scale className="w-6 h-6" />
              </div>
              <div className="text-[10px] uppercase font-black tracking-widest">
                <div className="text-foreground">Legal Operations Team</div>
                <div className="text-muted-foreground">Compliance & Ethics Division</div>
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Effective Date</span>
              <span className="text-xs font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> June 01, 2024</span>
            </div>
          </div>
        </header>

        <section className="prose prose-invert prose-primary max-w-none space-y-12 text-muted-foreground text-sm md:text-lg leading-relaxed">
          <div className="glass p-8 md:p-12 border-primary/20 bg-primary/5 rounded-[40px] mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight mt-0 mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6" /> Agreement Architecture
            </h2>
            <p className="text-foreground font-medium mb-4">
              These Terms of Sync ("Agreement") govern your access to and use of the ChronoFlow high-precision chronological engine, website, and related AI services. 
            </p>
            <p className="text-sm opacity-80 leading-relaxed">
              By accessing the Engine, you confirm your acceptance of these terms. If you do not agree to the synchronization protocol defined herein, you must cease all interaction with the platform immediately.
            </p>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">1. Definitions of Synchronization</h2>
          <p>
            To ensure absolute clarity in our high-precision environment, the following definitions apply:
          </p>
          <ul className="space-y-4 list-none p-0">
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <span className="text-[10px] font-black">01</span>
              </div>
              <div>
                <strong className="text-foreground">The Engine:</strong> The proprietary chronological computation logic, including but not limited to the `calculateAll` function, zodiac mapping algorithms, and real-time ticker synchronization.
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <span className="text-[10px] font-black">02</span>
              </div>
              <div>
                <strong className="text-foreground">Sync State:</strong> The active computational process where user-provided date data is processed through the Engine to generate high-precision chronological metrics.
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <span className="text-[10px] font-black">03</span>
              </div>
              <div>
                <strong className="text-foreground">Precision Feed:</strong> The live-updating data stream presented in the dashboard, showing increments of time (years, months, days, hours, minutes, seconds).
              </div>
            </li>
          </ul>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">2. Scope of Service & precision Guarantee</h2>
          <p>
            ChronoFlow provides a specialized chronological utility. While we strive for "atomic-level" precision, users must acknowledge the inherent complexities of the Gregorian calendar and leap year paradoxes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            <div className="glass p-8 rounded-3xl border-border">
              <Hammer className="w-8 h-8 text-primary mb-4" />
              <h4 className="text-foreground font-black mb-2 text-xl tracking-tight">Functional Availability</h4>
              <p className="text-sm opacity-80 leading-relaxed">We aim for 99.9% uptime of our high-precision services. Maintenance windows are typically scheduled during periods of low global traffic.</p>
            </div>
            <div className="glass p-8 rounded-3xl border-border">
              <Globe className="w-8 h-8 text-accent mb-4" />
              <h4 className="text-foreground font-black mb-2 text-xl tracking-tight">Universal Accessibility</h4>
              <p className="text-sm opacity-80 leading-relaxed">The Engine is accessible globally; however, precision metrics are calculated based on UTC and standard astronomical algorithms.</p>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">3. User Responsibilities & Data Integrity</h2>
          <p>
            Users are the primary architects of their own chronological insights. To ensure the integrity of the Sync:
          </p>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>Input Accuracy:</strong> Users are responsible for providing accurate date and time data. The Engine's precision is directly tied to the validity of user input.</li>
            <li><strong>Ethical Use:</strong> The Engine must not be used for any purpose that violates international law, including the creation of fraudulent identity documents or misleading chronological records.</li>
            <li><strong>System Integrity:</strong> Any attempt to reverse-engineer the ChronoFlow core logic or disrupt the real-time ticker synchronization is strictly prohibited.</li>
          </ul>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">4. Intellectual Property & The Algorithm</h2>
          <p>
            The "ChronoFlow" brand, the UI design, the specific implementation of the `DateInput` and `ResultCard` components, and the proprietary "Fun Fact" AI prompt engineering are the exclusive intellectual property of ChronoFlow Operations.
          </p>
          <div className="border-l-4 border-primary pl-8 py-4 bg-primary/5 my-8">
            <h3 className="text-xl font-black text-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Proprietary Protection
            </h3>
            <p className="text-sm opacity-90">
              You are granted a limited, non-exclusive, non-transferable license to access the Engine for personal or professional calculation purposes. Commercial redistribution of the ChronoFlow Engine logic is forbidden without explicit written consent.
            </p>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">5. AI Synchronization & Genkit Logic</h2>
          <p>
            The use of Google Genkit and LLM-driven "Fun Facts" is subject to the following synchronization terms:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li><strong>Non-Deterministic Output:</strong> AI-generated facts are provided "as-is" for entertainment and supplementary insight. We do not guarantee the historical or scientific accuracy of every AI-generated datum.</li>
            <li><strong>Safety Filtering:</strong> All AI requests are processed through industry-standard safety filters. Attempts to bypass these filters or generate harmful content via the Engine will result in immediate termination of access.</li>
            <li><strong>Stateless Interaction:</strong> As detailed in our Privacy Protocol, AI interactions are stateless. Your "Sync State" with the AI is terminated immediately upon completion of the generation task.</li>
          </ol>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">6. Limitation of Liability</h2>
          <p>
            Time is an absolute constant, but software is a human construct. ChronoFlow Operations shall not be liable for:
          </p>
          <ul className="list-none p-0 space-y-4">
            <li className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-1" />
              <span><strong>Chronological Drift:</strong> Minor discrepancies caused by variations in system clocks or browser-level JavaScript execution.</span>
            </li>
            <li className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-1" />
              <span><strong>Reliance on Data:</strong> Decisions made based on chronological metrics provided by the Engine (e.g., retirement planning, legal eligibility). The Engine is a tool for insight, not a certified legal or financial advisor.</span>
            </li>
            <li className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-1" />
              <span><strong>Service Interruption:</strong> Any loss of data or emotional distress caused by the temporary unavailability of the real-time Precision Feed.</span>
            </li>
          </ul>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">7. Modifications to the Protocol</h2>
          <p>
            We reserve the right to update the Terms of Sync as the Engine evolves. Major updates (e.g., version jumps from v2.x to v3.x) will be notified via a system alert on the main dashboard. Continued use of the Engine following such updates constitutes acceptance of the new protocol.
          </p>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">8. Termination of Sync</h2>
          <p>
            ChronoFlow Operations reserves the right to terminate your access to the Engine at our sole discretion, without notice, for conduct that we believe violates these Terms of Sync or is harmful to other users of the platform.
          </p>

          <Separator className="my-16 opacity-10" />

          <div className="space-y-8">
            <h3 className="text-2xl font-black text-foreground tracking-tight">Final Synchronization</h3>
            <p>
              By proceeding, you acknowledge that you have read, understood, and agreed to be bound by the ChronoFlow Terms of Sync. Together, we maintain the precision of the chronological record.
            </p>
            <div className="pt-10 flex flex-col md:flex-row gap-4">
              <Link href="/">
                <Button className="w-full md:w-fit h-16 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl px-12">
                  Accept & Synchronize
                </Button>
              </Link>
              <Link href="/privacy-protocol">
                <Button variant="outline" className="w-full md:w-fit h-16 border-border font-black text-xs uppercase tracking-widest rounded-2xl px-12">
                  View Privacy Protocol
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-32 pt-16 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Chief Legal Officer</p>
              <p className="text-lg font-bold">ChronoFlow Operations</p>
            </div>
            <div className="flex gap-4">
               <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest px-4 py-2 flex items-center gap-2">
                 <Landmark className="w-3.5 h-3.5" /> Jurisdictional Guard
               </Badge>
               <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest px-4 py-2 flex items-center gap-2">
                 <FileText className="w-3.5 h-3.5" /> Compliance v2.1
               </Badge>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
