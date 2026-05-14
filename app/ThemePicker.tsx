"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type ThemeId =
  | "obsidian"
  | "midnight"
  | "forest"
  | "crimson"
  | "ivory"
  | "slate";

const THEMES: { id: ThemeId; label: string; bg: string; accent: string }[] = [
  { id: "obsidian", label: "Obsidian", bg: "#0f0d0b", accent: "#ca8a04" },
  { id: "midnight", label: "Midnight", bg: "#070d1a", accent: "#22d3ee" },
  { id: "forest",   label: "Forest",   bg: "#060e09", accent: "#4ade80" },
  { id: "crimson",  label: "Crimson",  bg: "#0d0608", accent: "#f43f5e" },
  { id: "ivory",    label: "Ivory",    bg: "#faf7f2", accent: "#78350f" },
  { id: "slate",    label: "Slate",    bg: "#0a0b10", accent: "#a78bfa" },
];

interface Props {
  theme: ThemeId;
  onChange: (t: ThemeId) => void;
}

export default function ThemePicker({ theme, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const current = THEMES.find((t) => t.id === theme)!;

  // Position popover relative to viewport so it escapes overflow:hidden
  const openPopover = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPopoverPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (btnRef.current && !btnRef.current.contains(target)) {
        // Also check if click is inside the portal popover
        const popover = document.getElementById("theme-popover");
        if (!popover || !popover.contains(target)) {
          setOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const popover = open
    ? createPortal(
        <div
          id="theme-popover"
          style={{
            position: "fixed",
            top: popoverPos.top,
            right: popoverPos.right,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 8,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 148,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            transformOrigin: "top right",
            animation: "popoverIn 150ms var(--ease-out) forwards",
            zIndex: 9999,
          }}
        >
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => { onChange(t.id); setOpen(false); }}
              className="cursor-pointer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "7px 10px",
                borderRadius: 8,
                border: "none",
                background: theme === t.id ? "var(--surface-2)" : "transparent",
                width: "100%",
                textAlign: "left",
                transition: "background 120ms ease",
              }}
              onMouseEnter={(e) => {
                if (theme !== t.id)
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-2)";
              }}
              onMouseLeave={(e) => {
                if (theme !== t.id)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: t.accent,
                  border: `2px solid ${t.bg}`,
                  boxShadow: `0 0 0 1.5px ${t.accent}60`,
                }}
              />
              <span
                className="text-xs font-medium"
                style={{
                  color: theme === t.id ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                {t.label}
              </span>
              {theme === t.id && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  style={{ marginLeft: "auto", color: "var(--gold)", flexShrink: 0 }}
                >
                  <path
                    d="M2 6L4.8 9L10 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => (open ? setOpen(false) : openPopover())}
        aria-label="Change theme"
        className="cursor-pointer"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 10px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          transition: "border-color 150ms ease, background 150ms ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--gold-muted)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: current.accent,
            boxShadow: `0 0 0 2px ${current.bg}, 0 0 0 3px ${current.accent}40`,
          }}
        />
        <span
          className="hidden text-xs font-medium tracking-wide sm:inline"
          style={{ color: "var(--text-muted)" }}
        >
          {current.label}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{
            color: "var(--text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 150ms ease",
          }}
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {popover}
    </>
  );
}
