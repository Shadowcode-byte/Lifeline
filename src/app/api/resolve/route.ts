import { runUnderstandingAgent } from "@/lib/agents/understanding-agent";
import { runContextAgent } from "@/lib/agents/context-agent";
import { runPlanningAgent } from "@/lib/agents/planning-agent";
import { runActionAgent } from "@/lib/agents/action-agent";

function createEvent(type: string, data: unknown) {
  return `${JSON.stringify({
    type,
    data,
  })}\n`;
}

function getReadableError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase();

  if (
    message.includes("503") ||
    message.includes("unavailable") ||
    message.includes("high demand")
  ) {
    return "The AI provider is temporarily experiencing high demand.";
  }

  if (
    message.includes("timeout") ||
    message.includes("timed out")
  ) {
    return "The AI provider took too long to respond.";
  }

  return "This agent could not complete its task.";
}

export async function POST(request: Request) {
  const body = await request.json();
  const problem = body?.problem;

  if (
    !problem ||
    typeof problem !== "string" ||
    !problem.trim()
  ) {
    return new Response(
      createEvent("error", {
        message: "A problem description is required.",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/x-ndjson",
        },
      }
    );
  }

  const cleanProblem = problem.trim();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(type: string, data: unknown) {
        controller.enqueue(
          encoder.encode(createEvent(type, data))
        );
      }

      try {
        // -----------------------------------------
        // Understanding Agent
        // -----------------------------------------

        send("stage", {
          stage: "understanding",
          status: "working",
        });

        let analysis;

        try {
          analysis =
            await runUnderstandingAgent(cleanProblem);
        } catch (error) {
          send("stage", {
            stage: "understanding",
            status: "failed",
            error: getReadableError(error),
          });

          send("failed", {
            stage: "understanding",
            error: getReadableError(error),
          });

          controller.close();
          return;
        }

        send("stage", {
          stage: "understanding",
          status: "complete",
        });

        send("analysis", analysis);

        // -----------------------------------------
        // Context Agent
        // -----------------------------------------

        send("stage", {
          stage: "context",
          status: "working",
        });

        let context;

        try {
          context = await runContextAgent(
            cleanProblem,
            analysis
          );
        } catch (error) {
          send("stage", {
            stage: "context",
            status: "failed",
            error: getReadableError(error),
          });

          send("failed", {
            stage: "context",
            error: getReadableError(error),
          });

          controller.close();
          return;
        }

        send("stage", {
          stage: "context",
          status: "complete",
        });

        send("context", context);

        // -----------------------------------------
        // Planning Agent
        // -----------------------------------------

        send("stage", {
          stage: "planning",
          status: "working",
        });

        let plan;

        try {
          plan = await runPlanningAgent(
            cleanProblem,
            analysis,
            context
          );
        } catch (error) {
          send("stage", {
            stage: "planning",
            status: "failed",
            error: getReadableError(error),
          });

          send("failed", {
            stage: "planning",
            error: getReadableError(error),
          });

          controller.close();
          return;
        }

        send("stage", {
          stage: "planning",
          status: "complete",
        });

        send("plan", plan);

        // -----------------------------------------
        // Action Agent
        // -----------------------------------------

        send("stage", {
          stage: "actions",
          status: "working",
        });

        let result;

        try {
          result = await runActionAgent(
            cleanProblem,
            analysis,
            context,
            plan
          );
        } catch (error) {
          send("stage", {
            stage: "actions",
            status: "failed",
            error: getReadableError(error),
          });

          send("failed", {
            stage: "actions",
            error: getReadableError(error),
          });

          controller.close();
          return;
        }

        send("stage", {
          stage: "actions",
          status: "complete",
        });

        send("result", result);

        // -----------------------------------------
        // Workflow complete
        // -----------------------------------------

        send("complete", {
          problem: cleanProblem,
        });

        controller.close();
      } catch (error) {
        send("error", {
          message:
            "LifeLine encountered an unexpected orchestration error.",
        });

        console.error(
          "LifeLine streaming infrastructure error:",
          error
        );

        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":
        "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}