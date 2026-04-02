import type { Data } from "@puckeditor/core";
import { transformProps } from "@puckeditor/core/rsc";
import config from "@/puck.config";

type ImageProp = { mediaId: number; url: string } | null;

export function collectMediaIds(data: Data): number[] {
  const mediaIds = new Set<number>();

  transformProps(
    data,
    {
      Image: (props: { image?: ImageProp }) => {
        if (props.image?.mediaId) {
          mediaIds.add(props.image.mediaId);
        }
        return props;
      },
    },
    config
  );

  return [...mediaIds];
}

export function resolveMediaUrls(
  data: Data,
  urlMap: ReadonlyMap<number, string>
): Data {
  return transformProps(
    data,
    {
      Image: (props: { image?: ImageProp }) => {
        if (!props.image?.mediaId) {
          return props;
        }
        const url = urlMap.get(props.image.mediaId);
        if (!url) {
          return { ...props, image: { ...props.image, url: "" } };
        }
        return { ...props, image: { ...props.image, url } };
      },
    },
    config
  );
}
