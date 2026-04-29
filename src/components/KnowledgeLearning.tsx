"use client";

import HandbookDeck from "./HandbookDeck";

export default function KnowledgeLearning() {
  return (
    <HandbookDeck
      deckId="road-users"
      title="Road Users Handbook"
      totalPages={212}
      pageSrc={(n) => `/handbook-pages/page-${String(n).padStart(3, "0")}.jpg`}
    />
  );
}
