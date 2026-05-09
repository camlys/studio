"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Share2, Bookmark, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Zodiac Symbols and the Ancient History of Time",
  "image": "https://picsum.photos/seed/zodiac-history/1200/630",
  "author": {
    "@type": "Organization",
    "name": "History & Culture Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ChronoFlow",
    "logo": {
      "@type": "ImageObject",
      "url": "https://calculator.camly.org/logo.png"
    }
  },
  "datePublished": "2024-05-25",
  "description": "A deep dive into how ancient civilizations mapped the stars to our current chronological systems."
};

export default function ZodiacHistoryArticle() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 h-1 bg-primary w-full z-[60] origin-left animate-in fade-in" style={{ transform: 'scaleX(1.0)' }} />

      <nav className="relative z-50 glass border-b border-border h-14 flex items-center px-4 md:px-8 justify-between">
        <Link href="/blog" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Back to Insights</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Share2 className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Bookmark className="w-4 h-4" /></Button>
          <Link href="/">
             <Button size="sm" className="bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-widest px-4">Open App</Button>
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <header className="space-y-6 mb-16">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.95] md:leading-[0.85]">
            Zodiac Symbols and the <span className="text-primary">Ancient History</span> of Time
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-6 py-2">
            "Before the clock, there was the sky. Before the calendar, there were the stars."
          </p>
        </header>

        <section className="prose prose-invert prose-primary max-w-none space-y-12 text-muted-foreground text-sm md:text-lg leading-relaxed">
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">1. The Primordial Clock</h2>
          <p>Long before the invention of the pendulum or the quartz crystal, human beings looked to the heavens to find order.</p>
          <div className="pt-10">
            <Link href="/">
              <Button className="w-full h-20 bg-primary text-primary-foreground font-black text-lg uppercase tracking-widest rounded-3xl shadow-2xl group">
                Synchronize with Your Personal Stars
                <Sparkles className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        <footer className="mt-32 pt-16 border-t border-border">
          <p className="text-lg font-bold">ChronoFlow Cultural Research Group</p>
        </footer>
      </article>
    </div>
  );
}
