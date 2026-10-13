export const responsiveBreakpoints = ["base", "md", "lg"] as const;

export type ResponsiveBreakpoint = (typeof responsiveBreakpoints)[number];

/**
 * Every breakpoint always carries its own value: breakpoints are configured
 * independently and never roll up from a smaller one.
 */
export type ResponsiveValue<T> = Record<ResponsiveBreakpoint, T>;

/** Shape of responsive values persisted before breakpoints became mandatory. */
export type PartialResponsiveValue<T> = { base: T } & Partial<ResponsiveValue<T>>;

export function setAt<T>(
  value: ResponsiveValue<T>,
  breakpoint: ResponsiveBreakpoint,
  newVal: T,
): ResponsiveValue<T> {
  if (newVal === undefined) {
    throw new Error(`Value for breakpoint "${breakpoint}" cannot be undefined`);
  }

  return {
    ...value,
    [breakpoint]: newVal,
  };
}

/** Expands a single value into the same value at every breakpoint. */
export function expandResponsiveValue<T>(value: T): ResponsiveValue<T> {
  return Object.fromEntries(
    responsiveBreakpoints.map((bp) => [bp, value]),
  ) as ResponsiveValue<T>;
}

/**
 * Fills in any breakpoint missing from legacy content with the base value, so
 * every control renders a concrete value.
 */
export function fillResponsiveValue<T>(
  value: PartialResponsiveValue<T>,
): ResponsiveValue<T> {
  return Object.fromEntries(
    responsiveBreakpoints.map((bp) => [bp, value[bp] ?? value.base]),
  ) as ResponsiveValue<T>;
}
