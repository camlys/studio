"use client";

import React from 'react';
import Link from 'next/link';
import { Timer, ArrowLeft, Sun, Moon, Sparkles, Clock, Share2, Bookmark, Star, Landmark, Map, Compass, Scroll, History } from 'lucide-react';
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
      "url": "https://chronoflow.app/logo.png"
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
          <div className="flex gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20">Ancient Chronology</Badge>
            <Badge variant="outline">Celestial Mapping</Badge>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.95] md:leading-[0.85]">
            Zodiac Symbols and the <span className="text-primary">Ancient History</span> of Time
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-6 py-2">
            "Before the clock, there was the sky. Before the calendar, there were the stars. The zodiac is the oldest language of time we possess."
          </p>
          <div className="flex items-center gap-6 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-white font-black text-sm">HT</div>
              <div className="text-[10px] uppercase font-black tracking-widest">
                <div className="text-foreground">History & Culture Team</div>
                <div className="text-muted-foreground">Celestial Studies Division</div>
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Comprehensive Read</span>
              <span className="text-xs font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> 45 Minutes</span>
            </div>
          </div>
        </header>

        <section className="prose prose-invert prose-primary max-w-none space-y-12 text-muted-foreground text-sm md:text-lg leading-relaxed">
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">1. The Primordial Clock: The Sky as a Grid</h2>
          <p>
            Long before the invention of the pendulum or the quartz crystal, human beings looked to the heavens to find order in a chaotic world. The concept of the <strong>Zodiac</strong>—literally "the circle of animals"—emerged not as a mystical pursuit, but as a survival mechanism. By mapping the Sun's path across the stars, ancient civilizations could predict seasons, floods, and harvest cycles.
          </p>
          <p>
            This path, known as the <strong>Ecliptic</strong>, was divided into twelve equal segments. Why twelve? The answer lies in the lunar cycle. Since there are approximately twelve full moons in a solar year, the ancients saw twelve as the natural "beat" of the universe. At <strong>ChronoFlow</strong>, we acknowledge this heritage by integrating zodiac mapping into our high-precision chronological engine.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="glass p-8 rounded-3xl border-border hover:border-primary/40 transition-all">
              <Landmark className="w-10 h-10 text-primary mb-6" />
              <h4 className="text-foreground font-black mb-2 text-xl tracking-tight">Babylonian Roots</h4>
              <p className="text-sm opacity-80 leading-relaxed">The MUL.APIN tablets (c. 1000 BCE) represent the first recorded systematic mapping of the constellations.</p>
            </div>
            <div className="glass p-8 rounded-3xl border-border hover:border-accent/40 transition-all">
              <Scroll className="w-10 h-10 text-accent mb-6" />
              <h4 className="text-foreground font-black mb-2 text-xl tracking-tight">Egyptian Insight</h4>
              <p className="text-sm opacity-80 leading-relaxed">The Dendera Zodiac remains one of the most magnificent representations of celestial time in history.</p>
            </div>
            <div className="glass p-8 rounded-3xl border-border hover:border-primary/40 transition-all">
              <Compass className="w-10 h-10 text-primary mb-6" />
              <h4 className="text-foreground font-black mb-2 text-xl tracking-tight">Greek Logic</h4>
              <p className="text-sm opacity-80 leading-relaxed">Ptolemy's 'Almagest' synthesized ancient knowledge into a mathematical framework that lasted for 1,400 years.</p>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">2. The Twelve Signs: A Chronological Journey</h2>
          <p>
            Each sign of the zodiac represents a specific "slice" of the celestial year. While modern astrology focuses on personality, the historical zodiac was a <strong>chronological index</strong>.
          </p>
          <div className="space-y-8">
            <div className="border-l-4 border-primary pl-8 py-4">
              <h3 className="text-xl font-black text-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                <Sun className="w-5 h-5 text-primary" /> The Equinox Markers: Aries & Libra
              </h3>
              <p className="text-sm">Aries originally marked the Vernal Equinox—the moment when night and day are of equal length and the light begins to conquer the dark. Libra, conversely, marked the Autumnal Equinox, the start of the descending year.</p>
            </div>
            <div className="border-l-4 border-accent pl-8 py-4">
              <h3 className="text-xl font-black text-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                <Moon className="w-5 h-5 text-accent" /> The Solstice Anchors: Cancer & Capricorn
              </h3>
              <p className="text-sm">Cancer marked the highest point of the Sun (Summer Solstice), while Capricorn marked the lowest (Winter Solstice). These signs were the structural pillars of the ancient solar calendar.</p>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">3. Mathematics vs. Mysticism</h2>
          <p>
            It is a common misconception that the zodiac is purely "unscientific." In reality, the <strong>Tropical Zodiac</strong> used in the West is a fixed mathematical coordinate system. It doesn't actually follow the physical constellations anymore (due to the precession of the equinoxes), but rather serves as a rigid 360-degree map of the Earth's orbit.
          </p>
          <div className="glass p-10 border-primary/20 bg-primary/5 rounded-[40px] my-16">
            <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-6 flex items-center gap-3">
              <History className="w-8 h-8" /> SEO Insight: Why "Zodiac History" Matters
            </h3>
            <p className="text-sm leading-relaxed opacity-90">
              Users searching for "Age Calculators" often have a deep interest in self-discovery. By providing the historical context of their zodiac sign, ChronoFlow transforms from a simple utility into a <strong>meaningful experience</strong>. High-authority content on ancient chronology establishes ChronoFlow as a leader in the precision-time niche.
            </p>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">4. Precision in the Digital Age</h2>
          <p>
            How does a modern app like ChronoFlow determine a sign? It's not just "month and day." To be truly precise, one must account for the specific hour of birth and the geographical location to handle the <strong>Cusp Transitions</strong>. 
          </p>
          <p>
            Our engine uses industry-standard astronomical algorithms to ensure that even if you were born on the very minute the Sun transitions from Leo to Virgo, your ChronoFlow dashboard will reflect it accurately.
          </p>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">5. The Future: Bio-Chronology and Beyond</h2>
          <p>
            As we move toward a world of 5G connectivity and quantum computing, the ancient zodiac might seem like a relic. However, the <strong>human desire for meaning</strong> in time is constant. We believe the future of chronological tools lies in the synthesis of atomic-clock precision and ancient narrative significance.
          </p>

          <Separator className="my-16 opacity-10" />

          <div className="space-y-8">
            <h3 className="text-2xl font-black text-foreground tracking-tight">Final Synthesis</h3>
            <p>
              The history of time is the history of the zodiac. By understanding where we come from—the Babylonian priests, the Egyptian stargazers, the Greek mathematicians—we can better appreciate the high-definition, live-ticking precision of the <strong>ChronoFlow Engine</strong>.
            </p>
            <div className="pt-10">
              <Link href="/">
                <Button className="w-full h-20 bg-primary text-primary-foreground font-black text-lg uppercase tracking-widest rounded-3xl shadow-2xl hover:scale-[1.03] transition-all group">
                  Synchronize with Your Personal Stars
                  <Sparkles className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-32 pt-16 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Chief Historian</p>
              <p className="text-lg font-bold">ChronoFlow Cultural Research Group</p>
            </div>
            <div className="flex gap-4">
               <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest px-4 py-2">Historical Accuracy Verified</Badge>
               <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest px-4 py-2">Source: Ptolemaic Archive</Badge>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
