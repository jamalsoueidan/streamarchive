import { getFollowerFilters } from "@/app/actions/followers";
import { Stack, Tabs, TabsList, TabsTab } from "@mantine/core";
import {
  dehydrate,
  HydrationBoundary,
  InfiniteData,
  QueryClient,
} from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { fetchFollowers } from "./actions/fetch-followers";
import CreatorsInfinity from "./components/creators-infinity";
import Filters from "./components/filters";
import { CreatorFilters, creatorsParamsCache } from "./lib/search-params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CreatorFilters>;
}) {
  const t = await getTranslations("protected.myList");
  const filters = await creatorsParamsCache.parse(searchParams);

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["creators", "mylist", filters],
    queryFn: ({ pageParam }) => fetchFollowers(filters, pageParam),
    initialPageParam: 1,
  });

  const initialData = queryClient.getQueryData<
    InfiniteData<Awaited<ReturnType<typeof fetchFollowers>>>
  >(["creators", "mylist", filters]);

  const filterOptions = await getFollowerFilters();

  const count = initialData?.pages?.[0]?.meta?.pagination?.total ?? 0;

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
            <TabsTab value="default">{t("title", { count })}</TabsTab>
          </TabsList>
        </Tabs>
        <Filters filterOptions={filterOptions} />

        <CreatorsInfinity />
      </Stack>
    </HydrationBoundary>
  );
}
