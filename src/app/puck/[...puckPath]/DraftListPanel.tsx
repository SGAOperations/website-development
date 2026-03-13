import type { Draft } from "./types";

export interface DraftListPanelProps {
  drafts: Draft[];
  isLoading: boolean;
  currentDraftId?: number;
  publishedDraftId?: number | null;
  onLoadDraft: (draftId: number) => void;
  onDeleteDraft: (draftId: number) => void;
}

export function DraftListPanel({
  drafts,
  isLoading,
  currentDraftId,
  publishedDraftId,
  onLoadDraft,
  onDeleteDraft,
}: DraftListPanelProps) {

  return (
    <div className="border-t border-gray-200 pt-3">
      <div className="text-xs font-semibold text-gray-600 mb-2">
        Drafts ({drafts.length})
      </div>

      {isLoading ? 
      (
        <div className="text-xs text-gray-500 text-center py-2">Loading...</div>
      ) :
       drafts.length === 0 ? 
      (
        <div className="text-xs text-gray-500 text-center py-2">
          No drafts found
        </div>
      ) : 
      (
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {drafts.map((draft) => {
            const isPublished = draft.id === publishedDraftId;
            const isCurrent = draft.id === currentDraftId;
            const date = new Date(draft.createdAt);

            return (
              <div
                key={draft.id}
                onClick={() => onLoadDraft(draft.id)}
                className={`px-3 py-2 rounded text-xs cursor-pointer transition ${
                  isCurrent
                    ? "bg-gray-100 font-semibold"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>Draft #{draft.id}</span>

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

                  {!isPublished && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDraft(draft.id);
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition flex-shrink-0"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
