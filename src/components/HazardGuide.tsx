"use client";

import HandbookDeck from "./HandbookDeck";

export default function HazardGuide() {
  return (
    <HandbookDeck
      deckId="hazard"
      title="Hazard Perception Handbook"
      totalPages={92}
      pageSrc={(n) => `/hazard-pages/page-${String(n).padStart(3, "0")}.jpg`}
    />
  );
}
