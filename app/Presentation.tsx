"use client";

import { useEffect, useState, useCallback } from "react";

const SLIDES = [
  {
    id: 1,
    label: "01 / Definition",
    content: <Slide1 />,
    script:
      "Xin chào mọi người. Hôm nay mình muốn giới thiệu một khái niệm đang âm thầm thay đổi cách chúng ta xây dựng các hệ thống AI: Harness Engineering. Chúng ta thường tốn rất nhiều thời gian tranh luận xem model nào tốt hơn, provider nào nên dùng, hay scale lên bao nhiêu tham số. Nhưng ngày càng có nhiều bằng chứng cho thấy hệ thống bao quanh model, tức là cái harness, mới là thứ quan trọng hơn bản thân model. Harness Engineering được định nghĩa là việc thiết kế toàn bộ môi trường xung quanh một AI agent: công cụ, quyền hạn, bộ nhớ, vòng phản hồi, và các rào chắn an toàn. Tất cả mọi thứ, ngoại trừ model. Khái niệm này được đặt ra bởi Mitchell Hashimoto, người sáng lập HashiCorp, vào đầu năm 2026, với một định nghĩa ngắn gọn: mỗi khi agent mắc lỗi, bạn thiết kế một giải pháp để nó không bao giờ mắc lỗi đó nữa. Đó là bản chất của kỷ luật này.",
  },
  {
    id: 2,
    label: "02 / Evolution",
    content: <Slide2 />,
    script:
      "Để hiểu tại sao Harness Engineering lại quan trọng vào lúc này, hãy nhìn lại cách mối quan hệ của chúng ta với AI đã thay đổi ra sao. Từ 2022 đến 2024, kỹ năng chủ đạo là Prompt Engineering: học cách đặt câu hỏi để model trả lời đúng ý. Đến 2025, lĩnh vực trưởng thành hơn với Context Engineering: không chỉ hỏi như thế nào, mà còn là cung cấp thông tin gì. RAG, memory systems, structured context windows đều là những cải tiến thực chất. Nhưng đến 2026, chúng ta bước vào kỷ nguyên thứ ba và rộng hơn. Context Engineering hỏi: agent nên thấy gì? Harness Engineering hỏi: cả hệ thống vận hành như thế nào? Nó bao gồm thiết kế công cụ, vòng kiểm tra, ranh giới bảo mật, quản lý trạng thái qua nhiều phiên làm việc, và việc áp đặt kiến trúc. Đây là kỷ luật của hệ thống, không phải của prompt.",
  },
  {
    id: 3,
    label: "03 / Why It Matters",
    content: <Slide3 />,
    script:
      "Đây là bằng chứng thuyết phục nhất mình tìm được. Các nhà nghiên cứu tại Princeton NLP công bố bài báo SWE-agent, nghiên cứu về AI agent giải quyết các bài toán kỹ thuật phần mềm thực tế. Họ chỉ thực hiện một can thiệp duy nhất: thiết kế lại Agent-Computer Interface, tức là lớp mà model dùng để tương tác với môi trường. Giới hạn kết quả tìm kiếm tối đa 50 mục để tránh ngập context. Hiển thị file có số dòng, giới hạn 100 dòng mỗi lần xem. Thêm linting tích hợp để từ chối ngay các chỉnh sửa không hợp lệ về cú pháp. Họ không thay đổi gì ở model. Kết quả: hiệu suất tăng 64 phần trăm. Sáu mươi bốn phần trăm chỉ từ thiết kế interface. Rohit Verma tóm tắt rất chính xác: model là thứ suy nghĩ, nhưng harness là thứ mà nó suy nghĩ về. Chất lượng của tư duy bị giới hạn bởi chất lượng của môi trường.",
  },
  {
    id: 4,
    label: "04 / Core Components",
    content: <Slide4 />,
    script:
      "Vậy một harness được thiết kế tốt thực sự bao gồm những gì? Có bốn lớp nổi bật. Thứ nhất: công cụ và phân quyền. Một harness trưởng thành chỉ cấp cho agent đúng những công cụ nó thực sự cần, được kiểm soát bởi các quyền hạn rõ ràng. Claude Code, ví dụ, có hơn 40 công cụ được gating và 23 lớp kiểm tra lệnh bash. Agent không thể vươn ra ngoài vùng hoạt động được xác định. Thứ hai: kiến trúc bộ nhớ phân tầng. Claude Code triển khai ba tầng: file MEMORY.md khoảng 200 token luôn được tải, các file theo chủ đề được tải khi cần, và toàn bộ transcript có thể tìm kiếm nhưng không tự động được nạp. Điều này cho agent sự liên tục mà không làm phình context. Thứ ba: guardrails và feedback loops. Bao gồm nén context sau một số lượt nhất định, phát hiện frustration qua regex, và quality gates ngăn agent khai báo hoàn thành quá sớm. Thứ tư: lớp kiểm tra. Kiến trúc multi-agent của Anthropic có một evaluator riêng chạy Playwright, mô phỏng hành vi người dùng thực tế, trước khi tính năng được coi là hoàn chỉnh.",
  },
  {
    id: 5,
    label: "05 / Failure Patterns",
    content: <Slide5 />,
    script:
      "Để hiểu thiết kế harness, cần hiểu các failure mode mà nó đang giải quyết. Ba pattern xuất hiện nhất quán trong các triển khai AI agent thực tế. Thứ nhất là over-ambition: agent cố gắng xử lý quá nhiều việc trong một phiên, mất mạch tư duy, và tạo ra kết quả không đầy đủ hoặc mâu thuẫn. Cách harness xử lý là phân phạm vi session rõ ràng, thường là một tính năng hoặc một nhiệm vụ mỗi context window. Thứ hai là premature victory: agent tuyên bố nhiệm vụ hoàn thành trước khi được xác minh. Điều này đặc biệt nguy hiểm vì độ tự tin bên trong của agent không tương quan tốt với độ chính xác thực tế. Giải pháp là một evaluator độc lập kiểm tra đầu ra, dùng các công cụ như Playwright để mô phỏng hành vi người dùng thực. Thứ ba là poor self-evaluation: agent liên tục đánh giá quá cao chất lượng công việc của chính mình. Giải pháp là các rubric chấm điểm có cấu trúc và vòng kiểm tra độc lập, loại bỏ agent khỏi vai trò tự đánh giá đầu ra của nó.",
  },
  {
    id: 6,
    label: "06 / Takeaway",
    content: <Slide6 />,
    script:
      "Mình muốn để lại cho mọi người một suy nghĩ mà mình tin sẽ định hình lợi thế cạnh tranh trong kỹ thuật AI trong hai đến ba năm tới. Model là hàng hóa phổ thông. Harness mới là sản phẩm. Các model đang hội tụ. GPT, Claude, Gemini: khoảng cách năng lực đang thu hẹp nhanh hơn bất kỳ ai trong chúng ta kỳ vọng. Điều sẽ tạo ra sự khác biệt giữa các team và sản phẩm không phải là họ dùng model nào, mà là họ đã thiết kế hệ thống xung quanh nó tốt đến đâu. Context Engineering là một tập con của điều này, trả lời câu hỏi agent nên thấy gì. Harness Engineering là kỷ luật rộng hơn, trả lời toàn bộ hệ thống vận hành như thế nào: công cụ, bộ nhớ, cơ chế phản hồi, ranh giới bảo mật, và kiến trúc kiểm tra. Nếu bạn đang xây dựng các hệ thống AI hôm nay, mình khuyến khích bạn chuyển bớt sự chú ý từ việc chọn model sang thiết kế harness. Đó mới là nơi có đòn bẩy thực sự. Cảm ơn mọi người.",
  },
];

type Direction = "forward" | "backward";

export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideKey, setSlideKey] = useState(0);
  const [showScript, setShowScript] = useState(false);

  const goTo = useCallback(
    (next: number, direction: Direction) => {
      if (isAnimating || next < 0 || next >= SLIDES.length) return;
      setIsAnimating(true);
      setTimeout(() => {
        setCurrent(next);
        setSlideKey((k) => k + 1);
        setIsAnimating(false);
      }, 380);
    },
    [isAnimating]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        goTo(current + 1, "forward");
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goTo(current - 1, "backward");
      } else if (e.key === "s" || e.key === "S") {
        setShowScript((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, goTo]);

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

      {/* Slide area: blank during transition, then fade in new slide */}
      <main className="relative z-10 flex flex-1 overflow-hidden">
        {isAnimating ? (
          <div className="flex flex-1 items-center justify-center">
            <div
              className="h-1 w-16 overflow-hidden rounded-full"
              style={{ background: "var(--surface-2)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  background: "var(--gold)",
                  animation: "loadBar 380ms var(--ease-out) forwards",
                }}
              />
            </div>
          </div>
        ) : (
          <div key={slideKey} className="slide-enter flex flex-1">
            {SLIDES[current].content}
          </div>
        )}
      </main>

      {/* Script panel */}
      {showScript && (
        <div
          className="relative z-10 px-10 py-5"
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--surface)",
            maxHeight: "30%",
            overflowY: "auto",
          }}
        >
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--gold)" }}
          >
            Speaker notes
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {SLIDES[current].script}
          </p>
        </div>
      )}

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
        <span className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>left / right to navigate</span>
          <span
            style={{
              color: showScript ? "var(--gold)" : "var(--text-muted)",
              transition: "color 200ms ease",
            }}
          >
            s: {showScript ? "hide" : "show"} script
          </span>
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
