import type { CustomField } from "@puckeditor/core";
import type { Token, TokenOption } from "@/lib/puck/tokens";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { responsiveField } from "@/components/puck/fields/responsive-field";
import { selectAdapter } from "@/components/puck/fields/responsive-token-field";

// -- Prop spec shape ----------------------------------------------------------

type PropSpec<F, V> = { field: F; defaultValue: V };

type FieldsOf<S> = { [K in keyof S]: S[K] extends PropSpec<infer F, any> ? F : never };
type DefaultsOf<S> = { [K in keyof S]: S[K] extends PropSpec<any, infer V> ? V : never };

// -- Builder: responsive tokens -----------------------------------------------

export const responsive = {
  token<T extends string>(
    token: Token<T>,
    opts: { label: string; default?: NoInfer<T | ResponsiveValue<T>> },
  ): PropSpec<CustomField<ResponsiveValue<T>>, ResponsiveValue<T>> {
    const defaultValue: ResponsiveValue<T> =
      opts.default !== undefined && typeof opts.default === "object"
        ? opts.default as ResponsiveValue<T>
        : { base: (opts.default ?? token.defaultValue) } as ResponsiveValue<T>;

    return {
      field: responsiveField(selectAdapter<T>(token.options), opts.label),
      defaultValue,
    };
  },
};

// -- Builder: static fields ---------------------------------------------------

type FieldDescriptor = { type: "select" | "radio"; label: string; options: TokenOption[] };

export const field = {
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

function fieldRaw<const D>(descriptor: D): PropSpec<D, undefined>;
function fieldRaw<const D, T>(descriptor: D, defaultValue: T): PropSpec<D, T>;
function fieldRaw<const D, T>(descriptor: D, defaultValue?: T): PropSpec<D, T | undefined> {
  return {
    field: descriptor,
    defaultValue: defaultValue as T | undefined,
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
