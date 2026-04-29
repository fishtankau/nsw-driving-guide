"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

const STORAGE_PREFIX = "nsw-driving:profile:";
const CURRENT_USER_KEY = "nsw-driving:current-user";

type Verdict = "got-it" | "read-later";
type FilterMode = "unreviewed" | "got-it" | "read-later" | "all";
type Profile = {
  username: string;
  passwordHash: string;
  decks: Record<string, Record<number, Verdict>>;
};

export type HandbookDeckProps = {
  deckId: string;
  title: string;
  subtitle?: string;
  totalPages: number;
  pageSrc: (n: number) => string;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

async function hashPassword(pw: string): Promise<string> {
  const data = new TextEncoder().encode(pw);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function loadProfile(username: string): Profile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_PREFIX + username);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    // Ensure decks exists (back-compat)
    if (!parsed.decks) parsed.decks = {};
    return parsed;
  } catch {
    return null;
  }
}

function saveProfile(p: Profile) {
  localStorage.setItem(STORAGE_PREFIX + p.username, JSON.stringify(p));
}

/* ------------------------------------------------------------------ */
/*  Sign-in form                                                       */
/* ------------------------------------------------------------------ */

function SignInForm({ onSignIn }: { onSignIn: (p: Profile) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExisting, setIsExisting] = useState<boolean | null>(null);

  useEffect(() => {
    const trimmed = username.trim();
    if (!trimmed) {
      setIsExisting(null);
      return;
    }
    setIsExisting(!!localStorage.getItem(STORAGE_PREFIX + trimmed));
  }, [username]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const u = username.trim();
    if (!u || !password) {
      setError("Username and password are required.");
      return;
    }
    setLoading(true);
    try {
      const ph = await hashPassword(password);
      const existing = loadProfile(u);
      let profile: Profile;
      if (existing) {
        if (existing.passwordHash !== ph) {
          setError("Wrong password for this username.");
          setLoading(false);
          return;
        }
        profile = existing;
      } else {
        profile = { username: u, passwordHash: ph, decks: {} };
        saveProfile(profile);
      }
      localStorage.setItem(CURRENT_USER_KEY, profile.username);
      onSignIn(profile);
    } catch {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex w-16 h-16 rounded-2xl bg-primary-light items-center justify-center mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Save Your Progress</h1>
        <p className="text-slate-500 mt-2 text-sm">
          Track which handbook pages you&apos;ve mastered and which to review
          later. Pick any username and password — we&apos;ll remember you on
          this device.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
      >
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. helen"
            autoComplete="username"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm"
          />
          {isExisting === true && (
            <p className="text-xs text-emerald-600 mt-1.5">
              ✓ Welcome back — enter your password to continue.
            </p>
          )}
          {isExisting === false && username.trim() && (
            <p className="text-xs text-slate-500 mt-1.5">
              New username — we&apos;ll create your profile.
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Pick a password"
            autoComplete={isExisting ? "current-password" : "new-password"}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in…" : isExisting ? "Sign In" : "Create Profile"}
        </button>

        <p className="text-[11px] text-slate-400 text-center pt-1">
          Stored only in this browser — no email, no tracking.
        </p>
      </motion.form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card variants                                                      */
/* ------------------------------------------------------------------ */

const cardVariants = {
  enter: { x: 0, scale: 0.95, opacity: 0, y: 20 },
  center: { x: 0, scale: 1, opacity: 1, y: 0, rotate: 0 },
  exit: (direction: "left" | "right" | null) => ({
    x: direction === "right" ? 600 : direction === "left" ? -600 : 0,
    rotate: direction === "right" ? 20 : direction === "left" ? -20 : 0,
    opacity: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/* ------------------------------------------------------------------ */
/*  Review deck                                                        */
/* ------------------------------------------------------------------ */

function ReviewDeck({
  profile,
  deckId,
  totalPages,
  pageSrc,
  onUpdateProfile,
  onSignOut,
}: {
  profile: Profile;
  deckId: string;
  totalPages: number;
  pageSrc: (n: number) => string;
  onUpdateProfile: (p: Profile) => void;
  onSignOut: () => void;
}) {
  const [filter, setFilter] = useState<FilterMode>("unreviewed");
  const [zoomed, setZoomed] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [dragX, setDragX] = useState(0);

  const deckProgress = profile.decks[deckId] || {};

  const queue = useMemo(() => {
    const all = Array.from({ length: totalPages }, (_, i) => i + 1);
    if (filter === "unreviewed") return all.filter((p) => !deckProgress[p]);
    if (filter === "got-it")
      return all.filter((p) => deckProgress[p] === "got-it");
    if (filter === "read-later")
      return all.filter((p) => deckProgress[p] === "read-later");
    return all;
  }, [filter, deckProgress, totalPages]);

  const currentPage = queue[0];
  const upcomingPage = queue[1];
  const totalReviewed = Object.keys(deckProgress).length;
  const gotItCount = Object.values(deckProgress).filter(
    (v) => v === "got-it"
  ).length;
  const readLaterCount = Object.values(deckProgress).filter(
    (v) => v === "read-later"
  ).length;

  function recordVerdict(verdict: Verdict, direction: "left" | "right") {
    if (!currentPage) return;
    setExitDirection(direction);
    const updated: Profile = {
      ...profile,
      decks: {
        ...profile.decks,
        [deckId]: { ...deckProgress, [currentPage]: verdict },
      },
    };
    onUpdateProfile(updated);
    setHistory((h) => [...h, currentPage]);
    setTimeout(() => setExitDirection(null), 400);
  }

  function undo() {
    const last = history[history.length - 1];
    if (!last) return;
    const newDeck = { ...deckProgress };
    delete newDeck[last];
    onUpdateProfile({
      ...profile,
      decks: { ...profile.decks, [deckId]: newDeck },
    });
    setHistory((h) => h.slice(0, -1));
  }

  function reset() {
    if (!confirm("Reset all progress for this handbook?")) return;
    onUpdateProfile({
      ...profile,
      decks: { ...profile.decks, [deckId]: {} },
    });
    setHistory([]);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    setDragX(0);
    const threshold = 120;
    if (info.offset.x > threshold) {
      recordVerdict("got-it", "right");
    } else if (info.offset.x < -threshold) {
      recordVerdict("read-later", "left");
    }
  }

  const gotItHintOpacity = Math.max(0, Math.min(1, dragX / 120));
  const readLaterHintOpacity = Math.max(0, Math.min(1, -dragX / 120));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-emerald-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
            {profile.username[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {profile.username}
            </p>
            <p className="text-[11px] text-slate-400 leading-tight">
              {totalReviewed} / {totalPages} pages reviewed
            </p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-5">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-emerald-500"
          animate={{ width: `${(totalReviewed / totalPages) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Filter tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5 text-[11px] sm:text-xs">
        {[
          {
            key: "unreviewed" as const,
            label: "Unreviewed",
            count: totalPages - totalReviewed,
          },
          {
            key: "got-it" as const,
            label: "💡 Got it",
            count: gotItCount,
          },
          {
            key: "read-later" as const,
            label: "📚 Read later",
            count: readLaterCount,
          },
          { key: "all" as const, label: "All", count: totalPages },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-2 py-2 rounded-lg font-medium transition-all ${
              filter === f.key
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "bg-slate-100 text-slate-500 hover:text-slate-700 border border-transparent"
            }`}
          >
            {f.label}{" "}
            <span
              className={
                filter === f.key ? "text-slate-400" : "text-slate-400/70"
              }
            >
              ({f.count})
            </span>
          </button>
        ))}
      </div>

      {/* Card area */}
      <div className="relative aspect-[630/893] mb-5">
        {currentPage ? (
          <>
            {upcomingPage && (
              <div className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden -z-10 transform scale-[0.96] translate-y-2 opacity-60">
                <img
                  src={pageSrc(upcomingPage)}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            )}

            <AnimatePresence custom={exitDirection} mode="wait">
              <motion.div
                key={currentPage}
                custom={exitDirection}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDrag={(_, info) => setDragX(info.offset.x)}
                onDragEnd={handleDragEnd}
                whileTap={{ cursor: "grabbing" }}
                style={{ rotate: dragX / 30 }}
                className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden cursor-grab active:cursor-grabbing"
              >
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold">
                  Page {currentPage}
                </div>
                <button
                  onClick={() => setZoomed(true)}
                  className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold hover:bg-black/80 transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                  </svg>
                  Zoom
                </button>

                <img
                  src={pageSrc(currentPage)}
                  alt={`Page ${currentPage}`}
                  draggable={false}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                <motion.div
                  style={{ opacity: gotItHintOpacity }}
                  className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center pointer-events-none"
                >
                  <div className="border-4 border-emerald-500 rounded-2xl px-6 py-3 rotate-[-12deg] bg-white/90">
                    <span className="text-2xl font-black text-emerald-600">💡 GOT IT</span>
                  </div>
                </motion.div>
                <motion.div
                  style={{ opacity: readLaterHintOpacity }}
                  className="absolute inset-0 bg-amber-500/20 flex items-center justify-center pointer-events-none"
                >
                  <div className="border-4 border-amber-500 rounded-2xl px-6 py-3 rotate-[12deg] bg-white/90">
                    <span className="text-2xl font-black text-amber-600">📚 READ LATER</span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <EmptyState filter={filter} onChangeFilter={setFilter} />
        )}
      </div>

      {currentPage && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => recordVerdict("read-later", "left")}
              className="py-4 bg-amber-50 border-2 border-amber-200 text-amber-800 rounded-xl font-bold text-sm hover:bg-amber-100 hover:border-amber-300 transition-colors flex items-center justify-center gap-2"
            >
              📚 Read Later
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => recordVerdict("got-it", "right")}
              className="py-4 bg-emerald-50 border-2 border-emerald-200 text-emerald-800 rounded-xl font-bold text-sm hover:bg-emerald-100 hover:border-emerald-300 transition-colors flex items-center justify-center gap-2"
            >
              💡 I Got It
            </motion.button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <button
              onClick={undo}
              disabled={history.length === 0}
              className="hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
              Undo last
            </button>
            <span className="hidden sm:inline">Drag the card or use the buttons</span>
            <button
              onClick={reset}
              className="hover:text-red-600 transition-colors"
            >
              Reset all
            </button>
          </div>
        </>
      )}

      <AnimatePresence>
        {zoomed && currentPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setZoomed(false)}
          >
            <button
              onClick={() => setZoomed(false)}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              src={pageSrc(currentPage)}
              alt={`Page ${currentPage}`}
              className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl rounded-md"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

function EmptyState({
  filter,
  onChangeFilter,
}: {
  filter: FilterMode;
  onChangeFilter: (f: FilterMode) => void;
}) {
  const messages: Record<
    FilterMode,
    { emoji: string; title: string; sub: string; cta?: { label: string; goto: FilterMode } }
  > = {
    unreviewed: {
      emoji: "🎉",
      title: "All pages reviewed!",
      sub: "You've gone through every page. Revisit your Read later pile any time.",
      cta: { label: "Open Read Later pile", goto: "read-later" },
    },
    "got-it": {
      emoji: "🤔",
      title: "Nothing here yet",
      sub: "Pages you mark as I got it will collect here.",
      cta: { label: "Back to deck", goto: "unreviewed" },
    },
    "read-later": {
      emoji: "📚",
      title: "Your saved pile is empty",
      sub: "Pages you save for later will collect here.",
      cta: { label: "Back to deck", goto: "unreviewed" },
    },
    all: { emoji: "—", title: "No pages", sub: "" },
  };
  const msg = messages[filter];

  return (
    <div className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center p-8">
      <div className="text-5xl mb-3">{msg.emoji}</div>
      <h2 className="text-xl font-bold text-slate-900">{msg.title}</h2>
      <p className="text-slate-500 mt-2 text-sm max-w-xs">{msg.sub}</p>
      {msg.cta && (
        <button
          onClick={() => onChangeFilter(msg.cta!.goto)}
          className="mt-5 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          {msg.cta.label}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main exported component                                            */
/* ------------------------------------------------------------------ */

export default function HandbookDeck({
  deckId,
  title,
  subtitle,
  totalPages,
  pageSrc,
}: HandbookDeckProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem(CURRENT_USER_KEY);
    if (username) {
      const p = loadProfile(username);
      if (p) setProfile(p);
    }
    setLoaded(true);
  }, []);

  function handleUpdate(p: Profile) {
    setProfile(p);
    saveProfile(p);
  }

  function handleSignOut() {
    localStorage.removeItem(CURRENT_USER_KEY);
    setProfile(null);
  }

  if (!loaded) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-400 text-sm">
        Loading…
      </div>
    );
  }

  if (!profile) {
    return <SignInForm onSignIn={setProfile} />;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8 pb-2"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
        {subtitle ? (
          <p className="text-slate-500 mt-1.5 text-sm">{subtitle}</p>
        ) : (
          <p className="text-slate-500 mt-1.5 text-sm">
            Swipe right or tap{" "}
            <span className="font-medium text-emerald-700">💡 I Got It</span> ·
            Swipe left or tap{" "}
            <span className="font-medium text-amber-700">📚 Read Later</span>
          </p>
        )}
      </motion.div>

      <ReviewDeck
        profile={profile}
        deckId={deckId}
        totalPages={totalPages}
        pageSrc={pageSrc}
        onUpdateProfile={handleUpdate}
        onSignOut={handleSignOut}
      />
    </div>
  );
}
