import type { CustomField, Slot } from "@puckeditor/core";
import type { Token, TokenOption } from "@/lib/puck/tokens";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import {
  responsiveField,
  responsiveFieldDescriptor,
  type ResponsiveNumberFieldDescriptor,
  type ResponsiveSelectFieldDescriptor,
} from "@/components/puck/fields/responsive";

// -- Prop spec shape ----------------------------------------------------------

type PropSpec<F, V> = { field: F; defaultValue: V };

type FieldsOf<S> = { [K in keyof S]: S[K] extends PropSpec<infer F, any> ? F : never };
type DefaultsOf<S> = { [K in keyof S]: S[K] extends PropSpec<any, infer V> ? V : never };

// -- Builder: responsive fields -----------------------------------------------

export const responsive = {
  select<T extends string>(
    token: Token<T>,
    opts: { label: string; default?: NoInfer<T | ResponsiveValue<T>> },
  ): PropSpec<CustomField<ResponsiveValue<T>>, ResponsiveValue<T>> {
    return buildResponsiveFieldProp(
      responsiveFieldDescriptor.select(token.options),
      opts.label,
      opts.default ?? token.defaultValue,
    );
  },

  number(
    opts: {
      label: string;
      default: NoInfer<number | ResponsiveValue<number>>;
    } & Omit<ResponsiveNumberFieldDescriptor, "kind">,
  ): PropSpec<CustomField<ResponsiveValue<number>>, ResponsiveValue<number>> {
    return buildResponsiveFieldProp(
      responsiveFieldDescriptor.number({ min: opts.min, max: opts.max, step: opts.step }),
      opts.label,
      opts.default,
    );
  },
};

function buildResponsiveFieldProp<T extends string>(
  descriptor: ResponsiveSelectFieldDescriptor<T>,
  label: string,
  defaultValue: NoInfer<T | ResponsiveValue<T>>,
): PropSpec<CustomField<ResponsiveValue<T>>, ResponsiveValue<T>>;
function buildResponsiveFieldProp(
  descriptor: ResponsiveNumberFieldDescriptor,
  label: string,
  defaultValue: NoInfer<number | ResponsiveValue<number>>,
): PropSpec<CustomField<ResponsiveValue<number>>, ResponsiveValue<number>>;
function buildResponsiveFieldProp<T extends string>(
  descriptor: ResponsiveSelectFieldDescriptor<T> | ResponsiveNumberFieldDescriptor,
  label: string,
  defaultValue: NoInfer<T | ResponsiveValue<T>> | NoInfer<number | ResponsiveValue<number>>,
): PropSpec<any, any> {
  return {
    field: responsiveField(descriptor as any, label),
    defaultValue: resolveResponsiveDefaultValue(defaultValue as any),
  };
}

function resolveResponsiveDefaultValue<T extends string | number>(
  value: NoInfer<T | ResponsiveValue<T>>,
): ResponsiveValue<T> {
  return value !== undefined && typeof value === "object"
    ? value as ResponsiveValue<T>
    : { base: value } as ResponsiveValue<T>;
}

// -- Builder: static fields ---------------------------------------------------

type FieldDescriptor = { type: "select" | "radio"; label: string; options: TokenOption[] };

export const field = {
  slot(descriptor?: { allow?: string[]; disallow?: string[] }): PropSpec<{ type: "slot" } & typeof descriptor, Slot> {
    return {
      field: { type: "slot" as const, ...descriptor },
      defaultValue: [] as Slot,
    };
  },

  select<K extends string>(
    token: Token<K>,
    opts: { label: string; default?: NoInfer<K> },
  ): PropSpec<FieldDescriptor, K> {
    return {
      field: { type: "select", label: opts.label, options: token.options },
      defaultValue: (opts.default ?? token.defaultValue) as K,
    };
  },

  radio<K extends string>(
    token: Token<K>,
    opts: { label: string; default?: NoInfer<K> },
  ): PropSpec<FieldDescriptor, K> {
    return {
      field: { type: "radio", label: opts.label, options: token.options },
      defaultValue: (opts.default ?? token.defaultValue) as K,
    };
  },
  
  raw: fieldRaw,
};

function fieldRaw<const D, T>(descriptor: D, defaultValue: T): PropSpec<D, T>;
function fieldRaw<const D, T>(descriptor: D, defaultValue: T): PropSpec<D, T> {
  return {
    field: descriptor,
    defaultValue,
  };
}

// -- defineProps ---------------------------------------------------------------

export function defineProps<S extends Record<string, PropSpec<any, any>>>(
  spec: S,
): { fields: FieldsOf<S>; defaultProps: DefaultsOf<S> } {
  const fields = {} as Record<string, unknown>;
  const defaultProps = {} as Record<string, unknown>;

  for (const [key, entry] of Object.entries(spec)) {
    fields[key] = entry.field;
    defaultProps[key] = entry.defaultValue;
  }

  return { fields, defaultProps } as { fields: FieldsOf<S>; defaultProps: DefaultsOf<S> };
}
