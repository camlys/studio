"use client";

import React, { useState, useEffect } from 'react';
import { Download, Monitor, Smartphone, Zap, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;

  return (
    <div className="glass-card !p-5 border-accent/20 bg-accent/5 overflow-hidden relative group animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
      
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-3.5 h-3.5 text-accent animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">Cross-Platform Sync</span>
      </div>
      
      <div className="space-y-3 relative z-10">
        <div className="space-y-1">
          <h4 className="text-xs font-black tracking-tight text-foreground">Operational Standby</h4>
          <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">Add Camly to your home screen for high-fidelity offline computation.</p>
        </div>

        <Button 
          onClick={handleInstallClick}
          className="w-full h-10 bg-accent text-accent-foreground hover:bg-accent/90 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-accent/10 border-black border-2"
        >
          <Download className="w-3.5 h-3.5" />
          Install Engine
        </Button>

        <div className="flex items-center justify-center gap-4 opacity-30 pt-1">
          <Monitor className="w-4 h-4" />
          <Smartphone className="w-4 h-4" />
          <ShieldCheck className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
