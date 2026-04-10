"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  href: string;
  done: boolean;
}

interface OnboardingChecklistProps {
  steps: OnboardingStep[];
  userEmail: string;
}

export function OnboardingChecklist({ steps, userEmail }: OnboardingChecklistProps) {
  const completedCount = steps.filter((s) => s.done).length;
  const totalCount = steps.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const allDone = completedCount === totalCount;
  const nextStep = steps.find((s) => !s.done);

  if (allDone) {
    return (
      <div className="rounded-[14px] bg-nest-surface border border-[rgba(255,255,255,0.08)] p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-[rgba(61,186,126,0.12)] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-nest-success" />
          </div>
          <h2 className="text-lg font-medium text-nest-primary">You&apos;re live.</h2>
        </div>
        <p className="text-sm text-nest-secondary">
          Everything is set up. Your system is capturing and ready to deliver to guests.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[14px] bg-nest-surface border border-[rgba(255,255,255,0.08)] p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-medium text-nest-primary">
            Let&apos;s get {userEmail.split("@")[0]}&apos;s system live.
          </h2>
          <p className="text-sm text-nest-secondary mt-1">
            {completedCount} of {totalCount} steps complete
          </p>
        </div>
        {nextStep && (
          <Link href={nextStep.href} className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] transition-colors shrink-0">
            Continue <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        )}
      </div>

      {/* Progress bar */}
      <Progress
        value={progressPct}
        className="h-1.5 bg-nest-surface-2 mb-6 [&>div]:bg-nest-accent"
      />

      {/* Steps */}
      <div className="space-y-1">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-start gap-4 p-3 rounded-[10px] transition-colors duration-150 ${
              step.done
                ? "opacity-60"
                : index === steps.findIndex((s) => !s.done)
                ? "bg-[rgba(221,92,40,0.06)] border border-[rgba(221,92,40,0.15)]"
                : "opacity-50"
            }`}
          >
            {step.done ? (
              <CheckCircle2 className="w-4 h-4 text-nest-success mt-0.5 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-nest-muted mt-0.5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${step.done ? "text-nest-secondary" : "text-nest-primary"}`}>
                {step.label}
              </p>
              <p className="text-xs text-nest-muted mt-0.5">{step.description}</p>
            </div>
            {!step.done && index === steps.findIndex((s) => !s.done) && (
              <Link
                href={step.href}
                className="text-[11px] text-nest-accent hover:underline shrink-0 mt-0.5"
              >
                Set up
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
