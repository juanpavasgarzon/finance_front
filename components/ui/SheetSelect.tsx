"use client";

import { useEffect, useState } from "react";

const DURATION_MS = 280;

export interface SheetSelectOption<T = string> {
  value: T;
  label: string;
}

export interface SheetSelectProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: SheetSelectOption<T>[];
  label?: string;
  id?: string;
  placeholder?: string;
  className?: string;
  /** Optional empty option (e.g. "—") shown at top */
  emptyOption?: boolean;
}

export function SheetSelect<T extends string>({
  value,
  onChange,
  options,
  label,
  id,
  placeholder,
  className = "",
  emptyOption = false,
}: SheetSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const handler = () => setIsMobile(mql.matches);
    handler();
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const isVisible = open || isExiting;
  const isOpen = open && !isExiting;

  useEffect(() => {
    if (!open && isVisible && isMobile) {
      setIsExiting(true);
    }
  }, [open, isVisible, isMobile]);

  useEffect(() => {
    if (isVisible && isMobile) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isVisible, isMobile]);

  useEffect(() => {
    if (open) {
      setIsExiting(false);
    }
  }, [open]);

  const handleClose = () => {
    setIsExiting(true);
    setOpen(false);
  };

  const handleSelect = (v: T) => {
    onChange(v);
    handleClose();
  };

  const selectedLabel = emptyOption && !value
    ? placeholder ?? "—"
    : options.find((o) => o.value === value)?.label ?? placeholder ?? "—";

  const listOptions = emptyOption ? [{ value: "" as T, label: placeholder ?? "—" }, ...options] : options;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      {isMobile ? (
        <>
          <button
            type="button"
            id={id}
            onClick={() => setOpen(true)}
            className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-left text-sm text-foreground"
          >
            <span className={value ? "" : "text-muted"}>{selectedLabel}</span>
            <svg className="h-4 w-4 shrink-0 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isVisible && (
            <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label={label ?? "Select option"}>
              <div
                className={`absolute inset-0 bg-black/40 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
                style={{ transitionDuration: `${DURATION_MS}ms` }}
                onClick={handleClose}
                aria-hidden="true"
              />
              <aside
                className={`absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-hidden rounded-t-2xl border-border border-t bg-card shadow-xl transition-transform ${
                  isOpen ? "translate-y-0" : "translate-y-full"
                }`}
                style={{ transitionDuration: `${DURATION_MS}ms` }}
                onClick={(e) => e.stopPropagation()}
                onTransitionEnd={() => {
                  if (isExiting) {
                    setIsExiting(false);
                  }
                }}
              >
                <div className="flex items-center justify-between border-border border-b px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{label ?? "Select"}</span>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded p-2 text-muted hover:bg-primary-muted hover:text-foreground"
                    aria-label="Close"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ul className="max-h-[60vh] overflow-y-auto py-2">
                  {listOptions.map((opt) => (
                    <li key={String(opt.value)}>
                      <button
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                          opt.value === value
                            ? "bg-primary-muted text-primary font-medium"
                            : "text-foreground hover:bg-primary-muted/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          )}
        </>
      ) : (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          {emptyOption && (
            <option value="">{placeholder ?? "—"}</option>
          )}
          {options.map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
