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
        "glass p-2.5 rounded-xl flex flex-col items-center justify-center text-center animate-fade-in-up",
        className
      )}
      style={{ animationDelay: delay }}
    >
      <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-bold mb-0.5">
        {label}
      </span>
      <span className="text-lg md:text-xl font-headline font-bold text-primary neon-glow-sm">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      {subLabel && (
        <span className="text-[7px] mt-0.5 text-accent font-medium uppercase">
          {subLabel}
        </span>
      )}
    </div>
  );
}
