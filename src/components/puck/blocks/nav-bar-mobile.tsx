"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Equal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavRoute } from "@/components/puck/blocks/nav-bar";

const menuListClasses =
  "absolute inset-0 flex flex-col items-center justify-center gap-2 transition-transform duration-500"; // list of menu items
const itemClasses = "flex items-center gap-1 px-3 py-2 text-3xl"; // individual menu item

type MenuState = "closed" | "open" | "closing";

export function NavBarMobile({ routes }: { routes: NavRoute[] }) {
  const [state, setState] = useState<MenuState>("closed");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = state === "open";

  const close = () => setState("closing");

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.target !== e.currentTarget || state !== "closing") return;
    setState("closed");
    setActiveIndex(null);
  };

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={isOpen ? close : () => setState("open")}
        className={cn(
          "relative z-50 transition-colors duration-300 min-[800px]:hidden",
          isOpen && "text-black",
        )}
      >
        {isOpen ? <X className="size-8" /> : <Equal className="size-8" />}
      </button>
      {state !== "closed" && (
        <div
          inert={state === "closing"}
          onAnimationEnd={handleAnimationEnd}
          className={cn(
            "fixed inset-0 z-40 overflow-hidden bg-background text-black duration-300",
            isOpen ? "animate-in fade-in" : "animate-out fill-mode-forwards fade-out",
          )}
        >
          <ul
            inert={activeIndex !== null}
            className={cn(menuListClasses, activeIndex !== null && "-translate-x-full")}
          >
            {routes.map((route, i) => (
              <li
                key={route.label}
                style={{ animationDelay: `${i * 40}ms` }}
                className="duration-500 animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
              >
                {"children" in route ? (
                  <button type="button" onClick={() => setActiveIndex(i)} className={itemClasses}>
                    {route.label}
                    <ChevronRight className="size-5" />
                  </button>
                ) : (
                  <a href={route.href} onClick={close} className={itemClasses}>
                    {route.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
          {routes.map(
            (route, i) =>
              "children" in route && (
                <ul
                  key={route.label}
                  inert={activeIndex !== i}
                  className={cn(menuListClasses, activeIndex !== i && "translate-x-full")}
                >
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveIndex(null)}
                      className={cn(itemClasses, "text-muted-foreground")}
                    >
                      <ChevronLeft className="size-5" />
                      Back
                    </button>
                  </li>
                  {route.children.map((child) => (
                    <li key={child.href}>
                      <a href={child.href} onClick={close} className={itemClasses}>
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ),
          )}
        </div>
      )}
    </>
  );
}
