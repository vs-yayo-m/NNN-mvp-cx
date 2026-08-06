// /src/app/page.tsx

import {
  HeroBanner,
  CategoryRail,
  TodaysSpecials,
  PopularSection,
  RecommendedSection,
  AskAIPanel,
} from "@/modules/home";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero sits flush against the header — full width, no page gutter,
          no vertical gap. Everything below resumes the normal padded
          column. */}
      <HeroBanner />

      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-10">
        <AskAIPanel />
        <CategoryRail />
        <TodaysSpecials />
        <RecommendedSection />
        <PopularSection />
      </div>
    </div>
  );
}
