"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const slideIn = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.25 } },
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Pathway = "under25" | "over25";

type StageData = {
  id: string;
  step: number;
  label: string;
  plateColor: string;
  plateBg: string;
  plateBorder: string;
  plateText: string;
  accentBg: string;
  minAge: string;
  duration: string;
  speedLimit: string;
  demerits: string;
  bac: string;
  icon: string;
  tests: string[];
  requirements: { under25: string[]; over25: string[] };
  restrictions: { under25: string[]; over25: string[] };
  tips: { under25: string[]; over25: string[] };
  highlights?: { under25?: string[]; over25?: string[] };
};

/* ------------------------------------------------------------------ */
/*  Stage data — all 7 steps with pathway-specific info                */
/* ------------------------------------------------------------------ */

const allStages: StageData[] = [
  {
    id: "dkt",
    step: 1,
    label: "Driver Knowledge Test",
    plateColor: "DKT",
    plateBg: "bg-primary-light",
    plateBorder: "border-primary",
    plateText: "text-primary-dark",
    accentBg: "bg-primary",
    minAge: "16 (in-person) / 15y 11m (online)",
    duration: "One-off test",
    speedLimit: "N/A",
    demerits: "N/A",
    bac: "N/A",
    icon: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
    tests: ["Driver Knowledge Test (DKT) -- 45 questions, computer-based"],
    requirements: {
      under25: [
        "Study the Road Users Handbook",
        "Book online (from 15 years 11 months) or at a service centre (from 16)",
        "Pass 45 questions: 12/15 general knowledge + 29/30 road safety",
      ],
      over25: [
        "Study the Road Users Handbook",
        "Take the DKT online or at a service centre",
        "Pass 45 questions: 12/15 general knowledge + 29/30 road safety",
      ],
    },
    restrictions: {
      under25: [],
      over25: [],
    },
    tips: {
      under25: [
        "Practice with sample DKT tests to build confidence",
        "You can book online from 15 years and 11 months",
      ],
      over25: [],
    },
  },
  {
    id: "learner",
    step: 2,
    label: "Learner Licence",
    plateColor: "L",
    plateBg: "bg-l-yellow",
    plateBorder: "border-l-yellow-border",
    plateText: "text-l-yellow-border",
    accentBg: "bg-l-yellow",
    minAge: "16+",
    duration: "12 months min (under 25) / No min (25+)",
    speedLimit: "90 km/h",
    demerits: "4 points",
    bac: "Zero",
    icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
    tests: ["Apply for learner licence after passing DKT"],
    requirements: {
      under25: [
        "Go to a Service NSW centre",
        "Prove your identity (100 points of ID)",
        "Pass an eyesight test",
        "Get your photo taken and pay the fee",
        "Hold learner licence for at least 12 months",
        "Log 120 supervised driving hours (including 20 night hours)",
      ],
      over25: [
        "Go to a Service NSW centre",
        "Prove your identity (100 points of ID)",
        "Pass an eyesight test",
        "Get your photo taken and pay the fee",
        "No minimum holding period",
        "No logbook hours required",
      ],
    },
    restrictions: {
      under25: [
        "Must have a fully-licensed supervisor in the front seat at all times",
        "Maximum speed 90 km/h",
      ],
      over25: [
        "Must have a fully-licensed supervisor in the front seat at all times",
        "Maximum speed 90 km/h",
      ],
    },
    tips: {
      under25: [
        "Safer Drivers Course earns 20 bonus logbook hours",
        "Licensed instructor hours count as 3-for-1 (max 10 actual = 30 logged)",
        "Mix your practice: city, highway, night, wet weather",
      ],
      over25: [],
    },
    highlights: {
      under25: ["12-month minimum hold", "120 hours logbook (20 night)"],
      over25: ["No minimum hold period", "No logbook required"],
    },
  },
  {
    id: "hpt",
    step: 3,
    label: "Hazard Perception Test",
    plateColor: "HPT",
    plateBg: "bg-primary-light",
    plateBorder: "border-primary",
    plateText: "text-primary-dark",
    accentBg: "bg-primary",
    minAge: "N/A",
    duration: "One-off test",
    speedLimit: "N/A",
    demerits: "N/A",
    bac: "N/A",
    icon: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    tests: ["Hazard Perception Test (HPT) -- computer-based, video scenarios"],
    requirements: {
      under25: [
        "Have held learner licence for at least 10 months",
        "Book at a service centre",
        "HPT pass valid for 15 months -- must pass driving test within that time",
      ],
      over25: [
        "Book at a service centre when ready -- no waiting period",
        "HPT pass valid for 15 months -- must pass driving test within that time",
      ],
    },
    restrictions: {
      under25: [],
      over25: [],
    },
    tips: {
      under25: [
        "Study the Hazard Perception Handbook (free PDF from Transport for NSW)",
        "Practice identifying hazards while a passenger in everyday driving",
      ],
      over25: [],
    },
    highlights: {
      under25: ["Available after 10 months on L"],
      over25: ["No waiting period"],
    },
  },
  {
    id: "driving-test",
    step: 4,
    label: "Driving Test",
    plateColor: "DT",
    plateBg: "bg-primary-light",
    plateBorder: "border-primary",
    plateText: "text-primary-dark",
    accentBg: "bg-primary",
    minAge: "17 (under 25) / 25+ (over 25)",
    duration: "One-off test",
    speedLimit: "N/A",
    demerits: "N/A",
    bac: "N/A",
    icon: "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
    tests: ["Practical on-road driving assessment with a testing officer"],
    requirements: {
      under25: [
        "Be at least 17 years old",
        "Have completed all learner requirements (12 months + 120 hours)",
        "Book at a service centre",
        "If you fail, retake after 7 days",
      ],
      over25: [
        "Book at a service centre",
        "Must pass within 15 months of HPT or retake HPT",
        "If you fail, retake after 7 days",
      ],
    },
    restrictions: {
      under25: [],
      over25: [],
    },
    tips: {
      under25: [
        "Book early -- wait times at popular test centres can be weeks",
        "Ensure your vehicle is roadworthy and all lights, signals work",
        "Bring logbook, learner licence, and a supervising driver",
      ],
      over25: [],
    },
    highlights: {
      under25: ["Min age 17", "12 months + 120 hours required"],
      over25: ["No logbook needed", "No minimum holding period"],
    },
  },
  {
    id: "p1",
    step: 5,
    label: "Provisional P1 (Red)",
    plateColor: "P",
    plateBg: "bg-p1-red",
    plateBorder: "border-p1-red-border",
    plateText: "text-p1-red-border",
    accentBg: "bg-p1-red",
    minAge: "17+",
    duration: "12 months min (valid 18 months)",
    speedLimit: "90 km/h",
    demerits: "4 points",
    bac: "Zero",
    icon: "M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z",
    tests: ["Awarded upon passing the driving test"],
    requirements: {
      under25: [
        "Apply for provisional P1 after passing driving test",
        "Hold for at least 12 months",
        "P1 licence valid for 18 months",
      ],
      over25: [
        "Apply for provisional P1 after passing driving test",
        "Hold for at least 12 months",
      ],
    },
    restrictions: {
      under25: [
        "Maximum speed 90 km/h",
        "Maximum 1 passenger under 21 between 11pm and 5am",
        "No high-performance vehicles (over 130 kW/tonne)",
        "Towing limit: 250 kg unloaded trailer",
      ],
      over25: [
        "Maximum speed 90 km/h",
        "No high-performance vehicles (over 130 kW/tonne)",
        "Towing limit: 250 kg unloaded trailer",
      ],
    },
    tips: {
      under25: [
        "The passenger restriction (max 1 under-21 at night) is strictly enforced",
        "Peer passenger exemptions exist for siblings -- check the rules",
      ],
      over25: [],
    },
    highlights: {
      under25: ["Max 1 passenger under 21 (11pm-5am)"],
      over25: ["No passenger restrictions"],
    },
  },
  {
    id: "p2",
    step: 6,
    label: "Provisional P2 (Green)",
    plateColor: "P",
    plateBg: "bg-p2-green",
    plateBorder: "border-p2-green-border",
    plateText: "text-p2-green-border",
    accentBg: "bg-p2-green",
    minAge: "18+",
    duration: "24 months min (valid 36 months)",
    speedLimit: "100 km/h",
    demerits: "7 points",
    bac: "Zero",
    icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    tests: ["No additional test"],
    requirements: {
      under25: [
        "Apply online or at a service centre after 12 months on P1",
        "P2 licence valid for 36 months",
        "Hold for at least 24 months before upgrading to full",
      ],
      over25: [
        "Apply online or at a service centre after 12 months on P1",
        "P2 licence valid for 36 months",
        "Can upgrade to full licence after 24 months",
      ],
    },
    restrictions: {
      under25: [
        "Maximum speed 100 km/h",
        "No high-performance vehicles",
        "Suspension adds 6 extra months to your P2 period",
      ],
      over25: [
        "Maximum speed 100 km/h",
        "No high-performance vehicles",
        "Suspension adds 6 extra months to your P2 period",
      ],
    },
    tips: {
      under25: [
        "Demerit points increase to 7 (up from 4 on P1)",
        "Any suspension adds 6 months to your P2 period -- drive carefully",
      ],
      over25: [],
    },
  },
  {
    id: "full",
    step: 7,
    label: "Full Licence",
    plateColor: "F",
    plateBg: "bg-full-gold",
    plateBorder: "border-full-gold-border",
    plateText: "text-full-gold-border",
    accentBg: "bg-full-gold",
    minAge: "~20 (under 25 path) / ~28 (25+ path)",
    duration: "1, 3, 5, or 10 years",
    speedLimit: "Posted limit",
    demerits: "13 per 3 years",
    bac: "0.05",
    icon: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
    tests: ["No test -- apply when eligible"],
    requirements: {
      under25: [
        "Visit a Service NSW centre after 24 months on P2",
        "Prove your identity",
        "Pass an eyesight test",
        "Pay the fee",
      ],
      over25: [
        "Visit a Service NSW centre after 24 months on P2",
        "Prove your identity",
        "Pass an eyesight test",
        "Pay the fee",
      ],
    },
    restrictions: {
      under25: [],
      over25: [],
    },
    tips: {
      under25: [
        "BAC limit increases to 0.05 (no longer zero)",
        "Hands-free phone use is now allowed",
        "You can now supervise learner drivers",
        "10-year renewal option available for ages 21 to 44",
      ],
      over25: [
        "BAC limit increases to 0.05 (no longer zero)",
        "Hands-free phone use is now allowed",
        "You can now supervise learner drivers",
      ],
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Timeline data                                                      */
/* ------------------------------------------------------------------ */

const timelineUnder25 = [
  { label: "DKT", months: 0, color: "bg-primary" },
  { label: "Learner", months: 12, color: "bg-l-yellow" },
  { label: "P1", months: 12, color: "bg-p1-red" },
  { label: "P2", months: 24, color: "bg-p2-green" },
  { label: "Full", months: 0, color: "bg-full-gold" },
];

const timelineOver25 = [
  { label: "DKT", months: 0, color: "bg-primary" },
  { label: "Learner", months: 0, color: "bg-l-yellow" },
  { label: "P1", months: 12, color: "bg-p1-red" },
  { label: "P2", months: 24, color: "bg-p2-green" },
  { label: "Full", months: 0, color: "bg-full-gold" },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Plate({ text, bg, border, textColor }: { text: string; bg: string; border: string; textColor: string }) {
  const isSmall = text.length > 1;
  return (
    <div className={`w-14 h-14 rounded-xl ${bg} border-2 ${border} flex items-center justify-center`}>
      <span className={`${isSmall ? "text-xs" : "text-2xl"} font-black ${textColor}`}>{text}</span>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex flex-col items-center py-2">
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-0.5 h-12 bg-gradient-to-b from-slate-300 to-slate-200 origin-top"
      />
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm"
      />
    </div>
  );
}

function PathwaySelector({ pathway, onChange }: { pathway: Pathway; onChange: (p: Pathway) => void }) {
  return (
    <div className="relative flex bg-slate-100 rounded-xl p-1 max-w-md mx-auto">
      <motion.div
        layout
        className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm"
        style={{ width: "calc(50% - 4px)" }}
        animate={{ x: pathway === "under25" ? 0 : "calc(100% + 8px)" }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      />
      <button
        onClick={() => onChange("under25")}
        className={`relative z-10 flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 ${
          pathway === "under25" ? "text-primary-dark" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <span className="block text-base">Under 25</span>
        <span className="block text-[11px] font-normal mt-0.5 opacity-70">~4 years minimum</span>
      </button>
      <button
        onClick={() => onChange("over25")}
        className={`relative z-10 flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 ${
          pathway === "over25" ? "text-primary-dark" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <span className="block text-base">25 and Over</span>
        <span className="block text-[11px] font-normal mt-0.5 opacity-70">~3 years minimum</span>
      </button>
    </div>
  );
}

function TimelineViz({ pathway }: { pathway: Pathway }) {
  const data = pathway === "under25" ? timelineUnder25 : timelineOver25;
  const totalMonths = data.reduce((sum, d) => sum + d.months, 0);
  const totalLabel = pathway === "under25" ? "~4 years" : "~3 years";

  return (
    <motion.div
      key={pathway}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Minimum Timeline</h3>
        <span className="text-sm font-bold text-primary">{totalLabel}</span>
      </div>

      {/* Bar visualization */}
      <div className="flex items-center gap-0.5 h-10 rounded-xl overflow-hidden mb-3">
        {data.map((segment, i) => {
          if (segment.months === 0) return null;
          const widthPct = (segment.months / totalMonths) * 100;
          return (
            <motion.div
              key={segment.label}
              initial={{ width: 0 }}
              animate={{ width: `${widthPct}%` }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={`${segment.color} h-full flex items-center justify-center`}
            >
              <span className="text-[11px] font-bold text-white drop-shadow-sm">
                {segment.months}mo
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        {data.filter(d => d.months > 0).map((segment) => (
          <div key={segment.label} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${segment.color}`} />
            <span>{segment.label} ({segment.months} months)</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function HighlightBadges({ highlights, pathway }: { highlights?: { under25?: string[]; over25?: string[] }; pathway: Pathway }) {
  const items = pathway === "under25" ? highlights?.under25 : highlights?.over25;
  if (!items || items.length === 0) return null;

  const isOver25 = pathway === "over25";

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {items.map((h) => (
        <span
          key={h}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
            isOver25
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {isOver25 ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          )}
          {h}
        </span>
      ))}
    </div>
  );
}

function StageCard({ stage, index, pathway }: { stage: StageData; index: number; pathway: Pathway }) {
  const [expanded, setExpanded] = useState(false);

  const requirements = pathway === "under25" ? stage.requirements.under25 : stage.requirements.over25;
  const restrictions = pathway === "under25" ? stage.restrictions.under25 : stage.restrictions.over25;
  const tips = pathway === "under25" ? stage.tips.under25 : stage.tips.over25;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeUp}
    >
      <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-shadow duration-300 hover:shadow-md">
        {/* Top accent bar */}
        <div className={`h-1.5 ${stage.accentBg}`} />

        <div className="p-6 sm:p-8">
          {/* Step number + header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <Plate text={stage.plateColor} bg={stage.plateBg} border={stage.plateBorder} textColor={stage.plateText} />
              <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                {stage.step}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900">{stage.label}</h3>
              <p className="text-sm text-slate-400 mt-0.5">Step {stage.step} of 7</p>
            </div>
            <svg className={`w-6 h-6 ${stage.plateText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={stage.icon} />
            </svg>
          </div>

          {/* Pathway-specific highlights */}
          <AnimatePresence mode="wait">
            <motion.div key={pathway} variants={slideIn} initial="hidden" animate="visible" exit="exit">
              <HighlightBadges highlights={stage.highlights} pathway={pathway} />
            </motion.div>
          </AnimatePresence>

          {/* Quick stats -- only show for licence stages */}
          {stage.speedLimit !== "N/A" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Speed Limit", value: stage.speedLimit },
                { label: "Demerits", value: stage.demerits },
                { label: "BAC Limit", value: stage.bac },
                { label: "Duration", value: stage.duration },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-50 rounded-xl px-3 py-2.5 text-center">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tests required */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tests / Actions</p>
            {stage.tests.map((test) => (
              <div key={test} className="flex items-start gap-2 mb-1.5">
                <svg className="w-4 h-4 text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="text-sm text-slate-600">{test}</span>
              </div>
            ))}
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            {expanded ? "Show less" : "Show all details"}
            <motion.svg
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </motion.svg>
          </button>

          {/* Expanded content */}
          <motion.div
            initial={false}
            animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-5 space-y-5">
              {/* Requirements */}
              <AnimatePresence mode="wait">
                <motion.div key={`req-${pathway}`} variants={slideIn} initial="hidden" animate="visible" exit="exit">
                  <p className="text-xs font-semibold text-success uppercase tracking-wider mb-2">Requirements</p>
                  <ul className="space-y-1.5">
                    {requirements.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              {/* Restrictions */}
              {restrictions.length > 0 && (
                <AnimatePresence mode="wait">
                  <motion.div key={`rest-${pathway}`} variants={slideIn} initial="hidden" animate="visible" exit="exit">
                    <p className="text-xs font-semibold text-danger uppercase tracking-wider mb-2">Restrictions</p>
                    <ul className="space-y-1.5">
                      {restrictions.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Tips */}
              {tips.length > 0 && (
                <AnimatePresence mode="wait">
                  <motion.div key={`tips-${pathway}`} variants={slideIn} initial="hidden" animate="visible" exit="exit">
                    <div className="bg-primary-light/50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Tips</p>
                      <ul className="space-y-1.5">
                        {tips.map((t) => (
                          <li key={t} className="flex items-start gap-2 text-sm text-primary-dark">
                            <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                            </svg>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Common restrictions banner                                         */
/* ------------------------------------------------------------------ */

function CommonRestrictions() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Common Restrictions (All Learner & Provisional)</h3>
            <p className="text-xs text-slate-400 mt-0.5">Rules that apply to every learner and provisional driver</p>
          </div>
        </div>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-5 h-5 text-slate-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </motion.svg>
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 space-y-2">
          {[
            "Zero blood alcohol concentration (BAC)",
            "No mobile phone use at all -- not even hands-free, not even when the vehicle is stopped",
            "Must display the correct plates at all times (L, red P, or green P)",
            "No driving in Parramatta Park, Centennial Park, or Moore Park (learners only)",
            "No motor tricycles (learners and P1 only)",
            "If you passed your driving test in an automatic, you can only drive automatic vehicles on P1 and P2 (unless supervised by a full licence holder in a manual)",
          ].map((r) => (
            <div key={r} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
              {r}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}


/* ------------------------------------------------------------------ */
/*  Pathway difference summary                                         */
/* ------------------------------------------------------------------ */

function PathwayDifferences({ pathway }: { pathway: Pathway }) {
  const isUnder25 = pathway === "under25";

  return (
    <motion.div
      key={pathway}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border p-6 mb-8 ${
        isUnder25 ? "bg-amber-50/50 border-amber-200" : "bg-emerald-50/50 border-emerald-200"
      }`}
    >
      <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${isUnder25 ? "text-amber-700" : "text-emerald-700"}`}>
        {isUnder25 ? "Under 25 Pathway -- Key Points" : "25 and Over Pathway -- Key Points"}
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {(isUnder25
          ? [
              "12-month minimum learner holding period",
              "120 logbook hours required (including 20 night)",
              "HPT available after 10 months on learner licence",
              "Must be at least 17 for driving test",
              "P1: max 1 passenger under 21 (11pm-5am)",
              "Total minimum time: approximately 4 years",
            ]
          : [
              "No minimum learner holding period",
              "No logbook hours required",
              "HPT can be taken as soon as ready",
              "No late-night passenger restrictions on P1",
              "Total minimum time: approximately 3 years",
            ]
        ).map((point) => (
          <div key={point} className="flex items-start gap-2 text-sm">
            <svg
              className={`w-4 h-4 mt-0.5 shrink-0 ${isUnder25 ? "text-amber-500" : "text-emerald-500"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isUnder25 ? "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" : "m4.5 12.75 6 6 9-13.5"}
              />
            </svg>
            <span className={isUnder25 ? "text-amber-800" : "text-emerald-800"}>{point}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function LicenceProcess() {
  const [pathway, setPathway] = useState<Pathway>("under25");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          NSW Driving Licence Process
        </h1>
        <p className="text-slate-500 mt-3 max-w-lg mx-auto">
          Your complete 7-step guide from DKT to Full Licence. Select your age
          pathway below to see the requirements that apply to you.
        </p>
        <Link
          href="/practice"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
          </svg>
          Practice DKT Questions
        </Link>
      </motion.div>

      {/* Pathway selector */}
      <div className="mb-8">
        <PathwaySelector pathway={pathway} onChange={setPathway} />
      </div>

      {/* Timeline visualization */}
      <AnimatePresence mode="wait">
        <TimelineViz key={pathway} pathway={pathway} />
      </AnimatePresence>

      {/* Pathway key points summary */}
      <AnimatePresence mode="wait">
        <PathwayDifferences key={pathway} pathway={pathway} />
      </AnimatePresence>

      {/* Common restrictions */}
      <CommonRestrictions />

      {/* Stage cards */}
      <div className="space-y-0">
        {allStages.map((stage, i) => (
          <div key={stage.id}>
            <StageCard stage={stage} index={i} pathway={pathway} />
            {i < allStages.length - 1 && <Connector />}
          </div>
        ))}
      </div>

      {/* Official source link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">Official Source</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              For the latest information, visit the official Service NSW website.
            </p>
          </div>
          <a
            href="https://www.service.nsw.gov.au/guide/getting-a-nsw-driver-licence"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            service.nsw.gov.au
          </a>
        </div>
      </motion.div>

      {/* Footer info */}
      <div className="text-center mt-10 mb-6">
        <p className="text-xs text-slate-400">
          Information based on NSW Government and Transport for NSW guidelines.
          For the latest details, call 13 22 13 or visit service.nsw.gov.au.
        </p>
      </div>
    </div>
  );
}
