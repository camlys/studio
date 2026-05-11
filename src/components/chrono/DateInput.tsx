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

// Generate days 1-31
const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

export function DateInput({ label, values, onChange, error }: DateInputProps) {
  const yearRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof DateInputValues, value: string) => {
    let finalValue = value;

    // Filter numeric input for year field (month/day handled by Select)
    if (field === 'year') {
      finalValue = value.replace(/\D/g, '');
      if (finalValue.length > 4) finalValue = finalValue.slice(0, 4);
    }

    const newValues = { ...values, [field]: finalValue };
    onChange(newValues);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-[8px] font-bold uppercase tracking-widest text-primary/60">{label}</Label>
      <div className="grid grid-cols-[1.2fr_1fr_1.5fr] gap-1">
        {/* Month Select Component */}
        <Select 
          value={values.month} 
          onValueChange={(v) => handleInputChange('month', v)}
        >
          <SelectTrigger className="text-center text-xs h-8 bg-white/5 border border-black dark:border-white rounded-none px-2 transition-colors focus:border-primary focus:ring-0 shadow-none">
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

        {/* Day Select Component (1, 2, 3...) */}
        <Select 
          value={values.day} 
          onValueChange={(v) => handleInputChange('day', v)}
        >
          <SelectTrigger className="text-center text-xs h-8 bg-white/5 border border-black dark:border-white rounded-none px-2 transition-colors focus:border-primary focus:ring-0 shadow-none">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent className="max-h-[220px] overflow-y-auto bg-background border-border">
            {DAYS.map((d) => (
              <SelectItem key={d} value={d} className="text-xs focus:bg-primary/10">
                {parseInt(d)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Input Field */}
        <Input
          ref={yearRef}
          placeholder="Year"
          value={values.year}
          onChange={(e) => handleInputChange('year', e.target.value)}
          className="text-center text-xs h-8 bg-white/5 border border-black dark:border-white rounded-none px-0.5 transition-colors focus:border-primary shadow-none"
          maxLength={4}
        />
      </div>
      {error && <p className="text-[8px] text-destructive font-medium mt-0.5">{error}</p>}
    </div>
  );
}
