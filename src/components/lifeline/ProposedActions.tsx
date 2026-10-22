"use client";

import { motion } from "framer-motion";
import { ListChecks, Target } from "lucide-react";

export type ProposedAction = {
  id: number;
  title: string;
  description: string;
  status: "proposed";
};

type ProposedActionsProps = {
  actions: ProposedAction[] | null;
  actionsWorking: boolean;
  hasFailure: boolean;
};

export default function ProposedActions({
  actions,
  actionsWorking,
  hasFailure,
}: ProposedActionsProps) {
  return (
    <section className="rounded-[26px] border border-white/[0.075] bg-white/[0.025] p-5">
      <div className="mb-5 flex items-center gap-2">
        <ListChecks
          size={15}
          className="text-[#FF2E88]"
        />

        <span className="text-[11px] font-medium text-white/65">
          Proposed actions
        </span>
      </div>

      {actions && actions.length > 0 ? (
        <div className="space-y-2.5">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{
                opacity: 0,
                x: 8,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: index * 0.07,
              }}
              className="rounded-xl border border-white/[0.055] bg-black/10 p-3.5"
            >
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#FF2E88]/[0.07] text-[#FF2E88]">
                  <span className="text-[9px] font-semibold">
                    {index + 1}
                  </span>
                </div>

                <div>
                  <p className="text-[11px] font-medium text-white/70">
                    {action.title}
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-white/38">
                    {action.description}
                  </p>

                  <div className="mt-2">
                    <span className="rounded-full border border-[#FF2E88]/10 bg-[#FF2E88]/[0.025] px-2 py-0.5 text-[7px] font-medium tracking-[0.1em] text-[#FF2E88]/55">
                      PROPOSED
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[155px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.07] px-6 text-center">
          <div
            className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${
              actionsWorking
                ? "bg-[#FF2E88]/[0.07] text-[#FF2E88]"
                : "bg-white/[0.035] text-white/25"
            }`}
          >
            <Target
              size={15}
              className={
                actionsWorking
                  ? "animate-pulse"
                  : ""
              }
            />
          </div>

          <p className="max-w-[230px] text-[10px] leading-5 text-white/38">
            {actionsWorking
              ? "The Action Agent is generating concrete next steps."
              : hasFailure
                ? "Action generation is waiting for the interrupted stage."
                : "Actions will appear when the Action Agent completes."}
          </p>
        </div>
      )}
    </section>
  );
}