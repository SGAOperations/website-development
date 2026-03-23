import type { ComponentConfig } from "@puckeditor/core";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { fields, gapVariants, type Spacing } from "@/lib/puck/tokens";

const columnValues = ["2", "3", "4", "5", "6"] as const;
type ColumnCount = (typeof columnValues)[number];

const columnsVariants = cva("grid", {
  variants: {
    columns: {
      "2": "grid-cols-1 md:grid-cols-2",
      "3": "grid-cols-1 md:grid-cols-3",
      "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      "5": "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
      "6": "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
    },
    gap: gapVariants,
  },
  defaultVariants: {
    columns: "2",
    gap: "md",
  },
});

type ColumnsProps = {
  column1: any;
  column2: any;
  column3: any;
  column4: any;
  column5: any;
  column6: any;
  columns: ColumnCount;
  gap: Spacing;
};

const slotField = { type: "slot" as const };

export const Columns: ComponentConfig<ColumnsProps> = {
  label: "Columns",
  fields: {
    column1: slotField,
    column2: slotField,
    column3: slotField,
    column4: slotField,
    column5: slotField,
    column6: slotField,
    columns: {
      type: "select",
      label: "Columns",
      options: columnValues.map((v) => ({ label: v, value: v })),
    },
    gap: fields.gap(),
  },
  defaultProps: {
    columns: "2",
    gap: "md",
  } as ColumnsProps,
  resolveFields: (data) => {
    const f = { ...Columns.fields! };
    const colCount = parseInt(data.props.columns ?? "2", 10);

    f.column1 = { ...f.column1, visible: colCount >= 1 };
    f.column2 = { ...f.column2, visible: colCount >= 2 };
    f.column3 = { ...f.column3, visible: colCount >= 3 };
    f.column4 = { ...f.column4, visible: colCount >= 4 };
    f.column5 = { ...f.column5, visible: colCount >= 5 };
    f.column6 = { ...f.column6, visible: colCount >= 6 };

    return f;
  },
  render: ({
    column1: Column1,
    column2: Column2,
    column3: Column3,
    column4: Column4,
    column5: Column5,
    column6: Column6,
    columns,
    gap,
  }) => {
    const colCount = parseInt(columns ?? "2", 10);
    const columnSlots = [Column1, Column2, Column3, Column4, Column5, Column6];

    return (
      <div className={cn(columnsVariants({ columns, gap }))}>
        {columnSlots
          .slice(0, colCount)
          .map((Col, i) => Col && <Col key={i} />)}
      </div>
    );
  },
};
