"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Eye, Database, Globe, UserCheck, FileText, Scale, Zap, Info, Clock, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const privacySchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "ChronoFlow Privacy Protocol",
  "description": "Comprehensive data privacy and sovereignty protocol for the ChronoFlow High-Precision Chronological Engine.",
  "publisher": {
    "@type": "Organization",
    "name": "ChronoFlow Operations"
  }
};

export default function PrivacyProtocolPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
      
      <nav className="relative z-50 glass border-b border-border h-14 flex items-center px-4 md:px-8 justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Back to Engine</span>
        </Link>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-widest text-[9px] px-3 py-1">
            Protocol v1.4.2 Verified
          </Badge>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <header className="space-y-6 mb-16">
          <div className="flex gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20">System Integrity</Badge>
            <Badge variant="outline">User Sovereignty</Badge>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.95] md:leading-[0.85]">
            The ChronoFlow <span className="text-primary">Privacy Protocol</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-6 py-2">
            "Your time is yours. Your data is yours. Our protocol is built on the non-negotiable principle of absolute user sovereignty."
          </p>
          <div className="flex items-center gap-6 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-[10px] uppercase font-black tracking-widest">
                <div className="text-foreground">Security Operations Team</div>
                <div className="text-muted-foreground">Encryption & Protocol Division</div>
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Audit</span>
              <span className="text-xs font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> May 28, 2024</span>
            </div>
          </div>
        </header>

        <section className="prose prose-invert prose-primary max-w-none space-y-12 text-muted-foreground text-sm md:text-lg leading-relaxed">
          <div className="glass p-8 md:p-12 border-primary/20 bg-primary/5 rounded-[40px] mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight mt-0 mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6" /> Executive Summary of Sovereignty
            </h2>
            <p className="text-foreground font-medium mb-4">
              At ChronoFlow, we don't just "collect" data; we facilitate your interaction with your own chronological history. 
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
              <li className="flex gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                  <UserCheck className="w-3 h-3 text-accent" />
                </div>
                <span><strong>No Account Required:</strong> Most features work entirely without personal identification.</span>
              </li>
              <li className="flex gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                  <Database className="w-3 h-3 text-accent" />
                </div>
                <span><strong>Local-First Storage:</strong> Your calculations stay on your device whenever possible.</span>
              </li>
              <li className="flex gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                  <Lock className="w-3 h-3 text-accent" />
                </div>
                <span><strong>E2E Encryption:</strong> Any data synced with our systems is protected by military-grade standards.</span>
              </li>
              <li className="flex gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                  <Eye className="w-3 h-3 text-accent" />
                </div>
                <span><strong>Zero-Knowledge AI:</strong> Your inputs to our AI flows are processed and immediately discarded.</span>
              </li>
            </ul>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">1. Data Architecture & Collection</h2>
          <p>
            The ChronoFlow High-Precision Engine is built on a "Privacy by Design" framework. We distinguish between three types of data:
          </p>
          
          <div className="space-y-8 my-12">
            <div className="glass p-8 rounded-3xl border-border">
              <h4 className="text-foreground font-black mb-2 text-xl tracking-tight flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" /> Volatile Chronological Data (VCD)
              </h4>
              <p className="text-sm opacity-80 leading-relaxed mb-4">
                This includes the specific dates of birth or "from/to" dates you input into the calculator.
              </p>
              <Badge variant="secondary" className="text-[10px]">Processing: Local-Only / LocalStorage</Badge>
              <p className="text-xs mt-4 italic opacity-60">VCD is never transmitted to our servers unless you explicitly trigger an AI insight flow, at which point it is handled under our Zero-Knowledge protocol.</p>
            </div>

            <div className="glass p-8 rounded-3xl border-border">
              <h4 className="text-foreground font-black mb-2 text-xl tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" /> Inference Input Data (IID)
              </h4>
              <p className="text-sm opacity-80 leading-relaxed mb-4">
                When you request a "Fun Fact" or "AI Insight," your age metrics (years, months, days) are passed to our Genkit backend.
              </p>
              <Badge variant="secondary" className="text-[10px]">Processing: Stateless Serverless Function</Badge>
              <p className="text-xs mt-4 italic opacity-60">IID is used as a prompt variable for Google Gemini 1.5 Flash. It is not used for model training and is purged upon completion of the generation task.</p>
            </div>

            <div className="glass p-8 rounded-3xl border-border">
              <h4 className="text-foreground font-black mb-2 text-xl tracking-tight flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> System Telemetry
              </h4>
              <p className="text-sm opacity-80 leading-relaxed mb-4">
                We collect anonymous technical logs to ensure the stability of the high-precision engine.
              </p>
              <Badge variant="secondary" className="text-[10px]">Processing: Anonymized Aggregation</Badge>
              <p className="text-xs mt-4 italic opacity-60">Includes browser version, screen resolution (e.g., detecting the 5-8 inch range for layout optimization), and error reports.</p>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">2. The Genkit & LLM Privacy Layer</h2>
          <p>
            Integrating Generative AI into a personal utility requires extreme care. Our Genkit architecture ensures that your personal chronological milestones are treated with the highest level of confidentiality.
          </p>
          <p>
            <strong>The Zero-Storage Policy:</strong> Our backend "Flows" are stateless. This means that once the AI has generated your age-related fact, the context is cleared. There is no persistent memory of your birth date on the AI server. 
          </p>
          <div className="border-l-4 border-accent pl-8 py-4 bg-accent/5 my-8">
            <h3 className="text-xl font-black text-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" /> Enterprise-Grade AI Safety
            </h3>
            <p className="text-sm opacity-90">
              We leverage Google's Generative AI safety settings to prevent the processing of sensitive or prohibited content. Your inputs are filtered locally before reaching the inference engine, providing a dual-layer of protection.
            </p>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">3. Cookies and Persistent Memory</h2>
          <p>
            ChronoFlow uses minimal persistent storage. We utilize the following mechanisms:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li><strong>LocalStorage:</strong> We store your last entered dates and theme preferences locally in your browser. This allows for a "fast resume" experience. We never access this data remotely.</li>
            <li><strong>Session Cookies:</strong> Temporary tokens used to manage your connection to our high-precision engine services during a single visit.</li>
            <li><strong>Essential Analytics:</strong> We use lightweight, privacy-focused analytics to understand how users interact with our Blog Hub and Calculator. We do not use cross-site tracking or invasive fingerprinting.</li>
          </ol>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">4. Global Compliance Standards</h2>
          <p>
            While our engine operates globally, we adhere to the strictest regional privacy regulations as our baseline:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="space-y-4">
              <Badge className="bg-primary/20 text-primary border-primary/20 font-black">GDPR (EU)</Badge>
              <h4 className="text-foreground font-bold">General Data Protection Regulation</h4>
              <p className="text-xs leading-relaxed opacity-80">
                EU citizens have the right to access, rectify, or erase any data we might hold. Since we focus on local-first storage, your primary mechanism for data erasure is simply clearing your browser cache.
              </p>
            </div>
            <div className="space-y-4">
              <Badge className="bg-accent/20 text-accent border-accent/20 font-black">CCPA (USA)</Badge>
              <h4 className="text-foreground font-bold">California Consumer Privacy Act</h4>
              <p className="text-xs leading-relaxed opacity-80">
                California residents have the right to know what personal data is being collected and to opt-out of its sale. ChronoFlow NEVER sells data. We are a utility, not a data broker.
              </p>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">5. Data Retention & Purging</h2>
          <p>
            Because we do not require account creation for standard use, we do not maintain a permanent user database for non-authenticated users. 
          </p>
          <ul className="space-y-4 list-none p-0">
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Info className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-sm"><strong>In-App Data:</strong> Retained in your browser's LocalStorage until you clear it.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Info className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-sm"><strong>Server Logs:</strong> Automatically purged every 30 days.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <Info className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-sm"><strong>AI Context:</strong> Discarded immediately after the API response is sent to your device.</p>
            </li>
          </ul>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">6. Security Infrastructure</h2>
          <p>
            The ChronoFlow engine is hosted on a secure, distributed cloud infrastructure. We implement:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li><strong>Transport Layer Security (TLS):</strong> All data in transit is encrypted via HTTPS.</li>
            <li><strong>DDoS Protection:</strong> Multi-layered defense systems to ensure 99.9% availability of the precision engine.</li>
            <li><strong>Regular Audits:</strong> Our Security Operations Team performs weekly protocol audits to identify and mitigate potential vulnerabilities.</li>
          </ul>

          <div className="glass p-10 border-destructive/20 bg-destructive/5 rounded-[40px] my-16">
            <h3 className="text-2xl font-black text-destructive uppercase tracking-tighter mb-6 flex items-center gap-3">
              <AlertCircle className="w-8 h-8" /> Critical Alert: Third-Party Links
            </h3>
            <p className="text-sm leading-relaxed opacity-90">
              Our Blog Hub contains links to external resources and social platforms. Once you exit the ChronoFlow domain, our Privacy Protocol no longer applies. We encourage you to review the privacy policies of any external site you visit.
            </p>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">7. Your Rights & Redress</h2>
          <p>
            You are the master of your chronological destiny. You have the right to:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li><strong>Request Transparency:</strong> Inquire about any data we process.</li>
            <li><strong>Demand Deletion:</strong> Ask us to remove any server logs associated with your IP address.</li>
            <li><strong>Limit Processing:</strong> Disable AI features if you prefer not to use our Genkit infrastructure.</li>
            <li><strong>Data Portability:</strong> Use our "Copy Results" feature to export your chronological data for your own records.</li>
          </ol>

          <Separator className="my-16 opacity-10" />

          <div className="space-y-8">
            <h3 className="text-2xl font-black text-foreground tracking-tight">Closing Statement on Trust</h3>
            <p>
              In a digital landscape dominated by data exploitation, ChronoFlow stands as a bastion of precision and privacy. We believe that a utility app should be a tool that serves the user, not a net that captures their identity. This protocol is our bond to you.
            </p>
            <div className="pt-10 flex flex-col md:flex-row gap-4">
              <Link href="/">
                <Button className="w-full md:w-fit h-16 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-2xl px-12">
                  Accept & Return to Engine
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" className="w-full md:w-fit h-16 border-border font-black text-xs uppercase tracking-widest rounded-2xl px-12">
                  Read More Insights
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="mt-32 pt-16 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-2 text-center md:text-left">
              <p className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Chief Data Sovereignty Officer</p>
              <p className="text-lg font-bold">ChronoFlow Security Group</p>
            </div>
            <div className="flex gap-4">
               <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest px-4 py-2 flex items-center gap-2">
                 <Scale className="w-3.5 h-3.5" /> Law Verified
               </Badge>
               <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest px-4 py-2 flex items-center gap-2">
                 <FileText className="w-3.5 h-3.5" /> ISO 27001 Ready
               </Badge>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
