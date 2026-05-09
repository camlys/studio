import { intervalToDuration, differenceInDays, differenceInWeeks, differenceInHours, differenceInMinutes, differenceInSeconds, addYears, isLeapYear, format } from 'date-fns';

export type DateInputValues = {
  day: string;
  month: string;
  year: string;
};

export type CalculationResults = {
  years: number;
  months: number;
  days: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  zodiac: string;
  nextBirthday: number;
  nextBirthdayDate: string;
  previousBirthdayDate: string;
  daysSincePrevious: number;
  isLeapYear: boolean;
};

export function isValidDate(d: string, m: string, y: string): boolean {
  const day = parseInt(d);
  const month = parseInt(m);
  const year = parseInt(y);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1) return false;

  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function getZodiacSign(day: number, month: number): string {
  const signs = [
    { name: "Capricorn", start: [12, 22], end: [1, 19] },
    { name: "Aquarius", start: [1, 20], end: [2, 18] },
    { name: "Pisces", start: [2, 19], end: [3, 20] },
    { name: "Aries", start: [3, 21], end: [4, 19] },
    { name: "Taurus", start: [4, 20], end: [5, 20] },
    { name: "Gemini", start: [5, 21], end: [6, 20] },
    { name: "Cancer", start: [6, 21], end: [7, 22] },
    { name: "Leo", start: [7, 23], end: [8, 22] },
    { name: "Virgo", start: [8, 23], end: [9, 22] },
    { name: "Libra", start: [9, 23], end: [10, 22] },
    { name: "Scorpio", start: [10, 23], end: [11, 21] },
    { name: "Sagittarius", start: [11, 22], end: [12, 21] },
  ];

  const sign = signs.find(s => {
    const [sm, sd] = s.start;
    const [em, ed] = s.end;
    if (month === sm) return day >= sd;
    if (month === em) return day <= ed;
    return false;
  });

  return sign ? sign.name : "Capricorn";
}

export function calculateAll(startDate: Date, endDate: Date = new Date()): CalculationResults {
  const duration = intervalToDuration({ start: startDate, end: endDate });
  
  // Next Birthday Calculation relative to endDate
  let nextBday = new Date(endDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  if (nextBday < endDate) {
    nextBday = addYears(nextBday, 1);
  }
  const daysToNextBday = differenceInDays(nextBday, endDate);

  // Previous Birthday Calculation relative to endDate
  let prevBday = new Date(endDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  if (prevBday > endDate) {
    prevBday = addYears(prevBday, -1);
  }
  const daysSincePrevBday = differenceInDays(endDate, prevBday);

  return {
    years: duration.years || 0,
    months: duration.months || 0,
    days: duration.days || 0,
    totalWeeks: Math.abs(differenceInWeeks(endDate, startDate)),
    totalDays: Math.abs(differenceInDays(endDate, startDate)),
    totalHours: Math.abs(differenceInHours(endDate, startDate)),
    totalMinutes: Math.abs(differenceInMinutes(endDate, startDate)),
    totalSeconds: Math.abs(differenceInSeconds(endDate, startDate)),
    zodiac: getZodiacSign(startDate.getDate(), startDate.getMonth() + 1),
    nextBirthday: daysToNextBday,
    nextBirthdayDate: format(nextBday, 'dd MMM, yyyy'),
    previousBirthdayDate: format(prevBday, 'dd MMM, yyyy'),
    daysSincePrevious: daysSincePrevBday,
    isLeapYear: isLeapYear(startDate),
  };
}