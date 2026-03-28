import { responsiveBreakpoints, type ResponsiveValue } from "./responsive";

function prefixResponsiveClassNames(prefix: string, className: string): string[] {
  if (!className) {
    return [];
  }

  return className
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => `${prefix}:${token}`);
}

function resolveResponsiveClassNames<T>(
  value: ResponsiveValue<T>,
  classNameFor: (value: T) => string,
): string {
  const classes = responsiveBreakpoints.flatMap((bp) => {
    const breakpointValue = value[bp];

    if (breakpointValue === undefined) {
      return [];
    }

    const className = classNameFor(breakpointValue);

    return bp === "base"
      ? className.split(/\s+/).filter(Boolean)
      : prefixResponsiveClassNames(bp, className);
  });

  return classes.join(" ");
}

export function resolveResponsive<const T extends string | number>(
  value: ResponsiveValue<T>,
  variantMap: Record<T, string>,
): string {
  return resolveResponsiveClassNames(value, (token) => variantMap[token]);
}
