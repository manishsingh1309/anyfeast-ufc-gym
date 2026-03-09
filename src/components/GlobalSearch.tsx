/**
 * GlobalSearch.tsx — Command-palette style global search modal.
 *
 * Searches members and trainers from mock data on keystroke.
 */

import React, { useEffect, useRef, useState } from "react";
import { Search, User, Users, X } from "lucide-react";
import clsx from "clsx";
import { MOCK_MEMBERS } from "../services/memberService";

// ─── Mock trainers for search ────────────────────────────────────────────────

const MOCK_TRAINERS = [
  { id: "tr_001", name: "Arjun Mehta", gymId: "gym_001", type: "trainer" as const },
  { id: "tr_002", name: "Priya Nair", gymId: "gym_001", type: "trainer" as const },
  { id: "tr_003", name: "Rahul Verma", gymId: "gym_002", type: "trainer" as const },
  { id: "tr_004", name: "Sneha Kapoor", gymId: "gym_002", type: "trainer" as const },
  { id: "tr_005", name: "Vikrant Yadav", gymId: "gym_001", type: "trainer" as const },
];

type ResultType = "member" | "trainer";

interface SearchResult {
  id: string;
  name: string;
  subtitle: string;
  type: ResultType;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Cmd/Ctrl+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) {
          // The parent opens it; here we just prevent default
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  const q = query.toLowerCase().trim();

  const results: SearchResult[] = q
    ? [
        ...MOCK_MEMBERS.filter((m) =>
          m.name.toLowerCase().includes(q) || m.phone.includes(q)
        ).map((m) => ({
          id: m.id,
          name: m.name,
          subtitle: `Member · ${m.subscriptionTier} · ${m.status.replace("_", " ")}`,
          type: "member" as const,
        })),
        ...MOCK_TRAINERS.filter((t) => t.name.toLowerCase().includes(q)).map(
          (t) => ({
            id: t.id,
            name: t.name,
            subtitle: `Trainer · ${t.gymId === "gym_001" ? "FitZone Koramangala" : "FitZone Indiranagar"}`,
            type: "trainer" as const,
          })
        ),
      ]
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3.5 dark:border-slate-700">
          <Search className="h-4 w-4 shrink-0 text-gray-400 dark:text-slate-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members, trainers…"
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none dark:text-slate-100 dark:placeholder-slate-500"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-slate-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto">
          {!q && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Search className="h-8 w-8 text-gray-200 dark:text-slate-600" />
              <p className="text-sm text-gray-400 dark:text-slate-500">
                Start typing to search members and trainers
              </p>
            </div>
          )}

          {q && results.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-400 dark:text-slate-500">
                No results for "<span className="font-medium">{query}</span>"
              </p>
            </div>
          )}

          {results.length > 0 && (
            <ul className="py-2">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/60"
                    onClick={onClose}
                  >
                    <div
                      className={clsx(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs",
                        r.type === "member"
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                          : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                      )}
                    >
                      {r.type === "member" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Users className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800 dark:text-slate-200">
                        {r.name}
                      </p>
                      <p className="truncate text-xs capitalize text-gray-400 dark:text-slate-500">
                        {r.subtitle}
                      </p>
                    </div>
                    <span
                      className={clsx(
                        "ml-auto shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                        r.type === "member"
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                          : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                      )}
                    >
                      {r.type}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-gray-100 px-4 py-2 dark:border-slate-700">
          <p className="text-[10px] text-gray-400 dark:text-slate-600">
            Press <kbd className="rounded border border-gray-200 px-1 dark:border-slate-600">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
};
