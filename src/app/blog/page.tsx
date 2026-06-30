
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Timer, ArrowLeft, User, Clock, ChevronRight, Search, BookOpen, ExternalLink, Github, Twitter, Globe, GraduationCap, Brain, Briefcase, Zap, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InstallPWA } from '@/components/chrono/InstallPWA';

const BLOG_POSTS = [
  {
    title: "The Physics of Digital Precision: Mastering IEEE 754 in High-Velocity Web Environments",
    description: "An exhaustive technical whitepaper exploring the physics of binary precision, floating-point entropy, and high-fidelity mathematical modeling in web-based engines.",
    date: "June 10, 2025",
    author: "ALU Intelligence Division",
    readTime: "420 min read",
    slug: "/blog/physics-of-digital-precision-masterclass",
    category: "Computational Science"
  },
  {
    title: "The Masterclass on Piecewise Linear Interpolation: The Mathematics of Cross-Standard Grade Translations",
    description: "An exhaustive technical whitepaper exploring the mathematical logic of mapping non-linear grading scales across international academic standards using piecewise linear models.",
    date: "October 10, 2025",
    author: "Academic Intelligence Unit",
    readTime: "12 hour read",
    slug: "/blog/piecewise-linear-interpolation-masterclass",
    category: "Mathematical Science"
  },
  {
    title: "The Masterclass on Atmospheric UI/UX: The Science of High-Definition Digital Aesthetics",
    description: "An exhaustive technical whitepaper exploring the mathematics of glassmorphism, depth-perception in digital layers, and the physics of tactile interface synchronization.",
    date: "August 10, 2025",
    author: "UI/UX Intelligence Unit",
    readTime: "10 hour read",
    slug: "/blog/atmospheric-ui-ux-masterclass",
    category: "Design Science"
  },
  {
    title: "The Masterclass on Quantitative Academic Performance: The Science of Weighted GPA Inferences",
    description: "An exhaustive technical whitepaper exploring the mathematics of weighted averages, credit density, and global scholastic grade synchronization.",
    date: "July 05, 2025",
    author: "Academic Intelligence Unit",
    readTime: "8 hour read",
    slug: "/blog/quantitative-academic-performance-masterclass",
    category: "Academic Science"
  },
  {
    title: "Clinical Search Dominance: Optimizing Gestational Due Date Engines",
    description: "The definitive technical whitepaper on optimizing due date calculators for maximum organic authority, featuring maternity keyword clustering and healthcare schema synchronization.",
    date: "March 02, 2025",
    author: "Search Intelligence Unit",
    readTime: "8 hour read",
    slug: "/blog/seo-due-date-calculator-masterclass",
    category: "SEO Whitepaper"
  },
  {
    title: "Monetizing Financial Search: The Equated Monthly Installment SEO Audit",
    description: "The definitive technical whitepaper on optimizing EMI calculators for maximum organic authority, featuring fiscal keyword clustering and financial schema synchronization.",
    date: "March 05, 2025",
    author: "Search Intelligence Unit",
    readTime: "8 hour read",
    slug: "/blog/ultimate-emi-seo-masterclass",
    category: "SEO Whitepaper"
  },
  {
    title: "The Geometry of User Intent: High-Fidelity Pathfinding in Advanced Utility Suites",
    description: "An exhaustive technical whitepaper exploring the mathematics of user journey mapping, intent-based UI synchronization, and high-fidelity navigational architecture.",
    date: "June 25, 2025",
    author: "Intelligence Division",
    readTime: "10 hour read",
    slug: "/blog/geometry-of-user-intent-masterclass",
    category: "Productivity Science"
  },
  {
    title: "The Masterclass on High-Definition Resource Allocation: The Science of Computational Fluidity",
    description: "An exhaustive technical whitepaper exploring cloud-native resource scheduling, container orchestration, and the mathematics of high-velocity computational fluidity.",
    date: "May 25, 2025",
    author: "Cloud Operations Group",
    readTime: "450 min read",
    slug: "/blog/computational-resource-allocation-masterclass",
    category: "Computational Science"
  },
  {
    title: "The Axiom of Precision: An Exhaustive Masterclass on Arithmetic Logic Unit Optimization",
    description: "An exhaustive technical whitepaper on floating-point parity, IEEE 754 standards, and the future of high-velocity computational engine architecture.",
    date: "March 15, 2025",
    author: "ALU Engineering Division",
    readTime: "500 min read",
    slug: "/blog/arithmetic-logic-unit-optimization",
    category: "Computational Science"
  },
  {
    title: "The Chronological Drift Protocol: Mastering Atomic Time Synchronization",
    description: "An exhaustive technical whitepaper on clock drift mitigation, NTP Stratum-1 synchronization, and the future of high-precision temporal engineering.",
    date: "March 10, 2025",
    author: "Chronos Engineering Group",
    readTime: "400 min read",
    slug: "/blog/science-of-temporal-drift",
    category: "Chronological Science"
  },
  {
    title: "Biometric Authority: The Enterprise Guide to BMI Calculator SEO",
    description: "The definitive technical whitepaper on optimizing BMI calculators for maximum organic reach, featuring biometric keyword clustering and clinical schema synchronization.",
    date: "February 28, 2025",
    author: "Search Intelligence Unit",
    readTime: "8 hour read",
    slug: "/blog/ultimate-bmi-seo-masterclass",
    category: "SEO Whitepaper"
  },
  {
    title: "Chronological Keyword Strategy: A Masterclass in Age Utility SEO",
    description: "The definitive technical whitepaper on optimizing age calculators for maximum search authority, featuring keyword clustering and structured data synchronization.",
    date: "February 25, 2025",
    author: "Search Intelligence Unit",
    readTime: "8 hour read",
    slug: "/blog/seo-age-calculator-masterclass",
    category: "SEO Whitepaper"
  },
  {
    title: "Technical SEO Velocity: Achieving Absolute Index Parity and Precision",
    description: "The definitive technical whitepaper on search index synchronization, Core Web Vitals optimization, and the science of organic performance velocity.",
    date: "February 20, 2025",
    author: "Search Intelligence Unit",
    readTime: "8 hour read",
    slug: "/blog/ultimate-seo-precision-masterclass",
    category: "SEO Whitepaper"
  },
  {
    title: "Strategic Temporal Alignment: The Science of Tactical Milestone Sync",
    description: "An exhaustive 10,000-word whitepaper on the science of milestone synchronization, critical path inference, and high-fidelity project management.",
    date: "February 10, 2025",
    author: "Project Intelligence Unit",
    readTime: "10 hour read",
    slug: "/blog/tactical-project-chronology-masterclass",
    category: "Project Science"
  },
  {
    title: "The Bunk-Meter Logic: Academic Attendance Threshold Analysis",
    description: "An exhaustive technical whitepaper on attendance thresholds, bunk-meter synchronization, and percentage inference models.",
    date: "January 15, 2025",
    author: "Academic Intelligence Unit",
    readTime: "320 min read",
    slug: "/blog/academic-attendance-logic-masterclass",
    category: "Academic Whitepaper"
  },
  {
    title: "Neural Load Management: High-Precision Cognitive Focus Protocols",
    description: "An exhaustive technical whitepaper on neural flow state synchronization, deep work architectures, and high-fidelity temporal productivity protocols.",
    date: "December 05, 2024",
    author: "Productivity Intelligence Unit",
    readTime: "360 min read",
    slug: "/blog/cognitive-focus-velocity-masterclass",
    category: "Cognitive Whitepaper"
  },
  {
    title: "Amortized Debt Inference: The Mathematics of compound Fiscal Logic",
    description: "An exhaustive technical whitepaper on loan amortization algorithms, principal-interest distribution, and capital velocity synchronization.",
    date: "November 15, 2024",
    author: "Fiscal Ops Team",
    readTime: "320 min read",
    slug: "/blog/ultimate-fiscal-emi-masterclass",
    category: "Fiscal Whitepaper"
  },
  {
    title: "Thermodynamic Nutritional Sync: Metabolic Calorie Inference Models",
    description: "An exhaustive technical whitepaper on thermodynamic synchronization, BMR algorithms, and the precision of macro-nutrient mapping.",
    date: "October 05, 2024",
    author: "Metabolic Ops Team",
    readTime: "280 min read",
    slug: "/blog/ultimate-metabolic-calorie-masterclass",
    category: "Metabolic Whitepaper"
  }
];

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Camly Insights Hub",
  "description": "Expert insights on productivity synchronization, chronological precision, and the evolution of digital utility tools.",
  "publisher": {
    "@type": "Organization",
    "name": "Camly Inc"
  },
  "blogPost": BLOG_POSTS.map(post => ({
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "url": `https://calculator.camly.org${post.slug}`
  }))
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://calculator.camly.org"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Insights Hub",
      "item": "https://calculator.camly.org/blog"
    }
  ]
};

export default function BlogHub() {
  const [search, setSearch] = useState('');

  const filteredPosts = BLOG_POSTS.filter(post => 
    post.title.toLowerCase().includes(search.toLowerCase()) || 
    post.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav className="relative z-50 glass border-b border-border h-14 flex items-center px-4 md:px-6 justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center transition-all group-hover:scale-110">
            <Image src="/camly.png" alt="Camly" width={40} height={40} priority className="object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm md:text-base font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              CAMLY <span className="text-foreground/50 font-normal ml-2">INSIGHTS</span>
            </h1>
          </div>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="sm" className="rounded-full text-xs gap-2">
            <ArrowLeft className="w-3 h-3" /> Back to App
          </Button>
        </Link>
      </nav>

      <main className="flex-grow container max-w-5xl mx-auto px-4 py-12">
        <header className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-widest text-[10px] px-3 py-1">
            Knowledge Center
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
            Intelligence <span className="text-primary">&</span> <span className="text-accent">High-Performance</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium">
            Exploring the intersection of neural focus synchronization, academic parity, and military-grade utility tools.
          </p>
          
          <div className="max-w-md mx-auto relative pt-4">
            <Search className="absolute left-3 top-7 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search exhaustive whitepapers..." 
              className="pl-10 bg-muted/50 border-border h-12 rounded-xl focus:ring-2 focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured Post */}
          {filteredPosts.length > 0 && (
            <div className="md:col-span-2 glass border border-border rounded-3xl overflow-hidden group hover:border-primary/30 transition-all">
              <div className="grid md:grid-cols-2">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 h-64 md:h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-30" />
                  <Zap className="w-24 h-24 text-primary opacity-20 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-8 space-y-4 flex flex-col justify-center">
                  <Badge className="w-fit bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-black">{filteredPosts[0].category}</Badge>
                  <h2 className="text-3xl font-black leading-tight tracking-tight">{filteredPosts[0].title}</h2>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {filteredPosts[0].description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                    <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {filteredPosts[0].author}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {filteredPosts[0].readTime}</span>
                  </div>
                  <Link href={filteredPosts[0].slug}>
                    <Button className="w-full md:w-fit mt-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] h-10 px-8">
                      Access Whitepaper
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Regular Posts */}
          {filteredPosts.slice(1).map((post, i) => (
            <div key={i} className="glass p-6 rounded-3xl border border-border hover:border-primary/20 transition-all flex flex-col group">
              <div className="space-y-4 flex-grow">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="text-[9px] uppercase tracking-widest">{post.category}</Badge>
                  <span className="text-[9px] text-muted-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                </div>
                <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{post.description}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                <span>{post.date}</span>
                <Link href={post.slug} className="text-primary hover:underline flex items-center gap-1">
                  Read More <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </section>
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
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-accent/10 shadow-sm border border-border/50"><Users className="w-4 h-4" /></Button>
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
                   <Link href="/cgpa-calculator">Academic Sync</Link>
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
                   <ChevronRight className="w-3 h-3 opacity-30" /> Insights API
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
                <InstallPWA variant="footer" />
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
