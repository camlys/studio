"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Share2, Bookmark, CheckCircle, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The Ultimate Guide to Chronological Computation",
  "image": "https://picsum.photos/seed/chrono-guide/1200/630",
  "author": {
    "@type": "Organization",
    "name": "ChronoFlow Editorial"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ChronoFlow",
    "logo": {
      "@type": "ImageObject",
      "url": "https://calculator.camly.org/logo.png"
    }
  },
  "datePublished": "2024-05-20",
  "description": "Explore the science behind high-precision time tracking and why every second counts in the modern era."
};

export default function UltimateGuideArticle() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Progress Bar (Visual Hack) */}
      <div className="fixed top-0 left-0 h-1 bg-primary w-full z-[60] origin-left animate-in fade-in" style={{ transform: 'scaleX(0.4)' }} />

      <nav className="relative z-50 glass border-b border-white/10 h-14 flex items-center px-4 md:px-8 justify-between">
        <Link href="/blog" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Back to Insights</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Share2 className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Bookmark className="w-4 h-4" /></Button>
          <Link href="/">
             <Button size="sm" className="bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-widest px-4">Open Calculator</Button>
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <header className="space-y-6 mb-16">
          <div className="flex gap-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Chronology</Badge>
            <Badge variant="outline">Advanced Guide</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] md:leading-[0.9]">
            The Ultimate Guide to <span className="text-primary">Chronological Computation</span> and High-Precision Age Calculation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-6 py-2">
            "Time is the most valuable coin in your life. You and you alone will determine how that coin will be spent." 
          </p>
        </header>

        <section className="prose prose-invert prose-primary max-w-none space-y-8 text-muted-foreground text-sm md:text-base leading-loose font-body">
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">1. The Philosophy of the Chronological Interface</h2>
          <p>Chronological computation bridges the gap between PASSED time and LIVED time.</p>
          <div className="pt-8">
            <Link href="/">
              <Button className="w-full h-14 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-2xl neon-glow">
                Launch the ChronoFlow Engine
              </Button>
            </Link>
          </div>
        </section>

        <footer className="mt-24 pt-12 border-t border-white/10">
          <p className="text-sm font-bold">ChronoFlow Editorial Team</p>
        </footer>
      </article>
    </div>
  );
}
