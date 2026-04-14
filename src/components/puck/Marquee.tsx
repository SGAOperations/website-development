import { ComponentConfig } from "@puckeditor/core";
import React from "react";

type MarqueeItem = {
  text: string;
};

export type MarqueeProps = {
  items?: MarqueeItem[];
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  gap?: number;
  className?: string;
};

export const Marquee: React.FC<MarqueeProps> = ({
  items = [{ text: "sample text" }, { text: "another item" }],
  speed = 20,
  direction = "left",
  pauseOnHover = true,
  gap = 16,
  className = "",
}) => {
  const animationDirection =
    direction === "right" ? "reverse" : "normal";

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div
        className={`flex w-max animate-marquee ${
          pauseOnHover ? "hover:[animation-play-state:paused]" : ""
        }`}
        style={{
          gap: `${gap}px`,
          animationDuration: `${speed}s`,
          animationDirection,
        }}
      >
        <div className="flex shrink-0" style={{ gap: `${gap}px` }}>
          {items.map((item, index) => (
            <span
              key={`first-${index}`}
              className="whitespace-nowrap shrink-0"
            >
              {item.text}
            </span>
          ))}
        </div>

        <div
          className="flex shrink-0"
          style={{ gap: `${gap}px` }}
          aria-hidden="true"
        >
          {items.map((item, index) => (
            <span
              key={`second-${index}`}
              className="whitespace-nowrap shrink-0"
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MarqueeConfig: ComponentConfig<MarqueeProps> = {
  fields: {
    items: {
      type: "array",
      arrayFields: {
        text: { type: "text" },
      },
    },
    speed: { type: "number" },
    direction: {
      type: "select",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    pauseOnHover: {
      type: "radio",
      options: [
        { label: "True", value: true },
        { label: "False", value: false },
      ],
    },
    gap: { type: "number" },
    className: { type: "text" },
  },
  defaultProps: {
    items: [{ text: "sample text" }, { text: "another item" }],
    speed: 20,
    direction: "left",
    pauseOnHover: true,
    gap: 16,
    className: "",
  },
  render: (props) => <Marquee {...props} />,
};

export default Marquee;