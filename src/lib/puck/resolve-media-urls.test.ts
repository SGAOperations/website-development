import { describe, expect, it, vi } from "vitest";
import type { Data } from "@puckeditor/core";
import { collectMediaIds, resolveMediaUrls } from "./resolve-media-urls";

vi.mock("server-only", () => ({}));
vi.mock("@/puck.config", () => ({
  default: {
    components: {
      Image: {},
    },
  },
}));

function createData(image: { mediaId: number; url: string }): Data {
  return {
    root: {},
    content: [
      {
        type: "Image",
        props: {
          image,
          alt: "",
          objectFit: "cover",
          aspectRatio: "auto",
          radius: "none",
        },
      },
    ],
  };
}

function getImage(data: Data) {
  return data.content[0]?.props?.image as { mediaId: number; url: string } | null;
}

describe("resolveMediaUrls", () => {
  it("collects media ids from image blocks", () => {
    expect(collectMediaIds(createData({ mediaId: 12, url: "https://stale.test/old.png" }))).toEqual([12]);
  });

  it("refreshes URLs for recognized media", () => {
    expect(
      getImage(resolveMediaUrls(
        createData({ mediaId: 12, url: "https://stale.test/old.png" }),
        new Map([[12, "https://cdn.test/media/12/hero.png"]]),
      )),
    ).toEqual({
      mediaId: 12,
      url: "https://cdn.test/media/12/hero.png",
    });
  });

  it("preserves unresolved media references instead of clearing them", () => {
    expect(
      getImage(resolveMediaUrls(
        createData({ mediaId: 99, url: "https://stale.test/missing.png" }),
        new Map(),
      )),
    ).toEqual({
      mediaId: 99,
      url: "",
    });
  });
});
