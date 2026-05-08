"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { generateFunAgeFact } from '@/ai/flows/generate-fun-age-fact';

interface FunFactProps {
  years: number;
  months: number;
  days: number;
}

export function FunFact({ years, months, days }: FunFactProps) {
  const [fact, setFact] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFact = async () => {
      setLoading(true);
      try {
        const result = await generateFunAgeFact({ years, months, days });
        setFact(result.fact);
      } catch (error) {
        console.error("Failed to fetch fun fact:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFact();
  }, [years, months, days]);

  return (
    <div className="glass-card mt-8 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4">
        <Sparkles className="w-6 h-6 text-accent animate-pulse" />
      </div>
      <h3 className="text-lg font-headline font-semibold text-accent mb-2 flex items-center gap-2">
        Did You Know?
      </h3>
      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-4 bg-white/10 rounded w-5/6"></div>
        </div>
      ) : (
        <p className="text-muted-foreground leading-relaxed italic">
          "{fact || "Your age is a journey through time, filled with millions of heartbeats and countless memories."}"
        </p>
      )}
    </div>
  );
}