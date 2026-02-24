export interface DraftToolbarProps {
  onNewDraft: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSaving: boolean;
  isPublishing: boolean;
  canCreateDraft: boolean;
  isDraft: boolean;
}

export function DraftToolbar({
  onNewDraft,
  onSaveDraft,
  onPublish,
  isSaving,
  isPublishing,
  canCreateDraft,
  isDraft,
}: DraftToolbarProps) {
  const isLoading = isSaving || isPublishing;

  return (
    <div className="flex flex-col gap-3 pb-3 border-b border-gray-200">
      {canCreateDraft && (
        <button
          onClick={onNewDraft}
          disabled={isLoading}
          className="w-full px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Loading..." : "New Draft"}
        </button>
      )}

      <div className="flex gap-2">
        <button
          onClick={onSaveDraft}
          disabled={isLoading}
          className="flex-1 px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSaving ? "Saving..." : isDraft ? "Update Draft" : "Save Draft"}
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
