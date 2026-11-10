"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import type { Media } from "../../generated/prisma/client";

export type MediaWithUrl = Media & { url: string };

type MediaContextValue = {
  media: MediaWithUrl[];
  imageMedia: MediaWithUrl[];
  addMedia: (item: MediaWithUrl) => void;
  getMedia: (id: number) => MediaWithUrl | undefined;
  getUrl: (id: number) => string | undefined;
};

const MediaContext = createContext<MediaContextValue | null>(null);

export function MediaProvider({
  media: initial,
  children,
}: {
  media: MediaWithUrl[];
  children: ReactNode;
}) {
  const [media, setMedia] = useState(initial);

  const addMedia = useCallback((item: MediaWithUrl) => {
    setMedia((prev) => [item, ...prev]);
  }, []);

  const mediaById = useMemo(
    () => new Map(media.map((item) => [item.id, item])),
    [media],
  );
  const imageMedia = useMemo(
    () => media.filter((item) => item.contentType?.startsWith("image/")),
    [media],
  );
  const getMedia = useCallback(
    (id: number) => mediaById.get(id),
    [mediaById],
  );
  const getUrl = useCallback(
    (id: number) => mediaById.get(id)?.url,
    [mediaById],
  );

  return (
    <MediaContext value={{ media, imageMedia, addMedia, getMedia, getUrl }}>
      {children}
    </MediaContext>
  );
}

export function useMedia() {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMedia must be used within a MediaProvider");
  return ctx;
}
