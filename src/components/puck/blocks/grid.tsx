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
  columns: responsive.select(columnCount, { label: "Columns", default: "3" }),
  rows: responsive.select(gridRows, { label: "Rows", default: "auto" }),
  gap: responsive.select(gap, { label: "Gap", default: "md" }),
});

export const Grid: ComponentConfig<GridProps> = {
  label: "Grid",
  inline: true,
  ...props,
  render: ({ content: Content, columns, rows: r, gap, puck }) => {
    if (!Content) {
      return (
        <div
          ref={puck.dragRef}
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
        ref={puck.dragRef}
        className={getGridClassName({ columns, rows: r, gap })}
        minEmptyHeight="200px"
      />
    );
  },
};
