"use client";

import { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Mic,
  MicOff,
  Sparkles,
} from "lucide-react";

import { useVoiceInput } from "@/hooks/useVoiceInput";

type VoiceComposerProps = {
  problem: string;
  setProblem: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  isResolving: boolean;
};

export default function VoiceComposer({
  problem,
  setProblem,
  onSubmit,
  isResolving,
}: VoiceComposerProps) {
  const {
    isListening,
    isSupported,
    voiceError,
    startListening,
    stopListening,
  } = useVoiceInput((transcript) => {
    setProblem(transcript);
  });

  function handleVoiceClick() {
    if (isListening) {
      stopListening();
      return;
    }

    startListening();
  }

  return (
    <div className="w-full">
      <form
        onSubmit={onSubmit}
        className={`group relative flex items-center rounded-[22px] border p-2.5 pl-3 shadow-[0_25px_80px_rgba(0,0,0,0.35)] transition-all duration-300 ${
          isListening
            ? "border-[#FF2E88]/35 bg-[#FF2E88]/[0.035] shadow-[0_0_70px_rgba(255,46,136,0.06)]"
            : "border-white/[0.09] bg-white/[0.035] focus-within:border-[#00A8E8]/30 focus-within:bg-white/[0.045]"
        }`}
      >
        <button
          type="button"
          onClick={handleVoiceClick}
          disabled={!isSupported || isResolving}
          aria-label={
            isListening
              ? "Stop listening"
              : "Start voice input"
          }
          className={`relative mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30 ${
            isListening
              ? "border-[#FF2E88]/30 bg-[#FF2E88]/10 text-[#FF2E88]"
              : "border-white/[0.06] bg-white/[0.025] text-white/35 hover:border-[#00A8E8]/20 hover:bg-[#00A8E8]/[0.05] hover:text-[#00A8E8]"
          }`}
        >
          {isListening && (
            <>
              <motion.span
                className="absolute h-7 w-7 rounded-full border border-[#FF2E88]/30"
                animate={{
                  scale: [1, 1.45],
                  opacity: [0.55, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />

              <motion.span
                className="absolute h-7 w-7 rounded-full border border-[#FF2E88]/20"
                animate={{
                  scale: [1, 1.75],
                  opacity: [0.35, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay: 0.25,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </>
          )}

          {isListening ? (
            <MicOff
              size={17}
              strokeWidth={1.8}
              className="relative z-10"
            />
          ) : (
            <Mic
              size={17}
              strokeWidth={1.8}
              className="relative z-10"
            />
          )}
        </button>

        <input
          value={problem}
          onChange={(event) =>
            setProblem(event.target.value)
          }
          disabled={isResolving}
          type="text"
          placeholder={
            isListening
              ? "Listening..."
              : "Tell LifeLine what's happening..."
          }
          className="h-12 min-w-0 flex-1 bg-transparent px-2 text-[14px] text-white outline-none placeholder:text-white/24 disabled:opacity-60"
        />

        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mr-3 hidden items-center gap-2 sm:flex"
            >
              <div className="flex h-5 items-end gap-[3px]">
                {[8, 14, 10, 17, 12].map(
                  (height, index) => (
                    <motion.span
                      key={index}
                      className="w-[2px] rounded-full bg-[#FF2E88]"
                      animate={{
                        height: [
                          4,
                          height,
                          6,
                          height - 2,
                          4,
                        ],
                      }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        delay: index * 0.08,
                      }}
                    />
                  )
                )}
              </div>

              <span className="text-[8px] font-semibold tracking-[0.18em] text-[#FF2E88]/80">
                LISTENING
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={!problem.trim() || isResolving}
          aria-label="Resolve situation"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#00A8E8] text-[#031014] transition duration-300 hover:bg-[#27B9EF] disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-white/20"
        >
          {isResolving ? (
            <Sparkles
              size={17}
              className="animate-pulse"
            />
          ) : (
            <ArrowUp size={19} strokeWidth={2} />
          )}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {isListening ? (
          <motion.div
            key="listening"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center justify-center gap-2"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF2E88] opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF2E88]" />
            </span>

            <p className="text-[9px] tracking-[0.08em] text-white/35">
              Speak naturally. LifeLine is listening.
            </p>
          </motion.div>
        ) : voiceError ? (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-center text-[9px] text-[#FF2E88]/75"
          >
            {voiceError}
          </motion.p>
        ) : !isSupported ? (
          <motion.p
            key="unsupported"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-center text-[9px] text-white/28"
          >
            Voice input isn&apos;t supported in this browser.
            You can still type your situation.
          </motion.p>
        ) : (
          <motion.p
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-center text-[9px] text-white/24"
          >
            Type your situation or use voice input.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}