"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Share2, Bookmark, Zap, Activity, Flame, Utensils, Target, Terminal, Globe, HeartPulse, Beef, Wheat, Droplets } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The Masterclass on Metabolic Calorie Inference: The Science of Thermodynamic Synchronization",
  "image": "https://picsum.photos/seed/calorie-master/1200/630",
  "author": {
    "@type": "Organization",
    "name": "Metabolic Intelligence Unit"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Camly Inc",
    "logo": {
      "@type": "ImageObject",
      "url": "https://calculator.camly.org/logo.png"
    }
  },
  "datePublished": "2024-10-05",
  "description": "An exhaustive, high-authority whitepaper exploring metabolic thermodynamics, BMR algorithms, and the precision of macro-nutrient synchronization."
};

export default function CalorieMasterclass() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 h-1.5 bg-primary w-full z-[60] origin-left animate-in fade-in" style={{ transform: 'scaleX(0.05)' }} />

      <nav className="relative z-50 glass border-b border-border h-14 flex items-center px-4 md:px-8 justify-between">
        <Link href="/blog" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Back to Insights Hub</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Share2 className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full"><Bookmark className="w-4 h-4" /></Button>
          <Link href="/calorie-calculator">
             <Button size="sm" className="bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-widest px-4">Launch Calorie Engine</Button>
          </Link>
        </div>
      </nav>

      <article className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <header className="space-y-8 mb-24 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 font-black text-[9px] tracking-widest">METABOLIC SCIENCE</Badge>
            <Badge variant="outline" className="font-black text-[9px] tracking-widest uppercase">Exhaustive Authority Whitepaper</Badge>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] md:leading-[0.85] mb-8">
            The Science of <span className="text-primary">Metabolic</span> Calorie Sync
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed italic border-l-8 border-primary/30 pl-8 py-6 max-w-4xl mx-auto lg:mx-0">
            "Energy cannot be created or destroyed; it can only be transformed. To calculate a calorie is to track the thermal signature of human life itself."
          </p>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 pt-12 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-2xl">
                <Flame className="w-8 h-8" />
              </div>
              <div className="text-[12px] uppercase font-black tracking-[0.2em] text-left">
                <div className="text-foreground">Metabolic Intelligence</div>
                <div className="text-muted-foreground">Thermodynamic Records Division</div>
              </div>
            </div>
            <Separator orientation="vertical" className="hidden lg:block h-12 mx-6" />
            <div className="flex gap-12">
              <div className="flex flex-col gap-1 items-center lg:items-start">
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Article Depth</span>
                <span className="text-sm font-bold flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> Comprehensive Read</span>
              </div>
              <div className="flex flex-col gap-1 items-center lg:items-start">
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Authority Level</span>
                <span className="text-sm font-bold text-accent uppercase tracking-[0.2em]">CLINICAL STANDARD</span>
              </div>
            </div>
          </div>
        </header>

        <section className="prose prose-invert prose-primary max-w-none space-y-24 text-muted-foreground text-lg md:text-2xl leading-relaxed">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-7xl font-black text-foreground tracking-tight leading-none">1. The First Law of Bio-Energetics</h2>
            <p>At the fundamental level, the human body is an open thermodynamic system. The calories we ingest are not merely 'food units' but potential energy vectors that fuel every biological process, from the synthesis of DNA to the mechanical contraction of cardiac tissue.</p>
            <p>To master calorie calculation is to move beyond the simplistic 'calories in vs. calories out' model. One must understand the components of Total Daily Energy Expenditure (TDEE): Basal Metabolic Rate (BMR), the Thermic Effect of Food (TEF), Exercise Activity Thermogenesis (EAT), and the often-overlooked Non-Exercise Activity Thermogenesis (NEAT).</p>
            <div className="glass p-12 rounded-[64px] border-primary/20 bg-primary/5 my-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Activity className="w-32 h-32 text-primary" />
              </div>
              <h4 className="text-2xl font-black text-foreground mb-6 uppercase tracking-widest">The Axiom of TDEE</h4>
              <p className="text-lg opacity-90 leading-relaxed max-w-2xl">Ensuring that every metabolic component is weighted correctly based on physiological density and activity variance.</p>
            </div>
          </div>

          <div className="space-y-12">
             <h2 className="text-4xl md:text-7xl font-black text-foreground tracking-tight leading-none">2. The Mifflin-St Jeor Precision Protocol</h2>
             <p>For decades, the Harris-Benedict equation was the gold standard. However, modern clinical research has demonstrated that the Mifflin-St Jeor equation provides a significantly more accurate inference of BMR in today's sedentary-leaning populations. This algorithm takes into account the cumulative impact of mass, stature, age, and biological sex with a higher degree of predictive parity.</p>
             <p>At Camly, our engine utilizes this refined protocol as the baseline. By recalibrating the constant values for males and females, we achieve a metabolic dashboard that aligns with actual oxygen consumption rates observed in clinical settings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
            <div className="glass p-10 rounded-[40px] border-border group hover:border-primary/50 transition-all">
              <Beef className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-foreground font-black text-2xl mb-4 uppercase tracking-tighter">Macro-Sync</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Mapping the caloric load to macro-nutrient ratios requires a piecewise approach that respects the high thermic effect of protein versus the efficiency of lipid storage.
              </p>
            </div>
            <div className="glass p-10 rounded-[40px] border-border group hover:border-accent/50 transition-all">
              <Utensils className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-foreground font-black text-2xl mb-4 uppercase tracking-tighter">TEF Variance</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Our inference engine handles the complex 'cost of digestion,' identifying that roughly 10% of your daily intake is consumed just by the process of nutrient absorption.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <h2 className="text-3xl md:text-6xl font-black text-foreground tracking-tight">3. The Mathematics of Metabolic Adaptation</h2>
            <p>Precision in calorie calculation must account for 'metabolic drift.' As an individual loses mass, their BMR naturally decreases, requiring a dynamic recalibration of their caloric ceiling. To ignore this delta is to invite the 'plateau effect,' where the system reaches thermodynamic equilibrium despite a perceived deficit.</p>
            <p>Our **Calorie Inference Engine** treats these variables as mission-critical coordinates. Users can track their progress through varying activity protocols, ensuring that their daily target is always synchronized with their current physiological state.</p>
          </div>

          <div className="p-12 bg-muted/20 border-l-8 border-primary rounded-r-[48px] my-20">
            <h4 className="text-foreground font-black mb-6 uppercase tracking-widest text-xs flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Technical Specification
            </h4>
            <p className="text-lg italic leading-relaxed text-foreground/80">
              "The calorie algorithm is a weighted summation of metabolic inputs. If B is the basal rate and A is the activity multiplier, then TDEE = B * A. This ensures that energetic mass is preserved across the entire biological lifecycle."
            </p>
          </div>

          <div className="space-y-12 text-center">
            <h3 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">Synchronize Your Metabolism</h3>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
              Precision is the ultimate form of respect for your biological engine. Experience the most accurate metabolic computation suite available today.
            </p>
            <div className="pt-12">
              <Link href="/calorie-calculator">
                <Button className="w-full md:w-fit h-20 bg-primary text-primary-foreground font-black text-xl uppercase tracking-[0.2em] rounded-[32px] shadow-2xl hover:scale-[1.05] transition-all group px-16">
                  Launch the Calorie Engine
                  <Zap className="ml-4 w-7 h-7 group-hover:fill-current transition-all" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-48 pt-24 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-16">
            <div className="space-y-4 text-center md:text-left">
              <p className="text-[14px] font-black uppercase tracking-[0.5em] text-primary">Chief Metabolic Lead</p>
              <p className="text-3xl font-black">Metabolic Intelligence Unit</p>
              <p className="text-base text-muted-foreground">© 2024 Camly Inc • calculator.camly.org • Defining Biological Velocity</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
               <Badge variant="outline" className="text-[11px] uppercase font-bold tracking-widest px-8 py-4 flex items-center gap-2 border-primary/20">
                 <HeartPulse className="w-4 h-4 text-primary" /> Vitals Registry: SECURE
               </Badge>
               <Badge variant="outline" className="text-[11px] uppercase font-bold tracking-widest px-8 py-4 flex items-center gap-2 border-accent/20">
                 <Globe className="w-4 h-4 text-accent" /> Global Standard: ACTIVE
               </Badge>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
