export const responsiveBreakpoints = ["base", "md", "lg"] as const;

export type ResponsiveBreakpoint = (typeof responsiveBreakpoints)[number];

type ResponsiveOverrideBreakpoint = Exclude<ResponsiveBreakpoint, "base">;

export type ResponsiveValue<T> = {
  base: T;
} & Partial<Record<ResponsiveOverrideBreakpoint, T>>;

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
