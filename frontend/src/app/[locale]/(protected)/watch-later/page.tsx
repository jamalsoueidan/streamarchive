import { Stack } from "@mantine/core";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { FollowingTabs } from "../following/components/following-tabs";
import { getRecordingsByIds } from "./actions";
import { ClearWatchLaterButton } from "./components/clear-watch-later-button";
import WatchLaterList from "./components/watch-later-list";
import { getWatchLaterIds } from "./lib/get-watch-later-ids";

const PAGE_SIZE = 12;

export default async function Page() {
  const watchLaterIds = await getWatchLaterIds();
  const idsToFetch = watchLaterIds.slice(0, PAGE_SIZE);

  const queryClient = new QueryClient();

  if (idsToFetch.length > 0) {
    await queryClient.prefetchQuery({
      queryKey: ["watch-later", idsToFetch],
      queryFn: () => getRecordingsByIds(idsToFetch),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Stack w="100%">
        <FollowingTabs />
        <ClearWatchLaterButton initialCount={watchLaterIds.length} />
        <WatchLaterList initialIds={watchLaterIds} />
      </Stack>
    </HydrationBoundary>
  );
}
