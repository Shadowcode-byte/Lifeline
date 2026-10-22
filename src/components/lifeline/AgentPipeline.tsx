"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  BrainCircuit,
  Check,
  Circle,
  Compass,
  Network,
  Search,
  Sparkles,
} from "lucide-react";

export type AgentStage =
  | "understanding"
  | "context"
  | "planning"
  | "actions";

export type StageStatus =
  | "waiting"
  | "working"
  | "complete"
  | "failed";

export type StageState = Record<AgentStage, StageStatus>;

const stageDefinitions = [
  {
    id: "understanding" as const,
    title: "Understanding",
    description: "Intent, urgency & constraints",
    icon: BrainCircuit,
  },
  {
    id: "context" as const,
    title: "Context",
    description: "Assumptions, gaps & priorities",
    icon: Search,
  },
  {
    id: "planning" as const,
    title: "Planning",
    description: "Resolution strategy",
    icon: Compass,
  },
  {
    id: "actions" as const,
    title: "Actions",
    description: "Concrete next steps",
    icon: Network,
  },
];

type AgentPipelineProps = {
  stages: StageState;
  complete: boolean;
  failedStage: AgentStage | null;
  isResolving: boolean;
};

export default function AgentPipeline({
  stages,
  complete,
  failedStage,
  isResolving,
}: AgentPipelineProps) {
  const workingStage =
    stageDefinitions.find(
      (stage) => stages[stage.id] === "working"
    )?.id ?? null;

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-[26px] border border-white/[0.075] bg-white/[0.025] p-4 sm:p-7">
      {/* Header */}
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-white/[0.06] pb-5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-white/75">
            Agent orchestration
          </p>

          <p className="mt-1 max-w-full break-words text-[10px] leading-4 text-white/35 [overflow-wrap:anywhere]">
            {complete
              ? "Resolution workflow completed"
              : failedStage
                ? `${formatStageName(
                    failedStage
                  )} Agent needs attention`
                : workingStage
                  ? `${formatStageName(
                      workingStage
                    )} Agent is working`
                  : "Preparing orchestration"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-[8px] tracking-[0.12em] text-[#00A8E8]/70 sm:text-[9px] sm:tracking-[0.14em]">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              failedStage
                ? "bg-[#FF2E88]"
                : isResolving
                  ? "animate-pulse bg-[#00A8E8]"
                  : "bg-[#00A8E8]"
            }`}
          />
          LIVE
        </div>
      </div>

      {/* Mobile-safe progress rail */}
      <div className="mt-6 grid w-full min-w-0 grid-cols-4 gap-1.5 sm:gap-2">
        {stageDefinitions.map((stage) => {
          const status = stages[stage.id];

          return (
            <div
              key={stage.id}
              className="min-w-0"
            >
              <div
                className={`h-1.5 w-full min-w-0 rounded-full transition-all duration-500 ${
                  status === "complete"
                    ? "bg-[#00A8E8]"
                    : status === "working"
                      ? "animate-pulse bg-[#00A8E8]/55"
                      : status === "failed"
                        ? "bg-[#FF2E88]"
                        : "bg-white/[0.06]"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Agent cards */}
      <div className="relative mt-6 w-full min-w-0">
        <div className="absolute bottom-0 left-[19px] top-0 w-px bg-gradient-to-b from-[#00A8E8]/45 via-[#00A8E8]/15 to-[#FF2E88]/20 sm:left-[21px]" />

        <div className="w-full min-w-0 space-y-3">
          {stageDefinitions.map((stage) => {
            const Icon = stage.icon;
            const status = stages[stage.id];

            return (
              <motion.div
                key={stage.id}
                layout
                className={`relative flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-2xl border p-3.5 transition-all duration-500 sm:gap-4 sm:p-4 ${
                  status === "complete"
                    ? "border-[#00A8E8]/20 bg-[#080D10]"
                    : status === "working"
                      ? "border-[#00A8E8]/35 bg-[#00A8E8]/[0.045] shadow-[0_0_45px_rgba(0,168,232,0.045)]"
                      : status === "failed"
                        ? "border-[#FF2E88]/25 bg-[#FF2E88]/[0.03]"
                        : "border-white/[0.06] bg-[#080A0C]/80"
                }`}
              >
                {status === "working" && (
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "220%" }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="pointer-events-none absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[#00A8E8]/[0.06] to-transparent sm:w-32"
                  />
                )}

                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-500 sm:h-11 sm:w-11 ${
                    status === "failed"
                      ? "border-[#FF2E88]/25 bg-[#FF2E88]/[0.07] text-[#FF2E88]"
                      : status === "complete" ||
                          status === "working"
                        ? "border-[#00A8E8]/30 bg-[#00A8E8]/[0.1] text-[#00A8E8]"
                        : "border-[#00A8E8]/15 bg-[#00A8E8]/[0.045] text-[#00A8E8]/50"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.7} />
                </div>

                <div className="relative z-10 min-w-0 flex-1 overflow-hidden">
                  <p
                    className={`max-w-full truncate text-[12px] font-medium sm:text-[13px] ${
                      status === "waiting"
                        ? "text-white/55"
                        : "text-white/85"
                    }`}
                  >
                    {stage.title}
                  </p>

                  <p className="mt-1 max-w-full truncate text-[9px] text-white/35 sm:text-[10px]">
                    {stage.description}
                  </p>
                </div>

                <StageIndicator status={status} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Live active-agent message */}
      {isResolving && workingStage && (
        <motion.div
          key={workingStage}
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-6 w-full min-w-0 overflow-hidden rounded-2xl border border-[#00A8E8]/10 bg-[#00A8E8]/[0.025] p-4"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00A8E8]/[0.07]">
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-[#00A8E8]/20" />

              <Sparkles
                size={14}
                className="relative text-[#00A8E8]"
              />
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-[11px] font-medium text-white/65">
                {formatStageName(workingStage)} Agent active
              </p>

              <p className="mt-1 max-w-full break-words text-[9px] leading-4 text-white/32 [overflow-wrap:anywhere]">
                {stageWorkingCopy(workingStage)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}

function StageIndicator({
  status,
}: {
  status: StageStatus;
}) {
  if (status === "complete") {
    return (
      <div className="relative z-10 flex shrink-0 items-center gap-1.5 sm:gap-2">
        <span className="hidden text-[9px] font-medium tracking-[0.12em] text-[#00A8E8] sm:block">
          COMPLETE
        </span>

        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00A8E8]/15 text-[#00A8E8]">
          <Check size={11} strokeWidth={2.5} />
        </span>
      </div>
    );
  }

  if (status === "working") {
    return (
      <div className="relative z-10 flex shrink-0 items-center gap-1.5 sm:gap-2">
        <span className="hidden text-[9px] font-medium tracking-[0.12em] text-[#00A8E8] sm:block">
          WORKING
        </span>

        <span className="relative flex h-3 w-3 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00A8E8] opacity-30" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[#00A8E8]" />
        </span>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="relative z-10 flex shrink-0 items-center gap-1.5 sm:gap-2">
        <span className="hidden text-[9px] font-medium tracking-[0.12em] text-[#FF2E88] sm:block">
          INTERRUPTED
        </span>

        <AlertCircle
          size={15}
          className="shrink-0 text-[#FF2E88]"
        />
      </div>
    );
  }

  return (
    <div className="relative z-10 flex shrink-0 items-center gap-1.5 sm:gap-2">
      <span className="hidden text-[9px] tracking-[0.12em] text-white/25 sm:block">
        WAITING
      </span>

      <Circle
        size={9}
        className="shrink-0 text-white/20"
      />
    </div>
  );
}

export function formatStageName(stage: AgentStage) {
  const names: Record<AgentStage, string> = {
    understanding: "Understanding",
    context: "Context",
    planning: "Planning",
    actions: "Actions",
  };

  return names[stage];
}

function stageWorkingCopy(stage: AgentStage) {
  const copy: Record<AgentStage, string> = {
    understanding:
      "Identifying intent, urgency, constraints and desired outcome.",
    context:
      "Separating known facts, assumptions, missing information and priorities.",
    planning:
      "Building a practical strategy around the situation and constraints.",
    actions:
      "Converting the strategy into concrete proposed next steps.",
  };

  return copy[stage];
}