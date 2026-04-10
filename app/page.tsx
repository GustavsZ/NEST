import Link from "next/link";
import { Camera, Zap, DollarSign, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-nest-bg text-nest-primary">
      {/* Nav */}
      <header className="border-b border-[rgba(255,255,255,0.08)] px-8 h-14 flex items-center justify-between max-w-[1280px] mx-auto">
        <div className="flex items-center gap-1">
          <span className="text-lg font-semibold tracking-tight">nest</span>
          <div className="w-1.5 h-1.5 rounded-full bg-nest-accent mb-0.5 ml-0.5" />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-9 px-4 text-sm text-nest-secondary hover:text-nest-primary transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] transition-colors"
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-8 pt-24 pb-20 text-center relative">
        <div
          className="absolute inset-x-0 top-0 h-64 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(221,92,40,0.08) 0%, transparent 70%)" }}
        />
        <p className="text-[10px] font-medium uppercase tracking-widest text-nest-accent mb-5">
          Captomatic Nest Platform
        </p>
        <h1 className="text-[48px] font-light tracking-tight leading-tight text-nest-primary max-w-2xl mx-auto">
          Automate Guest Photo Capture.{" "}
          <span className="text-nest-accent">Zero Effort.</span>
        </h1>
        <p className="text-lg text-nest-secondary mt-6 max-w-lg mx-auto leading-relaxed">
          From installation to first sale in under an hour. Nest gives attraction operators a complete system for automated capture, delivery, and monetization.
        </p>
        <div className="flex items-center justify-center gap-3 mt-10">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] transition-colors"
          >
            Get started free <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-11 px-6 text-sm border border-[rgba(255,255,255,0.14)] bg-transparent text-nest-primary hover:bg-nest-surface-2 rounded-[10px] transition-colors"
          >
            See the demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-[1280px] mx-auto px-8 pb-20">
        <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted text-center mb-10">
          Everything you need to run a capture operation
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Zap, title: "One-click setup", description: "Install, scan, configure. Your system is live in minutes, not days." },
            { icon: Camera, title: "Instant guest delivery", description: "Guests scan a QR code and receive their photos immediately — no app download required." },
            { icon: DollarSign, title: "Revenue on autopilot", description: "Payments go directly to your Stripe account. Full visibility, zero manual work." },
          ].map((feature) => (
            <div key={feature.title} className="rounded-[14px] bg-nest-surface border border-[rgba(255,255,255,0.08)] p-6">
              <div className="w-9 h-9 rounded-[10px] bg-nest-surface-2 flex items-center justify-center mb-4">
                <feature.icon className="w-4 h-4 text-nest-accent" />
              </div>
              <h3 className="text-sm font-medium text-nest-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-nest-secondary leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[rgba(255,255,255,0.08)] py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted text-center mb-10">How it works</p>
          <div className="grid grid-cols-4 gap-6">
            {[
              { step: "01", title: "Register", description: "Create your account and set up your workspace." },
              { step: "02", title: "Connect device", description: "Install the Nest app on your Android capture device." },
              { step: "03", title: "Configure", description: "Set your content type, template, and display layout." },
              { step: "04", title: "Go live", description: "Guests scan, purchase, and receive their media instantly." },
            ].map((item) => (
              <div key={item.step}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs text-nest-accent">{item.step}</span>
                  <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
                </div>
                <h3 className="text-sm font-medium text-nest-primary mb-1.5">{item.title}</h3>
                <p className="text-xs text-nest-secondary leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[rgba(255,255,255,0.08)] py-20">
        <div className="max-w-[1280px] mx-auto px-8 text-center">
          <h2 className="text-[32px] font-light tracking-tight text-nest-primary mb-4">Ready to activate your system?</h2>
          <p className="text-nest-secondary mb-8">No credit card required. Free to start.</p>
          <div className="flex items-center justify-center gap-6 flex-wrap mb-8">
            {["Automated capture", "Instant delivery", "Stripe payments", "Real-time stats"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-nest-success" />
                <span className="text-sm text-nest-secondary">{item}</span>
              </div>
            ))}
          </div>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-11 px-8 text-sm font-medium bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] transition-colors"
          >
            Start for free <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.08)] py-8">
        <div className="max-w-[1280px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-nest-secondary">nest</span>
            <div className="w-1 h-1 rounded-full bg-nest-accent mb-0.5 ml-0.5" />
          </div>
          <p className="text-xs text-nest-muted">Captomatic © 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
