import { getFollowerFilters } from "@/app/actions/followers";
import { getUser } from "@/app/actions/user";
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

  const userResp = await getUser();
  const followingIds = (userResp.data?.followers || [])
    .map((f) => f.id)
    .filter((id): id is number => typeof id === "number");
  const favoriteIds = (userResp.data?.favorites || [])
    .map((f) => f.id)
    .filter((id): id is number => typeof id === "number");

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["creators", "mylist", filters, followingIds, favoriteIds],
    queryFn: ({ pageParam }) =>
      fetchFollowers(filters, pageParam, followingIds, favoriteIds),
    initialPageParam: 1,
  });

  const initialData = queryClient.getQueryData<
    InfiniteData<Awaited<ReturnType<typeof fetchFollowers>>>
  >(["creators", "mylist", filters, followingIds, favoriteIds]);

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
