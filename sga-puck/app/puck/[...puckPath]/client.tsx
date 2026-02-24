"use client";

import type { Data } from "@puckeditor/core";
import { Puck } from "@puckeditor/core";
import config from "../../../puck.config";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DraftPlugin } from "./DraftPlugin";

type Draft = {
  id: number;
  pageId: number;
  createdAt: string;
};

export function Client({
  path,
  data,
  pageId,
  draftId,
  finalDraftId: initialFinalDraftId,
}: {
  path: string;
  data: Partial<Data>;
  pageId?: number;
  draftId?: number;
  finalDraftId?: number;
}) {
    return(
      <div style={{ marginTop: "60px" }}>
        <Puck
          key={currentDraftId || "new"} // Force re-render when draftId changes
          config={config}
          data={currentData}
          plugins = {[DraftPlugin]} 
          onChange={(data) => {
            setCurrentData(data);
          }}
          onPublish={async (data) => {
            // Default to publish for backward compatibility
            setCurrentData(data);
            await handleSave(data, "publish");
          }}
        />
      </div>
  );
}
