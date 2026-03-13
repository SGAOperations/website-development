export interface VersionToolbarProps {
  onSaveVersion: () => void;
  onPublish: () => void;
  isSaving: boolean;
  isPublishing: boolean;
}

export function VersionToolbar({
  onSaveVersion,
  onPublish,
  isSaving,
  isPublishing,
}: VersionToolbarProps) {
  const isLoading = isSaving || isPublishing;

  return (
    <div className="flex flex-col gap-3 pb-3 border-b border-gray-200">
      <div className="flex gap-2">
        <button
          onClick={onSaveVersion}
          disabled={isLoading}
          className="flex-1 px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={onPublish}
          disabled={isLoading}
          className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}
