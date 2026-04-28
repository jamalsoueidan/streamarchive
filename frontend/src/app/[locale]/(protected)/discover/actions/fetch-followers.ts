"use server";

import publicApi from "@/lib/public-api";
import { unstable_cache } from "next/cache";
import { buildCreatorsFilters, CreatorFilters } from "../lib/search-params";

const SORT_FIELD_MAP: Record<string, string> = {
  totalRecordings: "recordingsCount",
  latestRecording: "lastRecordingAt",
};

function mapSort(sort?: string): string | undefined {
  if (!sort) return undefined;
  const [field, dir] = sort.split(":");
  return `${SORT_FIELD_MAP[field] ?? field}:${dir ?? "desc"}`;
}

const cachedDiscover = unstable_cache(
  async (
    filters: CreatorFilters,
    page: number,
    excludeFollowingIds: number[],
  ) => {
    const baseFilters = buildCreatorsFilters(filters);
    const response = await publicApi.follower.searchFollowers({
      pagination: { page, pageSize: 10, withCount: true },
      sort: mapSort(filters.sort),
      populate: {
        avatar: { fields: ["url"] },
        recordings: {
          populate: {
            sources: {
              fields: ["*"],
              filters: { state: { $ne: "failed" } },
            },
          },
        },
      },
      filters: {
        ...baseFilters,
        ...(filters.hasRecordings ? { recordingsCount: { $gt: 0 } } : {}),
        ...(excludeFollowingIds.length > 0
          ? { id: { $notIn: excludeFollowingIds } }
          : {}),
      },
    });

    return {
      data: response.data?.data || [],
      meta: response.data?.meta,
    };
  },
  ["streamarchive-discover-followers"],
  { revalidate: 60 * 60 * 3 },
);

export async function fetchFollowers(
  filters: CreatorFilters,
  page: number,
  excludeFollowingIds: number[],
) {
  return cachedDiscover(filters, page, excludeFollowingIds);
}
