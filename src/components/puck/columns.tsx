import type { ComponentConfig } from "@puckeditor/core";
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import { columnCount, gap, type ColumnCount, type Spacing } from "@/lib/puck/tokens";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { getGridClassName, getMaxCols } from "@/lib/puck/layout";

type SlotKey = `column${ColumnCount}`;

type ColumnsProps = {
  [K in SlotKey]: any;
} & {
  columns: ResponsiveValue<ColumnCount>;
  gap: ResponsiveValue<Spacing>;
};

const slotField = { type: "slot" } as const;
const columnSlotKeys = columnCount.options.map(
  ({ value }) => `column${value}` as SlotKey,
);

const columnSlotFields = Object.fromEntries(
  columnSlotKeys.map((key) => [key, slotField]),
) as Record<SlotKey, typeof slotField>;

const props = defineProps({
  columns: responsive.token(columnCount, { label: "Columns", default: { base: "1", md: "2" } }),
  gap: responsive.token(gap, { label: "Gap", default: "md" }),
});

export const Columns: ComponentConfig<ColumnsProps> = {
  label: "Columns",
  fields: { ...columnSlotFields, ...props.fields },
  defaultProps: props.defaultProps as ColumnsProps,
  // Hide column slot fields that exceed the selected column count,
  // so the editor sidebar only shows slots that are actually rendered.
  resolveFields: (data) => {
    const f = { ...Columns.fields! };
    const columns = data.props.columns ?? { base: "1", md: "2" };
    const maxCols = getMaxCols(columns);

    for (const [index, key] of columnSlotKeys.entries()) {
      f[key] = { ...f[key], visible: index < maxCols };
    }

    return f;
  },
  render: ({ columns, gap, ...slots }) => {
    const maxCols = getMaxCols(columns);
    const slotMap = slots as Record<SlotKey, any>;

    return (
      <div className={getGridClassName({ columns, rows: { base: "auto" }, gap })}>
        {columnSlotKeys.slice(0, maxCols).map((key) => {
          const Col = slotMap[key];
          return Col && <Col key={key} />;
        })}
      </div>
    );
  },
};
