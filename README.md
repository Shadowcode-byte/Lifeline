# LifeLine

> A simulated Alexa+ multi-agent experience that turns complex real-world situations into clear, actionable resolution plans.

LifeLine is an agentic situation-resolution system built for the **Build, Ship, Shape: Amazon Developer Hackathon 2026**.

Instead of treating a user's problem as a single prompt, LifeLine decomposes the situation across specialized AI agents that understand the problem, organize its context, create a resolution strategy, and generate concrete next actions.

---

## The Problem

Real-world problems rarely require a single answer.

A situation such as:

> "My laptop died and my assignment is due tonight."

contains multiple layers:

- What is the user actually trying to achieve?
- How urgent is the situation?
- What constraints exist?
- What information is missing?
- Which actions should happen first?
- How should the final recommendation be communicated?

Traditional assistants often respond directly to the prompt.

LifeLine instead treats the situation as a **resolution workflow**.

---

## How LifeLine Works

```text
User speaks or types a situation
              |
              v
     Understanding Agent
              |
              v
        Context Agent
              |
              v
       Planning Agent
              |
              v
        Action Agent
              |
              v
       LifeLine Response
```

Each specialist receives structured output from the previous stage.

### 1. Understanding Agent

Identifies:

- user intent
- urgency
- constraints
- desired outcome

### 2. Context Agent

Organizes:

- situation summary
- assumptions
- missing information
- priorities

### 3. Planning Agent

Builds:

- overall resolution strategy
- prioritized steps
- practical sequence of actions

### 4. Action Agent

Produces:

- concrete proposed actions
- concise conversational final response

LifeLine distinguishes **proposed actions** from executed actions and does not claim to have performed external operations it has not actually performed.

---

## Real-Time Agent Orchestration

LifeLine does not wait for the complete workflow before updating the interface.

The backend streams stage events to the browser using **NDJSON over a streaming HTTP response**.

The interface can therefore display real execution progress:

```text
Understanding   WORKING
Context         WAITING
Planning        WAITING
Actions         WAITING

        ↓

Understanding   COMPLETE
Context         WORKING
Planning        WAITING
Actions         WAITING

        ↓

Understanding   COMPLETE
Context         COMPLETE
Planning        COMPLETE
Actions         COMPLETE
```

Agent outputs appear in the interface as they become available.

---

## Simulated Alexa+ Experience

LifeLine is presented as a **custom simulated Alexa+ experience**.

Users can interact naturally through:

- typed situations
- browser-based voice input
- conversational final responses
- live agent orchestration visualization

Voice input is transcribed into the composer first so the user can review or correct the transcription before submitting it.

The interface explicitly identifies the experience as simulated rather than implying access to restricted Alexa+ developer capabilities.

---

## Voice Interaction

LifeLine uses browser speech recognition when supported.

```text
Voice
  |
  v
Speech recognition
  |
  v
Editable transcript
  |
  v
LifeLine orchestration
```

The transcript is **not automatically submitted**.

This allows users to correct recognition errors before triggering the agent workflow.

---

## Resilient AI Layer

LifeLine uses a shared server-side AI provider layer.

The application includes:

- model-level fallback
- application-level request timeouts
- structured JSON parsing
- temporary provider failure handling
- partial workflow preservation

If a provider becomes unavailable, LifeLine can attempt another configured model instead of immediately terminating the workflow.

```text
Primary model
     |
     | unavailable / timeout
     v
Fallback model
     |
     | unavailable / timeout
     v
Lightweight fallback
```

API credentials remain server-side and are loaded through environment variables.

---

## Partial Failure Recovery

A multi-agent workflow should not discard useful work because one later stage fails.

For example:

```text
Understanding   COMPLETE
Context         COMPLETE
Planning        INTERRUPTED
Actions         WAITING
```

LifeLine preserves the completed Understanding and Context outputs and clearly identifies the interrupted stage.

This allows the interface to remain useful even during temporary inference-provider failures.

---

## Interface

LifeLine uses a restrained visual system built around:

- **Jet Black** — primary canvas
- **Cerulean Blue** — intelligence and active agent states
- **Neon Rose** — urgency, attention, voice, and consequential actions

The interface includes:

- live agent pipeline
- progress rail
- situation intelligence
- expandable reasoning summaries
- resolution strategy
- proposed action cards
- simulated Alexa+ response
- provider-failure states
- voice listening states

---

## Architecture

```text
                         USER
                          |
                   Voice / Text
                          |
                          v
                  Next.js Interface
                          |
                          v
                Streaming API Route
                          |
                          v
                LifeLine Orchestrator
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
   Understanding       Context        Planning
       Agent             Agent           Agent
          |               |               |
          +---------------+---------------+
                          |
                          v
                     Action Agent
                          |
                          v
                   Final Resolution
                          |
                          v
                 Simulated Alexa+
                    Experience
```

### Project structure

```text
src/
├── app/
│   ├── api/
│   │   └── resolve/
│   │       └── route.ts
│   └── page.tsx
│
├── components/
│   └── lifeline/
│       ├── ActivityMark.tsx
│       ├── AgentPipeline.tsx
│       ├── ProposedActions.tsx
│       ├── ResolutionDetails.tsx
│       ├── SituationIntelligence.tsx
│       └── VoiceComposer.tsx
│
├── hooks/
│   └── useVoiceInput.ts
│
├── lib/
│   ├── agents/
│   │   ├── understanding-agent.ts
│   │   ├── context-agent.ts
│   │   ├── planning-agent.ts
│   │   └── action-agent.ts
│   │
│   ├── ai/
│   │   └── gemini.ts
│   │
│   └── orchestrator.ts
│
└── types/
    └── lifeline.ts
```

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

### AI

- Google Gemini API
- `@google/genai`
- structured multi-agent prompting
- model fallback architecture

### Interaction

- Browser Speech Recognition API
- streaming HTTP responses
- NDJSON event stream

### Development

- Node.js
- npm
- Git
- GitHub

---

## Running LifeLine Locally

### 1. Clone the repository

```bash
git clone https://github.com/Shadowcode-byte/Lifeline.git
cd Lifeline
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the environment

Create:

```text
.env.local
```

Add:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Never commit `.env.local` or expose the API key in client-side code.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Production build

```bash
npm run build
```

---

## Security

LifeLine follows several basic credential-safety practices:

- Gemini credentials are stored in `.env.local`
- `.env*` files are excluded through `.gitignore`
- API requests originate from the server
- secrets are not embedded in frontend code
- proposed actions are clearly distinguished from executed actions
- exposed development credentials should be rotated before deployment

---

## Example

Input:

> My laptop died and my assignment is due tonight.

LifeLine can identify the deadline as critical, determine the primary constraints, separate assumptions from missing information, create a recovery strategy, and propose actions such as checking cloud backups, confirming the submission deadline, finding another device, and submitting through the required platform.

The final response is then written in a concise conversational style suitable for the simulated Alexa+ experience.

---

## Hackathon

Built for:

**Build, Ship, Shape: Amazon Developer Hackathon 2026**

LifeLine explores how an Alexa+-style agentic experience could move beyond simple question answering toward **multi-stage situation resolution**.

---

## Status

LifeLine is an active hackathon prototype.

Current capabilities include:

- [x] Multi-agent orchestration
- [x] Understanding Agent
- [x] Context Agent
- [x] Planning Agent
- [x] Action Agent
- [x] Real-time streaming progress
- [x] Voice input
- [x] Model fallback
- [x] Partial failure preservation
- [x] Simulated Alexa+ interaction
- [x] Production Next.js build
- [ ] Public deployment
- [ ] Demo video
- [ ] Final Devpost submission

---

## Author

Built by **Shadowcode-byte** for the Amazon Developer Hackathon 2026.
