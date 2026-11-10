export const responsiveBreakpoints = ["phone", "md", "lg"] as const;

export type ResponsiveBreakpoint = (typeof responsiveBreakpoints)[number];

type ResponsiveOverrideBreakpoint = Exclude<ResponsiveBreakpoint, "phone">;

export type ResponsiveValue<T> = {
  phone: T;
} & Partial<Record<ResponsiveOverrideBreakpoint, T>>;

export function setAt<T>(
  value: ResponsiveValue<T>,
  breakpoint: ResponsiveBreakpoint,
  newVal: T | undefined,
): ResponsiveValue<T> {
  if (breakpoint === "phone") {
    if (newVal === undefined) {
      throw new Error("Phone value cannot be undefined");
    }

    return {
      ...value,
      phone: newVal,
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
  if (breakpoint === "phone" || value[breakpoint] === undefined) {
    return value;
  }

  const { [breakpoint]: _removed, ...nextValue } = value;
  return nextValue as ResponsiveValue<T>;
}
