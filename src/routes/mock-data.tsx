import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

import { pageMeta } from "@/components/common/SEOHead";
import { PageSkeleton } from "@/components/common/PageSkeleton";

const MockData = lazy(() => import("@/pages/MockData"));

export const Route = createFileRoute("/mock-data")({
  head: () => ({
    meta: pageMeta({
      title: "Free AI Mock Data Generator — SmartOpenTools",
      description:
        "Generate realistic SQL, JSON, and CSV mock data using natural language prompts without complex manual schemas.",
    }),
  }),
  component: MockDataRoute,
});

function MockDataRoute() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <MockData />
    </Suspense>
  );
}
