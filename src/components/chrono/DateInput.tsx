"use client";

import React, { useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DateInputValues } from '@/lib/date-utils';

interface DateInputProps {
  label: string;
  values: DateInputValues;
  onChange: (values: DateInputValues) => void;
  error?: string;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function DateInput({ label, values, onChange, error }: DateInputProps) {
  const dayRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof DateInputValues, value: string) => {
    let finalValue = value;

    // Filter numeric input for day and year fields
    if (field !== 'month') {
      finalValue = value.replace(/\D/g, '');
      if (field === 'day' && parseInt(finalValue) > 31) finalValue = '31';
      if (field === 'year' && finalValue.length > 4) finalValue = finalValue.slice(0, 4);
    }

    const newValues = { ...values, [field]: finalValue };
    onChange(newValues);

    // Automatic focus management logic for standard inputs
    if (field === 'day' && finalValue.length === 2) {
      // Manual focus logic can be implemented here if needed to jump to year
    }
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-[8px] font-bold uppercase tracking-widest text-primary/60">{label}</Label>
      <div className="grid grid-cols-[1.2fr_1fr_1.5fr] gap-1">
        <Select 
          value={values.month} 
          onValueChange={(v) => handleInputChange('month', v)}
        >
          <SelectTrigger className="text-center text-xs h-8 bg-white/5 border border-black dark:border-white rounded-md px-2 transition-colors focus:border-primary focus:ring-0 shadow-none">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="max-h-[220px] overflow-y-auto bg-background border-border">
            {MONTHS.map((m, i) => (
              <SelectItem key={m} value={(i + 1).toString().padStart(2, '0')} className="text-xs focus:bg-primary/10">
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          ref={dayRef}
          placeholder="Day"
          value={values.day}
          onChange={(e) => handleInputChange('day', e.target.value)}
          className="text-center text-xs h-8 bg-white/5 border border-black dark:border-white rounded-md px-0.5 transition-colors focus:border-primary shadow-none"
          maxLength={2}
        />

        <Input
          ref={yearRef}
          placeholder="Year"
          value={values.year}
          onChange={(e) => handleInputChange('year', e.target.value)}
          className="text-center text-xs h-8 bg-white/5 border border-black dark:border-white rounded-md px-0.5 transition-colors focus:border-primary shadow-none"
          maxLength={4}
        />
      </div>
      {error && <p className="text-[8px] text-destructive font-medium mt-0.5">{error}</p>}
    </div>
  );
}
