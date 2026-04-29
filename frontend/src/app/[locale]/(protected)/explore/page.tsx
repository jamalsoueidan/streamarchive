import { Stack, Tabs, TabsList, TabsTab } from "@mantine/core";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getFollowerFilters } from "@/app/actions/followers";
import { getTranslations } from "next-intl/server";
import { fetchRecordings } from "./actions/fetch-recordings";
import Filters from "./components/filters";
import FollowingInfinity from "./components/following-infinity";
import { FollowingFilters, followingParamsCache } from "./lib/search-params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<FollowingFilters>;
}) {
  const t = await getTranslations("protected.explore");
  const filters = await followingParamsCache.parse(searchParams);

  const queryClient = new QueryClient();

  const initialData = await fetchRecordings(filters, 1);

  queryClient.setQueryData(
    ["explore", filters],
    { pages: [initialData], pageParams: [1] },
    { updatedAt: 0 },
  );

  const filterOptions = await getFollowerFilters();

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
        <Filters filterOptions={filterOptions} />
        <FollowingInfinity />
      </Stack>
    </HydrationBoundary>
  );
}
