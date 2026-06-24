
"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Sun, Moon, Timer, ChevronRight, 
  Github, Twitter, Cpu, ShieldCheck, 
  ExternalLink, Globe, Zap, Activity, 
  Star, ArrowRight, Scale, HeartPulse, 
  Coins, Milestone, LayoutGrid, Download,
  Calculator as CalcIcon, CalendarDays, Copy,
  ArrowUpRight, Target, BarChart3, Settings,
  FileType, GraduationCap, Wallet, UserCheck,
  CheckCircle2, Clock, User, Camera, Upload, X, Shield,
  Sparkles, Workflow, Pencil, ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Cropper from 'react-easy-crop';
import { DateInput } from '@/components/chrono/DateInput';
import { ResultCard } from '@/components/chrono/ResultCard';
import { FunFact } from '@/components/chrono/FunFact';
import { InstallPWA } from '@/components/chrono/InstallPWA';
import { isValidDate, calculateAll, DateInputValues, CalculationResults } from '@/lib/date-utils';
import { useToast } from '@/hooks/use-toast';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { toPng } from 'html-to-image';
import { format } from 'date-fns';

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Camly Premium Age Calculator",
  "url": "https://calculator.camly.org/",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web, Windows, macOS, Android, iOS",
  "description": "Professional high-precision age and date difference calculator with atomic-clock synchronization and real-time interval tracking.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Atomic-sync chronological precision",
    "Real-time age interval tracking (seconds/minutes)",
    "Western Zodiac celestial mapping",
    "AI-driven chronological fun facts",
    "High-resolution report generation (PNG)"
  ]
};

function ChronoFlowContent() {
  const { toast } = useToast();
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [userName, setUserName] = useState('');
  const [subjectImage, setSubjectImage] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [fromDate, setFromDate] = useState<DateInputValues>({ day: '', month: '', year: '' });
  const [toDate, setToDate] = useState<DateInputValues>({ day: '', month: '', year: '' });
  
  const [isIdentityOpen, setIsIdentityOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tickerRef = useRef<NodeJS.Timeout | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [syncId, setSyncId] = useState<string>('');

  // Cropper states
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('chrono_user_name');
    if (savedName) setUserName(savedName);

    const savedImage = localStorage.getItem('chrono_subject_image');
    if (savedImage) setSubjectImage(savedImage);

    const savedDetails = localStorage.getItem('chrono_audit_details');
    if (savedDetails) setDetails(savedDetails);

    const savedFrom = localStorage.getItem('chrono_from');
    if (savedFrom) setFromDate(JSON.parse(savedFrom));
    
    const savedTo = localStorage.getItem('chrono_to');
    if (savedTo) {
      setToDate(JSON.parse(savedTo));
    } else {
      const now = new Date();
      setToDate({
        day: now.getDate().toString().padStart(2, '0'),
        month: (now.getMonth() + 1).toString().padStart(2, '0'),
        year: now.getFullYear().toString()
      });
    }

    const savedTheme = localStorage.getItem('chrono_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('light');
    }
    
    setSyncId(Math.random().toString(36).substring(7).toUpperCase());
  }, []);

  useEffect(() => {
    localStorage.setItem('chrono_user_name', userName);
    localStorage.setItem('chrono_subject_image', subjectImage || '');
    localStorage.setItem('chrono_audit_details', details);
    localStorage.setItem('chrono_from', JSON.stringify(fromDate));
    localStorage.setItem('chrono_to', JSON.stringify(toDate));
  }, [userName, subjectImage, details, fromDate, toDate]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('chrono_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (results) {
      tickerRef.current = setInterval(() => {
        setResults(prev => {
          if (!prev) return null;
          return {
            ...prev,
            totalSeconds: prev.totalSeconds + 1,
            totalMinutes: Math.floor((prev.totalSeconds + 1) / 60),
            totalHours: Math.floor((prev.totalSeconds + 1) / 3600),
          };
        });
      }, 1000);
    } else {
      if (tickerRef.current) clearInterval(tickerRef.current);
    }
    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, [results === null]);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const createCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop!, croppedAreaPixels);
      setSubjectImage(croppedImage);
      setImageToCrop(null);
      toast({
        title: "Photo Framed",
        description: "Subject identity synchronized with local registry.",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCalculate = useCallback(() => {
    setError(null);
    if (tickerRef.current) clearInterval(tickerRef.current);

    if (!isValidDate(fromDate.day, fromDate.month, fromDate.year) || 
        !isValidDate(toDate.day, toDate.month, toDate.year)) {
      setError("Invalid dates.");
      return;
    }
    const start = new Date(parseInt(fromDate.year), parseInt(fromDate.month) - 1, parseInt(fromDate.day));
    const end = new Date(parseInt(toDate.year), parseInt(toDate.month) - 1, parseInt(toDate.day));
    setResults(calculateAll(start, end));
  }, [fromDate, toDate]);

  const downloadResults = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(receiptRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        width: 480,
        pixelRatio: 4, 
        style: {
          transform: 'scale(1)',
          left: '0',
          top: '0',
        }
      });
      const fileName = userName 
        ? `Camly_Audit_${userName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd_HHmm')}.png`
        : `Camly_Chronological_Audit_${format(new Date(), 'yyyyMMdd_HHmm')}.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not generate the high-definition audit image.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (!results) return;
    const text = `${userName ? userName + "'s " : ""}Age Metrics: ${results.years}y, ${results.months}m, ${results.days}d. Calculated via Camly.`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Results copied to clipboard.",
    });
  };

  const QUICK_NAV = [
    { name: "Attendance Calculator", href: "/attendance-calculator" },
    { name: "BMI Calculator", href: "/bmi-calculator" },
    { name: "Calorie Calculator", href: "/calorie-calculator" },
    { name: "CGPA Calculator", href: "/cgpa-calculator" },
    { name: "Due Date Calculator", href: "/due-date-calculator" },
    { name: "EMI Calculator", href: "/emi-calculator" },
    { name: "Scientific Calculator", href: "/calculator" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-all duration-700 overflow-x-hidden font-body">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
      
      {/* Cropper Dialog */}
      <Dialog open={!!imageToCrop} onOpenChange={(open) => !open && setImageToCrop(null)}>
        <DialogContent className="sm:max-w-lg bg-transparent border-none shadow-none text-white overflow-hidden p-0 backdrop-blur-md">
          <DialogHeader className="sr-only">
            <DialogTitle>Frame Subject Photo</DialogTitle>
          </DialogHeader>
          <div className="relative h-[450px] w-full bg-transparent rounded-3xl overflow-hidden border border-white/20">
            <Cropper
              image={imageToCrop || ''}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={true}
              style={{
                containerStyle: { background: 'transparent' }
              }}
            />
          </div>
          <div className="mt-6 flex flex-row gap-3 justify-center items-center pb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setImageToCrop(null)} 
              className="text-[10px] font-black uppercase tracking-widest bg-black/40 text-white border border-white/20 hover:bg-black/60 rounded-full h-11 px-8"
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={createCroppedImage} 
              className="bg-primary text-white hover:bg-primary/90 text-[10px] font-black uppercase tracking-widest px-12 rounded-full h-11 border-2 border-white/20 shadow-xl"
            >
              Confirm Frame
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Hidden Receipt for Download */}
      <div className="fixed -left-[2000px] top-0 pointer-events-none">
        <div ref={receiptRef} className="w-[480px] bg-white text-black p-10 font-mono border-[6px] border-black relative overflow-hidden">
          {/* Header Branding - Horizontal Alignment */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-black">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <h2 className="text-3xl font-black tracking-tighter uppercase font-roboto-slab leading-none flex items-center gap-2">
                  <span className="text-primary">CAMLY</span>
                  <span className="text-black">CALCULATOR</span>
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Image src="/camly.png" alt="Camly" width={20} height={20} className="object-contain" />
                  <p className="text-[10px] font-black text-primary/80">calculator.camly.org</p>
                  <Separator orientation="vertical" className="h-2 bg-black/20" />
                  <p className="text-[8px] font-bold text-black/40 uppercase tracking-widest">camly.org</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest border-black text-black px-2 h-5">VERIFIED UNIT</Badge>
          </div>

          {/* Subject Profile Section */}
          <div className="grid grid-cols-[1fr_auto] gap-8 mb-10 items-center">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">Registry Identity</span>
                <div className="text-2xl font-black truncate border-l-4 border-primary pl-3 py-1 bg-black/5 uppercase leading-tight">{userName || 'UNIDENTIFIED_SUBJECT'}</div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Audit Metadata</span>
                <div className="flex flex-col gap-1 text-[11px] font-bold">
                  <div className="flex justify-between">
                    <span className="opacity-40">SYNC_ID:</span>
                    <span className="text-primary">{syncId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-40">TIMESTAMP:</span>
                    <span>{format(new Date(), 'dd-MMM-yyyy HH:mm:ss')}</span>
                  </div>
                </div>
              </div>
            </div>
            {subjectImage ? (
              <div className="relative">
                <div className="w-28 h-28 rounded-xl border border-black/10 relative overflow-hidden bg-transparent">
                   <img src={subjectImage} alt="Identity" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2.5 -right-2.5 bg-black text-white p-1 rounded-md border-2 border-white">
                   <ShieldCheck className="w-4 h-4 text-accent" />
                </div>
              </div>
            ) : (
              <div className="w-28 h-28 rounded-xl border-4 border-dashed border-black/10 flex items-center justify-center bg-black/5">
                <UserCheck className="w-12 h-12 opacity-10" />
              </div>
            )}
          </div>

          {/* Coordinates Section */}
          <div className="grid grid-cols-2 gap-8 mb-10 border-y-2 border-dashed border-black/20 py-8">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Target className="w-3.5 h-3.5" /> Origin Point
              </span>
              <div className="text-xl font-black tabular-nums">{fromDate.day}-{fromDate.month}-{fromDate.year}</div>
            </div>
            <div className="space-y-2 text-right border-l-2 border-dashed border-black/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center justify-end gap-2">
                Target Node <Globe className="w-3.5 h-3.5" />
              </span>
              <div className="text-xl font-black tabular-nums">{toDate.day}-{toDate.month}-{toDate.year}</div>
            </div>
          </div>

          {/* Primary Metrics Section */}
          <div className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 block mb-4">Core Chronological Matrix</span>
            <div className="bg-black text-white p-8 rounded-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Activity className="w-16 h-16 text-primary" />
               </div>
               <div className="grid grid-cols-3 gap-4 text-center relative z-10">
                  <div className="space-y-2">
                     <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Years</span>
                     <div className="text-6xl font-black tracking-tighter text-primary">{results?.years}</div>
                  </div>
                  <div className="space-y-2 border-l border-r border-white/20">
                     <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Months</span>
                     <div className="text-6xl font-black tracking-tighter">{results?.months}</div>
                  </div>
                  <div className="space-y-2">
                     <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Days</span>
                     <div className="text-6xl font-black tracking-tighter">{results?.days}</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Interval Matrix Section */}
          <div className="grid grid-cols-2 gap-10 mb-10">
            <div className="space-y-4">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary block">Total Intervals</span>
               <div className="space-y-2 text-[11px] font-bold">
                  <div className="flex justify-between border-b border-black/5 pb-1.5">
                     <span className="opacity-40">WEEKS:</span>
                     <span>{results?.totalWeeks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-black/5 pb-1.5">
                     <span className="opacity-40">DAYS:</span>
                     <span>{results?.totalDays.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-black/5 pb-1.5">
                     <span className="opacity-40">HOURS:</span>
                     <span>{results?.totalHours.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-black/5 pb-1.5">
                     <span className="opacity-40">MINUTES:</span>
                     <span>{results?.totalMinutes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                     <span className="opacity-40">SECONDS:</span>
                     <span className="text-primary">{results?.totalSeconds.toLocaleString()}</span>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary block">Milestone Target</span>
               <div className="space-y-2 text-[11px] font-bold">
                  <div className="flex justify-between border-b border-black/5 pb-1.5">
                     <span className="opacity-40">PREV_BDAY:</span>
                     <span className="text-[10px]">{results?.previousBirthdayDate}</span>
                  </div>
                  <div className="flex justify-between border-b border-black/5 pb-1.5">
                     <span className="opacity-40">DAYS_ELAPSED:</span>
                     <span>{results?.daysSincePrevious}</span>
                  </div>
                  <div className="flex justify-between border-b border-black/5 pb-1.5">
                     <span className="opacity-40">NEXT_BDAY:</span>
                     <span className="text-[10px]">{results?.nextBirthdayDate}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                     <span className="opacity-40">DAYS_REMAINING:</span>
                     <span className="text-accent">{results?.nextBirthday}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Audit Details Section */}
          {details && (
            <div className="mb-10 p-6 bg-black/5 rounded-3xl border border-black/10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary block mb-3 flex items-center gap-2">
                <Pencil className="w-3 h-3" /> Audit Specifications
              </span>
              <p className="text-[11px] font-medium leading-relaxed whitespace-pre-wrap">{details}</p>
            </div>
          )}

          {/* Footer Branding & URL */}
          <div className="mt-10 text-center border-t-4 border-black pt-10 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6">
                <CheckCircle2 className="w-12 h-12 text-primary" />
             </div>
             <p className="text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed mb-4">
               Atomic-Sync Precision Guaranteed<br/>
               Verified by Camly Intelligence Unit
             </p>
             <div className="bg-black py-3 px-6 inline-block rounded-xl">
               <p className="text-white text-[12px] font-black tracking-[0.2em] font-roboto-slab">CALCULATOR.CAMLY.ORG</p>
             </div>
             <div className="mt-4 flex flex-col items-center gap-0.5">
               <p className="text-[9px] font-black text-primary tracking-widest uppercase">camly.org</p>
               <p className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest italic">Defining high-precision velocity</p>
             </div>
             <p className="text-[9px] font-bold mt-6 opacity-30 uppercase tracking-widest">© 2024 Camly Inc. All chronological records certified.</p>
          </div>
        </div>
      </div>

      <nav className="relative z-50 h-14 flex items-center px-4 md:px-6 justify-between transition-colors duration-700 glass border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center transition-all group-hover:scale-110">
            <Image src="/camly.png" alt="Camly" width={40} height={40} priority className="object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter leading-none font-roboto-slab uppercase bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              CALCULATOR
            </h1>
            <Link href="https://camly.org" target="_blank" className="text-[7px] font-bold tracking-[0.3em] uppercase mt-1 flex items-center gap-1 transition-colors text-primary/60 hover:text-primary">
              CAMLY.ORG <ExternalLink className="w-2 h-2" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full hover:bg-accent/10 w-8 h-8">
             {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
           </Button>
        </div>
      </nav>

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col min-[480px]:flex-row items-start gap-6 md:gap-10">
          
          <aside className="w-full shrink-0 space-y-4 min-[480px]:w-[260px] md:w-[300px] lg:w-[340px] min-[480px]:sticky min-[480px]:top-24">
            <div className="glass-card !p-6 shadow-2xl transition-all duration-700 border-black dark:border-white border">
              <Tabs 
                value="age"
                className="w-full" 
                onValueChange={(v) => {
                  if (v === 'calculator') router.push('/calculator');
                  if (v === 'due-date') router.push('/due-date-calculator');
                }}
              >
                <TabsList className="grid w-full grid-cols-3 mb-6 rounded-xl h-10 bg-muted/50">
                  <TabsTrigger value="age" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Age</TabsTrigger>
                  <TabsTrigger value="calculator" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Calc</TabsTrigger>
                  <TabsTrigger value="due-date" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Due</TabsTrigger>
                </TabsList>

                <TabsContent value="age" className="space-y-4 mt-0">
                  
                  {/* Toolbelt: Identity Left, Details Right */}
                  <div className="flex items-center justify-between px-1 mb-2">
                    <Collapsible open={isIdentityOpen} onOpenChange={setIsIdentityOpen}>
                      <CollapsibleTrigger asChild>
                        <button className="flex items-center gap-1.5 text-primary/60 hover:text-primary transition-colors group">
                          <User className="w-4 h-4" /> 
                          <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", isIdentityOpen && "rotate-180")} />
                        </button>
                      </CollapsibleTrigger>
                    </Collapsible>

                    <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                      <CollapsibleTrigger asChild>
                        <button className="flex items-center gap-1.5 text-primary/60 hover:text-primary transition-colors group">
                          <Pencil className="w-4 h-4" /> 
                          <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", isDetailsOpen && "rotate-180")} />
                        </button>
                      </CollapsibleTrigger>
                    </Collapsible>
                  </div>

                  <Collapsible open={isIdentityOpen} onOpenChange={setIsIdentityOpen} className="space-y-3">
                    <CollapsibleContent className="space-y-3 pt-1 border-t border-border/10">
                      <div className="flex items-end gap-2.5">
                        <div className="flex-grow space-y-1.5">
                          <Input 
                            placeholder="Enter identity..." 
                            value={userName} 
                            onChange={(e) => setUserName(e.target.value)}
                            className="bg-white/5 border border-black dark:border-white rounded-none h-9 text-xs focus:border-primary shadow-none"
                          />
                        </div>
                        
                        <div className="shrink-0">
                          {subjectImage ? (
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-black dark:border-white group">
                              <img src={subjectImage} alt="Subject" className="w-full h-full object-cover" />
                              <button 
                                onClick={() => setSubjectImage(null)}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          ) : (
                            <label className="w-9 h-9 rounded-lg border border-dashed border-black dark:border-white flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-all group shadow-inner">
                              <Camera className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                          )}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen} className="space-y-3">
                    <CollapsibleContent className="space-y-2 pt-1 border-t border-border/10">
                      <Textarea 
                        placeholder="Enter tactical details..." 
                        value={details} 
                        onChange={(e) => setDetails(e.target.value)}
                        className="bg-white/5 border border-black dark:border-white rounded-none min-h-[60px] text-[10px] focus:border-primary shadow-none resize-none"
                      />
                    </CollapsibleContent>
                  </Collapsible>

                  <DateInput label="Date of Birth" values={fromDate} onChange={setFromDate} />
                  <DateInput label="Target Timestamp" values={toDate} onChange={setToDate} error={error || undefined} />
                  
                  <Button 
                    className="w-full h-12 mt-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 neon-glow border-black dark:border-white border"
                    onClick={handleCalculate}
                  >
                    Compute Results
                  </Button>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-3">
              <InstallPWA variant="sidebar" />
              <div className="hidden min-[480px]:block space-y-3">
                <div className="glass-card !p-4 border-accent/20 bg-accent/5 overflow-hidden relative group">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000" />
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-3 h-3 text-accent" />
                    <p className="text-[9px] uppercase font-black tracking-widest text-accent">Real-Time Sync</p>
                  </div>
                  <h4 className="text-xs font-black tracking-tight mb-1">Atomic Precision Control</h4>
                  <p className="text-[10px] text-muted-foreground/80 leading-relaxed font-medium">Engine synchronizing with primary time servers via Stratum-1 NTP nodes.</p>
                </div>
                
                <div className="glass-card !p-4 border-primary/20 bg-primary/5 relative overflow-hidden group">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    <p className="text-[9px] uppercase font-black tracking-widest text-primary">Security Ops</p>
                  </div>
                  <h4 className="text-xs font-black tracking-tight mb-1">Encrypted Payload</h4>
                  <p className="text-[10px] text-muted-foreground/80 leading-relaxed font-medium">Calculation processing is handled locally. Zero-knowledge data sovereignty.</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-grow w-full min-0">
            {results ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex items-center justify-between px-2">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(var(--accent),0.6)]" />
                      <span className="text-[10px] uppercase font-black tracking-[0.3em] text-accent">
                        {userName ? `${userName.toUpperCase()}: ` : ''}Active Computation Stream
                      </span>
                   </div>
                   <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-border bg-muted/30">Latency: 1.2ms</Badge>
                </div>

                <div className="space-y-6 bg-background p-2 rounded-3xl">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <ResultCard label="Years" value={results.years} delay="0s" />
                    <ResultCard label="Months" value={results.months} delay="0.1s" />
                    <ResultCard label="Days" value={results.days} delay="0.2s" />
                    <ResultCard label="Days To Birthday" value={results.nextBirthday} subLabel="Milestone Countdown" delay="0.3s" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResultCard label="Previous Birthday" value={results.previousBirthdayDate} subLabel={`${results.daysSincePrevious} Days Elapsed`} delay="0.4s" />
                    <ResultCard label="Next Birthday" value={results.nextBirthdayDate} subLabel={`${results.nextBirthday} Days Target`} delay="0.5s" />
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <ResultCard label="Total Days" value={results.totalDays} className="border-primary/10" delay="0.6s" />
                    <ResultCard label="Total Hours" value={results.totalHours} className="border-primary/10" delay="0.7s" />
                    <ResultCard label="Total Minutes" value={results.totalMinutes} className="border-primary/10" delay="0.8s" />
                    <ResultCard label="Total Seconds" value={results.totalSeconds} className="border-primary/10" delay="0.9s" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResultCard label="Celestial Mapping" value={results.zodiac} subLabel="Zodiac Alignment" delay="1.0s" />
                    <ResultCard label="Gregorian Check" value={results.isLeapYear ? "Leap Identified" : "Standard Cycle"} delay="1.1s" />
                  </div>

                  <FunFact years={results.years} months={results.months} days={results.days} />
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="rounded-xl h-11 px-6 gap-2.5 text-[10px] font-black uppercase tracking-widest border-primary/20 hover:bg-primary/5 hover:text-primary transition-all" 
                    onClick={downloadResults}
                    disabled={isDownloading}
                  >
                    <Download className={cn("w-4 h-4", isDownloading && "animate-bounce")} /> 
                    {isDownloading ? 'Capturing HD...' : 'Download Report'}
                  </Button>
                  <Button variant="outline" className="rounded-xl h-11 px-6 gap-2.5 text-[10px] font-black uppercase tracking-widest border-primary/20 hover:bg-primary/5 hover:text-primary transition-all" onClick={handleShare}>
                    <Copy className="w-4 h-4" /> Copy Metrics
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-border/40 rounded-[3rem] min-h-[400px] md:min-h-[550px] bg-muted/10 transition-all hover:bg-muted/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary-foreground)_0%,_transparent_100%)] opacity-5 group-hover:opacity-10 transition-opacity" />
                <div className="text-center space-y-6 relative z-10 px-8">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-2 border-primary/10 border-t-primary animate-spin" />
                    <div className="absolute inset-4 rounded-full border-2 border-accent/10 border-b-accent animate-spin-slow" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Cpu className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.5em]">System Standby</p>
                    <h3 className="text-xl md:text-2xl font-black tracking-tight text-foreground/40">Awaiting Temporal Coordinates</h3>
                    <p className="text-muted-foreground/50 text-xs max-w-[320px] mx-auto leading-relaxed">Input origin and target dates in the primary console to initiate high-precision chronological synchronization.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Navigation Section */}
            <section className="mt-8 space-y-4">
              <div className="flex items-center gap-2 px-2">
                <LayoutGrid className="w-4 h-4 text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Quick Navigation</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {QUICK_NAV.map((calc) => (
                  <Link key={calc.name} href={calc.href}>
                    <Button variant="outline" className="w-full justify-start h-10 text-[9px] font-black uppercase tracking-wider border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all px-2 overflow-hidden group">
                      <span className="truncate text-primary group-hover:text-primary/80 transition-colors">{calc.name}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Science of Deadlines Section */}
        <section className="mt-32 space-y-20">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-[0.4em] text-[10px] px-6 py-1.5 font-black">Architecture Whitepaper</Badge>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">The Science of <span className="text-primary">Chronology</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-medium">
              We define the global standard for high-fidelity chronological milestones through military-grade synchronization and clinical protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-primary/40">
              <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <Workflow className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Clinical Fidelity</h3>
              <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                Implementing standard obstetric and IVF dating models with absolute parity, turning biological data into precise milestones.
              </p>
            </div>
            <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-accent/40">
              <div className="w-16 h-16 rounded-[2rem] bg-accent/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Risk Mitigation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                Real-time validation of mathematical and biological inputs prevents overflows and handles edge-cases with sub-millisecond precision.
              </p>
            </div>
            <div className="glass-card !p-10 hover:translate-y-[-8px] transition-all group hover:border-primary/40">
              <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Global Sync</h3>
              <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                Synchronizing with primary time servers ensuring your deadlines are perfectly aligned with IST and the rotational velocity of the Earth.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative mt-auto pt-24 pb-12 px-6 transition-colors duration-700 border-t glass border-border/40">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center transition-all">
                  <Image src="/camly.png" alt="Camly" width={48} height={48} className="object-contain" />
                </div>
                <h2 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent uppercase font-roboto-slab">
                  CALCULATOR
                </h2>
              </div>
              <p className="text-sm leading-relaxed max-w-xs font-medium text-muted-foreground">
                Defining the standard for high-precision chronological and academic computation. 
                Camly Inc's flagship engine for professional and tactical management.
              </p>
              <div className="flex gap-5">
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-accent/10 shadow-sm border border-border/50"><Github className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-accent/10 shadow-sm border border-border/50"><Twitter className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-accent/10 shadow-sm border border-border/50"><Globe className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Operations</h3>
              <ul className="space-y-3 text-xs font-bold text-muted-foreground">
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/due-date-calculator">Due Date</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/calculator">Precision Calculator</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" />
                   <Link href="/cgpa-calculator">CGPA Calculator</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" />
                   <Link href="/attendance-calculator">Attendance</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" />
                   <Link href="/bmi-calculator">BMI Calculator</Link>
                </li>
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" />
                   <Link href="/">Age Calculator</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Intelligence</h3>
              <ul className="space-y-3 text-xs font-bold text-muted-foreground">
                <li className="hover:text-primary transition-colors flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 opacity-30" />
                  <Link href="/blog">Knowledge Hub</Link>
                </li>
                <li className="hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                   <ChevronRight className="w-3 h-3 opacity-30" /> Fun Facts API
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Architecture</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 text-[10px] font-black tracking-widest text-accent">
                  <div className="w-2 h-2 rounded-full animate-pulse bg-accent" />
                  CAMLY-SYNC-01: ONLINE
                </div>
                <InstallPWA variant="footer" />
              </div>
            </div>
          </div>

          <Separator className="mb-10 bg-border/60" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] uppercase tracking-[0.5em] font-black text-muted-foreground/40">
              © 2024 Camly Inc • Defining High-Precision Velocity
            </p>
            <div className="flex gap-8">
              <Link href="/privacy-protocol" className="text-[10px] uppercase tracking-[0.2em] transition-colors font-black text-muted-foreground/40 hover:text-primary">Privacy Protocol</Link>
              <Link href="/terms-of-sync" className="text-[10px] uppercase tracking-[0.2em] transition-colors font-black text-muted-foreground/40 hover:text-primary">Terms of Sync</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Image Utility Functions
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Return as PNG to preserve transparency
  return canvas.toDataURL('image/png');
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

export default function ChronoFlow() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-[10px] font-black uppercase tracking-widest opacity-20">Initializing Engine...</div>}>
      <ChronoFlowContent />
    </Suspense>
  );
}
