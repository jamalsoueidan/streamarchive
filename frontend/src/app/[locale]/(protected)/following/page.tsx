import { Stack } from "@mantine/core";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getFollowerFilters } from "@/app/actions/followers";
import { fetchRecordings } from "./actions/fetch-recordings";
import Filters from "./components/filters";
import { FollowingTabs } from "./components/following-tabs";
import FollowingInfinity from "./components/following-infinity";
import { FollowingFilters, followingParamsCache } from "./lib/search-params";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<FollowingFilters>;
}) {
  const filters = await followingParamsCache.parse(searchParams);

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["following", filters],
    queryFn: ({ pageParam }) => fetchRecordings(filters, pageParam),
    initialPageParam: 1,
  });

  const filterOptions = await getFollowerFilters();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stack w="100%">
        <FollowingTabs />
        <Filters filterOptions={filterOptions} />
        <FollowingInfinity />
      </Stack>
    </HydrationBoundary>
  );
}
