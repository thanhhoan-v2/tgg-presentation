"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import ThemePicker, { type ThemeId } from "./ThemePicker";
import FontPicker, { type FontId, FONT_FAMILIES } from "./FontPicker";

const SLIDES = [
  {
    id: 1,
    label: "01 / Definition",
    content: <Slide1 />,
    script:
      "Xin chào mọi người. Hôm nay mình muốn chia sẻ về một hướng tư duy đang dần thay đổi cách chúng ta xây dựng các hệ thống trí tuệ nhân tạo, mà mình tạm gọi là Harness Engineering. Chúng ta hay dành nhiều thời gian so sánh xem mô hình AI nào mạnh hơn, hay chọn nhà cung cấp nào. Nhưng bằng chứng ngày càng nhiều cho thấy phần môi trường bao quanh mô hình mới là yếu tố quyết định, chứ không phải bản thân mô hình. Harness Engineering là việc thiết kế toàn bộ môi trường đó: các công cụ mà AI được phép dùng, giới hạn quyền hạn của nó, cách nó lưu trữ thông tin, cơ chế nhận phản hồi, và các rào chắn ngăn nó phạm sai lầm. Khái niệm này được đặt ra bởi Mitchell Hashimoto, người sáng lập HashiCorp, đầu năm 2026, với một định nghĩa rất thực tế: mỗi khi AI mắc lỗi, bạn chỉnh lại hệ thống để nó không bao giờ mắc lỗi đó nữa. Nghe đơn giản, nhưng đây là một kỷ luật kỹ thuật thực sự.",
  },
  {
    id: 2,
    label: "02 / Evolution",
    content: <Slide2 />,
    script:
      "Để thấy được tại sao Harness Engineering xuất hiện đúng lúc này, hãy nhìn lại hành trình phát triển của ngành. Giai đoạn đầu, từ 2022 đến 2024, điều mọi người tập trung là học cách đặt câu hỏi cho AI sao cho ra kết quả tốt nhất, tức là nghệ thuật viết lệnh. Đến năm 2025, câu hỏi nâng lên một tầng: không chỉ hỏi thế nào, mà còn phải cung cấp đúng thông tin nào cho AI. Các kỹ thuật như truy vấn tài liệu thời gian thực hay quản lý bộ nhớ hội thoại ra đời trong giai đoạn này. Nhưng từ 2026, chúng ta bước vào giai đoạn thứ ba, rộng hơn nhiều. Câu hỏi giờ là: toàn bộ hệ thống xung quanh AI vận hành như thế nào? Nó được trang bị những công cụ gì, được giám sát ra sao, có cơ chế tự kiểm tra không, và ranh giới an toàn của nó được thiết kế thế nào. Đây không còn là kỹ năng cá nhân nữa, mà là kỷ thuật hệ thống.",
  },
  {
    id: 3,
    label: "03 / Why It Matters",
    content: <Slide3 />,
    script:
      "Đây là ví dụ thực tế thuyết phục nhất mình tìm được. Nhóm nghiên cứu tại Đại học Princeton đã thử nghiệm một AI tự động giải quyết các lỗi phần mềm thực tế. Họ chỉ thay đổi một thứ duy nhất: cách AI nhìn thấy và tương tác với môi trường làm việc của nó. Họ giới hạn số kết quả tìm kiếm hiển thị cùng lúc, để AI không bị ngợp thông tin. Họ cho AI xem mã nguồn có đánh số dòng, từng đoạn nhỏ thay vì cả file. Họ thêm bộ kiểm tra tự động từ chối ngay những thay đổi mã lỗi cú pháp. Mô hình AI không thay đổi gì cả. Kết quả: hiệu suất tăng 64 phần trăm. Chỉ từ việc thiết kế lại môi trường làm việc. Có một câu nói rất hay để tóm tắt điều này: mô hình là thứ suy nghĩ, nhưng môi trường là thứ nó suy nghĩ về. Chất lượng đầu ra bị ràng buộc bởi chất lượng của môi trường xung quanh.",
  },
  {
    id: 4,
    label: "04 / Core Components",
    content: <Slide4 />,
    script:
      "Vậy một hệ thống harness hoàn chỉnh trông như thế nào? Có bốn thành phần cốt lõi. Thứ nhất là công cụ và phân quyền. AI chỉ được trao đúng những công cụ nó thực sự cần, không hơn không kém. Claude Code chẳng hạn kiểm soát hơn 40 loại hành động khác nhau và có 23 bước xác thực trước khi cho phép chạy bất kỳ lệnh hệ thống nào. AI không thể tự ý làm những việc ngoài phạm vi được giao. Thứ hai là bộ nhớ phân tầng. Thay vì nhồi tất cả mọi thứ vào một chỗ, hệ thống chia bộ nhớ thành ba tầng: thông tin tóm tắt luôn được nạp sẵn, các tài liệu chi tiết chỉ tải khi cần, và lịch sử đầy đủ có thể tra cứu khi cần thiết. Nhờ vậy AI có được sự liên tục mà không bị quá tải thông tin. Thứ ba là các rào chắn và vòng phản hồi. Hệ thống tự nén thông tin sau một số lượt nhất định, phát hiện khi AI đang lặp vòng vô nghĩa, và chặn AI tự tuyên bố hoàn thành khi chưa qua kiểm tra. Thứ tư là lớp xác minh độc lập. Anthropic xây dựng một AI riêng chuyên kiểm tra kết quả bằng cách thực sự thao tác lên sản phẩm như người dùng thật, trước khi coi nhiệm vụ là xong.",
  },
  {
    id: 5,
    label: "05 / Failure Patterns",
    content: <Slide5 />,
    script:
      "Một cách khác để hiểu tại sao harness quan trọng là nhìn vào những lỗi phổ biến nhất mà AI hay mắc phải khi vận hành thực tế. Lỗi thứ nhất là tham lam quá mức: AI cố ôm quá nhiều việc trong một lần, kết quả là mất mạch, làm dở dang hoặc tạo ra những thứ mâu thuẫn nhau. Cách khắc phục là chia nhỏ phạm vi, mỗi phiên làm việc chỉ tập trung vào một nhiệm vụ cụ thể. Lỗi thứ hai là tự tuyên bố thắng sớm: AI nói đã xong việc trong khi thực ra chưa. Điều đáng lo là AI thường rất tự tin khi sai. Giải pháp là có một thành phần riêng biệt, hoàn toàn độc lập, chịu trách nhiệm kiểm tra kết quả bằng cách thử dùng sản phẩm như người dùng thật. Lỗi thứ ba là tự đánh giá bản thân quá cao: AI liên tục cho rằng mình đã làm tốt trong khi thực tế thì không. Giải pháp là không để AI tự chấm điểm mình, mà dùng các tiêu chí đánh giá rõ ràng từ bên ngoài.",
  },
  {
    id: 6,
    label: "06 / Takeaway",
    content: <Slide6 />,
    script:
      "Mình muốn kết thúc bằng một góc nhìn mà mình tin sẽ trở thành lợi thế cạnh tranh thực sự trong hai đến ba năm tới. Mô hình AI đang dần trở thành hàng hóa phổ thông. GPT, Claude, Gemini đang ngày càng tương đương nhau về năng lực, nhanh hơn nhiều so với kỳ vọng của chúng ta. Trong bối cảnh đó, điều tạo ra sự khác biệt không còn là bạn dùng mô hình nào, mà là bạn đã xây dựng hệ thống xung quanh nó tốt đến đâu. Quản lý thông tin đầu vào là một phần của điều đó, nhưng Harness Engineering là bức tranh toàn cảnh hơn: thiết kế công cụ, cơ chế kiểm tra, ranh giới an toàn, cách hệ thống học từ sai lầm. Nếu bạn đang xây dựng sản phẩm AI, đây là lời mình muốn gửi: đừng chỉ chọn mô hình tốt nhất. Hãy đầu tư vào việc thiết kế môi trường mà mô hình đó hoạt động trong đó. Đó mới là nơi tạo ra sự khác biệt bền vững. Cảm ơn mọi người đã lắng nghe.",
  },
];

type Direction = "forward" | "backward";

export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideKey, setSlideKey] = useState(0);
  const [showScript, setShowScript] = useState(false);
  const [theme, setTheme] = useState<ThemeId>("obsidian");
  const [font, setFont] = useState<FontId>("dm-sans");

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
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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

  // Swipe gesture handling
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1, "forward") : goTo(current - 1, "backward");
    }
  };

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden noise-overlay"
      style={{ background: "var(--bg)", fontFamily: FONT_FAMILIES[font] }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
        className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-10 sm:py-5"
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
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-medium tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            {String(current + 1).padStart(2, "0")} / {SLIDES.length}
          </span>
          <FontPicker font={font} onChange={setFont} />
          <ThemePicker theme={theme} onChange={setTheme} />
        </div>
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
        className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-10 sm:py-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          {SLIDES[current].label}
        </span>
        <span className="hidden text-xs sm:block" style={{ color: "var(--text-muted)" }}>
          left / right to navigate
        </span>
        <span className="text-xs sm:hidden" style={{ color: "var(--text-muted)" }}>
          swipe to navigate
        </span>
      </footer>
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────

function SlideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-5 py-6 sm:px-20 sm:py-12">
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
      className="fade-up fade-up-3 my-4 h-px w-16 sm:my-8"
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
        <Heading className="text-3xl sm:text-5xl">
          It&apos;s not the model.{" "}
          <span className="gold-shimmer">It&apos;s the harness.</span>
        </Heading>
        <Divider />
        <p
          className="fade-up fade-up-4 max-w-xl text-center text-sm leading-relaxed sm:text-lg"
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
        <Heading className="text-2xl sm:text-4xl">
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
        <Heading className="text-2xl sm:text-4xl">
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

        <div className="fade-up fade-up-5 grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
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
        <Heading className="text-2xl sm:text-4xl">
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
        <Heading className="text-2xl sm:text-4xl">
          Why agents fail, and how the harness fixes them
        </Heading>
        <Divider />
        <div className="fade-up fade-up-4 flex w-full flex-col gap-3">
          {patterns.map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-2 rounded-xl p-4 sm:grid-cols-3 sm:gap-4 sm:p-5"
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
        <Heading className="mb-2 text-4xl sm:mb-4 sm:text-6xl">
          <span className="gold-shimmer">Model is commodity.</span>
        </Heading>
        <Heading className="text-4xl sm:text-6xl">Harness is product.</Heading>
        <Divider />
        <p
          className="fade-up fade-up-4 max-w-lg text-center text-base leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          The next competitive advantage in AI engineering is not a more powerful
          model. It is the system that constrains, guides, and verifies the agent
          around it.
        </p>

        <div className="fade-up fade-up-5 mt-4 grid w-full grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
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
