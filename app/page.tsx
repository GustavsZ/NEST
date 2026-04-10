import Link from "next/link";
import { ArrowRight, CheckCircle2, Camera, Zap, DollarSign, Image, Music, Layers, ScanLine } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-nest-bg text-nest-primary">
      {/* Nav */}
      <header className="border-b border-[rgba(255,255,255,0.06)] px-8 h-14 flex items-center justify-between max-w-[1280px] mx-auto">
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-semibold tracking-tight">nest</span>
          <div className="w-1.5 h-1.5 rounded-full bg-nest-accent mb-0.5" />
          <span className="text-xs text-nest-muted ml-0.5">by Captomatic</span>
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
            className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium text-white rounded-[10px] transition-colors"
            style={{ background: "#dd5c28", boxShadow: "var(--shadow-neuro-sm)" }}
          >
            Register for Free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-8 pt-24 pb-20 text-center relative">
        <div
          className="absolute inset-x-0 top-0 h-80 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(221,92,40,0.07) 0%, transparent 70%)" }}
        />
        <p className="text-[10px] font-medium uppercase tracking-widest text-nest-accent mb-5">
          Captomatic Nest Platform
        </p>
        <h1 className="text-[52px] font-light tracking-tight leading-tight text-nest-primary max-w-3xl mx-auto">
          Turn Guest Moments Into{" "}
          <span className="text-nest-accent">Revenue</span>{" "}
          — For Free
        </h1>
        <p className="text-lg text-nest-secondary mt-6 max-w-xl mx-auto leading-relaxed">
          No hardware. No commitment. Run it from an Android phone and earn from guest photos and videos.
        </p>
        <p className="text-sm text-nest-muted mt-2">Starting from 14,000 EUR</p>
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-11 px-7 text-sm font-medium text-white rounded-[10px] transition-colors"
            style={{ background: "#dd5c28", boxShadow: "var(--shadow-neuro-sm)" }}
          >
            Register for Free <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-11 px-7 text-sm text-nest-primary rounded-[10px] transition-colors"
            style={{ boxShadow: "var(--shadow-neuro-out)", background: "#161618" }}
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[rgba(255,255,255,0.06)] py-10">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "150M+", label: "Pieces of Content" },
              { value: "56%", label: "Highest Conversion by Clients" },
              { value: "99.6%", label: "System Uptime" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[40px] font-light tracking-tight text-nest-accent leading-none">{s.value}</p>
                <p className="text-sm text-nest-secondary mt-2">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-nest-muted mt-6">
            With over a decade in operation, we bring a wealth of experience to every installation.
          </p>
        </div>
      </section>

      {/* Two components section */}
      <section className="max-w-[1280px] mx-auto px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted mb-3">How it works</p>
          <h2 className="text-[36px] font-light tracking-tight text-nest-primary">
            Two components.{" "}
            <span className="text-nest-accent">One seamless experience.</span>
          </h2>
          <p className="text-sm text-nest-secondary mt-4 max-w-lg mx-auto leading-relaxed">
            Nest powers the full automation. Add our app to any Android phone and it becomes your automated camera. Capture, Edit, Sell — with zero staff needed.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {[
            {
              step: "01",
              title: "Sign up and install",
              description: "Sign up, then install the Captomatic app on any Android phone.",
            },
            {
              step: "02",
              title: "Set it up",
              description: "Position the phone at the key moment in your attraction. Capture, processing, and branding happen automatically.",
            },
            {
              step: "03",
              title: "Guests buy",
              description: "Visitors see and purchase their photos and videos. You keep the revenue.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-[16px] p-6"
              style={{ boxShadow: "var(--shadow-neuro-out)", background: "#161618" }}
            >
              <span className="font-mono text-xs text-nest-accent mb-3 block">{item.step}</span>
              <h3 className="text-sm font-medium text-nest-primary mb-2">{item.title}</h3>
              <p className="text-sm text-nest-secondary leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — 3 step detailed */}
      <section className="border-t border-[rgba(255,255,255,0.06)] py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted text-center mb-14">1-2-3 content capture to boost your revenue</p>
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Capture",
                icon: Camera,
                body: "Automated cameras capture guest content. Our reliable capture systems consistently get quality photos and videos of your guests. Each shot is expertly timed to capture the excitement and joy of every experience.",
              },
              {
                num: "02",
                title: "Process",
                icon: Zap,
                body: "After capture, our systems effortlessly process and edit the content. Set up various edits, filters, animations and have stunning content automatically — with precision, every time.",
              },
              {
                num: "03",
                title: "Revenue",
                icon: DollarSign,
                body: "Offer individual videos and photos or curated packages. Reliable, self-service sales onsite and automated upselling after guests leave drive continuous revenue and maximize guest satisfaction.",
              },
            ].map((item) => (
              <div key={item.num}>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                    style={{ boxShadow: "var(--shadow-neuro-out)", background: "#161618" }}
                  >
                    <item.icon className="w-4 h-4 text-nest-accent" />
                  </div>
                  <span className="font-mono text-xs text-nest-accent">{item.num}</span>
                </div>
                <h3 className="text-sm font-medium text-nest-primary mb-2">{item.title}</h3>
                <p className="text-sm text-nest-secondary leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flexible content */}
      <section className="border-t border-[rgba(255,255,255,0.06)] py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted mb-3">Content</p>
              <h2 className="text-[36px] font-light tracking-tight text-nest-primary mb-4">Flexible Content</h2>
              <p className="text-sm text-nest-secondary leading-relaxed mb-8">
                Deliver personalized content with a simple click. Create your own story line with everything you need to make every guest moment unforgettable.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium text-white rounded-[10px] transition-colors"
                style={{ background: "#dd5c28" }}
              >
                Get started free
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Image, label: "High-resolution pictures and videos" },
                { icon: Camera, label: "Intro and outro sequences" },
                { icon: Music, label: "Music" },
                { icon: Layers, label: "Overlays and filters" },
                { icon: ScanLine, label: "Object detection" },
                { icon: Zap, label: "Automated processing" },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="rounded-[12px] p-4 flex items-start gap-3"
                  style={{ boxShadow: "var(--shadow-neuro-out)", background: "#161618" }}
                >
                  <feature.icon className="w-4 h-4 text-nest-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-nest-secondary leading-relaxed">{feature.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-[rgba(255,255,255,0.06)] py-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted text-center mb-3">Pricing</p>
          <h2 className="text-[36px] font-light tracking-tight text-nest-primary text-center mb-12">
            Start free. Scale when you&apos;re ready.
          </h2>
          <div className="grid grid-cols-3 gap-5">
            {/* Starter */}
            <div
              className="rounded-[16px] p-6 flex flex-col"
              style={{ boxShadow: "var(--shadow-neuro-out)", background: "#161618" }}
            >
              <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted mb-4">Starter</p>
              <div className="mb-1">
                <span className="text-[40px] font-light tracking-tight text-nest-primary">$0</span>
              </div>
              <p className="text-xs text-nest-muted mb-6">30-day free trial</p>
              <ul className="space-y-2.5 flex-1 mb-6">
                {[
                  "1 camera connection",
                  "100 Photos + 50 Videos",
                  "Single Photo and Real-time Video capture",
                  "Branded Overlays",
                  "Standard Sales page",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-nest-success shrink-0 mt-0.5" />
                    <span className="text-xs text-nest-secondary">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center h-9 text-sm font-medium text-white rounded-[10px] transition-colors w-full"
                style={{ background: "#dd5c28" }}
              >
                Start Free Trial
              </Link>
              <p className="text-[10px] text-nest-muted text-center mt-2">No credit card required</p>
            </div>

            {/* Pro */}
            <div
              className="rounded-[16px] p-6 flex flex-col relative overflow-hidden"
              style={{ boxShadow: "var(--shadow-neuro-accent)", background: "#161618", outline: "1px solid rgba(221,92,40,0.2)" }}
            >
              <div className="absolute top-0 inset-x-0 h-0.5 bg-nest-accent" />
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">Pro</p>
                <span className="text-[10px] font-medium uppercase tracking-widest bg-[rgba(221,92,40,0.12)] text-nest-accent px-2 py-0.5 rounded-full">Popular</span>
              </div>
              <div className="mb-1">
                <span className="text-[40px] font-light tracking-tight text-nest-primary">$149</span>
                <span className="text-sm text-nest-muted">/mo</span>
              </div>
              <p className="text-xs text-nest-muted mb-6">Unlock full platform with unlimited capture</p>
              <ul className="space-y-2.5 flex-1 mb-6">
                {[
                  "1 camera connection (+$70/mo each)",
                  "Unlimited Photos and Videos",
                  "Full capture modes (Burst, Slow Motion, Boomerang)",
                  "Fully branded experience",
                  "Customizable Sales and Delivery page",
                  "Full Platform Access with API",
                  "Flexible billing — pause or resume anytime",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-nest-success shrink-0 mt-0.5" />
                    <span className="text-xs text-nest-secondary">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center h-9 text-sm font-medium text-white rounded-[10px] transition-colors w-full"
                style={{ background: "#dd5c28" }}
              >
                Try for Free
              </Link>
              <p className="text-[10px] text-nest-muted text-center mt-2">Start free, upgrade anytime</p>
            </div>

            {/* Custom */}
            <div
              className="rounded-[16px] p-6 flex flex-col"
              style={{ boxShadow: "var(--shadow-neuro-out)", background: "#161618" }}
            >
              <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted mb-4">Custom</p>
              <div className="mb-1">
                <span className="text-[28px] font-light tracking-tight text-nest-primary">Enterprise</span>
              </div>
              <p className="text-xs text-nest-muted mb-6">Full turn-key or enterprise solution</p>
              <ul className="space-y-2.5 flex-1 mb-6">
                {[
                  "Captomatic provided hardware",
                  "On-site installation",
                  "Custom consultation",
                  "Dedicated support",
                  "Custom integration",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-nest-muted shrink-0 mt-0.5" />
                    <span className="text-xs text-nest-secondary">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:sales@captomatic.com"
                className="inline-flex items-center justify-center h-9 text-sm font-medium text-nest-primary rounded-[10px] transition-colors w-full border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[rgba(255,255,255,0.06)] py-20">
        <div className="max-w-[1280px] mx-auto px-8 text-center">
          <h2 className="text-[36px] font-light tracking-tight text-nest-primary mb-3">
            Your guests deserve the memory.
          </h2>
          <p className="text-lg text-nest-secondary mb-2">You deserve to earn from it.</p>
          <p className="text-sm text-nest-muted mb-10">We set up your account. Setup instructions sent. You go live.</p>
          <div className="flex items-center justify-center gap-6 flex-wrap mb-8">
            {["Automated capture", "Instant guest delivery", "Revenue on autopilot", "99.6% uptime"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-nest-success" />
                <span className="text-sm text-nest-secondary">{item}</span>
              </div>
            ))}
          </div>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-11 px-8 text-sm font-medium text-white rounded-[10px] transition-colors"
            style={{ background: "#dd5c28", boxShadow: "var(--shadow-neuro-sm)" }}
          >
            Register for Free <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] py-8">
        <div className="max-w-[1280px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-nest-secondary">nest</span>
              <div className="w-1 h-1 rounded-full bg-nest-accent mb-0.5" />
            </div>
            <a href="mailto:sales@captomatic.com" className="text-xs text-nest-muted hover:text-nest-secondary transition-colors">
              sales@captomatic.com
            </a>
          </div>
          <p className="text-xs text-nest-muted">2025 © Captomatic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
