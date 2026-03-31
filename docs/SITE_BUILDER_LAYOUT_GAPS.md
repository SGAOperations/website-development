# Styling and Component System Gaps

## Goal

Document what is missing in the current styling and component system to approach the layout and styling control expected from a more capable site builder such as Squarespace.

This is focused primarily on layout power, container behavior, and editor control, not brand-specific visual design.

## Current Baseline

The current system already has a solid foundation:

- A token-driven styling model for spacing, colors, width, radius, shadow, alignment, and some typography controls.
- Responsive values for `base`, `md`, and `lg`.
- Core layout blocks: `Section`, `Container`, `Columns`, `Grid`.
- Basic content blocks: `Text`, `Image`, `Button`.
- A simple way to convert token selections into Tailwind classes at render time.

This is enough for simple page assembly, but it is still closer to a constrained block editor than a builder-grade layout system.

## Main Gap

The system is currently optimized for choosing from a small set of predefined classes. A stronger site builder needs a layout model that can express relationships between items:

- proportions
- spanning
- minimum and maximum sizes
- independent control of parent and child behavior
- positioning and layering
- richer responsive behavior

Right now most layout choices are shallow presets. They do not let an editor shape composition with much precision.

## Missing Capabilities

### 1. Container sizing is too limited

Current controls mostly cover:

- max width presets
- padding
- gap
- background/text color
- radius/shadow
- flex direction and alignment

Missing container sizing controls:

- fixed width and height
- min/max width and min/max height
- viewport-based sizing such as `vh`, `svh`, and percentage-based height
- per-breakpoint size changes beyond a few width presets
- fit-content, fill, and intrinsic sizing modes
- container aspect ratio
- explicit overflow control per axis

Why this matters:

- complex hero layouts often need a media pane to stay `16:9` while adjacent text grows
- cards and promos often need fixed-height or min-height behavior
- editors need to choose whether a block hugs content, fills available space, or caps at a max size

### 2. Columns do not support ratios

The `Columns` block is currently equal-width columns only. That is a major limitation.

Missing ratio controls:

- 50/50, 33/67, 67/33, 25/75, 75/25 presets
- custom fractional splits per breakpoint
- per-column basis or width definitions
- uneven multi-column distributions such as `1fr 2fr 1fr`
- stacking rules for specific breakpoints

Why this matters:

- builder-grade layouts rely heavily on asymmetric columns
- equal columns are rarely enough for marketing pages, editorial layouts, or feature sections

### 3. Grid is missing item-level control

The `Grid` block currently controls:

- column count
- row count
- gap

Missing grid capabilities:

- per-item column span
- per-item row span
- start/end placement
- auto-fit and auto-fill behavior
- `minmax(...)` sizing
- separate row and column gaps everywhere
- dense packing or masonry-style behavior
- named layout presets for common editorial grids

Why this matters:

- without spans, every grid is visually flat
- more advanced section design depends on letting some items become larger feature tiles while others remain smaller

### 4. Parent layout and child layout are conflated

Containers can choose flex direction and alignment, but child items have almost no independent layout behavior.

Missing child-level controls:

- `align-self`
- `justify-self`
- `order`
- grow and shrink
- flex-basis
- per-child width/height rules
- per-child span inside grid layouts

Why this matters:

- advanced builders let editors tune both the container and the item
- otherwise every child behaves identically, which keeps layouts generic

### 5. No positioning or layering system

There is no real support for compositional positioning.

Missing capabilities:

- relative/absolute/sticky positioning
- inset controls
- z-index/layer order
- overlap between sibling elements
- pinned badges, floating cards, callouts, and stacked media/text compositions

Why this matters:

- many modern page sections are not pure document flow
- without positioning tools, the editor cannot recreate more designed layouts

### 6. Ratios are isolated to images instead of being a general layout primitive

Only the image block exposes aspect ratio presets.

Missing ratio use cases:

- ratio on generic containers
- ratio on grid items or cards
- ratio locks for embeds and interactive blocks
- breakpoint-specific ratio changes

Why this matters:

- ratio is a layout primitive, not only a media primitive
- cards, frames, testimonials, galleries, and promo tiles all need it

### 7. Section behavior is too simple

The `Section` block is basically a centered wrapper with horizontal and vertical padding.

Missing section-level controls:

- full bleed versus contained content choices
- split-background sections
- independent content width and background width
- inset content regions
- section min-height
- vertical alignment within section height
- background media, overlays, gradients, and layered decoration
- sticky sections or scroll-aware sections

Why this matters:

- strong site builders treat sections as composition systems, not just padded bands

### 8. Breakpoint model is minimal

Responsive styling currently supports only `base`, `md`, and `lg`.

Missing responsive capabilities:

- more breakpoints
- customizable breakpoint definitions
- device-specific presets
- breakpoint visibility controls
- responsive booleans and enums beyond current select/number support

Why this matters:

- builder-grade editing often depends on finer control between mobile, tablet, desktop, and wide desktop

### 9. Styling inputs are too narrow

Responsive fields currently support only select and number. The token system is also biased toward predefined Tailwind classes.

Missing field/input types:

- length fields with units like `px`, `rem`, `%`, `vw`, `vh`
- paired dimensions
- four-sided spacing controls
- toggle groups
- border controls
- opacity controls
- background controls
- gradient controls
- per-breakpoint visibility
- more advanced color selection

Why this matters:

- many layout requirements do not map cleanly to a fixed token list
- ratios and `minmax`-style sizing need value types richer than token lookups

### 10. No reusable layout primitives beyond a few generic blocks

The current block set is small and generic. More capable builders usually expose higher-level primitives as first-class components or variants.

Missing primitives:

- stack
- inline row
- cluster
- sidebar
- split hero
- media object
- feature grid
- cards with media/content/footer regions
- carousel or gallery layouts
- banner and announcement strips

Why this matters:

- not every layout problem should be solved from raw `Section` plus `Container`
- good builders offer both low-level control and high-level section patterns

### 11. Editor experience is not yet layout-oriented

Even if the render layer becomes more capable, the editor still needs tools that make layout editing practical.

Missing UX:

- visual resize handles
- drag-to-span controls in grids
- column ratio presets shown visually
- breakpoint preview tied directly to block settings
- layout presets that can be applied and then customized
- better field grouping for spacing, sizing, alignment, and positioning
- block outlines and drop-zone visualization for nested layouts

Why this matters:

- a builder is not only a render engine
- layout power that only exists in side-panel fields remains hard to use

## Architectural Gaps

These are not just missing tokens. The model itself is narrow.

### Token-only layout expression

The current system is strongest when a style can be represented as:

- pick one token
- maybe vary it at `md` and `lg`
- emit Tailwind classes

That works for simple spacing and color choices, but it breaks down for:

- ratios
- arbitrary track definitions
- min/max sizing
- mixed-unit values
- item spans and placement
- overlaps and layered compositions

### Parent-driven rendering

Current layout blocks mostly render children as undifferentiated slots. More advanced builders need metadata on individual children, not just the parent wrapper.

Examples:

- a grid child should know its span
- a column child should know its basis or ratio
- a card child may need alignment and order overrides

### Limited separation between semantic structure and visual system

The system has HTML tag choice for `Container`, but not a broader model for:

- section structure
- inner wrapper structure
- media/background layers
- decorative layers
- content region alignment

Complex builders usually model those layers directly.

## Priority Roadmap

### Phase 1: unlock layout basics

Highest-value additions:

- ratio-based columns
- generic container aspect ratio
- min/max width and height controls
- per-axis overflow
- section min-height and vertical alignment
- child grow/shrink/basis controls

This would remove the biggest current constraints without changing the whole system.

### Phase 2: make grid and child placement powerful

Next additions:

- per-item grid span
- per-item order and self-alignment
- row span and placement
- separate row and column gap controls everywhere
- richer responsive breakpoint support

This is where layouts start to feel intentionally designed rather than evenly distributed.

### Phase 3: add positioning and advanced section composition

Then add:

- absolute and sticky positioning
- z-index and overlap controls
- background media and overlays for sections/containers
- split and layered section presets

This closes much of the gap with modern marketing-site builders.

### Phase 4: improve editor ergonomics and reusable patterns

Finally:

- visual controls for ratios and spans
- saved presets and variants
- richer layout primitives and section templates
- stronger grouping and discoverability in the editor

This is what turns a technically capable system into a usable site builder.

## Recommended Direction

To rival a more complex builder, the system should evolve from:

- a token picker for a few wrapper classes

toward:

- a layout schema with explicit parent and child sizing rules
- richer responsive value types
- generic composition primitives for ratio, span, placement, and layering
- editor UI that makes those powers understandable

In practical terms, the next version should treat the following as first-class primitives:

- size
- ratio
- span
- basis
- alignment
- order
- overflow
- position
- layer

Until those exist, the editor will remain good for simple stacked page assembly but not for more designed, asymmetrical, builder-style layouts.
