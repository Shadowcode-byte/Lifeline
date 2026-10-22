"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  CircleDot,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import ActivityMark from "@/components/lifeline/ActivityMark";
import AgentPipeline, {
  type AgentStage,
  type StageState,
} from "@/components/lifeline/AgentPipeline";
import ProposedActions, {
  type ProposedAction,
} from "@/components/lifeline/ProposedActions";
import ResolutionDetails, {
  type ResolutionPlan,
  type SituationContext,
} from "@/components/lifeline/ResolutionDetails";
import SituationIntelligence, {
  type SituationAnalysis,
} from "@/components/lifeline/SituationIntelligence";
import VoiceComposer from "@/components/lifeline/VoiceComposer";

type ActionResult = {
  actions: ProposedAction[];
  finalResponse: string;
};

type StreamEvent = {
  type:
    | "stage"
    | "analysis"
    | "context"
    | "plan"
    | "result"
    | "failed"
    | "complete"
    | "error";
  data: unknown;
};

const examples = [
  "My interview is tomorrow and I haven't prepared.",
  "My laptop died and my assignment is due tonight.",
  "I'm travelling tomorrow and haven't prepared anything.",
];

function freshStages(): StageState {
  return {
    understanding: "waiting",
    context: "waiting",
    planning: "waiting",
    actions: "waiting",
  };
}

export default function Home() {
  const [problem, setProblem] = useState("");
  const [submittedProblem, setSubmittedProblem] = useState("");
  const [active, setActive] = useState(false);

  const [stages, setStages] =
    useState<StageState>(freshStages());

  const [analysis, setAnalysis] =
    useState<SituationAnalysis | null>(null);

  const [context, setContext] =
    useState<SituationContext | null>(null);

  const [plan, setPlan] =
    useState<ResolutionPlan | null>(null);

  const [result, setResult] =
    useState<ActionResult | null>(null);

  const [isResolving, setIsResolving] = useState(false);

  const [failedStage, setFailedStage] =
    useState<AgentStage | null>(null);

  const [workflowError, setWorkflowError] = useState("");
  const [complete, setComplete] = useState(false);

  function resetWorkflowData() {
    setStages(freshStages());
    setAnalysis(null);
    setContext(null);
    setPlan(null);
    setResult(null);
    setFailedStage(null);
    setWorkflowError("");
    setComplete(false);
  }

  function processStreamEvent(event: StreamEvent) {
    if (event.type === "stage") {
      const data = event.data as {
        stage: AgentStage;
        status: StageState[AgentStage];
      };

      setStages((current) => ({
        ...current,
        [data.stage]: data.status,
      }));

      return;
    }

    if (event.type === "analysis") {
      setAnalysis(event.data as SituationAnalysis);
      return;
    }

    if (event.type === "context") {
      setContext(event.data as SituationContext);
      return;
    }

    if (event.type === "plan") {
      setPlan(event.data as ResolutionPlan);
      return;
    }

    if (event.type === "result") {
      setResult(event.data as ActionResult);
      return;
    }

    if (event.type === "failed") {
      const data = event.data as {
        stage: AgentStage;
        error?: string;
      };

      setFailedStage(data.stage);
      setWorkflowError(
        data.error ||
          "This agent could not complete its task."
      );

      return;
    }

    if (event.type === "complete") {
      setComplete(true);
      return;
    }

    if (event.type === "error") {
      const data = event.data as {
        message?: string;
      };

      setWorkflowError(
        data.message ||
          "LifeLine encountered an unexpected error."
      );
    }
  }

  async function consumeResolutionStream(
    cleanProblem: string
  ) {
    setIsResolving(true);
    resetWorkflowData();

    try {
      const response = await fetch("/api/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem: cleanProblem,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(
          "Unable to connect to LifeLine orchestration."
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();

          if (!trimmed) continue;

          try {
            const event =
              JSON.parse(trimmed) as StreamEvent;

            processStreamEvent(event);
          } catch {
            // Ignore malformed stream fragments.
          }
        }
      }

      if (buffer.trim()) {
        try {
          const event =
            JSON.parse(buffer.trim()) as StreamEvent;

          processStreamEvent(event);
        } catch {
          // Ignore an incomplete trailing fragment.
        }
      }
    } catch {
      setWorkflowError(
        "LifeLine could not reach the orchestration service. Please retry."
      );
    } finally {
      setIsResolving(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const cleanProblem = problem.trim();

    if (!cleanProblem || isResolving) return;

    setSubmittedProblem(cleanProblem);
    setActive(true);

    await consumeResolutionStream(cleanProblem);
  }

  async function retryWorkflow() {
    if (!submittedProblem || isResolving) return;

    await consumeResolutionStream(submittedProblem);
  }

  function resetSession() {
    setProblem("");
    setSubmittedProblem("");
    setActive(false);
    setIsResolving(false);
    resetWorkflowData();
  }

  const completedCount = Object.values(stages).filter(
    (status) => status === "complete"
  ).length;

  const workingStage =
    (Object.entries(stages).find(
      ([, status]) => status === "working"
    )?.[0] as AgentStage | undefined) ?? null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050608] text-[#F5F7FA]">
      {/* Ambient atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-340px] h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-[#00A8E8]/[0.07] blur-[140px]" />
        <div className="absolute bottom-[-320px] right-[-180px] h-[600px] w-[600px] rounded-full bg-[#FF2E88]/[0.035] blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex h-[76px] items-center justify-between border-b border-white/[0.06] px-6 sm:px-10 lg:px-14">
        <button
          onClick={resetSession}
          className="group flex items-center gap-3"
        >
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[#00A8E8]/20 bg-[#00A8E8]/[0.07]">
            <motion.div
              animate={{
                opacity: [0.55, 1, 0.55],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
              }}
              className="absolute h-5 w-5 rounded-full bg-[#00A8E8]/15 blur-md"
            />

            <ActivityMark />
          </div>

          <div className="text-left">
            <div className="text-[15px] font-semibold tracking-[0.22em]">
              LIFELINE
            </div>

            <div className="mt-0.5 text-[9px] font-medium tracking-[0.2em] text-white/35">
              SIMULATED ALEXA+ AGENT
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-2">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-30 ${
                failedStage
                  ? "bg-[#FF2E88]"
                  : "bg-[#00A8E8]"
              }`}
            />

            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                failedStage
                  ? "bg-[#FF2E88]"
                  : "bg-[#00A8E8]"
              }`}
            />
          </span>

          <span className="text-[10px] font-medium tracking-[0.14em] text-white/45">
            {complete
              ? "RESOLUTION READY"
              : failedStage
                ? "ATTENTION REQUIRED"
                : isResolving
                  ? "ORCHESTRATING"
                  : active
                    ? "SESSION ACTIVE"
                    : "SYSTEM READY"}
          </span>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {!active ? (
          <motion.section
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.45,
            }}
            className="relative z-10 mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl flex-col items-center justify-center px-5 pb-16 pt-10 text-center"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              className="mb-7 flex items-center gap-2 rounded-full border border-[#00A8E8]/15 bg-[#00A8E8]/[0.035] px-4 py-2"
            >
              <Sparkles
                size={12}
                className="text-[#00A8E8]"
              />

              <span className="text-[10px] font-medium tracking-[0.18em] text-white/45">
                INTELLIGENT SITUATION RESOLUTION
              </span>
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.18,
              }}
              className="max-w-5xl text-[clamp(3.1rem,6.3vw,6.4rem)] font-medium leading-[0.98] tracking-[-0.055em]"
            >
              Tell me the problem.

              <span className="mt-2 block text-white/28">
                I&apos;ll figure out the actions.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.28,
              }}
              className="mt-8 max-w-xl text-sm leading-7 text-white/40 sm:text-[15px]"
            >
              A simulated Alexa+ experience that understands
              complex situations, coordinates specialist agents,
              and turns uncertainty into an actionable plan.
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.36,
              }}
              className="mt-11 w-full max-w-3xl"
            >
              <VoiceComposer
                problem={problem}
                setProblem={setProblem}
                onSubmit={handleSubmit}
                isResolving={isResolving}
              />

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {examples.map((example) => (
                  <button
                    key={example}
                    onClick={() =>
                      setProblem(example)
                    }
                    className="rounded-full border border-white/[0.07] bg-white/[0.018] px-3.5 py-2 text-[10px] text-white/32 transition hover:border-white/[0.13] hover:bg-white/[0.035] hover:text-white/55"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.55,
              }}
              className="mt-16 flex items-center gap-3 text-[9px] font-medium tracking-[0.15em] text-white/20"
            >
              <span>SIMULATED ALEXA+</span>
              <span className="h-px w-5 bg-white/10" />
              <span>AGENTIC ORCHESTRATION</span>
              <span className="h-px w-5 bg-white/10" />
              <span>CONTEXT AWARE</span>
            </motion.div>
          </motion.section>
        ) : (
          <motion.section
            key="workspace"
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="relative z-10 mx-auto w-full min-w-0 max-w-[1500px] overflow-hidden px-4 py-7 sm:px-8 lg:px-12"
          >
            {/* Situation header */}
            <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <CircleDot
                    size={13}
                    className="text-[#FF2E88]"
                  />

                  <span className="text-[9px] font-semibold tracking-[0.2em] text-[#FF2E88]/80">
                    ACTIVE SITUATION
                  </span>
                </div>

                <h2 className="max-w-4xl text-2xl font-medium tracking-[-0.025em] text-white/90 sm:text-3xl">
                  “{submittedProblem}”
                </h2>
              </div>

              <button
                onClick={resetSession}
                className="w-fit rounded-full border border-white/[0.08] px-4 py-2 text-[10px] font-medium tracking-[0.08em] text-white/40 transition hover:bg-white/[0.04] hover:text-white/70"
              >
                NEW SITUATION
              </button>
            </div>

            <div className="grid w-full min-w-0 grid-cols-1 gap-4 overflow-hidden xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
              {/* Main workflow */}
              <div className="min-w-0 space-y-4">
                <AgentPipeline
                  stages={stages}
                  complete={complete}
                  failedStage={failedStage}
                  isResolving={isResolving}
                />

                <ResolutionDetails
                  analysis={analysis}
                  context={context}
                  plan={plan}
                  finalResponse={
                    result?.finalResponse ?? null
                  }
                />

                {/* Agent failure */}
                {failedStage && (
                  <motion.section
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="rounded-[26px] border border-[#FF2E88]/15 bg-[#FF2E88]/[0.035] p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF2E88]/10 text-[#FF2E88]">
                        <AlertCircle size={16} />
                      </div>

                      <div className="flex-1">
                        <p className="text-xs font-medium text-white/75">
                          {formatStageName(
                            failedStage
                          )}{" "}
                          Agent temporarily interrupted
                        </p>

                        <p className="mt-1.5 text-[11px] leading-5 text-white/42">
                          {workflowError ||
                            "The provider could not complete this stage."}{" "}
                          Completed outputs have been preserved.
                        </p>

                        <button
                          onClick={retryWorkflow}
                          disabled={isResolving}
                          className="mt-4 flex items-center gap-2 rounded-lg border border-[#FF2E88]/15 bg-[#FF2E88]/[0.04] px-3 py-2 text-[10px] font-medium text-[#FF2E88] transition hover:bg-[#FF2E88]/[0.08] disabled:opacity-40"
                        >
                          <RotateCcw size={12} />
                          RETRY WORKFLOW
                        </button>
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* Infrastructure failure */}
                {workflowError &&
                  !failedStage &&
                  !isResolving && (
                    <section className="rounded-[26px] border border-[#FF2E88]/15 bg-[#FF2E88]/[0.035] p-5">
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          size={17}
                          className="mt-0.5 shrink-0 text-[#FF2E88]"
                        />

                        <div>
                          <p className="text-xs font-medium text-white/75">
                            Connection interrupted
                          </p>

                          <p className="mt-1.5 text-[11px] text-white/42">
                            {workflowError}
                          </p>
                        </div>
                      </div>
                    </section>
                  )}
              </div>

              {/* Intelligence sidebar */}
              <aside className="min-w-0 space-y-4 xl:sticky xl:top-5 xl:self-start">
                <SituationIntelligence
                  analysis={analysis}
                  understandingWorking={
                    stages.understanding ===
                    "working"
                  }
                />

                <ProposedActions
                  actions={
                    result?.actions ?? null
                  }
                  actionsWorking={
                    stages.actions === "working"
                  }
                  hasFailure={!!failedStage}
                />

                <section
                  className={`rounded-[26px] border p-5 ${
                    failedStage
                      ? "border-[#FF2E88]/12 bg-[#FF2E88]/[0.02]"
                      : "border-[#00A8E8]/10 bg-[#00A8E8]/[0.025]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <p className="text-[9px] font-medium tracking-[0.15em] text-white/30">
                        RESOLUTION STATUS
                      </p>

                      <p className="mt-2 text-sm font-medium text-white/72">
                        {complete
                          ? "Resolution ready"
                          : failedStage
                            ? `${formatStageName(
                                failedStage
                              )} interrupted`
                            : workingStage
                              ? `${formatStageName(
                                  workingStage
                                )} in progress`
                              : "Preparing"}
                      </p>

                      <div
                        className={`mt-2 flex items-center gap-1.5 text-[9px] ${
                          failedStage
                            ? "text-[#FF2E88]/70"
                            : "text-[#00A8E8]/70"
                        }`}
                      >
                        {failedStage ? (
                          <AlertCircle size={11} />
                        ) : (
                          <CheckCircle2 size={11} />
                        )}

                        {complete
                          ? "4 agents completed"
                          : failedStage
                            ? `${completedCount}/4 completed • partial results preserved`
                            : `${completedCount}/4 agents completed`}
                      </div>
                    </div>

                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                      <div
                        className={`absolute inset-0 animate-pulse rounded-full ${
                          failedStage
                            ? "bg-[#FF2E88]/10"
                            : "bg-[#00A8E8]/10"
                        }`}
                      />

                      <ActivityMark />
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

function formatStageName(stage: AgentStage) {
  const names: Record<AgentStage, string> = {
    understanding: "Understanding",
    context: "Context",
    planning: "Planning",
    actions: "Actions",
  };

  return names[stage];
}