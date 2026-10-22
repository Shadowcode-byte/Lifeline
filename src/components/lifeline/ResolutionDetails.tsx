"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BrainCircuit,
  Check,
  ChevronDown,
  Compass,
  Search,
} from "lucide-react";

import ActivityMark from "@/components/lifeline/ActivityMark";
import type { SituationAnalysis } from "@/components/lifeline/SituationIntelligence";

export type SituationContext = {
  summary: string;
  assumptions: string[];
  missingInformation: string[];
  priorities: string[];
};

export type ResolutionPlan = {
  strategy: string;
  steps: {
    id: number;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }[];
};

type ResolutionDetailsProps = {
  analysis: SituationAnalysis | null;
  context: SituationContext | null;
  plan: ResolutionPlan | null;
  finalResponse: string | null;
};

export default function ResolutionDetails({
  analysis,
  context,
  plan,
  finalResponse,
}: ResolutionDetailsProps) {
  const [understandingOpen, setUnderstandingOpen] =
    useState(false);

  const [contextOpen, setContextOpen] =
    useState(false);

  return (
    <div className="w-full min-w-0 space-y-4 overflow-hidden">
      {/* Compact agent insights */}
      {(analysis || context) && (
        <section className="w-full min-w-0 overflow-hidden rounded-[26px] border border-white/[0.075] bg-white/[0.022]">
          {analysis && (
            <ExpandableSection
              title="Understanding output"
              summary={analysis.intent}
              icon={BrainCircuit}
              open={understandingOpen}
              onToggle={() =>
                setUnderstandingOpen(
                  (current) => !current
                )
              }
            >
              <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoCard
                  label="INTENT"
                  value={analysis.intent}
                />

                <InfoCard
                  label="URGENCY"
                  value={analysis.urgency}
                  rose={
                    analysis.urgency === "critical" ||
                    analysis.urgency === "high"
                  }
                />

                <InfoCard
                  label="GOAL"
                  value={analysis.goal}
                  wide
                />

                <div className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.055] bg-black/10 p-4 sm:col-span-2">
                  <p className="mb-2 text-[8px] font-semibold tracking-[0.14em] text-white/35">
                    CONSTRAINTS
                  </p>

                  <div className="space-y-1.5">
                    {analysis.constraints.map(
                      (constraint, index) => (
                        <BulletLine
                          key={index}
                          text={constraint}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </ExpandableSection>
          )}

          {context && (
            <ExpandableSection
              title="Context output"
              summary={context.summary}
              icon={Search}
              open={contextOpen}
              onToggle={() =>
                setContextOpen(
                  (current) => !current
                )
              }
              borderTop={!!analysis}
            >
              <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
                <SignalGroup
                  title="PRIORITIES"
                  items={context.priorities}
                />

                <SignalGroup
                  title="ASSUMPTIONS"
                  items={context.assumptions}
                />

                <SignalGroup
                  title="MISSING INFO"
                  items={context.missingInformation}
                  rose
                />
              </div>
            </ExpandableSection>
          )}
        </section>
      )}

      {/* Resolution strategy */}
      <AnimatePresence>
        {plan && (
          <motion.section
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="w-full min-w-0 overflow-hidden rounded-[26px] border border-[#00A8E8]/15 bg-[#00A8E8]/[0.025] p-4 sm:p-6"
          >
            <div className="mb-4 flex min-w-0 items-center gap-2">
              <Compass
                size={15}
                className="shrink-0 text-[#00A8E8]"
              />

              <span className="min-w-0 text-[11px] font-medium text-white/75">
                Resolution strategy
              </span>

              <CompletedPill />
            </div>

            <p className="max-w-full break-words text-[12px] leading-6 text-white/58 [overflow-wrap:anywhere]">
              {plan.strategy}
            </p>

            <div
              className={`mt-5 grid w-full min-w-0 grid-cols-1 gap-3 ${
                plan.steps.length === 3
                  ? "md:grid-cols-3"
                  : plan.steps.length === 4
                    ? "md:grid-cols-2"
                    : "sm:grid-cols-2"
              }`}
            >
              {plan.steps.map((step) => (
                <div
                  key={step.id}
                  className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/[0.065] bg-black/15 p-4"
                >
                  <div className="mb-2 flex min-w-0 flex-wrap items-center justify-between gap-2">
                    <span className="text-[9px] font-medium tracking-[0.12em] text-[#00A8E8]/80">
                      STEP {step.id}
                    </span>

                    <PriorityBadge
                      priority={step.priority}
                    />
                  </div>

                  <p className="break-words text-[12px] font-medium text-white/80 [overflow-wrap:anywhere]">
                    {step.title}
                  </p>

                  <p className="mt-2 break-words text-[10px] leading-5 text-white/48 [overflow-wrap:anywhere]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Hero final response */}
      <AnimatePresence>
        {finalResponse && (
          <motion.section
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
            }}
            className="relative w-full min-w-0 overflow-hidden rounded-[28px] border border-[#FF2E88]/20 bg-[#FF2E88]/[0.035] p-4 sm:p-7"
          >
            <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-56 w-56 rounded-full bg-[#FF2E88]/[0.08] blur-[70px]" />

            <div className="pointer-events-none absolute bottom-[-100px] left-[20%] h-52 w-52 rounded-full bg-[#00A8E8]/[0.04] blur-[80px]" />

            <div className="relative flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF2E88]/20 bg-[#FF2E88]/[0.08] sm:h-11 sm:w-11">
                <motion.div
                  className="absolute h-7 w-7 rounded-full bg-[#FF2E88]/10 blur-lg"
                  animate={{
                    scale: [0.9, 1.25, 0.9],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                  }}
                />

                <ActivityMark />
              </div>

              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="break-words text-[9px] font-semibold tracking-[0.14em] text-[#FF2E88] sm:text-[10px] sm:tracking-[0.16em]">
                    LIFELINE RESPONSE
                  </span>

                  <span className="max-w-full rounded-full border border-white/[0.07] bg-black/10 px-2 py-0.5 text-[7px] tracking-[0.08em] text-white/35 sm:text-[8px] sm:tracking-[0.1em]">
                    SIMULATED ALEXA+
                  </span>
                </div>

                <p className="mt-4 max-w-full break-words text-[14px] font-medium leading-7 text-white/82 [overflow-wrap:anywhere] sm:text-[16px] sm:leading-8">
                  “{finalResponse}”
                </p>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExpandableSection({
  title,
  summary,
  icon: Icon,
  open,
  onToggle,
  children,
  borderTop = false,
}: {
  title: string;
  summary: string;
  icon: typeof BrainCircuit;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  borderTop?: boolean;
}) {
  return (
    <div
      className={`w-full min-w-0 overflow-hidden ${
        borderTop
          ? "border-t border-white/[0.055]"
          : ""
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full min-w-0 items-center gap-3 overflow-hidden p-4 text-left transition hover:bg-white/[0.015] sm:px-6 sm:py-5"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#00A8E8]/15 bg-[#00A8E8]/[0.055] text-[#00A8E8]">
          <Icon size={15} />
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex min-w-0 items-center gap-2">
            <p className="min-w-0 truncate text-[11px] font-medium text-white/72">
              {title}
            </p>

            <CompletedPill />
          </div>

          <p className="mt-1 max-w-full truncate text-[10px] text-white/38">
            {summary}
          </p>
        </div>

        <motion.div
          animate={{
            rotate: open ? 180 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className="shrink-0 text-white/30"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="w-full min-w-0 overflow-hidden"
          >
            <div className="w-full min-w-0 overflow-hidden px-4 pb-4 sm:px-6 sm:pb-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoCard({
  label,
  value,
  rose = false,
  wide = false,
}: {
  label: string;
  value: string;
  rose?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={`w-full min-w-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/10 p-4 ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <p
        className={`mb-2 text-[8px] font-semibold tracking-[0.14em] ${
          rose
            ? "text-[#FF2E88]/75"
            : "text-[#00A8E8]/65"
        }`}
      >
        {label}
      </p>

      <p
        className={`max-w-full break-words text-[10px] leading-5 [overflow-wrap:anywhere] ${
          rose
            ? "text-[#FF2E88]/90"
            : "text-white/58"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SignalGroup({
  title,
  items,
  rose = false,
}: {
  title: string;
  items: string[];
  rose?: boolean;
}) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/10 p-4">
      <p
        className={`mb-3 text-[8px] font-semibold tracking-[0.14em] ${
          rose
            ? "text-[#FF2E88]/70"
            : "text-[#00A8E8]/70"
        }`}
      >
        {title}
      </p>

      <div className="min-w-0 space-y-2">
        {items.map((item, index) => (
          <BulletLine
            key={`${title}-${index}`}
            text={item}
            rose={rose}
          />
        ))}
      </div>
    </div>
  );
}

function BulletLine({
  text,
  rose = false,
}: {
  text: string;
  rose?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <span
        className={`mt-[7px] h-1 w-1 shrink-0 rounded-full ${
          rose
            ? "bg-[#FF2E88]/75"
            : "bg-[#00A8E8]/75"
        }`}
      />

      <p className="min-w-0 flex-1 break-words text-[9px] leading-4 text-white/50 [overflow-wrap:anywhere]">
        {text}
      </p>
    </div>
  );
}

function CompletedPill() {
  return (
    <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full border border-[#00A8E8]/12 bg-[#00A8E8]/[0.04] px-2 py-1 text-[7px] font-medium tracking-[0.06em] text-[#00A8E8]/75 sm:text-[8px] sm:tracking-[0.08em]">
      <Check size={9} />
      COMPLETE
    </span>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: "low" | "medium" | "high";
}) {
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[8px] font-medium tracking-[0.08em] ${
        priority === "high"
          ? "border-[#FF2E88]/20 bg-[#FF2E88]/[0.05] text-[#FF2E88]/85"
          : priority === "medium"
            ? "border-[#00A8E8]/20 bg-[#00A8E8]/[0.05] text-[#00A8E8]/80"
            : "border-white/[0.08] text-white/40"
      }`}
    >
      {priority.toUpperCase()}
    </span>
  );
}