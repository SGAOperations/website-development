import type { ComponentConfig, Slot } from "@puckeditor/core";
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { columnCount, gap, gridRows, type ColumnCount, type Spacing, type GridRows } from "@/lib/puck/tokens";
import { getGridClassName } from "@/lib/puck/layout";

type GridProps = {
  content: Slot;
  columns: ResponsiveValue<ColumnCount>;
  rows: ResponsiveValue<GridRows>;
  gap: ResponsiveValue<Spacing>;
};

const props = defineProps({
  content: field.slot(),
  columns: responsive.token(columnCount, { label: "Columns", default: "3" }),
  rows: responsive.token(gridRows, { label: "Rows", default: "auto" }),
  gap: responsive.token(gap, { label: "Gap", default: "md" }),
});

export const Grid: ComponentConfig<GridProps> = {
  label: "Grid",
  ...props,
  render: ({ content: Content, columns, rows: r, gap }) => {
    if (!Content) {
      return (
        <div
          className={getGridClassName({
            columns,
            rows: r,
            gap,
            empty: true,
          })}
        />
      );
    }

    return (
      <Content
        className={getGridClassName({ columns, rows: r, gap })}
        minEmptyHeight="200px"
      />
    );
  },
};
