import { getUser } from "@/app/actions/user";
import { Stack, Tabs, TabsList, TabsTab } from "@mantine/core";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { fetchFollowers } from "./actions/fetch-followers";
import CreatorsInfinity from "./components/creators-infinity";
import Filters from "./components/filters";
import { FiltersWrapper } from "./components/filters-wrapper";
import { CreatorFilters, creatorsParamsCache } from "./lib/search-params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CreatorFilters>;
}) {
  const t = await getTranslations("protected.discover");
  const filters = await creatorsParamsCache.parse(searchParams);

  const userResp = await getUser();
  const excludeFollowingIds = (userResp.data?.followers || [])
    .map((f) => f.id)
    .filter((id): id is number => typeof id === "number");

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: [
      "creators",
      "discover",
      filters,
      filters.excludeMyCreators ? excludeFollowingIds : null,
    ],
    queryFn: ({ pageParam }) =>
      fetchFollowers(filters, pageParam, excludeFollowingIds),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stack w="100%">
        <Tabs
          defaultValue="default"
          styles={{
            list: {
              borderBottomWidth: 4,
            },
            tab: {
              fontSize: "var(--mantine-font-size-lg)",
              fontWeight: 600,
              padding: "var(--mantine-spacing-sm) var(--mantine-spacing-md)",
              borderBottomWidth: 4,
            },
          }}
        >
          <TabsList>
            <TabsTab value="default">{t("title")}</TabsTab>
          </TabsList>
        </Tabs>

        <Suspense fallback={<Filters />}>
          <FiltersWrapper />
        </Suspense>

        <CreatorsInfinity />
      </Stack>
    </HydrationBoundary>
  );
}
