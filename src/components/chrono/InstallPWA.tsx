"use client";

import React, { useState, useEffect } from 'react';
import { Download, Monitor, Smartphone } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }

    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <Button 
        onClick={handleInstallClick}
        variant="outline"
        className="w-full h-10 border-accent/20 bg-accent/5 hover:bg-accent/10 text-accent text-[9px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 transition-all group"
      >
        <Download className="w-3.5 h-3.5 group-hover:bounce" />
        Install Engine
      </Button>
      <div className="flex items-center justify-center gap-4 opacity-40">
        <Monitor className="w-3 h-3" />
        <Smartphone className="w-3 h-3" />
        <span className="text-[8px] font-bold uppercase tracking-widest">Cross-Platform Sync</span>
      </div>
    </div>
  );
}
