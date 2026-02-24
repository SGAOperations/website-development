# Draft Plugin Refactor Implementation Plan

## Overview
Refactor the DraftPlugin from a fixed header UI implementation to use Puck's new Plugin Rail (v0.21+), decompose monolithic components, migrate to Tailwind CSS, and remove technical debt from vibe-coding practices.

**Key References:**
- [Puck Plugin Rail Blog Post](https://puckeditor.com/blog/puck-021#new-ui-the-plugin-rail)
- [Plugin Rail Documentation](https://puckeditor.com/docs/extending-puck/plugins#rendering-ui-in-the-plugin-rail)
- [Working Example: HeadingAnalyzer Plugin](./HeadingAnalyzer.tsx)

---

## Current State Problems

### 1. **Fixed Header UI (Anti-pattern)**
- Currently renders as a fixed-position header bar at top of page
- Uses inline styles with hardcoded colors and spacing
- Blocks page content with `marginTop: "60px"`
- Not composable with Puck's native UI

### 2. **Monolithic Implementation**
- All logic in single `DraftPluginComponent` function (~559 lines)
- Mixed concerns: business logic, state management, UI rendering
- Difficult to test individual features
- Hard to reuse components

### 3. **Unused/Legacy Attributes**
- `data-drafts-button` - Only passed to DOM, not used by logic
- `data-drafts-panel` - Only for click-outside detection (should use ref)
- Inline style objects sprawled throughout
- No separation of concerns between styling and logic

### 4. **Styling Issues**
- Entire implementation uses inline styles with hardcoded hex colors
- No use of Tailwind classes despite project using Tailwind
- Colors don't align with Puck's `var(--puck-color-*)` token system
- Can't leverage Tailwind theming or design system

### 5. **State Management Complexity**
- Local state duplicates information: `data`, `currentData`, `finalDraftId`, `initialFinalDraftId`
- Dependency chains unclear in useEffect hooks
- No use of Puck's state management (`usePuck`, `setData` dispatch)
- Manual URL param parsing instead of leveraging Puck routing

---

## Implementation Plan (Phases)

### Phase 1: Component Decomposition

#### 1.1 Create Sub-Components
Extract the 559-line component into focused, single-responsibility components:

```
DraftPlugin.tsx (exported plugin definition)
├── DraftPluginContainer.tsx (main render component)
├── components/
│   ├── DraftToolbar.tsx        (Action buttons: Save, Publish, New Draft)
│   ├── DraftBadge.tsx          (Status badge: "Published", "Current")
│   ├── DraftListPanel.tsx      (Dropdown panel with draft list)
│   ├── DraftListItem.tsx       (Individual draft row with delete button)
│   ├── ActionButton.tsx        (Reusable button with consistent styling)
│   └── ConfirmDialog.tsx       (Reusable confirmation pattern)
└── hooks/
    └── useDraftState.ts        (Custom hook for draft state logic)
```

#### 1.2 Component Specifications

**ActionButton.tsx** --Use existing ../../../Button.tsx component if possible--
- Props: `label: string`, `onClick: () => void`, `disabled?: boolean`, `variant?: "primary" | "secondary" | "danger" | "success"`, `isLoading?: boolean`
- Uses Tailwind classes for all styling (replace inline styles)
- Support disabled/loading states with opacity and cursor classes
- Example variants map:
  - `primary`: "bg-blue-500 hover:bg-blue-600"
  - `danger`: "bg-red-500 hover:bg-red-600"
  - `delete`: "bg-red-500 hover:bg-red-600 text-sm"

**DraftToolbar.tsx**
- Props: `onNewDraft: () => void`, `onSaveDraft: () => void`, `onPublish: () => void`, `isSaving: boolean`, `isPublishing: boolean`, `canCreateDraft: boolean`, `isDraft: boolean`, `lastAction?: 'draft' | 'publish'`
- Render: Button group with New Draft, Save/Update Draft, Publish buttons
- Use Tailwind: `flex gap-3 p-4 border-b` (or plugin rail equivalent spacing)

**DraftListPanel.tsx**
- Props: `isOpen: boolean`, `drafts: Draft[]`, `isLoading: boolean`, `currentDraftId?: number`, `publishedDraftId?: number`, `onLoadDraft: (id: number) => void`, `onDeleteDraft: (id: number) => void`
- Render: Scrollable list panel with count badge
- Use Tailwind: `absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto`
- Remove `data-drafts-panel` attribute

**DraftListItem.tsx**
- Props: `draft: Draft`, `isPublished: boolean`, `isCurrent: boolean`, `onSelect: () => void`, `onDelete: (e: React.MouseEvent) => void`
- Render Each draft with status badges
- Tailwind: Hover states with `hover:bg-gray-100`, highlighting for current draft

**DraftBadge.tsx**
- Props: `variant: "published" | "current" | "status"`, `children: React.ReactNode`
- Render: Span with conditional styling
- Tailwind classes based on variant

**ConfirmDialog.tsx**
- Props: `message: string`, `onConfirm: () => void`, `onCancel: () => void`, `isDangerous?: boolean`
- Replace native `confirm()` and `alert()` calls with component-based pattern
- Future enhancement: Render inside Puck's modal system

#### 1.3 Custom Hook: useDraftState

Extract all draft-related state management into `hooks/useDraftState.ts`:

**Hook signature:**
```tsx
type UseDraftStateReturn = {
  // State
  currentData: Data;
  drafts: Draft[];
  currentDraftId?: number;
  finalDraftId: number | null;
  isLoading: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  lastAction: "draft" | "publish" | null;
  
  // Actions
  fetchDrafts: () => Promise<void>;
  fetchPageInfo: () => Promise<void>;
  loadDraft: (draftId: number) => Promise<void>;
  saveDraft: (data: Data) => Promise<void>;
  publishDraft: (data: Data) => Promise<void>;
  deleteDraft: (draftId: number) => Promise<void>;
  createNewDraft: () => Promise<void>;
  updateData: (newData: Data) => void;
};

export function useDraftState({
  pageId?: number;
  initialDraftId?: number;
  initialFinalDraftId?: number;
  initialData: Data;
}): UseDraftStateReturn
```

**Benefits:**
- Logic separable from UI
- Easier to test
- Reusable in other components
- Clear API surface

---

### Phase 2: Migrate to Plugin Rail UI

#### 2.1 Update DraftPlugin Definition

Change from:
```tsx
export const DraftPlugin = {
  name: "draft-plugin",
  label: "Drafts",
  icon: <PencilLine />,
  render: () => DraftPluginComponent  // ❌ Returns JSX directly
};
```

To:
```tsx
import { createUsePuck } from "@puckeditor/core";
import { Plugin } from "@puckeditor/core/types";

const usePuck = createUsePuck();

export const DraftPlugin: Plugin = {
  name: "draft-plugin",
  label: "Drafts",
  icon: <PencilLine />,
  render: DraftPluginContainer  // ✅ React component function
};
```

#### 2.2 Update DraftPluginContainer

**Key Changes:**
1. Use `usePuck()` hook to access Puck state (not props)
2. Use Puck's `setData` dispatch to update page data
3. Remove fixed positioning and header styling
4. Return compact plugin rail compatible UI

**Structure:**
```tsx
export function DraftPluginContainer() {
  const usePuck = createUsePuck();
  const data = usePuck((s) => s.appState.data);
  const dispatch = usePuck((s) => s.dispatch);
  
  // Get pageId from somewhere (URL params, global state, context)
  // Remove prop-based injection - use app routing
  
  const {
    currentData,
    drafts,
    currentDraftId,
    finalDraftId,
    isSaving,
    isPublishing,
    lastAction,
    saveDraft,
    publishDraft,
    // ... other actions
  } = useDraftState({ pageId, initialData: data });
  
  // Handle data updates through Puck
  const handleSaveDraft = (dataToSave: Data) => {
    // Dispatch to Puck first
    dispatch({ type: "setData", payload: dataToSave });
    // Then save to backend
    saveDraft(dataToSave);
  };

  return (
    <div className="flex flex-col gap-4 p-4 text-sm">
      {/* Toolbar section */}
      <DraftToolbar
        onNewDraft={handleNewDraft}
        onSaveDraft={() => handleSaveDraft(currentData)}
        onPublish={() => publishDraft(currentData)}
        isSaving={isSaving}
        isPublishing={isPublishing}
        canCreateDraft={!!pageId}
        isDraft={currentDraftId !== finalDraftId}
        lastAction={lastAction}
      />

      {/* Draft list section */}
      <DraftListPanel
        isOpen={!loadingMinimized}
        drafts={drafts}
        isLoading={isLoading}
        currentDraftId={currentDraftId}
        publishedDraftId={finalDraftId}
        onLoadDraft={loadDraft}
        onDeleteDraft={deleteDraft}
      />

      {/* Status indicator */}
      {lastAction && (
        <div className="text-xs text-gray-500">
          Last: {lastAction === "publish" ? "Published" : "Saved"}
        </div>
      )}
    </div>
  );
}
```

#### 2.3 Remove Click-Outside Detection

Replace manual dropdown handler:
```tsx
// ❌ OLD: Manual click-outside with data attributes
useEffect(() => {
  if (!showDrafts) return;
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-drafts-panel]') && !target.closest('[data-drafts-button]')) {
      setShowDrafts(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [showDrafts]);
```

With Puck's plugin rail, the panel is automatically scoped and doesn't need click-outside detection.

---

### Phase 3: Tailwind CSS Migration

#### 3.1 Mapping Inline Styles to Tailwind

**Example transformations:**

Header/Toolbar styling:
```tsx
// ❌ OLD
style={{
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: "#fff",
  borderBottom: "1px solid #e5e7eb",
  padding: "12px 24px",
  display: "flex",
  gap: "12px",
  alignItems: "center",
}}

// ✅ NEW (Plugin Rail - no fixed positioning)
className="flex gap-3 items-center p-4 border-b border-gray-200 bg-white"
```

Button styling:
```tsx
// ❌ OLD (hardcoded colors)
style={{
  padding: "8px 16px",
  backgroundColor: "#10b981",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: isSaving || isPublishing ? "not-allowed" : "pointer",
  opacity: isSaving || isPublishing ? 0.6 : 1,
}}

// ✅ NEW (Tailwind with states)
className={cn(
  "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition",
  (isSaving || isPublishing) && "opacity-50 cursor-not-allowed"
)}
disabled={isSaving || isPublishing}
```

Panel/dropdown styling:
```tsx
// ❌ OLD
style={{
  position: "absolute",
  top: "100%",
  right: 0,
  marginTop: "8px",
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  minWidth: "300px",
  maxHeight: "400px",
  overflowY: "auto",
  zIndex: 1001,
}}

// ✅ NEW (Or use plugin rail native)
className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md z-50"
```

Label badges:
```tsx
// ❌ OLD
style={{
  marginLeft: "8px",
  padding: "2px 6px",
  backgroundColor: "#10b981",
  color: "white",
  borderRadius: "4px",
  fontSize: "11px",
}}

// ✅ NEW
className="ml-2 px-2 py-0.5 bg-green-500 text-white rounded text-xs"
```

#### 3.2 Use Puck Color Tokens (Optional for visual consistency)

If using Puck's default theme, consider:
- Primary actions: `bg-blue-500` → matches Puck's plugin rail
- Danger actions: `bg-red-500`/`bg-red-600`
- Status success: `bg-green-500`
- Text muted: `text-gray-500`

#### 3.3 Create Utility File for Repeated Patterns

Create `lib/button-variants.ts` for reusable button classes:
```tsx
export const buttonVariants = {
  primary: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50",
  danger: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50",
  secondary: "px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50",
  success: "px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50",
  small: "px-2 py-1 text-sm rounded",
};

// Usage:
<button className={cn(buttonVariants.primary, "w-full")} />
```

---

### Phase 4: Integrate with Puck State Management

#### 4.1 Update useDraftState Hook

Add Puck dispatch integration:
```tsx
export function useDraftState({ 
  pageId, 
  initialData,
  dispatch, // ← From usePuck
}: /* ... */) {
  // When saving draft
  const saveDraft = async (dataToSave: Data) => {
    // 1. Dispatch to Puck immediately (optimistic update)
    dispatch({ type: "setData", payload: dataToSave });
    
    // 2. Persist to backend
    const response = await fetch("/puck/api", { /* ... */ });
    
    // 3. Handle errors (revert Puck state if needed)
    if (!response.ok) {
      dispatch({ type: "setData", payload: previousData });
      throw new Error("Save failed");
    }
  };
  
  return { /* ... */ };
}
```

#### 4.2 Update client.tsx Integration

Current passing data via props:
```tsx
// OLD client.tsx
<Puck
  plugins={[DraftPlugin]}
  data={currentData}
  onChange={(data) => setCurrentData(data)}
/>
```

New approach (DraftPlugin uses `usePuck()` internally):
```tsx
// NEW client.tsx
<Puck
  plugins={[DraftPlugin]}
  data={data}
  onChange={(data) => {
    // Puck handles internal state
    // DraftPlugin will pick up changes via usePuck hook
  }}
/>
```

**Note:** DraftPlugin now needs pageId injected differently (e.g., context, URL params, global state) since it no longer receives props.

---

### Phase 5: Remove Technical Debt

#### 5.1 Remove Unused Data Attributes
- ~~`data-drafts-button`~~ → Use ref instead if needed
- ~~`data-drafts-panel`~~ → Plugin rail handles scoping

#### 5.2 Clean Up Native API Calls
- Replace `confirm()` with `ConfirmDialog` component
- Replace `alert()` with toast notifications or inline status messages (integrate with Puck's notification system if available)

#### 5.3 Remove Debugging Code
- Uncomment and clean up commented console.log statements
- Example:
  ```tsx
  // Remove or move to debug mode:
  // console.log("Data prop changed:", { draftId: currentDraftId, ... })
  ```

#### 5.4 Remove Unnecessary State
- `showDrafts` → Can be derived from panel UI state
- `lastAction` → Consider moving to toast notification instead of persistent state (auto-dismiss after 3-5 seconds)

---

## Implementation Sequence

### Step 1: Create Component Structure
1. Create `components/` directory
2. Extract and create:
   - `ActionButton.tsx`
   - `DraftBadge.tsx`
   - `ConfirmDialog.tsx`
   - `DraftToolbar.tsx`
   - `DraftListPanel.tsx`
   - `DraftListItem.tsx`

### Step 2: Create Custom Hook
1. Create `hooks/useDraftState.ts`
2. Extract all business logic from DraftPluginComponent
3. Test with isolated state

### Step 3: Refactor Main Component
1. Create `DraftPluginContainer.tsx`
2. Replace DraftPluginComponent with new container
3. Update to use hooks (usePuck, useDraftState)
4. Wire up component tree
5. Test functionality maintained

### Step 4: Tailwind Migration
1. Update all components to use Tailwind classes
2. Remove inline style objects
3. Test layout and responsive behavior
4. Update tailwind.config.js if needed

### Step 5: Puck Integration
1. Update plugin definition to match Plugin type exactly
2. Test plugin rail rendering in editor
3. Verify state updates through usePuck
4. Remove props-based data passing

### Step 6: Testing & Polish
1. Test each component in isolation
2. Test full draft workflow (create, edit, publish, delete)
3. Test error states and recovery
4. Test with different page IDs
5. Clean up console output

---

## File Structure After Refactor

```
app/puck/[...puckPath]/
├── DraftPlugin.tsx              (←renamed from previous file)
├── DraftPluginContainer.tsx     (← main render)
├── client.tsx                   (← updated integration)
├── components/
│   ├── DraftToolbar.tsx
│   ├── DraftListPanel.tsx
│   ├── DraftListItem.tsx
│   ├── DraftBadge.tsx
│   ├── ActionButton.tsx
│   ├── ConfirmDialog.tsx
│   └── index.ts                 (← export all components)
├── hooks/
│   ├── useDraftState.ts
│   └── index.ts                 (← export hook)
└── lib/
    ├── button-variants.ts       (← Tailwind classes)
    └── draft-types.ts           (← Draft/state types)
```

---

## Key Benefits of Refactor

| Aspect | Before | After |
|--------|--------|-------|
| **UI Location** | Fixed header (blocks content) | Plugin rail (integrated) |
| **Component Structure** | 559-line monolith | <100 line focused components |
| **Styling** | Inline styles + hex colors | Tailwind classes + design tokens |
| **Testability** | Hard (monolithic) | Easy (compositions + hook) |
| **State Management** | Local useState + props | usePuck + useDraftState hook |
| **Maintainability** | Hard (vibe-coding) | Clear (semi-structured) |
| **Technical Debt** | Many unused attributes | None |

---

## Migration Checklist

- [ ] Phase 1: Components decomposed
- [ ] Phase 1: useDraftState hook created and tested
- [ ] Phase 2: Plugin definition updated to Plugin type
- [ ] Phase 2: DraftPluginContainer created with usePuck integration
- [ ] Phase 2: Plugin renders in Puck's plugin rail
- [ ] Phase 3: All components use Tailwind classes
- [ ] Phase 3: Inline styles removed
- [ ] Phase 4: usePuck dispatch integration implemented
- [ ] Phase 4: client.tsx updated
- [ ] Phase 5: data-* attributes removed
- [ ] Phase 5: confirm/alert replaced entirely
- [ ] Phase 5: Debugging code cleaned up
- [ ] Full workflow tested (create, edit, publish, delete)
- [ ] Error states tested and handled gracefully
- [ ] UI responsive and matches design system
- [ ] Code review completed
- [ ] Deployed to staging/production
