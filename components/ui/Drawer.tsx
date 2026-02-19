"use client";

import { useEffect, useState } from "react";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const DURATION_MS = 320;

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const isVisible = open || isExiting;

  useEffect(() => {
    if (open) {
      setIsExiting(false);
      setIsEntering(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsEntering(false));
      });
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open && isVisible && !isExiting) {
      setIsExiting(true);
    }
  }, [open, isVisible, isExiting]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && (open ? onClose() : null);
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isVisible, open, onClose]);

  const handleTransitionEnd = () => {
    if (isExiting) {
      setIsExiting(false);
    }
  };

  const handleBackdropClick = () => {
    if (open) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  const isOpen = open && !isExiting && !isEntering;

  return (
    <div
      className="fixed inset-0 z-40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      {/* Backdrop: fade */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out md:bg-black/30 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Panel: slide from right on desktop, from bottom on mobile */}
      <aside
        className={`
          absolute flex flex-col border-border bg-card shadow-xl
          transition-transform duration-300 ease-out
          bottom-0 left-0 right-0 top-auto max-h-[90vh] rounded-t-2xl border-t
          md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-full md:max-h-none md:min-w-[28rem] md:max-w-xl md:rounded-none md:border-l md:border-t-0
          ${isOpen
            ? "translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-y-0 md:translate-x-full"
          }
        `}
        style={{ transitionDuration: `${DURATION_MS}ms` }}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={isExiting ? handleTransitionEnd : undefined}
      >
        <div className="flex items-center justify-between border-border border-b px-4 py-3">
          <h2 id="drawer-title" className="text-lg font-semibold text-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-primary-muted hover:text-foreground"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </aside>
    </div>
  );
}
