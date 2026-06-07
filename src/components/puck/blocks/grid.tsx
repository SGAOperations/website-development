"use client";

import { createUsePuck, type ComponentConfig, Slot } from "@puckeditor/core";
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import type { ResponsiveValue } from "@/lib/puck/responsive";
import { columnCount, gap, gridRows, type ColumnCount, type Spacing, type GridRows } from "@/lib/puck/tokens";
import { cn } from "@/lib/utils";
import { getGridCapacity, getGridClassName } from "@/lib/puck/layout";

const usePuck = createUsePuck();

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
  render: ({ content: Content, columns, rows: r, gap, puck, id }) => {
    const viewportWidth = usePuck((state) => state.appState.ui.viewports.current.width);
    const capacity = getGridCapacity(columns, r, viewportWidth);
    const overflowClassName = `grid-overflow-${id}`;

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

    const className = cn(getGridClassName({ columns, rows: r, gap }), overflowClassName);
    const overflowStyle = capacity !== null
      ? `.${overflowClassName} > [data-puck-component]:nth-child(n + ${capacity + 1}) { display: none; }`
      : null;

    return (
      <div className="w-full">
        {overflowStyle && <style>{overflowStyle}</style>}
        <Content
          ref={puck.dragRef}
          className={className}
          minEmptyHeight="200px"
        />
        {/* Hidden items are visually clamped via injected CSS when capacity is set. */}
      </div>
    );
  },
};
