"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  className?: string;
  delay?: string;
}

export function ResultCard({ label, value, subLabel, className, delay }: ResultCardProps) {
  return (
    <div 
      className={cn(
        "glass p-4 rounded-2xl flex flex-col items-center justify-center text-center animate-fade-in-up border-white/5 shadow-lg",
        className
      )}
      style={{ animationDelay: delay }}
    >
      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-1.5">
        {label}
      </span>
      <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-headline font-black text-primary neon-glow-sm break-all">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      {subLabel && (
        <span className="text-[8px] mt-1.5 text-accent font-bold uppercase tracking-widest opacity-80">
          {subLabel}
        </span>
      )}
    </div>
  );
}
