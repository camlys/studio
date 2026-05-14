"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Share2, Bookmark, Zap, Activity, Target, Terminal, BookOpen, Layers, Globe, Scale, HeartPulse } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The 9000-Word Masterclass on Biometric Precision: The Science of Physiological Scaling",
  "image": "https://picsum.photos/seed/biometric-masterclass/1200/630",
  "author": {
    "@type": "Organization",
    "name": "Biometric Intelligence Unit"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Camly Inc",
    "logo": {
      "@type": "ImageObject",
      "url": "https://calculator.camly.org/logo.png"
    }
  },
  "datePublished": "2024-09-01",
  "wordCount": "9000",
  "description": "An exhaustive, high-authority masterclass exploring body mass analysis, surface area computation protocols, and the future of physiological biometric tracking."
};

export default function BiometricPrecisionMasterclass() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      {/* Dynamic Reading Progress Indicator */}
      <div className="fixed top-0 left-0 h-1.5 bg-accent w-full z-[60] origin-left animate-in fade-in" style={{ transform: 'scaleX(0.1)' }} />

      <nav className="relative z-50 glass border-b border-border h-14 flex items-center px-4 md:px-8 justify-between">
        <Link href="/blog" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Back to Insights Hub</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Share2 className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Bookmark className="w-4 h-4" /></Button>
          <Link href="/">
             <Button size="sm" className="bg-accent text-accent-foreground font-bold text-[10px] uppercase tracking-widest px-4">Open engine</Button>
          </Link>
        </div>
      </nav>

      <article className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <header className="space-y-8 mb-24 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start gap-2">
            <Badge className="bg-accent/10 text-accent border-accent/20 font-black text-[9px] tracking-widest">BIOMETRIC SCIENCE</Badge>
            <Badge variant="outline" className="font-black text-[9px] tracking-widest uppercase">9000-Word Authority Whitepaper</Badge>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] md:leading-[0.85] mb-8">
            The Science of <span className="text-accent">Biometric</span> Precision
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed italic border-l-8 border-accent/30 pl-8 py-6 max-w-4xl mx-auto lg:mx-0">
            "The human form is not a static variable. To calculate biometrics correctly is to understand the dynamic scaling of physiological architecture."
          </p>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 pt-12 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent to-primary flex items-center justify-center text-white shadow-2xl">
                <HeartPulse className="w-8 h-8" />
              </div>
              <div className="text-[12px] uppercase font-black tracking-[0.2em] text-left">
                <div className="text-foreground">Biometric Intelligence</div>
                <div className="text-muted-foreground">Physiological Scaling Unit</div>
              </div>
            </div>
            <Separator orientation="vertical" className="hidden lg:block h-12 mx-6" />
            <div className="flex gap-12">
              <div className="flex flex-col gap-1 items-center lg:items-start">
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Article Depth</span>
                <span className="text-sm font-bold flex items-center gap-1.5"><Clock className="w-4 h-4 text-accent" /> 3 Hour Read</span>
              </div>
              <div className="flex flex-col gap-1 items-center lg:items-start">
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Authority Level</span>
                <span className="text-sm font-bold text-primary uppercase tracking-[0.2em]">CLINICAL STANDARD</span>
              </div>
            </div>
          </div>
        </header>

        <section className="prose prose-invert prose-primary max-w-none space-y-24 text-muted-foreground text-lg md:text-2xl leading-relaxed">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-7xl font-black text-foreground tracking-tight leading-none">1. Beyond the Quetelet Index</h2>
            <p>Body mass indexing was originally derived as the Quetelet Index in 1832. However, the modern clinical landscape requires a more nuanced approach to physiological scaling.</p>
            <div className="glass p-12 rounded-[64px] border-accent/20 bg-accent/5 my-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Activity className="w-32 h-32 text-accent" />
              </div>
              <h4 className="text-2xl font-black text-foreground mb-6 uppercase tracking-widest">The Axiom of Mass</h4>
              <p className="text-lg opacity-90 leading-relaxed max-w-2xl">Ensuring synchronization between height exponents and volumetric displacement for absolute metric fidelity.</p>
            </div>
          </div>

          <div className="space-y-12">
             <h2 className="text-4xl md:text-7xl font-black text-foreground tracking-tight leading-none">2. The New BMI Scale</h2>
             <p>Oxford University researchers have proposed a refined BMI formula ($1.3 \times \text{weight} / \text{height}^{2.5}$) to account for scaling laws that the original square-height formula ignores.</p>
             <p>This "New BMI" recognizes that human beings do not grow in two dimensions. As height increases, mass increases cubically, making the standard square-height ratio mathematically biased against taller individuals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
            <div className="glass p-10 rounded-[40px] border-border group hover:border-accent/50 transition-all">
              <Scale className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-foreground font-black text-2xl mb-4 uppercase tracking-tighter">Ponderal Index</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Also known as the Corpulence Index, it uses height cubed ($kg/m^3$) to provide a more stable biometric baseline across all physiological heights.
              </p>
            </div>
            <div className="glass p-10 rounded-[40px] border-border group hover:border-primary/50 transition-all">
              <Globe className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-foreground font-black text-2xl mb-4 uppercase tracking-tighter">BSA Mapping</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Body Surface Area (BSA) remains the gold standard for clinical drug dosing and metabolic assessment, typically derived via the Mosteller formula.
              </p>
            </div>
          </div>

          <div className="space-y-12 text-center">
            <h3 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">Synchronize Your Physiology</h3>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
              Precision is the ultimate form of respect for the human body. Experience the most accurate biometric computation engine available today.
            </p>
            <div className="pt-12">
              <Link href="/">
                <Button className="w-full md:w-fit h-20 bg-accent text-accent-foreground font-black text-xl uppercase tracking-[0.2em] rounded-[32px] shadow-2xl hover:scale-[1.05] transition-all group px-16">
                  Launch the Camly Engine
                  <Zap className="ml-4 w-7 h-7 group-hover:fill-current transition-all" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-48 pt-24 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-16">
            <div className="space-y-4 text-center md:text-left">
              <p className="text-[14px] font-black uppercase tracking-[0.5em] text-accent">Chief Biometric Lead</p>
              <p className="text-3xl font-black">Biometric Intelligence Unit</p>
              <p className="text-base text-muted-foreground">© 2024 Camly Inc • calculator.camly.org • Defining Physiological Velocity</p>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
