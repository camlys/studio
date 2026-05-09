"use client";

import React, { useRef } from 'react';
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
    <div className="space-y-1.5">
      <Label className="text-[8px] font-bold uppercase tracking-widest text-primary/60">{label}</Label>
      <div className="grid grid-cols-3 gap-1">
        <Input
          ref={dayRef}
          placeholder="DD"
          value={values.day}
          onChange={(e) => handleInputChange('day', e.target.value)}
          className="text-center text-xs h-8 bg-white/5 border-border glass focus:neon-glow rounded-md px-0.5"
          maxLength={2}
        />
        <Input
          ref={monthRef}
          placeholder="MM"
          value={values.month}
          onChange={(e) => handleInputChange('month', e.target.value)}
          className="text-center text-xs h-8 bg-white/5 border-border glass focus:neon-glow rounded-md px-0.5"
          maxLength={2}
        />
        <Input
          ref={yearRef}
          placeholder="YYYY"
          value={values.year}
          onChange={(e) => handleInputChange('year', e.target.value)}
          className="text-center text-xs h-8 bg-white/5 border-border glass focus:neon-glow rounded-md px-0.5"
          maxLength={4}
        />
      </div>
      {error && <p className="text-[8px] text-destructive font-medium mt-0.5">{error}</p>}
    </div>
  );
}
