import {
  HeroBanner,
  CategoryRail,
  TodaysSpecials,
  PopularSection,
  RecommendedSection,
  AskAIPanel,
} from "@/modules/home";

// ============================================================================
// Home — hero, "Ask AI" panel, category rail, Today's Specials, AI-powered
// Recommended for You, and Popular Right Now, per blueprint §3.1 and §9
// Phase B. Each section is its own module component (see modules/home/).
// ============================================================================

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-10">
      <HeroBanner />
      <AskAIPanel />
      <CategoryRail />
      <TodaysSpecials />
      <RecommendedSection />
      <PopularSection />
    </div>
  );
}
