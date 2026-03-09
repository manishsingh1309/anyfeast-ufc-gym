/**
 * ToastContext.tsx
 *
 * Lightweight in-app notification system.
 * Usage: const { toast } = useToast();
 *        toast.success("Saved!") | toast.error("Failed.") | toast.info("…")
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastKind = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
    warning: (msg: string) => void;
  };
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// ─── Config ──────────────────────────────────────────────────────────────────

const DURATION_MS = 3800;

const KIND_STYLES: Record<ToastKind, { bg: string; icon: React.ReactNode }> = {
  success: {
    bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-700",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
  },
  error: {
    bg: "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700",
    icon: <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />,
  },
  info: {
    bg: "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-700",
    icon: <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />,
  },
  warning: {
    bg: "bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-700",
    icon: <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />,
  },
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<ToastItem[]>([]);

  const addToast = useCallback((kind: ToastKind, message: string) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setItems((prev) => [...prev, { id, kind, message }]);
    setTimeout(
      () => setItems((prev) => prev.filter((t) => t.id !== id)),
      DURATION_MS
    );
  }, []);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg: string) => addToast("success", msg),
    error: (msg: string) => addToast("error", msg),
    info: (msg: string) => addToast("info", msg),
    warning: (msg: string) => addToast("warning", msg),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast stack — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 w-80 pointer-events-none">
        <AnimatePresence>
          {items.map((item) => {
            const style = KIND_STYLES[item.kind];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className={[
                  "pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg",
                  style.bg,
                ].join(" ")}
              >
                {style.icon}
                <p className="flex-1 text-xs font-medium text-gray-800 dark:text-slate-200">
                  {item.message}
                </p>
                <button
                  onClick={() => dismiss(item.id)}
                  className="shrink-0 rounded p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};
