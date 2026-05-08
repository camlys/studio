"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Server, Lock, Fingerprint, Activity, Zap, Info, Clock, AlertCircle, Database, ShieldCheck, Cpu, Globe, Key, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const securitySchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "ChronoFlow Security Operations Center",
  "description": "Comprehensive security architecture and threat mitigation protocols for the ChronoFlow High-Precision Chronological Engine.",
  "publisher": {
    "@type": "Organization",
    "name": "ChronoFlow Operations"
  }
};

export default function SecurityOpsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(securitySchema) }}
      />
      
      <nav className="sticky top-0 z-50 glass border-b border-border h-14 flex items-center px-4 md:px-8 justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Back to Engine</span>
        </Link>
        <div className="flex items-center gap-4">
          <Badge className="bg-accent/10 text-accent border-accent/20 uppercase tracking-widest text-[9px] px-3 py-1 animate-pulse">
            System Status: 100% Secure
          </Badge>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <header className="space-y-6 mb-16">
          <div className="flex gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest font-black text-[9px]">Defense-In-Depth</Badge>
            <Badge variant="outline" className="uppercase tracking-widest font-black text-[9px]">Infrastructure Resilience</Badge>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.95] md:leading-[0.85]">
            Security <span className="text-primary">Operations</span> & Architecture
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-6 py-2">
            "The integrity of time requires the absolute integrity of the system. Our Security Operations represent the fortress around the chronological record."
          </p>
          <div className="flex items-center gap-6 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-destructive to-primary flex items-center justify-center text-white">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="text-[10px] uppercase font-black tracking-widest">
                <div className="text-foreground">Security Operations (SecOps)</div>
                <div className="text-muted-foreground">Threat Intelligence Division</div>
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Perimeter Scan</span>
              <span className="text-xs font-bold flex items-center gap-1.5 font-mono"><Clock className="w-3.5 h-3.5 text-primary" /> REAL-TIME</span>
            </div>
          </div>
        </header>

        <section className="prose prose-invert prose-primary max-w-none space-y-12 text-muted-foreground text-sm md:text-lg leading-relaxed">
          <div className="glass p-8 md:p-12 border-primary/20 bg-primary/5 rounded-[40px] mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Fingerprint className="w-24 h-24 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight mt-0 mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6" /> Security Mission Statement
            </h2>
            <p className="text-foreground font-medium mb-4">
              At ChronoFlow, security is not a feature—it is the foundational state. Our Security Operations Center (SOC) operates 24/7/365 to maintain the highest levels of computational integrity.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
               <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Lock className="w-5 h-5 text-accent mb-2" />
                  <h4 className="text-foreground font-bold text-xs uppercase tracking-widest">Zero-Trust Architecture</h4>
                  <p className="text-[10px] opacity-70">Never trust, always verify every request at the network perimeter.</p>
               </div>
               <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Activity className="w-5 h-5 text-accent mb-2" />
                  <h4 className="text-foreground font-bold text-xs uppercase tracking-widest">Active Threat Mitigation</h4>
                  <p className="text-[10px] opacity-70">Real-time anomaly detection using machine learning algorithms.</p>
               </div>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">1. Infrastructure Resilience</h2>
          <p>
            The ChronoFlow Engine resides on a global, decentralized cloud infrastructure designed for maximum availability and minimal vulnerability surface area.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="glass p-8 rounded-3xl border-border">
              <Server className="w-10 h-10 text-primary mb-6" />
              <h4 className="text-foreground font-black mb-2 text-xl tracking-tight">Multi-Region Failover</h4>
              <p className="text-sm opacity-80 leading-relaxed">System redundancy across three geographic zones ensures that even major cloud outages do not disrupt the precision feed.</p>
            </div>
            <div className="glass p-8 rounded-3xl border-border">
              <Cpu className="w-10 h-10 text-accent mb-6" />
              <h4 className="text-foreground font-black mb-2 text-xl tracking-tight">Serverless Compute</h4>
              <p className="text-sm opacity-80 leading-relaxed">Stateless, short-lived functions minimize the risk of persistent server-side attacks and privilege escalation.</p>
            </div>
            <div className="glass p-8 rounded-3xl border-border">
              <ShieldCheck className="w-10 h-10 text-primary mb-6" />
              <h4 className="text-foreground font-black mb-2 text-xl tracking-tight">DDoS Shield</h4>
              <p className="text-sm opacity-80 leading-relaxed">Enterprise-grade scrubbing layers protect the Engine from volumetric and protocol-level floods.</p>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">2. Data Sovereignty & Encryption</h2>
          <p>
            We treat your chronological data with the same intensity as financial records. Our encryption protocols are designed to be "future-proof."
          </p>
          <ul className="space-y-6 list-none p-0">
            <li className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-foreground font-black uppercase tracking-widest text-sm mb-1">AES-256 GCM Encryption</h4>
                <p className="text-sm opacity-80">All data persisted in LocalStorage or transiently stored in system memory is encrypted using Advanced Encryption Standard with Galois/Counter Mode for authenticated integrity.</p>
              </div>
            </li>
            <li className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h4 className="text-foreground font-black uppercase tracking-widest text-sm mb-1">TLS 1.3 Mandatory</h4>
                <p className="text-sm opacity-80">We force Transport Layer Security 1.3 for all communications. Deprecated protocols like TLS 1.0/1.1 and SSL are blocked at the perimeter to prevent downgrade attacks.</p>
              </div>
            </li>
          </ul>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">3. AI Safety & Genkit Isolation</h2>
          <p>
            Integrating Google Genkit requires a specialized security layer to prevent "prompt injection" and data leakage.
          </p>
          <div className="glass p-10 border-primary/20 bg-primary/5 rounded-[40px] my-16">
            <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-6 flex items-center gap-3">
              <Eye className="w-8 h-8" /> Zero-Knowledge AI Logic
            </h3>
            <p className="text-sm leading-relaxed opacity-90 mb-6">
              Our "Inference Isolation" protocol ensures that while the AI receives your age metrics to generate a fact, it never receives your PII (Personally Identifiable Information). 
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
              <li className="flex items-center gap-2 text-xs font-bold text-foreground">
                <CheckCircle className="w-4 h-4 text-accent" /> Input Sanitation
              </li>
              <li className="flex items-center gap-2 text-xs font-bold text-foreground">
                <CheckCircle className="w-4 h-4 text-accent" /> Output Validation
              </li>
              <li className="flex items-center gap-2 text-xs font-bold text-foreground">
                <CheckCircle className="w-4 h-4 text-accent" /> Prompt Masking
              </li>
              <li className="flex items-center gap-2 text-xs font-bold text-foreground">
                <CheckCircle className="w-4 h-4 text-accent" /> Stateless Execution
              </li>
            </ul>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">4. Vulnerability Management</h2>
          <p>
            ChronoFlow follows a strict CI/CD security pipeline. Every update to the Engine undergoes automated security testing.
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li><strong>Static Analysis (SAST):</strong> Automated code scanning for common vulnerabilities (OWASP Top 10).</li>
            <li><strong>Dependency Monitoring:</strong> Real-time tracking of all third-party libraries (npm) for reported CVEs.</li>
            <li><strong>Manual Penetration Testing:</strong> Quarterly deep-dive audits performed by our senior SecOps architects.</li>
            <li><strong>Bug Bounty Program:</strong> We encourage responsible disclosure from the security community through our private bounty channel.</li>
          </ol>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">5. Incident Response Protocol</h2>
          <p>
            In the unlikely event of a security anomaly, our Incident Response Team activates a 4-stage containment strategy:
          </p>
          <div className="space-y-6 my-12">
            <div className="p-6 rounded-3xl border border-border bg-muted/20">
              <h4 className="text-foreground font-black text-xs uppercase tracking-widest mb-2">Stage 1: Identification & Triage</h4>
              <p className="text-xs opacity-70">Detection via SIEM (Security Information and Event Management) and immediate classification of threat level.</p>
            </div>
            <div className="p-6 rounded-3xl border border-border bg-muted/20">
              <h4 className="text-foreground font-black text-xs uppercase tracking-widest mb-2">Stage 2: Perimeter Isolation</h4>
              <p className="text-xs opacity-70">Decoupling affected components from the main Engine to prevent lateral movement.</p>
            </div>
            <div className="p-6 rounded-3xl border border-border bg-muted/20">
              <h4 className="text-foreground font-black text-xs uppercase tracking-widest mb-2">Stage 3: Eradication & Recovery</h4>
              <p className="text-xs opacity-70">Removal of the threat vector and restoration of services from encrypted, validated backups.</p>
            </div>
            <div className="p-6 rounded-3xl border border-border bg-muted/20">
              <h4 className="text-foreground font-black text-xs uppercase tracking-widest mb-2">Stage 4: Post-Mortem Analysis</h4>
              <p className="text-xs opacity-70">Full root-cause analysis and system hardening to prevent recurrence.</p>
            </div>
          </div>

          <div className="glass p-10 border-destructive/20 bg-destructive/5 rounded-[40px] my-16">
            <h3 className="text-2xl font-black text-destructive uppercase tracking-tighter mb-6 flex items-center gap-3">
              <AlertCircle className="w-8 h-8" /> Security Disclosure
            </h3>
            <p className="text-sm leading-relaxed opacity-90">
              Security is a shared responsibility. We never request your passwords, seed phrases, or master keys. If you receive a communication claiming to be from ChronoFlow SecOps asking for sensitive credentials, it is a phishing attempt. Report it immediately to <span className="font-bold underline">security@chronoflow.app</span>.
            </p>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">6. Compliance & Auditing</h2>
          <p>
            Our security standards are aligned with global industry benchmarks, ensuring that our operations meet the highest legal and ethical requirements.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
            <div className="p-4 border border-border rounded-xl text-center">
              <span className="text-[10px] font-black uppercase text-muted-foreground">ISO 27001</span>
            </div>
            <div className="p-4 border border-border rounded-xl text-center">
              <span className="text-[10px] font-black uppercase text-muted-foreground">SOC 2 Type II</span>
            </div>
            <div className="p-4 border border-border rounded-xl text-center">
              <span className="text-[10px] font-black uppercase text-muted-foreground">GDPR Ready</span>
            </div>
            <div className="p-4 border border-border rounded-xl text-center">
              <span className="text-[10px] font-black uppercase text-muted-foreground">HIPAA Compliant</span>
            </div>
          </div>

          <Separator className="my-16 opacity-10" />

          <div className="space-y-8">
            <h3 className="text-2xl font-black text-foreground tracking-tight">Continuous Security Evolution</h3>
            <p>
              Threat landscapes change, and so must we. The ChronoFlow SecOps team is committed to the continuous evolution of our defense systems, ensuring that your chronological records remain as secure as they are precise.
            </p>
            <div className="pt-10 flex flex-col md:flex-row gap-4">
              <Link href="/">
                <Button className="w-full md:w-fit h-16 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl px-12">
                  Launch Secure Engine
                </Button>
              </Link>
              <Link href="/privacy-protocol">
                <Button variant="outline" className="w-full md:w-fit h-16 border-border font-black text-xs uppercase tracking-widest rounded-2xl px-12">
                  View Privacy Protocol
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-32 pt-16 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Chief Security Officer</p>
              <p className="text-lg font-bold">ChronoFlow Security Operations Center</p>
            </div>
            <div className="flex gap-4">
               <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest px-4 py-2 flex items-center gap-2">
                 <ShieldCheck className="w-3.5 h-3.5" /> SOC Verified
               </Badge>
               <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest px-4 py-2 flex items-center gap-2">
                 <Cpu className="w-3.5 h-3.5" /> Hardware Hardened
               </Badge>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
