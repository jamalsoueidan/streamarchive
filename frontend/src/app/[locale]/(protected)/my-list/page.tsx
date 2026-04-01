import { getFollowerFilters } from "@/app/actions/followers";
import { Stack } from "@mantine/core";
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
import { MyListTabs } from "./components/my-list-tabs";
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
        <MyListTabs count={count} />
        <Filters filterOptions={filterOptions} />

        <CreatorsInfinity />
      </Stack>
    </HydrationBoundary>
  );
}
