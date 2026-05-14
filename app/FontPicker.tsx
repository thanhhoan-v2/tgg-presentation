"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type FontId =
  | "dm-sans"
  | "playfair"
  | "space-mono"
  | "syne"
  | "bricolage"
  | "instrument";

export const FONT_FAMILIES: Record<FontId, string> = {
  "dm-sans":    "var(--font-dm-sans), system-ui, sans-serif",
  "playfair":   "var(--font-playfair), Georgia, serif",
  "space-mono": "var(--font-space-mono), monospace",
  "syne":       "var(--font-syne), system-ui, sans-serif",
  "bricolage":  "var(--font-bricolage), system-ui, sans-serif",
  "instrument": "var(--font-instrument), Georgia, serif",
};

const FONTS: { id: FontId; label: string; sample: string }[] = [
  { id: "dm-sans",    label: "DM Sans",             sample: "Aa" },
  { id: "playfair",   label: "Playfair Display",     sample: "Aa" },
  { id: "space-mono", label: "Space Mono",           sample: "Aa" },
  { id: "syne",       label: "Syne",                 sample: "Aa" },
  { id: "bricolage",  label: "Bricolage Grotesque",  sample: "Aa" },
  { id: "instrument", label: "Instrument Serif",     sample: "Aa" },
];

interface Props {
  font: FontId;
  onChange: (f: FontId) => void;
}

export default function FontPicker({ font, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const current = FONTS.find((f) => f.id === font)!;

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
        const popover = document.getElementById("font-popover");
        if (!popover || !popover.contains(target)) setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const popover = open
    ? createPortal(
        <div
          id="font-popover"
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
            minWidth: 196,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            transformOrigin: "top right",
            animation: "popoverIn 150ms var(--ease-out) forwards",
            zIndex: 9999,
          }}
        >
          {FONTS.map((f) => (
            <button
              key={f.id}
              onClick={() => { onChange(f.id); setOpen(false); }}
              className="cursor-pointer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "7px 10px",
                borderRadius: 8,
                border: "none",
                background: font === f.id ? "var(--surface-2)" : "transparent",
                width: "100%",
                textAlign: "left",
                transition: "background 120ms ease",
              }}
              onMouseEnter={(e) => {
                if (font !== f.id)
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-2)";
              }}
              onMouseLeave={(e) => {
                if (font !== f.id)
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {/* Sample rendered in that font */}
              <span
                style={{
                  fontFamily: FONT_FAMILIES[f.id],
                  fontSize: 15,
                  fontWeight: 600,
                  width: 24,
                  textAlign: "center",
                  flexShrink: 0,
                  color: font === f.id ? "var(--gold)" : "var(--text-secondary)",
                }}
              >
                {f.sample}
              </span>
              <span
                className="text-xs font-medium"
                style={{
                  color: font === f.id ? "var(--text-primary)" : "var(--text-secondary)",
                  fontFamily: FONT_FAMILIES[f.id],
                }}
              >
                {f.label}
              </span>
              {font === f.id && (
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
        aria-label="Change font"
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
        {/* "T" icon in current font */}
        <span
          style={{
            fontFamily: FONT_FAMILIES[font],
            fontSize: 13,
            fontWeight: 700,
            color: "var(--gold)",
            lineHeight: 1,
          }}
        >
          T
        </span>
        <span
          className="text-xs font-medium tracking-wide"
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
