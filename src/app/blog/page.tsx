"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Timer, ArrowLeft, Calendar, User, Clock, ChevronRight, Search, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const BLOG_POSTS = [
  {
    title: "The Ultimate Guide to Chronological Computation",
    description: "Explore the science behind high-precision time tracking and why every second counts in the modern era.",
    date: "May 20, 2024",
    author: "ChronoFlow Editorial",
    readTime: "25 min read",
    slug: "ultimate-guide-to-age-calculation",
    category: "Technical Guide"
  },
  {
    title: "How AI is Revolutionizing Personal Utilities",
    description: "Discover how Genkit and LLMs are transforming simple calculators into intelligent lifestyle companions.",
    date: "May 18, 2024",
    author: "AI Insights",
    readTime: "12 min read",
    slug: "#",
    category: "Technology"
  },
  {
    title: "Zodiac Symbols and the History of Time",
    description: "A deep dive into how ancient civilizations mapped the stars to our current chronological systems.",
    date: "May 15, 2024",
    author: "Culture Team",
    readTime: "15 min read",
    slug: "#",
    category: "Culture"
  }
];

export default function BlogHub() {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen animate-gradient-bg flex flex-col text-foreground selection:bg-primary/30">
      {/* Mini Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-white/10 h-12 flex items-center px-4 md:px-6 justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
            <Timer className="text-primary-foreground w-4 h-4" />
          </div>
          <h1 className="text-sm md:text-base font-headline font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            CHRONOFLOW <span className="text-foreground/50 font-normal ml-2">BLOG</span>
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
            Insights into <span className="text-primary">Time</span> & <span className="text-accent">Technology</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Exploring the intersection of chronological precision, generative AI, and the evolution of digital utility tools.
          </p>
          
          <div className="max-w-md mx-auto relative pt-4">
            <Search className="absolute left-3 top-7 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search articles..." 
              className="pl-10 bg-white/5 border-white/10 glass h-12 rounded-xl focus:neon-glow"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured Post */}
          <div className="md:col-span-2 glass-card !p-0 overflow-hidden group hover:border-primary/30 transition-all">
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 h-64 md:h-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-50" />
                <BookOpen className="w-24 h-24 text-primary opacity-20 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-8 space-y-4 flex flex-col justify-center">
                <Badge className="w-fit bg-primary text-primary-foreground text-[10px]">Featured Article</Badge>
                <h2 className="text-3xl font-black leading-tight tracking-tight">The Ultimate Guide to Chronological Computation</h2>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  This comprehensive guide delves into the mathematics of time, the importance of precision at the second level, and how modern technology allows us to visualize our personal timeline like never before.
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> ChronoFlow Team</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 25 min read</span>
                </div>
                <Link href="/blog/ultimate-guide-to-age-calculation">
                  <Button className="w-full md:w-fit mt-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] h-10 px-8">
                    Read Full Article
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Regular Posts */}
          {BLOG_POSTS.slice(1).map((post, i) => (
            <div key={i} className="glass-card hover:border-white/20 transition-all flex flex-col group">
              <div className="space-y-4 flex-grow">
                <Badge variant="secondary" className="text-[9px] uppercase tracking-widest">{post.category}</Badge>
                <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{post.description}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                <span>{post.date}</span>
                <Link href={post.slug} className="text-primary hover:underline flex items-center gap-1">
                  Read More <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>

      <footer className="py-12 glass border-t border-white/10 text-center">
        <p className="text-[10px] uppercase font-black tracking-[0.4em] text-muted-foreground/60">
          ChronoFlow Insights Hub • Powered by Precision
        </p>
      </footer>
    </div>
  );
}
