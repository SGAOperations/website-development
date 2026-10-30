import { Eye } from "lucide-react";
import { cn } from "../../../../lib/utils";
import type { Version } from "../../../../lib/types";
import { formatRelativeTime } from "@/lib/format";

export interface VersionListPanelProps {
  versions: Version[];
  isLoading: boolean;
  currentVersionId?: number;
  publishedVersionId?: number | null;
  onLoadVersion: (versionId: number) => void;
  onPublishVersion: (versionId: number) => void;
  getPreviewUrlForVersion: (versionId: number) => string;
  isPublishing?: boolean;
  isPublishDisabled?: boolean;
}

function formatVersionLabel(version: Version) {
  const date = new Date(version.createdAt);
  const relative = formatRelativeTime(date);
  const month = date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase().replace(" ", "");
  const absolute = `${month}, ${time}`;
  return { relative, absolute };
}

function VersionEntry({
  version,
  isCurrent,
  isPublished,
  onLoad,
  onPublish,
  getPreviewUrlForVersion,
  isPublishing,
  isPublishDisabled,
}: {
  version: Version;
  isCurrent: boolean;
  isPublished: boolean;
  onLoad: () => void;
  onPublish: () => void;
  getPreviewUrlForVersion: (versionId: number) => string;
  isPublishing?: boolean;
  isPublishDisabled?: boolean;
}) {
  const { relative, absolute } = formatVersionLabel(version);
  // Spoken name; the relative time tells apart versions saved in the same minute.
  const name = `${absolute}, ${relative}`;

  return (
    <div
      onClick={onLoad}
      className={cn(
        "px-3 py-2 rounded text-xs cursor-pointer transition",
        isCurrent
          ? "bg-muted font-semibold"
          : "bg-background hover:bg-muted",
      )}
    >
      {/* Wraps so the actions drop below the date at large text sizes instead of overlapping it. */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        {/* The row stays clickable for mouse users; this button makes loading reachable by keyboard. */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLoad();
          }}
          aria-current={isCurrent || undefined}
          aria-label={`Load version from ${name}`}
          className="min-w-32 flex-1 cursor-pointer rounded text-left"
        >
          <span className="block">{absolute}</span>
          <span className={cn("block text-[0.6875rem] mt-0.5", isCurrent ? "text-foreground" : "text-muted-foreground")}>
            {relative}
          </span>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          {isPublished ? (
            <span className="px-2 py-0.5 bg-green-700 text-white rounded text-xs">
              Published
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPublish();
              }}
              disabled={isPublishing || isPublishDisabled}
              aria-label={`Publish version from ${name}`}
              className="px-2 py-1 text-xs text-foreground border border-input rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Publish
            </button>
          )}
          <a
            href={getPreviewUrlForVersion(version.id)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-muted-foreground rounded hover:text-foreground hover:bg-muted transition"
            title="Preview"
            aria-label={`Preview version from ${name} (opens in new tab)`}
          >
            <Eye size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

export function VersionListPanel({
  versions,
  isLoading,
  currentVersionId,
  publishedVersionId,
  onLoadVersion,
  onPublishVersion,
  getPreviewUrlForVersion,
  isPublishing,
  isPublishDisabled,
}: VersionListPanelProps) {

  return (
    <div className="">
      <div className="text-xs font-semibold text-muted-foreground mb-2">
        Versions ({versions.length})
      </div>

      {isLoading ?
      (
        <div role="status" className="text-xs text-muted-foreground text-center py-2">Loading...</div>
      ) :
       versions.length === 0 ?
      (
        <div className="text-xs text-muted-foreground text-center py-2">
          No versions found
        </div>
      ) :
      (
        <div className="space-y-1 max-h-96">
          {versions.map((version) => (
            <VersionEntry
              key={version.id}
              version={version}
              isCurrent={version.id === currentVersionId}
              isPublished={version.id === publishedVersionId}
              onLoad={() => onLoadVersion(version.id)}
              onPublish={() => onPublishVersion(version.id)}
              getPreviewUrlForVersion={getPreviewUrlForVersion}
              isPublishing={isPublishing}
              isPublishDisabled={isPublishDisabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
