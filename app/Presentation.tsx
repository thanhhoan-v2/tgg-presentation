"use client";

import { useEffect, useState, useCallback } from "react";

const SLIDES = [
  {
    id: 1,
    label: "01 / Definition",
    content: <Slide1 />,
  },
  {
    id: 2,
    label: "02 / Evolution",
    content: <Slide2 />,
  },
  {
    id: 3,
    label: "03 / Why It Matters",
    content: <Slide3 />,
  },
  {
    id: 4,
    label: "04 / Core Components",
    content: <Slide4 />,
  },
  {
    id: 5,
    label: "05 / Failure Patterns",
    content: <Slide5 />,
  },
  {
    id: 6,
    label: "06 / Takeaway",
    content: <Slide6 />,
  },
];

type Direction = "forward" | "backward";

export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  // outgoing holds the slide being animated out; null when idle
  const [outgoing, setOutgoing] = useState<{ index: number; id: number; direction: Direction } | null>(null);
  const [incomingId, setIncomingId] = useState(0);

  const goTo = useCallback(
    (next: number, direction: Direction) => {
      if (isAnimating || next < 0 || next >= SLIDES.length) return;
      setIsAnimating(true);

      // Snapshot current as the outgoing slide
      setOutgoing({ index: current, id: incomingId, direction });

      // Mount the new slide immediately (off-screen via enter animation)
      setCurrent(next);
      setIncomingId((id) => id + 1);

      // After exit animation completes, clean up outgoing
      setTimeout(() => {
        setOutgoing(null);
        setIsAnimating(false);
      }, 380);
    },
    [isAnimating, current, incomingId]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        goTo(current + 1, "forward");
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goTo(current - 1, "backward");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, goTo]);

  const enterClass = outgoing
    ? outgoing.direction === "forward"
      ? "slide-enter"
      : "slide-enter-back"
    : "";

  const exitClass = outgoing
    ? outgoing.direction === "forward"
      ? "slide-exit"
      : "slide-exit-back"
    : "";

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden noise-overlay"
      style={{ background: "var(--bg)" }}
    >
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.18,
        }}
      />

      {/* Top bar */}
      <header
        className="relative z-10 flex items-center justify-between px-10 py-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <span
          className="text-xs font-medium tracking-[0.15em] uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          Harness Engineering
        </span>
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === current ? 24 : 6,
                height: 6,
                borderRadius: 3,
                background: i === current ? "var(--gold)" : "var(--border)",
                transition: "width 300ms var(--ease-out), background 300ms ease",
              }}
            />
          ))}
        </div>
        <span
          className="text-xs font-medium tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          {String(current + 1).padStart(2, "0")} / {SLIDES.length}
        </span>
      </header>

      {/* Slide area: outgoing exits while incoming enters, both rendered simultaneously */}
      <main className="relative z-10 flex flex-1 overflow-hidden">
        {outgoing && (
          <div
            key={`out-${outgoing.id}`}
            className={`absolute inset-0 flex flex-1 ${exitClass}`}
          >
            {SLIDES[outgoing.index].content}
          </div>
        )}
        <div
          key={`in-${incomingId}`}
          className={`flex flex-1 ${outgoing ? enterClass : ""}`}
        >
          {SLIDES[current].content}
        </div>
      </main>

      {/* Bottom bar */}
      <footer
        className="relative z-10 flex items-center justify-between px-10 py-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          {SLIDES[current].label}
        </span>
        <span
          className="text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          left / right to navigate
        </span>
      </footer>
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────

function SlideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-20 py-12">
      {children}
    </div>
  );
}

function GoldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="fade-up fade-up-1 mb-4 text-xs font-semibold tracking-[0.2em] uppercase"
      style={{ color: "var(--gold)" }}
    >
      {children}
    </p>
  );
}

function Heading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={`fade-up fade-up-2 text-balance text-center font-semibold leading-tight tracking-tight ${className}`}
      style={{ color: "var(--text-primary)" }}
    >
      {children}
    </h1>
  );
}

function Divider() {
  return (
    <div
      className="fade-up fade-up-3 my-8 h-px w-16"
      style={{ background: "var(--gold-muted)" }}
    />
  );
}

function BulletList({ items }: { items: { icon: string; text: string; sub?: string }[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((item, i) => (
        <li
          key={i}
          className={`fade-up fade-up-${i + 3} flex items-start gap-4`}
        >
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--gold)",
            }}
          >
            {item.icon}
          </span>
          <div>
            <span
              className="text-base font-medium leading-relaxed"
              style={{ color: "var(--text-primary)" }}
            >
              {item.text}
            </span>
            {item.sub && (
              <p
                className="mt-0.5 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.sub}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function QuoteBlock({ quote, author }: { quote: string; author: string }) {
  return (
    <figure
      className="fade-up fade-up-4 relative rounded-2xl p-6"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="absolute -top-px left-8 right-8 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--gold-muted), transparent)" }}
      />
      <blockquote
        className="text-center text-base font-medium italic leading-relaxed"
        style={{ color: "var(--text-primary)" }}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption
        className="mt-3 text-center text-xs tracking-widest uppercase"
        style={{ color: "var(--gold)" }}
      >
        {author}
      </figcaption>
    </figure>
  );
}

// ─── Slide 1: Hook + Definition ───────────────────────────────────────────────

function Slide1() {
  return (
    <SlideLayout>
      <div className="flex w-full max-w-3xl flex-col items-center">
        <GoldLabel>Harness Engineering</GoldLabel>
        <Heading className="text-5xl">
          It&apos;s not the model.{" "}
          <span className="gold-shimmer">It&apos;s the harness.</span>
        </Heading>
        <Divider />
        <p
          className="fade-up fade-up-4 max-w-xl text-center text-lg leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          The practice of designing the entire environment surrounding an AI model:
          tools, permissions, memory, feedback loops, and guardrails, excluding
          the model itself.
        </p>
        <QuoteBlock
          quote="Anytime you find an agent makes a mistake, you engineer a solution such that the agent never makes that mistake again."
          author="Mitchell Hashimoto · HashiCorp Founder, Feb 2026"
        />
        <p
          className="fade-up fade-up-6 mt-6 text-xs tracking-widest uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          Presented by{" "}
          <span style={{ color: "var(--gold)" }}>Thanh Hoàn</span>
        </p>
      </div>
    </SlideLayout>
  );
}

// ─── Slide 2: Evolution ───────────────────────────────────────────────────────

function Slide2() {
  const stages = [
    {
      year: "2022 – 2024",
      name: "Prompt Engineering",
      desc: "Optimizing how to ask questions",
      active: false,
    },
    {
      year: "2025",
      name: "Context Engineering",
      desc: "Providing relevant information effectively",
      active: false,
    },
    {
      year: "2026",
      name: "Harness Engineering",
      desc: "Designing complete operational systems around AI agents",
      active: true,
    },
  ];

  return (
    <SlideLayout>
      <div className="flex w-full max-w-3xl flex-col items-center">
        <GoldLabel>Evolution</GoldLabel>
        <Heading className="text-4xl">
          Three eras of AI engineering
        </Heading>
        <Divider />
        <div className="fade-up fade-up-4 flex w-full flex-col gap-3">
          {stages.map((stage, i) => (
            <div
              key={i}
              className="flex items-center gap-5 rounded-xl p-5 transition-all duration-300"
              style={{
                background: stage.active ? "var(--surface)" : "transparent",
                border: `1px solid ${stage.active ? "var(--gold-muted)" : "var(--border)"}`,
                boxShadow: stage.active
                  ? "0 0 0 1px var(--gold-muted), 0 4px 24px rgba(202,138,4,0.08)"
                  : "none",
              }}
            >
              <span
                className="w-24 shrink-0 text-xs font-medium tabular-nums"
                style={{ color: stage.active ? "var(--gold)" : "var(--text-muted)" }}
              >
                {stage.year}
              </span>
              <div className="flex flex-col">
                <span
                  className="text-base font-semibold"
                  style={{
                    color: stage.active ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {stage.name}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {stage.desc}
                </span>
              </div>
              {stage.active && (
                <span
                  className="ml-auto rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
                  style={{
                    background: "rgba(202,138,4,0.12)",
                    color: "var(--gold-light)",
                    border: "1px solid var(--gold-muted)",
                  }}
                >
                  Now
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

// ─── Slide 3: Why It Matters ──────────────────────────────────────────────────

function Slide3() {
  return (
    <SlideLayout>
      <div className="flex w-full max-w-3xl flex-col items-center">
        <GoldLabel>Why It Matters</GoldLabel>
        <Heading className="text-4xl">
          Interface design alone improved performance by{" "}
          <span className="gold-shimmer">64%</span>
        </Heading>
        <Divider />
        <p
          className="fade-up fade-up-4 mb-6 max-w-xl text-center text-base leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Princeton NLP&apos;s SWE-agent paper demonstrated that changing only the
          Agent-Computer Interface, without touching the model, drove a 64%
          performance gain.
        </p>

        <div className="fade-up fade-up-5 grid w-full grid-cols-3 gap-4">
          {[
            { label: "Limited search results", detail: "Max 50 items to prevent context flooding" },
            { label: "Line-numbered file views", detail: "100 lines per view with index anchors" },
            { label: "Integrated linting", detail: "Rejects syntactically invalid edits immediately" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-xl p-5"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {item.label}
              </span>
              <span
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {item.detail}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 w-full">
          <QuoteBlock
            quote="The model is what thinks. The harness is what it thinks about."
            author="Rohit Verma"
          />
        </div>
      </div>
    </SlideLayout>
  );
}

// ─── Slide 4: Core Components ─────────────────────────────────────────────────

function Slide4() {
  return (
    <SlideLayout>
      <div className="flex w-full max-w-3xl flex-col items-center">
        <GoldLabel>Core Components</GoldLabel>
        <Heading className="text-4xl">
          What a harness is made of
        </Heading>
        <Divider />
        <div className="fade-up fade-up-4 w-full">
          <BulletList
            items={[
              {
                icon: "T",
                text: "Tools & Permissions",
                sub: "40+ gated tools, 23-layer bash validation: only what the agent needs",
              },
              {
                icon: "M",
                text: "3-Tier Memory",
                sub: "MEMORY.md (always loaded) → topic files (on-demand) → full transcripts (searchable)",
              },
              {
                icon: "G",
                text: "Guardrails & Feedback Loops",
                sub: "Regex frustration detection, quality gates, context compression after 5 turns",
              },
              {
                icon: "V",
                text: "Verification Layer",
                sub: "Evaluator agent runs Playwright tests to confirm features work from the user's perspective",
              },
            ]}
          />
        </div>
      </div>
    </SlideLayout>
  );
}

// ─── Slide 5: Failure Patterns ────────────────────────────────────────────────

function Slide5() {
  const patterns = [
    {
      failure: "Over-ambition",
      desc: "Agent attempts too many tasks simultaneously",
      fix: "Scoped sessions, one feature per context window",
    },
    {
      failure: "Premature victory",
      desc: "Agent declares completion without verification",
      fix: "Evaluator agent with Playwright, quality gates blocking early exit",
    },
    {
      failure: "Poor self-evaluation",
      desc: "Agent consistently overestimates its own work quality",
      fix: "External verification loop, structured scoring rubrics",
    },
  ];

  return (
    <SlideLayout>
      <div className="flex w-full max-w-3xl flex-col items-center">
        <GoldLabel>Failure Patterns</GoldLabel>
        <Heading className="text-4xl">
          Why agents fail, and how the harness fixes them
        </Heading>
        <Divider />
        <div className="fade-up fade-up-4 flex w-full flex-col gap-3">
          {patterns.map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-3 gap-4 rounded-xl p-5"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#f87171" }}
                >
                  {p.failure}
                </p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {p.desc}
                </p>
              </div>
              <div
                className="flex items-center justify-center"
                style={{ color: "var(--border)" }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 10h12M10 4l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--gold)" }}
                >
                  Harness fix
                </p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {p.fix}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

// ─── Slide 6: Takeaway ────────────────────────────────────────────────────────

function Slide6() {
  return (
    <SlideLayout>
      <div className="flex w-full max-w-3xl flex-col items-center">
        <GoldLabel>Key Takeaway</GoldLabel>
        <Heading className="mb-4 text-6xl">
          <span className="gold-shimmer">Model is commodity.</span>
        </Heading>
        <Heading className="text-6xl">Harness is product.</Heading>
        <Divider />
        <p
          className="fade-up fade-up-4 max-w-lg text-center text-base leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          The next competitive advantage in AI engineering is not a more powerful
          model. It is the system that constrains, guides, and verifies the agent
          around it.
        </p>

        <div className="fade-up fade-up-5 mt-8 grid w-full grid-cols-2 gap-4">
          {[
            { label: "Context Engineering", scope: "What should the agent see?" },
            { label: "Harness Engineering", scope: "How does the entire system operate?" },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-5"
              style={{
                background: i === 1 ? "var(--surface)" : "transparent",
                border: `1px solid ${i === 1 ? "var(--gold-muted)" : "var(--border)"}`,
              }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: i === 1 ? "var(--gold)" : "var(--text-secondary)" }}
              >
                {item.label}
              </p>
              <p
                className="mt-1 text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {item.scope}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}
