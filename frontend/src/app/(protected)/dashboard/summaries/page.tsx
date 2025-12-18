import { loaders } from "@/data/loaders";
import { SummariesGrid } from "@/components/custom/summaries-grid";
import { validateApiResponse } from "@/lib/error-handler";

import { Search } from "@/components/custom/search";

import { SearchParams } from "@/types";

interface ISummariesRouteProps {
  searchParams: SearchParams;
}

export default async function SummariesRoute({
  searchParams
}: ISummariesRouteProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query as string;

  const data = await loaders.getSummaries(query);
  const summaries = validateApiResponse(data, "summaries");

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-4 gap-6">
      <Search className="shrink-0" />
      <SummariesGrid summaries={summaries} className="grow" />
    </div>
  );
}
