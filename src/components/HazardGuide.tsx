"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

export default function HazardGuide() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Hazard Perception Handbook
        </h1>
        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
          Study the official NSW Hazard Perception Handbook to prepare for the
          Hazard Perception Test (HPT).
        </p>
      </motion.div>

      {/* PDF Viewer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mb-10"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* PDF header bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-danger"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 18h10v-2H7v2zM7 14h10v-2H7v2zM7 10h4V8H7v2zm12-4V4H5v16h14V6zm0-2c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h14z" />
              </svg>
              <h3 className="text-sm font-semibold text-slate-700">
                Hazard Perception Handbook
              </h3>
            </div>
            <a
              href="/hazard-perception-handbook.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              Open in new tab
            </a>
          </div>

          {/* PDF iframe */}
          <iframe
            ref={iframeRef}
            src="/hazard-perception-handbook.pdf"
            title="NSW Hazard Perception Handbook"
            className="w-full border-0"
            style={{ height: "85vh", minHeight: "600px" }}
          />
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-center mt-10 mb-6">
        <p className="text-xs text-slate-400">
          Information based on the NSW Hazard Perception Handbook and Transport for NSW guidelines.
          For the latest details, call 13 22 13 or visit service.nsw.gov.au.
        </p>
      </div>
    </div>
  );
}
