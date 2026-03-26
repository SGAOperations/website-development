# Styling System

Components are styled through **design tokens** that map editor choices to Tailwind classes. Any token can be made responsive, letting editors pick different values per breakpoint.

## Responsive values

A `ResponsiveValue<T>` has a required `base` and optional `md` / `lg` overrides:

```ts
type ResponsiveValue<T> = { base: T } & Partial<Record<"md" | "lg", T>>;

// Examples:
{ base: "sm" }                        // same at all sizes
{ base: "sm", md: "md", lg: "lg" }    // changes at each breakpoint
{ base: "sm", lg: "lg" }              // skip md — it inherits from base
```

Unset breakpoints inherit from the nearest smaller one.

## Tokens

`defineToken` creates a constrained set of choices. Two forms:

A **class token** maps each key to a Tailwind class string (and optionally any number of extra columns):

```ts
const padding = defineToken({
  sm: { label: "Small", classes: "p-2" },
  md: { label: "Medium", classes: "p-4" },
});

padding.classes // → { sm: "p-2", md: "p-4" }
```

Every property in the spec object besides `label` becomes a `Record<K, V>` on the returned token. The values aren't limited to strings — any type works:

```ts
const spacing = defineToken({
  sm: { label: "Small", classes: "gap-2", px: 8 },
  lg: { label: "Large", classes: "gap-6", px: 24 },
});

spacing.classes // → { sm: "gap-2", lg: "gap-6" }
spacing.px      // → { sm: 8, lg: 24 }
```

A **plain token** uses string values — the key is the value and the string is the editor label. These have no columns and are useful when there are no Tailwind classes to map to (e.g. HTML tag names):

```ts
const tag = defineToken({ div: "<div>", section: "<section>" });

tag.options      // → [{ value: "div", label: "<div>" }, ...]
tag.defaultValue // → "div"
```

When a concept needs multiple CSS properties (e.g. spacing for both padding and gap), define separate tokens:

```ts
const padding = defineToken({ sm: { label: "Small", classes: "p-2" }, ... });
const gap     = defineToken({ sm: { label: "Small", classes: "gap-2" }, ... });
```

## Props

`defineProps` wires tokens to Puck editor fields and returns `{ fields, defaultProps }` to spread onto a `ComponentConfig`.

Three field builders handle different cases:

```ts
const props = defineProps({
  // Static select / radio — token-backed
  radius:  field.select(radius, { label: "Corners" }),
  layout:  field.radio(layout, { label: "Layout" }),

  // Responsive — per-breakpoint picker, also token-backed
  padding: responsive.token(padding, { label: "Padding" }),

  // Raw — any Puck field descriptor, no token needed
  url:     field.raw({ type: "text", label: "URL" }, ""),
  content: field.raw({ type: "slot" }),
});
```

`field.raw` passes any Puck field descriptor through unchanged, so the system isn't limited to tokens — text inputs, slots, number fields, custom fields, etc. all work.

The token definition doesn't change between static and responsive use — only the field builder does.

## Rendering

Static values look up the class map directly. Responsive values go through `resolveResponsive`, which prefixes each Tailwind class with its breakpoint:

```ts
// Static
radius.classes[r]

// Responsive
resolveResponsive(padding, paddingToken.classes)
// { base: "sm", md: "lg" } → "p-2 md:p-6"

resolveResponsive(gap, gapToken.classes)
// { base: "sm", lg: "md" } → "gap-2 lg:gap-4"
```

Multi-class values are split and each utility prefixed individually — `"grid-rows-2 auto-rows-[0] overflow-hidden"` becomes `"md:grid-rows-2 md:auto-rows-[0] md:overflow-hidden"`.

## Putting it together

```ts
// 1. Token defines the choices and their Tailwind classes
const padding = defineToken({ sm: { label: "Small", classes: "p-2" }, ... });

// 2. defineProps wires tokens to editor fields
const props = defineProps({
  padding: responsive.token(padding, { label: "Padding" }),
});

// 3. Render resolves the responsive value to classes
cn(resolveResponsive(padding, paddingToken.classes))
```

`defineProps` only reads `options` + `defaultValue` from a token. The render side only reads `classes`. The two sides never touch each other's data.
