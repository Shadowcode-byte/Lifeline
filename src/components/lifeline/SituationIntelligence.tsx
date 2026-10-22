"use client";

import { BrainCircuit } from "lucide-react";

type Urgency = "low" | "medium" | "high" | "critical";

export type SituationAnalysis = {
  intent: string;
  urgency: Urgency;
  constraints: string[];
  goal: string;
};

type SituationIntelligenceProps = {
  analysis: SituationAnalysis | null;
  understandingWorking: boolean;
};

export default function SituationIntelligence({
  analysis,
  understandingWorking,
}: SituationIntelligenceProps) {
  return (
    <section className="rounded-[26px] border border-white/[0.075] bg-white/[0.025] p-5">
      <div className="mb-5 flex items-center gap-2">
        <BrainCircuit
          size={15}
          className="text-[#00A8E8]"
        />

        <span className="text-[11px] font-medium text-white/65">
          Situation intelligence
        </span>
      </div>

      <div className="space-y-3">
        <IntelligenceItem
          label="Intent"
          value={
            analysis?.intent ??
            (understandingWorking
              ? "Analyzing..."
              : "Waiting")
          }
        />

        <IntelligenceItem
          label="Urgency"
          value={
            analysis?.urgency ??
            (understandingWorking
              ? "Detecting..."
              : "Waiting")
          }
          accent={
            analysis?.urgency === "critical" ||
            analysis?.urgency === "high"
          }
        />

        <IntelligenceItem
          label="Goal"
          value={
            analysis?.goal ??
            (understandingWorking
              ? "Defining..."
              : "Waiting")
          }
        />
      </div>
    </section>
  );
}

function IntelligenceItem({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-black/10 px-3.5 py-3">
      <div className="flex items-start justify-between gap-4">
        <span className="shrink-0 pt-0.5 text-[10px] text-white/32">
          {label}
        </span>

        <span
          className={`max-w-[72%] text-right text-[10px] leading-[1.55] ${
            accent
              ? "text-[#FF2E88]/85"
              : "text-white/60"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}