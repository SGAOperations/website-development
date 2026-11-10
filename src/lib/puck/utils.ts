import type { Data } from "@puckeditor/core";

export function createEmptyPuckData(): Data {
  return {
    root: {},
    content: [],
  };
}
