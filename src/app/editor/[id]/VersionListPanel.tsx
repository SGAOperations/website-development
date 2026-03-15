import type { Version } from "../../../lib/types";

export interface VersionListPanelProps {
  versions: Version[];
  isLoading: boolean;
  currentVersionId?: number;
  publishedVersionId?: number | null;
  onLoadVersion: (versionId: number) => void;
}

export function VersionListPanel({
  versions,
  isLoading,
  currentVersionId,
  publishedVersionId,
  onLoadVersion,
}: VersionListPanelProps) {

  return (
    <div className="border-t border-gray-200 pt-3">
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
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {versions.map((version) => {
            const isPublished = version.id === publishedVersionId;
            const isCurrent = version.id === currentVersionId;
            const date = new Date(version.createdAt);

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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>Version #{version.id}</span>

                      {isPublished && (
                        <span className="px-2 py-0.5 bg-green-500 text-white rounded text-xs">
                          Published
                        </span>
                      )}

                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white rounded text-xs">
                          Current
                        </span>
                      )}

                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {date.toLocaleString()}
                    </div>
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
