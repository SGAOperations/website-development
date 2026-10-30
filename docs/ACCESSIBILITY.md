# Accessibility

We target [WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/) level AA for both the public site and the CMS.
That also covers WCAG 2.1 AA, which the ADA Title II rule requires. The CMS also follows
[ATAG 2.0](https://www.w3.org/TR/ATAG20/), the W3C guidelines for authoring tools:

- Part A: webmasters with disabilities can use the editor.
- Part B: the editor helps everyone publish accessible pages.

## Using the editor without a mouse

Everything that Puck does by drag and drop also has a keyboard and single-click route. The keyboard button in the
editor header opens the same guide.

| Task | How |
| --- | --- |
| Open a panel | Tab to **Versions**, **Blocks**, **Outline** or **Checks** in the left rail and press Enter or Space. |
| Add a block | Open **Blocks**, choose where it goes (after the selected block, inside it, or at the end of the page), then press the block's **Add (+)** button. |
| Select a block | Tab to it on the canvas and press Enter, or pick it in **Outline**. Its settings appear in the Fields panel. |
| Move a block | **Move up** / **Move down** in the block toolbar, or Alt+Shift+↑ / ↓ (⌥⇧ on Mac). |
| Move a block into another container | Copy it, select the block it should follow, Paste, then delete the original. |
| Find problems | Open **Checks**. Choosing an issue selects its block. |
| Save | Ctrl+S / ⌘S |
| Read notifications | Alt+T moves focus to them. Errors stay until closed. |

Screen readers announce every move, insert and selection, for example "Moved Image up. Position 2 of 4". Canvas blocks
are announced by type and content, for example "Image: Students at the fall town hall".

## Display settings (CMS only)

The sliders button in the dashboard and editor headers opens **Display settings**. Changes apply straight away and are
saved in that browser. Once the CMS has logins they can move to each user's account.

| Setting | Options | Notes |
| --- | --- | --- |
| Theme | System, Light, Dark | System follows the device's light or dark mode, and switches live when the device does. |
| Contrast | System, Standard, More | More darkens text, borders, input outlines and focus rings (or brightens them in dark mode). System follows the device's "increase contrast" setting. |
| Motion | System, Full, Reduced | Reduced turns off animations and transitions, including in the canvas. Full overrides the device's reduce-motion setting. |
| Text size | 87.5% to 200% | Scales all CMS text, including Puck's panels and the plugin rail. Browser zoom still works on top. |

These settings change the CMS only. Published pages, version previews and the editor's canvas always show SGA's own
colors and sizes. They still follow each visitor's device settings for reduced motion and high-contrast mode, and
browser zoom.

## Built in

### Published pages

- A "Skip to main content" link is the first tab stop. Every page has exactly one `<main>`: a Group tagged
  `<main>` if there is one, otherwise the whole page.
- Untitled pages fall back to the title "SGA".
- Links in text are underlined. Focus is a 2px outline in the text color, so it shows on any background, and it
  stays visible in Windows high-contrast mode. Buttons get a white-and-dark double ring, which shows on every
  background color, SGA red included.
- Animations are switched off for visitors whose device asks for reduced motion.
- A Grid with fixed rows hides overflow items from keyboards and screen readers too, not just visually.
- Decorative images get `alt=""`. Other images use the block's alt text, falling back to the media library's. An
  image with neither is published with no `alt` at all, so it isn't silently treated as decorative.

### Helping webmasters publish accessible pages

- **Checks panel**: a page-wide check covering:
  - page title;
  - missing, file-name-like or over-long alt text;
  - text and heading contrast against the real background behind them;
  - empty or skipped headings, and more than one H1;
  - empty or vague link and button text ("click here", "read more");
  - buttons with no link;
  - more than one `<main>`;
  - duplicate or reserved anchor IDs.
- **Canvas warnings** on the block itself for missing alt text and low contrast: a small corner label ("Low
  contrast", "No alt text") that screen readers read in full. They show in the editor only.
- **Publish check**: publishing the open version when it has errors asks before going live.
- **Alt text in the media library**: you're asked for it right after uploading an image. Image blocks use it unless
  they set their own.

### Editor accessibility

- Landmarks (Versions, Blocks, Outline, Checks, Fields, Page canvas) and a page heading, so screen reader users can jump
  between areas.
- Every control has a spoken name, including Puck's unlabelled zoom menu, rich text toolbar and canvas iframe.
- Inline form errors that name the problem and keep focus in the field, for example an empty name or an invalid route path.
- After deleting or archiving, focus moves to the section heading instead of being lost. After cancelling an edit, it
  returns to the button you used.
- Success and status messages are announced. Error notifications don't time out.
- Click targets are at least 24px. Text, icons, focus rings and input borders meet AA contrast.
- The dashboard and editor work at 320px wide (the equivalent of 400% zoom) and at 200% text size with no sideways scrolling.

## Up to the webmaster

The checks can't judge meaning:

- Alt text says what the image means here, not just what it shows.
- Headings describe their section and go in order.
- Link and button text makes sense out of context.
- Put repeated header and navigation in Groups tagged `<header>` / `<nav>`, and the page body in a `<main>` Group,
  so the skip link jumps past them.
- Build site navigation, plus a site map or search page, so every page can be reached more than one way (WCAG 2.4.5).
- Videos and audio linked from the media library need captions or a transcript.

## For developers

- Interactive elements must be real `<a>` / `<button>` elements. Give icon-only buttons an `aria-label`; `title` isn't read
  reliably.
- After removing the focused element, move focus somewhere predictable. Announce status changes with `toast` or
  `announce()` from `src/components/ui/announcer.tsx`.
- New color tokens need their hex in `colorHex` (`src/lib/puck/a11y.ts`) so contrast checks cover them.
- New checks go in `checkAccessibility` (`src/lib/puck/a11y-check.ts`), with a test.
- Use the shared prompt (`useDialogs().prompt`) with `required: true` instead of silently ignoring empty input.
- `editor-a11y.tsx` patches Puck's markup by CSS-module class prefix, so it depends on Puck **0.21.1**. After upgrading
  Puck, rerun an axe scan of the editor and check the patches still match. The same goes for the Puck overrides in the
  display settings part of `styles.css` (reversed color ramps for dark mode, rem font sizes, rail width).
- Display settings live in `src/lib/display-settings.ts`. They set `data-theme`, `data-contrast`, `data-motion` and
  `data-text-size` on `<html>`, and `dark:` utilities follow `data-theme`. In CMS components, use theme tokens
  (`bg-background`, `text-muted-foreground`, `border-input`) rather than fixed grays, or add a `dark:` variant, so every
  theme keeps AA contrast.

## WCAG 2.2 A and AA coverage

✅ met by the product · ✍️ depends on what webmasters publish · — not applicable

| Criterion | Level | Status |
| --- | --- | --- |
| 1.1.1 Non-text Content | A | ✅ Alt text, decorative switch, library alt text, checks; icon buttons named. ✍️ Alt text quality. |
| 1.2.1–1.2.5 Audio and video | A/AA | — No audio or video blocks. ✍️ Captions and transcripts for linked media files. |
| 1.3.1 Info and Relationships | A | ✅ Landmarks, headings, labelled fields, table headers; heading checks. |
| 1.3.2 Meaningful Sequence | A | ✅ Reading order follows layout; hidden Grid items are skipped. |
| 1.3.3 Sensory Characteristics | A | ✅ Instructions name controls, not just their position or shape. |
| 1.3.4 Orientation | AA | ✅ Not locked. |
| 1.3.5 Identify Input Purpose | AA | — No personal-data fields yet. Use `autocomplete` on future login forms. |
| 1.4.1 Use of Color | A | ✅ Links underlined; severity spelled out. |
| 1.4.2 Audio Control | A | — No autoplaying audio. |
| 1.4.3 Contrast (Minimum) | AA | ✅ UI colors pass in every theme and contrast setting; page colors checked. ✍️ Fix flagged combinations. |
| 1.4.4 Resize Text | AA | ✅ Text size setting up to 200%; everything is in rem units and reflows down to 320px. |
| 1.4.5 Images of Text | AA | ✍️ Use Text blocks, not pictures of text. |
| 1.4.10 Reflow | AA | ✅ 320px with no sideways scroll; route table scrolls in its own container. |
| 1.4.11 Non-text Contrast | AA | ✅ Focus rings, icons and input borders at least 3:1. |
| 1.4.12 Text Spacing | AA | ✅ No fixed-height text containers. |
| 1.4.13 Content on Hover or Focus | AA | ✅ Only native tooltips. |
| 2.1.1 Keyboard | A | ✅ Add, select, move, edit, save and publish by keyboard. |
| 2.1.2 No Keyboard Trap | A | ✅ Tab leaves the rich text editor; Esc closes dialogs. |
| 2.1.4 Character Key Shortcuts | A | ✅ Every shortcut uses a modifier key. |
| 2.2.1 Timing Adjustable | A | ✅ No time limits; errors persist; success toasts pause on hover/focus. |
| 2.2.2 Pause, Stop, Hide | A | ✅ No auto-moving content. |
| 2.3.1 Three Flashes | A | ✅ None. |
| 2.4.1 Bypass Blocks | A | ✅ Skip link; editor landmarks. |
| 2.4.2 Page Titled | A | ✅ All pages and the canvas; untitled pages flagged and given a fallback. |
| 2.4.3 Focus Order | A | ✅ Focus managed after removals, cancels and dialogs. |
| 2.4.4 Link Purpose (In Context) | A | ✅ Editor links named. ✍️ Vague text flagged. |
| 2.4.5 Multiple Ways | AA | ✅ CMS: routes table and document list. ✍️ Public site navigation. |
| 2.4.6 Headings and Labels | AA | ✅ |
| 2.4.7 Focus Visible | AA | ✅ Including high-contrast mode. |
| 2.4.11 Focus Not Obscured (Minimum) | AA | ✅ No sticky overlays cover focus. |
| 2.5.1 Pointer Gestures | A | ✅ No multi-finger or path gestures. |
| 2.5.2 Pointer Cancellation | A | ✅ Native buttons act on release. |
| 2.5.3 Label in Name | A | ✅ Spoken names start with the visible text. |
| 2.5.4 Motion Actuation | A | — None. |
| 2.5.7 Dragging Movements | AA | ✅ Add and Move buttons replace dragging. |
| 2.5.8 Target Size (Minimum) | AA | ✅ At least 24px. |
| 3.1.1 Language of Page | A | ✅ `lang="en"`. |
| 3.1.2 Language of Parts | AA | ✍️ The rich text editor can't mark other languages yet (known gap). |
| 3.2.1 On Focus / 3.2.2 On Input | A | ✅ Nothing changes context unexpectedly. |
| 3.2.3 / 3.2.4 Consistent Navigation and Identification | AA | ✅ Same header and controls everywhere. |
| 3.2.6 Consistent Help | A | ✅ Help button in the same place on every editor page. |
| 3.3.1 / 3.3.3 Error Identification and Suggestion | A/AA | ✅ Inline errors that say how to fix the problem. |
| 3.3.2 Labels or Instructions | A | ✅ Labels and hints, e.g. route path format. |
| 3.3.4 Error Prevention | AA | ✅ Confirm before delete; publish check; unsaved-changes guard; versions can be restored. |
| 3.3.7 Redundant Entry | A | ✅ Dialogs prefill current values. |
| 3.3.8 Accessible Authentication (Minimum) | AA | — No login yet. When Supabase auth is added, allow paste and password managers, and use no puzzles. |
| 4.1.2 Name, Role, Value | A | ✅ |
| 4.1.3 Status Messages | AA | ✅ Live regions for toasts, moves, inserts and check results. |

## How this was tested

- axe-core (WCAG 2.2 AA rules) shows no violations on the public pages, dashboard, editor, canvas, every editor
  panel, the rich text editor and dialogs.
- Keyboard-only runs of add, select, move, publish, the dialogs and the route form, checking focus after each step.
- Mouse drag and drop still works.
- Windows forced-colors emulation and a 320px viewport.
- Display settings: axe shows no violations in all four theme and contrast combinations on the dashboard and every
  editor panel. Also checked: 150% and 200% text with no sideways scrolling, reduced and full motion against the OS
  setting, and saved settings applying before any JavaScript loads (production build, scripts blocked). The canvas and
  published pages stay unchanged.

Not yet tested with real screen readers (VoiceOver, NVDA, JAWS) or by people with disabilities. Do both before calling
the CMS fully accessible.

## Known gaps

- Puck has no keyboard drag and drop. The Add and Move buttons cover the same tasks.
- Library alt text is copied into an Image block when the image is chosen. Changing it later doesn't update existing blocks.
- The publish check runs only when publishing the version that's open with no unsaved changes.
- No way to mark text in another language (3.1.2).
- At 200% text, Puck's fixed-width zoom menu clips its label, and the sidebars keep their pixel widths. Sidebars can be
  hidden with the header toggles to make room.
