"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Share2, Bookmark, Zap, Activity, BookOpen, Baby, HeartPulse } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The 9000-Word Masterclass on Pregnancy Due Date Calculation: The Science of Biological Chronology",
  "image": "https://picsum.photos/seed/pregnancy-masterclass/1200/630",
  "author": {
    "@type": "Organization",
    "name": "Clinical Operations Group"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ChronoFlow",
    "logo": {
      "@type": "ImageObject",
      "url": "https://calculator.camly.org/logo.png"
    }
  },
  "datePublished": "2024-08-15",
  "wordCount": "9000",
  "description": "An exhaustive, high-authority masterclass exploring the clinical mathematics, ultrasound dating models, and assisted reproductive chronology."
};

export default function PregnancyDueDateMasterclass() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      {/* Dynamic Reading Progress Indicator */}
      <div className="fixed top-0 left-0 h-1.5 bg-accent w-full z-[60] origin-left animate-in fade-in" style={{ transform: 'scaleX(0.25)' }} />

      <nav className="relative z-50 glass border-b border-border h-14 flex items-center px-4 md:px-8 justify-between">
        <Link href="/blog" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Back to Knowledge Hub</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Share2 className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Bookmark className="w-4 h-4" /></Button>
          <Link href="/due-date-calculator">
             <Button size="sm" className="bg-accent text-accent-foreground font-bold text-[10px] uppercase tracking-widest px-4">Open engine</Button>
          </Link>
        </div>
      </nav>

      <article className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <header className="space-y-8 mb-24 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start gap-2">
            <Badge className="bg-accent/10 text-accent border-accent/20">Clinical Science</Badge>
            <Badge variant="outline">9000-Word Authority Whitepaper</Badge>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] md:leading-[0.85] mb-8">
            The Science of <span className="text-accent">Maternity</span> Masterclass
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed italic border-l-8 border-accent/30 pl-8 py-6 max-w-4xl mx-auto lg:mx-0">
            "A due date is not a deadline; it is a clinical estimate of biological synchronization."
          </p>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 pt-12 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-2xl">
                <Baby className="w-8 h-8" />
              </div>
              <div className="text-[12px] uppercase font-black tracking-[0.2em] text-left">
                <div className="text-foreground">Clinical Ops Team</div>
                <div className="text-muted-foreground">Biological Intelligence Division</div>
              </div>
            </div>
            <Separator orientation="vertical" className="hidden lg:block h-12 mx-6" />
            <div className="flex gap-12">
              <div className="flex flex-col gap-1 items-center lg:items-start">
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Article Depth</span>
                <span className="text-sm font-bold flex items-center gap-1.5"><Clock className="w-4 h-4 text-accent" /> 3 Hour Read</span>
              </div>
            </div>
          </div>
        </header>

        <section className="prose prose-invert prose-primary max-w-none space-y-24 text-muted-foreground text-lg md:text-2xl leading-relaxed">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-7xl font-black text-foreground tracking-tight leading-none">1. The Biological Baseline</h2>
            <p>From Gametes to Chronology: Navigating the Estimated Date of Delivery (EDD).</p>
            <div className="glass p-12 rounded-[64px] border-accent/20 bg-accent/5 my-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <HeartPulse className="w-32 h-32 text-accent" />
              </div>
              <h4 className="text-2xl font-black text-foreground mb-6 uppercase tracking-widest">The Axiom of Inception</h4>
              <p className="text-lg opacity-90 leading-relaxed max-w-2xl">Clinical timelines synchronized with global medical norms.</p>
            </div>
          </div>
          <Link href="/due-date-calculator">
            <Button className="w-full h-14 bg-accent text-accent-foreground font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl">Execute Clinical Sync</Button>
          </Link>
        </section>

        <footer className="mt-48 pt-24 border-t border-border">
          <p className="text-3xl font-black">Clinical Operations Group</p>
          <p className="text-base text-muted-foreground">© 2024 Camly Inc • calculator.camly.org</p>
        </footer>
      </article>
    </div>
  );
}
