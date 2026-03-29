import { Eye } from "lucide-react";
import type { Version } from "../../../../lib/types";

export interface VersionListPanelProps {
  versions: Version[];
  isLoading: boolean;
  currentVersionId?: number;
  publishedVersionId?: number | null;
  onLoadVersion: (versionId: number) => void;
  onPublishVersion: (versionId: number) => void;
  onPreviewVersion: (versionId: number) => void;
  isPublishing?: boolean;
  isPublishDisabled?: boolean;
}

function formatVersionLabel(version: Version) {
  const date = new Date(version.createdAt);
  const label = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return { label, time };
}

export function VersionListPanel({
  versions,
  isLoading,
  currentVersionId,
  publishedVersionId,
  onLoadVersion,
  onPublishVersion,
  onPreviewVersion,
  isPublishing,
  isPublishDisabled,
}: VersionListPanelProps) {

  return (
    <div className="">
      <div className="text-xs font-semibold text-gray-600 mb-2">
        Versions ({versions.length})
      </div>

      {isLoading ?
      (
        <div className="text-xs text-gray-500 text-center py-2">Loading...</div>
      ) :
       versions.length === 0 ?
      (
        <div className="text-xs text-gray-500 text-center py-2">
          No versions found
        </div>
      ) :
      (
        <div className="space-y-1 max-h-96">
          {versions.map((version) => {
            const isPublished = version.id === publishedVersionId;
            const isCurrent = version.id === currentVersionId;
            const { label, time } = formatVersionLabel(version);

            return (
              <div
                key={version.id}
                onClick={() => onLoadVersion(version.id)}
                className={`px-3 py-2 rounded text-xs cursor-pointer transition ${
                  isCurrent
                    ? "bg-gray-100 font-semibold"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span>{label}</span>

                    <div className="text-xs text-gray-500 mt-1">
                      {time}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isPublished ? (
                      <span className="px-2 py-0.5 bg-green-500 text-white rounded text-xs">
                        Published
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPublishVersion(version.id);
                        }}
                        disabled={isPublishing || isPublishDisabled}
                        className="px-2 py-0.5 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewVersion(version.id);
                      }}
                      className="p-1 text-gray-400 rounded hover:text-gray-600 hover:bg-gray-100 transition"
                      title="Preview"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
