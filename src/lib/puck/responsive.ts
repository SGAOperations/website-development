export const responsiveBreakpoints = ["base", "md", "lg"] as const;

export type ResponsiveBreakpoint = (typeof responsiveBreakpoints)[number];

type ResponsiveOverrideBreakpoint = Exclude<ResponsiveBreakpoint, "base">;

export type ResponsiveValue<T> = {
  base: T;
} & Partial<Record<ResponsiveOverrideBreakpoint, T>>;

// Returns the effective value at a breakpoint, falling back to the nearest smaller breakpoint.
export function resolveAt<T>(
  value: ResponsiveValue<T>,
  breakpoint: ResponsiveBreakpoint,
): T {
  const start = responsiveBreakpoints.indexOf(breakpoint);

  for (let index = start; index >= 0; index -= 1) {
    const breakpointValue = value[responsiveBreakpoints[index]];

    if (breakpointValue !== undefined) {
      return breakpointValue;
    }
  }

  return value.base;
}

export function hasOverride<T>(value: ResponsiveValue<T>): boolean {
  return responsiveBreakpoints.some(
    (bp) => bp !== "base" && value[bp] !== undefined,
  );
}

export function map<T, U>(
  value: ResponsiveValue<T>,
  fn: (value: T, breakpoint: ResponsiveBreakpoint) => U,
): ResponsiveValue<U> {
  const mapped: ResponsiveValue<U> = {
    base: fn(value.base, "base"),
  };

  for (const bp of responsiveBreakpoints) {
    if (bp === "base") {
      continue;
    }

    const breakpointValue = value[bp];

    if (breakpointValue !== undefined) {
      mapped[bp] = fn(breakpointValue, bp);
    }
  }

  return mapped;
}

export function setAt<T>(
  value: ResponsiveValue<T>,
  breakpoint: ResponsiveBreakpoint,
  newVal: T | undefined,
): ResponsiveValue<T> {
  if (breakpoint === "base") {
    if (newVal === undefined) {
      throw new Error("Base value cannot be undefined");
    }

    return {
      ...value,
      base: newVal,
    };
  }

  if (newVal === undefined) {
    return clearOverride(value, breakpoint);
  }

  return {
    ...value,
    [breakpoint]: newVal,
  };
}

function clearOverride<T>(
  value: ResponsiveValue<T>,
  breakpoint: ResponsiveBreakpoint,
): ResponsiveValue<T> {
  if (breakpoint === "base" || value[breakpoint] === undefined) {
    return value;
  }

  const { [breakpoint]: _removed, ...nextValue } = value;
  return nextValue as ResponsiveValue<T>;
}
