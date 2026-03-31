import type { ComponentConfig, Slot, SlotComponent } from "@puckeditor/core";
import { cn } from "@/lib/utils";
import { defineProps, responsive } from "@/lib/puck/define-props";
import { resolveResponsive } from "@/lib/puck/responsive-tailwind";
import { columnCount, columnTemplate, gap as gapToken, type ColumnCount, type ColumnTemplate, type Spacing } from "@/lib/puck/tokens";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { getColumnTemplateStyles, getMaxCols } from "@/lib/puck/layout";

type SlotKey = `column${ColumnCount}`;

type ColumnsProps = {
  [K in SlotKey]: Slot;
} & {
  columns: ResponsiveValue<ColumnTemplate>;
  gap: ResponsiveValue<Spacing>;
};

const slotField = { type: "slot" } as const;
const columnSlotKeys = columnCount.options.map(
  ({ value }) => `column${value}` as SlotKey,
);

const columnSlotFields = Object.fromEntries(
  columnSlotKeys.map((key) => [key, slotField]),
) as Record<SlotKey, typeof slotField>;

const columnSlotDefaults = Object.fromEntries(
  columnSlotKeys.map((key) => [key, [] as Slot]),
) as Record<SlotKey, Slot>;

const props = defineProps({
  columns: responsive.select(columnTemplate, { label: "Template", default: { base: "1", md: "2" } }),
  gap: responsive.select(gapToken, { label: "Gap", default: "md" }),
});

export const Columns: ComponentConfig<ColumnsProps> = {
  label: "Columns",
  fields: { ...columnSlotFields, ...props.fields },
  defaultProps: { ...columnSlotDefaults, ...props.defaultProps },
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
    const slotMap = slots as Record<SlotKey, SlotComponent>;
    const templateStyles = getColumnTemplateStyles(columns);

    return (
      <div
        className={cn("grid w-full", resolveResponsive(gap, gapToken.classes), templateStyles.className)}
        style={templateStyles.style}
      >
        {columnSlotKeys.slice(0, maxCols).map((key) => {
          const Col = slotMap[key];
          return Col && <Col key={key} />;
        })}
      </div>
    );
  },
};
