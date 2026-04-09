"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  generalQuestions,
  roadSafetyQuestions,
  allQuestions,
  categories,
  Question,
} from "@/data/questions";
import Link from "next/link";

type Mode = "browse" | "quiz";
type Section = "general" | "road-safety";

const GENERAL_COUNT = 12;
const ROAD_SAFETY_COUNT = 33;
const GENERAL_PASS = 12; // must get all 12
const ROAD_SAFETY_PASS = 29; // need 29 out of 33

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuizPool(): Question[] {
  const gen = shuffle(generalQuestions).slice(0, GENERAL_COUNT);
  const road = shuffle(roadSafetyQuestions).slice(0, ROAD_SAFETY_COUNT);
  return [...gen, ...road];
}

function QuestionImages({ question }: { question: Question }) {
  if (!question.images || question.images.length === 0) return null;
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {question.images.map((src, i) => (
        <div
          key={i}
          className="rounded-lg border border-slate-200 overflow-hidden"
        >
          <img
            src={src}
            alt={`Diagram for question ${question.ref}`}
            className="block max-w-[400px] w-full h-auto"
          />
        </div>
      ))}
    </div>
  );
}

function SectionBanner({
  section,
  index,
}: {
  section: Section;
  index: number;
}) {
  const isGeneral = section === "general";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 p-4 rounded-xl border-2 ${
        isGeneral
          ? "bg-blue-50 border-blue-200"
          : "bg-amber-50 border-amber-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
            isGeneral ? "bg-blue-500" : "bg-amber-500"
          }`}
        >
          {isGeneral ? "1" : "2"}
        </span>
        <div>
          <h3
            className={`font-semibold ${
              isGeneral ? "text-blue-900" : "text-amber-900"
            }`}
          >
            {isGeneral
              ? "Section 1: General Knowledge"
              : "Section 2: Road Safety"}
          </h3>
          <p
            className={`text-xs mt-0.5 ${
              isGeneral ? "text-blue-600" : "text-amber-600"
            }`}
          >
            {isGeneral
              ? `${GENERAL_COUNT} questions — you must get all ${GENERAL_PASS} correct`
              : `${ROAD_SAFETY_COUNT} questions — you need at least ${ROAD_SAFETY_PASS} correct`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function QuizMode() {
  const pool = useMemo(() => buildQuizPool(), []);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [generalScore, setGeneralScore] = useState(0);
  const [roadScore, setRoadScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSectionBanner, setShowSectionBanner] = useState(true);

  const q = pool[current];
  const isLast = current >= pool.length - 1;
  const totalQuestions = pool.length;

  // Track when we transition from general to road-safety
  const isFirstRoadSafety =
    current === GENERAL_COUNT && q.section === "road-safety";
  const currentSection = q.section;

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correct) {
      if (q.section === "general") setGeneralScore((s) => s + 1);
      else setRoadScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (isLast) {
      setShowResult(true);
      return;
    }
    const nextIdx = current + 1;
    const nextQ = pool[nextIdx];
    // Show section banner when transitioning to road safety
    if (q.section === "general" && nextQ.section === "road-safety") {
      setShowSectionBanner(true);
    }
    setSelected(null);
    setCurrent(nextIdx);
  }

  if (showResult) {
    const generalPassed = generalScore >= GENERAL_PASS;
    const roadPassed = roadScore >= ROAD_SAFETY_PASS;
    const overallPassed = generalPassed && roadPassed;
    const totalScore = generalScore + roadScore;
    const totalAnswered = totalQuestions;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div
          className={`p-8 text-center ${
            overallPassed
              ? "bg-gradient-to-b from-green-50 to-white"
              : "bg-gradient-to-b from-red-50 to-white"
          }`}
        >
          <div
            className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
              overallPassed ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <span className="text-4xl">{overallPassed ? "🎉" : "📚"}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-4">
            {overallPassed ? "You Passed the DKT!" : "Not Quite — Keep Practising!"}
          </h2>
          <p className="text-slate-500 mt-2">
            Overall: <span className="font-bold text-slate-900">{totalScore}/{totalAnswered}</span>
          </p>
        </div>

        {/* Section breakdown */}
        <div className="px-6 pb-6 space-y-3">
          {/* General Knowledge */}
          <div
            className={`p-4 rounded-xl border-2 ${
              generalPassed
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    generalPassed ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {generalPassed ? "✓" : "✗"}
                </span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    Section 1: General Knowledge
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Required: {GENERAL_PASS}/{GENERAL_COUNT} correct
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    generalPassed ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {generalScore}/{GENERAL_COUNT}
                </p>
                <p
                  className={`text-xs font-medium ${
                    generalPassed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {generalPassed ? "PASSED" : "FAILED"}
                </p>
              </div>
            </div>
          </div>

          {/* Road Safety */}
          <div
            className={`p-4 rounded-xl border-2 ${
              roadPassed
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    roadPassed ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {roadPassed ? "✓" : "✗"}
                </span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    Section 2: Road Safety
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Required: {ROAD_SAFETY_PASS}/{ROAD_SAFETY_COUNT} correct
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    roadPassed ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {roadScore}/{ROAD_SAFETY_COUNT}
                </p>
                <p
                  className={`text-xs font-medium ${
                    roadPassed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {roadPassed ? "PASSED" : "FAILED"}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-400 text-center pt-2">
            {overallPassed
              ? "Great job! You're well prepared for the real DKT."
              : "You must pass both sections. Review the explanations and try again."}
          </p>

          <div className="flex gap-3 justify-center pt-4">
            <Link
              href="/practice"
              className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Review Process
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Determine section progress
  const isGeneralSection = current < GENERAL_COUNT;
  const sectionLabel = isGeneralSection
    ? "Section 1: General Knowledge"
    : "Section 2: Road Safety";
  const sectionProgress = isGeneralSection
    ? `${current + 1} of ${GENERAL_COUNT}`
    : `${current - GENERAL_COUNT + 1} of ${ROAD_SAFETY_COUNT}`;
  const sectionScore = isGeneralSection ? generalScore : roadScore;

  return (
    <div>
      {/* Overall progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400">
            Overall: {current + 1} of {totalQuestions}
          </span>
          <span className="text-slate-400">
            {Math.round(((current + 1) / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-slate-300 rounded-full"
            animate={{
              width: `${((current + 1) / totalQuestions) * 100}%`,
            }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Section header */}
      <div
        className={`mb-4 px-4 py-3 rounded-xl flex items-center justify-between ${
          isGeneralSection
            ? "bg-blue-50 border border-blue-200"
            : "bg-amber-50 border border-amber-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
              isGeneralSection ? "bg-blue-500" : "bg-amber-500"
            }`}
          >
            {isGeneralSection ? "1" : "2"}
          </span>
          <span
            className={`text-sm font-semibold ${
              isGeneralSection ? "text-blue-800" : "text-amber-800"
            }`}
          >
            {sectionLabel}
          </span>
        </div>
        <div className="text-right">
          <span
            className={`text-xs ${
              isGeneralSection ? "text-blue-600" : "text-amber-600"
            }`}
          >
            Q{sectionProgress} · Score: {sectionScore}
          </span>
        </div>
      </div>

      {/* Section transition banner */}
      <AnimatePresence>
        {isFirstRoadSafety && showSectionBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-4"
          >
            <SectionBanner section="road-safety" index={GENERAL_COUNT} />
            <button
              onClick={() => setShowSectionBanner(false)}
              className="w-full py-2 text-sm text-amber-700 font-medium hover:underline"
            >
              Continue to Road Safety Questions →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          {/* Category badge */}
          <div className="px-6 pt-5">
            <span className="inline-block px-2.5 py-1 bg-primary-light text-primary text-[11px] font-semibold rounded-full uppercase tracking-wider">
              {q.category}
            </span>
          </div>

          {/* Question */}
          <div className="px-6 pt-3 pb-5">
            <h3 className="text-lg font-semibold text-slate-900 leading-snug">
              {q.question}
            </h3>
          </div>

          {/* Question images */}
          {q.images && q.images.length > 0 && (
            <div className="px-6 pb-5">
              <QuestionImages question={q} />
            </div>
          )}

          {/* Options */}
          <div className="px-6 pb-6 space-y-2.5">
            {q.options.map((opt, idx) => {
              let style =
                "border-slate-200 hover:border-primary hover:bg-primary-light/30";
              if (selected !== null) {
                if (idx === q.correct) {
                  style = "border-green-400 bg-green-50 text-green-800";
                } else if (idx === selected && idx !== q.correct) {
                  style = "border-red-400 bg-red-50 text-red-800";
                } else {
                  style = "border-slate-100 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm transition-all duration-200 ${style} ${
                    selected === null ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        selected !== null && idx === q.correct
                          ? "border-green-500 bg-green-500 text-white"
                          : selected === idx && idx !== q.correct
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {selected !== null && idx === q.correct
                        ? "✓"
                        : selected === idx && idx !== q.correct
                        ? "✗"
                        : String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result feedback */}
          <AnimatePresence>
            {selected !== null && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className={`px-6 py-4 ${
                    selected === q.correct
                      ? "bg-green-50 border-t border-green-100"
                      : "bg-amber-50 border-t border-amber-100"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      selected === q.correct
                        ? "text-green-800"
                        : "text-amber-800"
                    }`}
                  >
                    {selected === q.correct
                      ? "Correct!"
                      : `Incorrect — the correct answer is ${String.fromCharCode(65 + q.correct)}. ${q.options[q.correct]}`}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {selected !== null && (
            <div className="px-6 py-4 border-t border-slate-100">
              <button
                onClick={handleNext}
                className="w-full py-3 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors"
              >
                {isLast ? "See Results" : "Next Question →"}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function BrowseMode({
  filter,
}: {
  filter: string;
}) {
  const pool = useMemo(() => {
    if (filter === "All") return allQuestions;
    if (filter === "General Knowledge") return generalQuestions;
    if (filter === "Road Safety") return roadSafetyQuestions;
    return allQuestions.filter((q) => q.category === filter);
  }, [filter]);

  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  function toggle(id: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Group by section for display
  const generalPool = pool.filter((q) => q.section === "general");
  const roadPool = pool.filter((q) => q.section === "road-safety");

  function renderQuestions(qs: Question[], startDelay: number) {
    return qs.map((q, i) => (
      <motion.div
        key={q.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: Math.min((startDelay + i) * 0.03, 0.5),
          duration: 0.4,
        }}
        className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <button
          onClick={() => toggle(q.id)}
          className="w-full text-left px-5 py-4 flex items-start gap-3"
        >
          <span className="w-7 h-7 rounded-lg bg-primary-light text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            {q.id}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800">{q.question}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-mono font-medium rounded">
                {q.ref}
              </span>
              <p className="text-[11px] text-slate-400">{q.category}</p>
            </div>
          </div>
          <motion.svg
            animate={{ rotate: revealed.has(q.id) ? 180 : 0 }}
            className="w-5 h-5 text-slate-400 shrink-0 mt-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </motion.svg>
        </button>

        <AnimatePresence>
          {revealed.has(q.id) && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4 space-y-2">
                {q.images && q.images.length > 0 && (
                  <div className="pb-2">
                    <QuestionImages question={q} />
                  </div>
                )}
                {q.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      idx === q.correct
                        ? "bg-green-50 text-green-800 font-medium border border-green-200"
                        : "bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span className="font-mono mr-2 text-xs">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                    {idx === q.correct && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    ));
  }

  return (
    <div className="space-y-4">
      {generalPool.length > 0 && (
        <>
          <div className="flex items-center gap-2 mt-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm font-semibold text-blue-800">
              General Knowledge ({generalPool.length} questions)
            </h3>
          </div>
          {renderQuestions(generalPool, 0)}
        </>
      )}
      {roadPool.length > 0 && (
        <>
          <div className="flex items-center gap-2 mt-6 mb-1">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="text-sm font-semibold text-amber-800">
              Road Safety ({roadPool.length} questions)
            </h3>
          </div>
          {renderQuestions(roadPool, generalPool.length)}
        </>
      )}
    </div>
  );
}

export default function PracticeTest() {
  const [mode, setMode] = useState<Mode>("quiz");
  const [browseFilter, setBrowseFilter] = useState("All");
  const [quizKey, setQuizKey] = useState(0);

  const browseFilters = [
    "All",
    "General Knowledge",
    "Road Safety",
    ...categories,
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          DKT Practice Test
        </h1>
        <p className="text-slate-500 mt-2">
          {GENERAL_COUNT} general knowledge + {ROAD_SAFETY_COUNT} road safety ={" "}
          {GENERAL_COUNT + ROAD_SAFETY_COUNT} questions — just like the real
          DKT.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-8 space-y-4">
        {/* Mode toggle */}
        <div className="flex gap-2">
          {(["quiz", "browse"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === m
                  ? "bg-primary text-white shadow-sm shadow-primary/20"
                  : "bg-slate-100 text-slate-500 hover:text-slate-700"
              }`}
            >
              {m === "quiz" ? "🎯 Quiz Mode" : "📖 Browse All"}
            </button>
          ))}
        </div>

        {/* Quiz mode info */}
        {mode === "quiz" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-medium text-blue-800">
                  Section 1: General Knowledge
                </p>
                <p className="text-lg font-bold text-blue-900 mt-1">
                  {GENERAL_COUNT} Qs
                </p>
                <p className="text-[11px] text-blue-600">
                  Must get all {GENERAL_PASS} correct
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs font-medium text-amber-800">
                  Section 2: Road Safety
                </p>
                <p className="text-lg font-bold text-amber-900 mt-1">
                  {ROAD_SAFETY_COUNT} Qs
                </p>
                <p className="text-[11px] text-amber-600">
                  Need at least {ROAD_SAFETY_PASS} correct
                </p>
              </div>
            </div>
            <button
              onClick={() => setQuizKey((k) => k + 1)}
              className="w-full py-2.5 border-2 border-dashed border-primary/30 text-primary text-sm font-medium rounded-xl hover:bg-primary-light/30 transition-colors"
            >
              ↻ New Random Quiz
            </button>
          </div>
        )}

        {/* Browse filter */}
        {mode === "browse" && (
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Filter
            </p>
            <div className="flex flex-wrap gap-2">
              {browseFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setBrowseFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    browseFilter === f
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {mode === "quiz" ? (
        <QuizMode key={quizKey} />
      ) : (
        <BrowseMode filter={browseFilter} />
      )}

      {/* View all official DKT questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-10 bg-gradient-to-br from-primary-light/60 to-blue-50 rounded-2xl border border-primary/10 p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">View All Official DKT Questions</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review the complete set of DKT questions from Transport for NSW.
            </p>
          </div>
          <a
            href="/dkt-questions.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Open PDF
          </a>
        </div>
      </motion.div>

      {/* Info */}
      <div className="text-center mt-10 mb-6">
        <p className="text-xs text-slate-400">
          Questions based on the NSW Road Users Handbook. The real DKT has 45
          questions — {GENERAL_COUNT} general knowledge (all must be correct) +{" "}
          {ROAD_SAFETY_COUNT} road safety (need {ROAD_SAFETY_PASS}/
          {ROAD_SAFETY_COUNT}).
        </p>
      </div>
    </div>
  );
}
