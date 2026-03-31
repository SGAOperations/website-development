# Styling System

Components in the Puck editor are styled through **design tokens** — named choices that map to arbitrary properties, but mostly Tailwind classes. Editors pick tokens from dropdowns; the system turns those choices into class names at render time.

Any token can be made **responsive**, letting editors pick different values per breakpoint (base / tablet / desktop). Unset breakpoints inherit from the nearest smaller one.

## Core concepts

### 1. Tokens

A token is a constrained set of options. `defineToken` creates one (`src/lib/puck/tokens.ts`). There are two forms:

**Class tokens** map each key to a Tailwind class string:

```ts
const padding = defineToken({
  sm: { label: "Small", classes: "p-2" },
  md: { label: "Medium", classes: "p-4" },
});

padding.classes // → { sm: "p-2", md: "p-4" }
```

You can add extra columns beyond `classes` — any property besides `label` becomes a `Record<K, V>` on the token:

```ts
const spacing = defineToken({
  sm: { label: "Small", classes: "gap-2", px: 8 },
  lg: { label: "Large", classes: "gap-6", px: 24 },
});

spacing.classes // → { sm: "gap-2", lg: "gap-6" }
spacing.px      // → { sm: 8, lg: 24 }
```

**Plain tokens** use simple string values (key = value, string = editor label). Useful when there are no Tailwind classes to map to:

```ts
const variant = defineToken({ default: "Default", outline: "Outline" });

variant.options      // → [{ value: "default", label: "Default" }, ...]
variant.defaultValue // → "default"
```

The first key is the default unless you pass an explicit second argument:

```ts
const size = defineToken({ sm: "Small", md: "Medium", lg: "Large" }, "md");
size.defaultValue // → "md"
```

Use `TokenValue<T>` to extract a token's value union for type annotations:

```ts
type Spacing = TokenValue<typeof padding>; // "sm" | "md"
```

### 2. Responsive values

A `ResponsiveValue<T>` has a required `base` and optional `md` / `lg` overrides (`src/lib/puck/responsive.ts`):

```ts
type ResponsiveValue<T> = { base: T } & Partial<Record<"md" | "lg", T>>;

{ base: "sm" }                        // same at all sizes
{ base: "sm", md: "md", lg: "lg" }    // changes at each breakpoint
{ base: "sm", lg: "lg" }              // skip md — it inherits from base
```

**Helper functions** for working with responsive values:

| Function | Purpose |
|---|---|
| `resolveAt(value, breakpoint)` | Returns the effective value at a breakpoint, falling back to the nearest smaller one. `resolveAt({ base: "sm", lg: "lg" }, "md")` → `"sm"` |
| `hasOverride(value)` | Returns `true` if any non-base overrides are set |
| `map(value, fn)` | Transforms each set breakpoint. `map(value, (v) => v.toUpperCase())` |
| `setAt(value, breakpoint, newVal)` | Returns a new `ResponsiveValue` with one breakpoint changed. Pass `undefined` to clear an override |

These helpers are for component logic — see [Rendering](#4-rendering) for how responsive values become Tailwind classes.

### 3. Props

`defineProps` wires tokens to Puck editor fields (`src/lib/puck/define-props.ts`). It returns `{ fields, defaultProps }` to spread onto a `ComponentConfig`.

There are two builder namespaces:

```ts
const props = defineProps({
  // Slot — a Puck drop zone for child components
  content: field.slot(),

  // Static select / radio — token-backed, single value
  radius:  field.select(radius, { label: "Corners" }),
  layout:  field.radio(layout, { label: "Layout" }),

  // Responsive — per-breakpoint picker, also token-backed
  padding: responsive.select(padding, { label: "Padding" }),

  // Responsive number — per-breakpoint numeric input
  columns: responsive.number({
    label: "Columns",
    default: { base: 1, md: 2 },
    min: 1,
    max: 6,
    step: 1,
  }),

  // Raw — any Puck field descriptor, for things tokens don't cover
  url:     field.raw({ type: "text", label: "URL" }, ""),
});
```

**Defaults.** Every builder falls back to the token's first key if no `default` is given. You can override with a scalar or a full responsive object:

```ts
responsive.select(columnCount, { label: "Columns", default: "3" })
responsive.select(columnCount, { label: "Columns", default: { base: "1", md: "3" } })
responsive.number({ label: "Rows", default: 2, min: 1, max: 6, step: 1 })
responsive.number({ label: "Rows", default: { base: 1, md: 3 } })
```

**Slots** accept an optional allow/disallow list to restrict which child components can be dropped in:

```ts
field.slot({ allow: ["Card", "Button"] })
field.slot({ disallow: ["Section"] })
```

The same token definition works for both static and responsive use. Numeric responsive fields do not need a token.

### Responsive field architecture

Responsive field descriptors are built on the server and rendered on the client, so the implementation is split intentionally:

- Shared kind definitions live in `src/lib/puck/fields/responsive/kinds/*/shared.ts`.
- Client renderers live in `src/lib/puck/fields/responsive/kinds/*/client.tsx`.
- `src/lib/puck/fields/responsive/index.tsx` is the server-safe wrapper that turns a serializable descriptor into a Puck custom field.
- `src/lib/puck/fields/responsive/client.tsx` is the client-only registry that maps `descriptor.kind` to the right renderer.
- `src/lib/puck/fields/responsive/frame.tsx` owns the shared breakpoint UI; kind-specific controls only deal with their own value format.

This keeps the descriptor shape and the renderer associated by kind without pushing client code across the server boundary.

To add a new responsive field kind:

1. Add `shared.ts` and `client.tsx` under `src/lib/puck/fields/responsive/kinds/<kind>/`.
2. Export the descriptor factory and type from `src/lib/puck/fields/responsive/kinds/index.ts`.
3. Register the client component in `src/lib/puck/fields/responsive/kinds/registry.tsx`.
4. Optionally add a convenience builder in `src/lib/puck/define-props.ts`.

### 4. Rendering

Static tokens look up the class map directly. Responsive tokens go through `resolveResponsive` (`src/lib/puck/responsive-tailwind.ts`), which prefixes each class with its breakpoint:

```ts
// Static — direct lookup
radius.classes[r]             // → "rounded-md"

// Responsive — produces prefixed classes for each set breakpoint
resolveResponsive(padding, paddingToken.classes)
// { base: "sm", md: "lg" } → "p-2 md:p-6"
```

Multi-class values get each utility prefixed individually:
`"grid-rows-2 auto-rows-[0] overflow-hidden"` → `"md:grid-rows-2 md:auto-rows-[0] md:overflow-hidden"`

Combine everything with `cn()` (re-exported from `src/lib/utils`):

```ts
const classes = cn(
  "w-full",
  bgColor.classes[bg],           // static
  resolveResponsive(py, paddingY.classes),  // responsive
);
```

Responsive numeric props stay as data. Use `resolveAt(...)` or your own component logic when they need to influence layout or behavior; they do not go through `resolveResponsive(...)`.

## Tailwind source hints

Because `resolveResponsive` builds prefixed class names like `md:p-4` at runtime, Tailwind's scanner never sees them in source. Every responsive token needs a corresponding `@source inline(...)` directive in `src/app/styles.css`:

```css
@source inline("{md:,lg:,}{p,px,py}-{0,1,2,4,6,8,12}");
@source inline("{md:,lg:,}columns-{1,2,3,4}");
```

Static tokens don't need this — their class strings appear literally in `tokens.ts` and are picked up by the scanner automatically.

## Creating a new component

This section walks through building a component from scratch.

### Step 1 — Define or reuse tokens

Check `src/lib/puck/tokens.ts` for existing tokens before creating new ones. The file already exports tokens for padding, gap, colors, radius, shadow, alignment, layout, width, columns, and grid rows.

If you need a new token, add it to `tokens.ts` and export a type alias:

```ts
export const fontSize = defineToken({
  sm:   { label: "Small",  classes: "text-sm" },
  base: { label: "Base",   classes: "text-base" },
  lg:   { label: "Large",  classes: "text-lg" },
});

export type FontSize = TokenValue<typeof fontSize>;
```

### Step 2 — Define the props type and field spec

Write a `Props` type that mirrors the field spec. Use `Slot` for drop zones, `ResponsiveValue<T>` for responsive fields, and the token's value type for static fields:

```ts
import type { ComponentConfig, Slot } from "@puckeditor/core";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import { padding, bgColor, type Spacing, type Color } from "@/lib/puck/tokens";

type CardProps = {
  content: Slot;
  padding: ResponsiveValue<Spacing>;
  columns: ResponsiveValue<number>;
  bgColor: Color;
  title: string;
};

const props = defineProps({
  content: field.slot(),
  padding: responsive.select(padding, { label: "Padding", default: "md" }),
  columns: responsive.number({ label: "Columns", default: { base: 1, md: 2 }, min: 1, max: 4, step: 1 }),
  bgColor: field.select(bgColor, { label: "Background" }),
  title: field.raw({ type: "text", label: "Title" }, ""),
});
```

### Step 3 — Export the component config

Spread `props` onto the config and destructure in `render`. Use `resolveResponsive` for responsive token props, `resolveAt` or component logic for responsive numeric props, and direct `token.classes[value]` lookups for static ones:

```ts
import { resolveAt } from "@/lib/puck/responsive";
import { resolveResponsive } from "@/lib/puck/responsive-tailwind";
import { cn } from "@/lib/utils";

export const Card: ComponentConfig<CardProps> = {
  label: "Card",
  ...props,
  render: ({ content: Content, padding: pad, columns, bgColor: bg, title }) => (
    <div
      className={cn(bgColor.classes[bg], resolveResponsive(pad, padding.classes))}
      style={{ columns: resolveAt(columns, "base") }}
    >
      {title && <h3>{title}</h3>}
      {Content && <Content />}
    </div>
  ),
};
```

### Step 4 — Register the component

Add the export to your Puck config so the editor can use it.

### Step 5 — Add Tailwind source hints (responsive tokens only)

If your component introduces responsive tokens with class patterns not already covered in `src/app/styles.css`, add a `@source inline(...)` directive. Check what's already there first — common patterns like padding and gap are already covered.

### Checklist

- Token exists in `tokens.ts` (or you added a new one with a `type` alias)
- Props type matches the `defineProps` spec
- `...props` is spread on the config (this includes both `fields` and `defaultProps`)
- Static tokens resolved via `token.classes[value]`
- Responsive tokens resolved via `resolveResponsive(value, token.classes)`
- `@source inline(...)` added for any new responsive class patterns
