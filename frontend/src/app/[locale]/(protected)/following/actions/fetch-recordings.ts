"use server";

import {
  fetchCachedRecordings,
  RecordingScope,
} from "@/app/actions/recordings";
import {
  buildFollowingFilters,
  FollowingFilters,
} from "../lib/search-params";

export async function fetchRecordings(filters: FollowingFilters, page: number) {
  const scope: RecordingScope = filters.favorites
    ? "favorites"
    : ((filters.scope as unknown as RecordingScope) || "following");

  return fetchCachedRecordings({
    scope,
    filters: buildFollowingFilters(filters),
    sort: filters.sort,
    page,
  });
}
