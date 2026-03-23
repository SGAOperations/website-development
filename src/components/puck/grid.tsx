import type { ComponentConfig } from "@puckeditor/core";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { fields, gapVariants, type Spacing } from "@/lib/puck/tokens";

const columnValues = ["1", "2", "3", "4", "5", "6"] as const;
type Columns = (typeof columnValues)[number];

const rowValues = ["auto", "1", "2", "3", "4", "5", "6"] as const;
type Rows = (typeof rowValues)[number];

const gridVariants = cva("grid w-full", {
  variants: {
    columns: {
      "1": "grid-cols-1",
      "2": "grid-cols-2",
      "3": "grid-cols-3",
      "4": "grid-cols-4",
      "5": "grid-cols-5",
      "6": "grid-cols-6",
    },
    rows: {
      auto: "",
      "1": "grid-rows-1",
      "2": "grid-rows-2",
      "3": "grid-rows-3",
      "4": "grid-rows-4",
      "5": "grid-rows-5",
      "6": "grid-rows-6",
    },
    gap: gapVariants,
  },
  defaultVariants: {
    columns: "3",
    rows: "auto",
    gap: "md",
  },
});

type GridProps = {
  content: any;
  columns: Columns;
  rows: Rows;
  gap: Spacing;
};

export const Grid: ComponentConfig<GridProps> = {
  label: "Grid",
  fields: {
    content: { type: "slot" },
    columns: {
      type: "select",
      label: "Columns",
      options: columnValues.map((v) => ({ label: v, value: v })),
    },
    rows: {
      type: "select",
      label: "Rows",
      options: rowValues.map((v) => ({
        label: v === "auto" ? "Auto" : v,
        value: v,
      })),
    },
    gap: fields.gap(),
  },
  defaultProps: {
    columns: "3",
    rows: "auto",
    gap: "md",
  } as GridProps,
  render: ({ content: Content, columns, rows, gap }) => {
    return (
      <Content
        className={cn(gridVariants({ columns, rows, gap }))}
        minEmptyHeight="200px"
      />
    );
  },
};
