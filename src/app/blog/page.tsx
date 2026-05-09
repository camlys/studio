
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Timer, ArrowLeft, Calendar, User, Clock, ChevronRight, Search, BookOpen, Sparkles, FileType, Globe, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const BLOG_POSTS = [
  {
    title: "The Enterprise Blueprint for Digital Asset Velocity",
    description: "The definitive 9000-word enterprise guide to maximizing digital asset velocity through high-precision optimization and edge-compute architectures.",
    date: "July 15, 2024",
    author: "Camly Ops Team",
    readTime: "120 min read",
    slug: "/blog/digital-asset-velocity-enterprise-guide",
    category: "Enterprise Whitepaper"
  },
  {
    title: "The Master Guide to Global Time Synchronization",
    description: "An exhaustive technical guide to the science of time synchronization, NTP protocols, and high-precision chronological engineering.",
    date: "July 10, 2024",
    author: "Camly Engineering",
    readTime: "60 min read",
    slug: "/blog/global-time-synchronization-standards",
    category: "Chronology"
  },
  {
    title: "The Ultimate 8000-Word Guide to Image and PDF Resizing",
    description: "Master the art of digital asset management. Learn how high-precision resizing impacts SEO, web performance, and document integrity.",
    date: "June 05, 2024",
    author: "Camly Tech Ops",
    readTime: "90 min read",
    slug: "/blog/image-and-pdf-resizing-optimization",
    category: "Asset Management"
  },
  {
    title: "How AI is Revolutionizing Personal Utilities",
    description: "Discover how Genkit and LLMs are transforming simple calculators into intelligent lifestyle companions.",
    date: "May 22, 2024",
    author: "AI Insights Team",
    readTime: "30 min read",
    slug: "/blog/ai-revolution-personal-utilities",
    category: "Technology"
  },
  {
    title: "The Ultimate Guide to Chronological Computation",
    description: "Explore the science behind high-precision time tracking and why every second counts in the modern era.",
    date: "May 20, 2024",
    author: "ChronoFlow Editorial",
    readTime: "25 min read",
    slug: "/blog/ultimate-guide-to-age-calculation",
    category: "Technical Guide"
  },
  {
    title: "Zodiac Symbols and the History of Time",
    description: "A deep dive into how ancient civilizations mapped the stars to our current chronological systems.",
    date: "May 25, 2024",
    author: "Culture Team",
    readTime: "45 min read",
    slug: "/blog/zodiac-symbols-history-of-time",
    category: "Culture"
  }
];

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "ChronoFlow Insights Hub",
  "description": "Expert insights on file optimization, chronological precision, and the evolution of digital utility tools.",
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
    "url": `https://chronoflow.app${post.slug}`
  }))
};

export default function BlogHub() {
  const [search, setSearch] = useState('');

  const filteredPosts = BLOG_POSTS.filter(post => 
    post.title.toLowerCase().includes(search.toLowerCase()) || 
    post.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <nav className="sticky top-0 z-50 glass border-b border-border h-12 flex items-center px-4 md:px-6 justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
            <Timer className="text-primary-foreground w-4 h-4" />
          </div>
          <h1 className="text-sm md:text-base font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            CAMLY <span className="text-foreground/50 font-normal ml-2">INSIGHTS</span>
          </h1>
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
            Digital <span className="text-primary">Optimization</span> & <span className="text-accent">Precision</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Exploring the intersection of file optimization, chronological precision, and the evolution of digital utility tools by Camly Inc.
          </p>
          
          <div className="max-w-md mx-auto relative pt-4">
            <Search className="absolute left-3 top-7 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search articles..." 
              className="pl-10 bg-muted/50 border-border h-12 rounded-xl focus:ring-2 focus:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured Post - The 9000 Word Masterpiece */}
          <div className="md:col-span-2 glass border border-border rounded-3xl overflow-hidden group hover:border-primary/30 transition-all">
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 h-64 md:h-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-30" />
                <Zap className="w-24 h-24 text-primary opacity-20 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-8 space-y-4 flex flex-col justify-center">
                <Badge className="w-fit bg-primary text-primary-foreground text-[10px]">9000-WORD ENTERPRISE MASTERCLASS</Badge>
                <h2 className="text-3xl font-black leading-tight tracking-tight">The Enterprise Blueprint for Digital Asset Velocity</h2>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  The definitive guide to maximizing digital asset velocity. Learn how high-precision optimization, edge-computing, and atomic compression drive enterprise performance.
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> Camly Ops Team</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 120 min read</span>
                </div>
                <Link href="/blog/digital-asset-velocity-enterprise-guide">
                  <Button className="w-full md:w-fit mt-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] h-10 px-8">
                    Read Whitepaper
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Regular Posts */}
          {filteredPosts.slice(1).map((post, i) => (
            <div key={i} className="glass p-6 rounded-3xl border border-border hover:border-primary/20 transition-all flex flex-col group">
              <div className="space-y-4 flex-grow">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="text-[9px] uppercase tracking-widest">{post.category}</Badge>
                  <span className="text-[9px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
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

      <footer className="py-12 glass border-t border-border text-center">
        <p className="text-[10px] uppercase font-black tracking-[0.4em] text-muted-foreground/60">
          Camly Insights Hub • Precision in Every Pixel • © 2024 Camly Inc
        </p>
      </footer>
    </div>
  );
}
