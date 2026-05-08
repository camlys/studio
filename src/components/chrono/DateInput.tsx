"use client";

import React, { useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateInputValues } from '@/lib/date-utils';

interface DateInputProps {
  label: string;
  values: DateInputValues;
  onChange: (values: DateInputValues) => void;
  error?: string;
}

export function DateInput({ label, values, onChange, error }: DateInputProps) {
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof DateInputValues, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    let finalValue = numericValue;

    if (field === 'day' && parseInt(numericValue) > 31) finalValue = '31';
    if (field === 'month' && parseInt(numericValue) > 12) finalValue = '12';
    if (field === 'year' && numericValue.length > 4) finalValue = numericValue.slice(0, 4);

    const newValues = { ...values, [field]: finalValue };
    onChange(newValues);

    // Auto-tab logic
    if (field === 'day' && finalValue.length === 2) monthRef.current?.focus();
    if (field === 'month' && finalValue.length === 2) yearRef.current?.focus();
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold uppercase tracking-wider text-primary/80">{label}</Label>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Input
            ref={dayRef}
            placeholder="DD"
            value={values.day}
            onChange={(e) => handleInputChange('day', e.target.value)}
            className="text-center text-lg h-14 bg-white/5 border-white/10 glass focus:neon-glow rounded-xl"
            maxLength={2}
          />
          <p className="text-[10px] text-center text-muted-foreground uppercase font-medium">Day</p>
        </div>
        <div className="space-y-2">
          <Input
            ref={monthRef}
            placeholder="MM"
            value={values.month}
            onChange={(e) => handleInputChange('month', e.target.value)}
            className="text-center text-lg h-14 bg-white/5 border-white/10 glass focus:neon-glow rounded-xl"
            maxLength={2}
          />
          <p className="text-[10px] text-center text-muted-foreground uppercase font-medium">Month</p>
        </div>
        <div className="space-y-2">
          <Input
            ref={yearRef}
            placeholder="YYYY"
            value={values.year}
            onChange={(e) => handleInputChange('year', e.target.value)}
            className="text-center text-lg h-14 bg-white/5 border-white/10 glass focus:neon-glow rounded-xl"
            maxLength={4}
          />
          <p className="text-[10px] text-center text-muted-foreground uppercase font-medium">Year</p>
        </div>
      </div>
      {error && <p className="text-xs text-destructive animate-pulse font-medium mt-2">{error}</p>}
    </div>
  );
}