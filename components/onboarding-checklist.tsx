"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  href: string;
  done: boolean;
}

interface Props {
  steps: OnboardingStep[];
  userEmail: string;
}

export function OnboardingChecklist({ steps, userEmail }: Props) {
  const completedCount = steps.filter((s) => s.done).length;
  const totalCount = steps.length;
  const allDone = completedCount === totalCount;
  const nextStep = steps.find((s) => !s.done);
  const progressPct = Math.round((completedCount / totalCount) * 100);

  if (allDone) {
    return (
      <div
        className="rounded-[16px] p-6 flex items-center gap-4"
        style={{ boxShadow: "var(--shadow-neuro-out)", background: "#161618" }}
      >
        <div className="w-10 h-10 rounded-full bg-[rgba(61,186,126,0.12)] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-nest-success" />
        </div>
        <div>
          <p className="text-sm font-medium text-nest-primary">You&apos;re live!</p>
          <p className="text-xs text-nest-secondary mt-0.5">
            All systems are set up. Your first guests can now capture and purchase their memories.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-[16px] p-6"
      style={{ boxShadow: "var(--shadow-neuro-out)", background: "#161618" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-nest-muted mb-1">Setup progress</p>
          <h2 className="text-sm font-medium text-nest-primary">
            {completedCount} of {totalCount} steps complete
          </h2>
        </div>
        {nextStep && (
          <Link
            href={nextStep.href}
            className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[8px] transition-colors shrink-0"
          >
            Continue <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ boxShadow: "var(--shadow-neuro-in)", background: "#111113" }}
        >
          <div
            className="h-full bg-nest-accent rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Steps — horizontal circles */}
      <div className="flex items-start gap-0">
        {steps.map((step, i) => {
          const isActive = !step.done && (i === 0 || steps[i - 1].done);
          const isDone = step.done;
          return (
            <div key={step.id} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="absolute top-[14px] left-[50%] w-full h-px"
                  style={{
                    background: isDone ? "rgba(221,92,40,0.4)" : "rgba(255,255,255,0.06)",
                  }}
                />
              )}
              {/* Circle */}
              <Link href={step.href} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isDone
                      ? "bg-nest-accent"
                      : isActive
                      ? "bg-[rgba(221,92,40,0.12)] border border-nest-accent"
                      : "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)]"
                  }`}
                  style={isDone || isActive ? {} : { boxShadow: "var(--shadow-neuro-sm)" }}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <span className={`text-[10px] font-medium ${isActive ? "text-nest-accent" : "text-nest-muted"}`}>
                      {i + 1}
                    </span>
                  )}
                </div>
                <p
                  className={`text-[10px] text-center mt-2 leading-tight max-w-[64px] ${
                    isDone ? "text-nest-secondary" : isActive ? "text-nest-primary font-medium" : "text-nest-muted"
                  }`}
                >
                  {step.label}
                </p>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Active step description */}
      {nextStep && (
        <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <p className="text-xs text-nest-secondary">
            <span className="text-nest-primary font-medium">Next:</span> {nextStep.description}
          </p>
        </div>
      )}
    </div>
  );
}
