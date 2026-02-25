"use client";

import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import config from "../../../puck.config";
import { useState, createContext, useContext } from "react";
import { DraftPlugin } from "./DraftPlugin";

type DraftContextType = {
  pageId?: number;
  draftId?: number;
  finalDraftId?: number;
};

const DraftContext = createContext<DraftContextType>({});

export function useDraftContext() {
  return useContext(DraftContext);
}

export function Client({
  data,
  pageId,
  draftId,
  finalDraftId,
}: {
  data: Partial<Data>;
  pageId?: number;
  draftId?: number;
  finalDraftId?: number;
}) {
  const [currentData, setCurrentData] = useState<Data>(data as Data);

  return (
    <DraftContext.Provider value={{ pageId, draftId, finalDraftId }}>
      <Puck
        config={config}
        data={currentData}
        ui={{plugin: {current: "draft-plugin"}}}
        plugins={[DraftPlugin]}
        onChange={(data) => {
          setCurrentData(data);
        }}
      />
    </DraftContext.Provider>
  );
}
