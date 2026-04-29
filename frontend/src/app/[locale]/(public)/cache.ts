import publicApi from "@/lib/public-api";
import { unstable_cache } from "next/cache";

const REVALIDATE = 3600;

export const getFeaturedFollowers = unstable_cache(
  async () => {
    const {
      data: { data: followers },
    } = await publicApi.follower.getFollowers({
      filters: {
        description: { $notNull: true },
      },
      "pagination[limit]": 30,
      sort: "updatedAt:desc",
      populate: { avatar: true },
    });
    return followers;
  },
  ["featured-followers"],
  { revalidate: REVALIDATE },
);

export const getLatestRecordings = unstable_cache(
  async () => {
    const {
      data: { data: recordings },
    } = await publicApi.recording.getRecordings({
      filters: {
        sources: {
          state: {
            $eq: ["done"],
          },
        },
        follower: {
          type: { $ne: "tango" },
        },
      },
      "pagination[limit]": 20,
      sort: "createdAt:desc",
      populate: {
        sources: {
          fields: ["*"],
          filters: {
            state: {
              $eq: "done",
            },
          },
        },
        follower: {
          populate: {
            avatar: true,
          },
        },
      },
    });
    return recordings;
  },
  ["latest-recordings"],
  { revalidate: REVALIDATE },
);

export const getLatestBlogs = async () => {
  const {
    data: { data: blogs },
  } = await publicApi.blog.getBlogs({
    "pagination[limit]": 6,
    populate: "card_image",
    sort: "createdAt:desc",
  });
  return blogs;
};

export const getRandomClips = unstable_cache(
  async () => {
    const {
      data: { data: clips },
    } = await publicApi.clip.getRandomClips({
      limit: 8,
    });
    return clips;
  },
  ["random-clips"],
  { revalidate: REVALIDATE },
);
