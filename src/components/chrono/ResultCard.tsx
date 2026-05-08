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
        "glass p-6 rounded-2xl flex flex-col items-center justify-center text-center animate-fade-in-up",
        className
      )}
      style={{ animationDelay: delay }}
    >
      <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
        {label}
      </span>
      <span className="text-3xl md:text-4xl font-headline font-bold text-primary neon-glow-sm">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      {subLabel && (
        <span className="text-[10px] mt-1 text-accent font-medium uppercase">
          {subLabel}
        </span>
      )}
    </div>
  );
}