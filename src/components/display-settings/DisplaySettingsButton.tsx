"use client";

import { useId } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  contrastOptions,
  motionOptions,
  textSizeOptions,
  themeOptions,
  type DisplaySettings,
} from "@/lib/display-settings";
import { useDisplaySettings } from "./DisplaySettingsProvider";

const labels: Record<string, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
  standard: "Standard",
  more: "More",
  full: "Full",
  reduce: "Reduced",
};

function OptionGroup<K extends keyof DisplaySettings>({
  setting,
  legend,
  hint,
  options,
  format = (value) => labels[value],
}: {
  setting: K;
  legend: string;
  hint: string;
  options: readonly DisplaySettings[K][];
  format?: (value: DisplaySettings[K]) => string;
}) {
  const { settings, update } = useDisplaySettings();
  const name = useId();
  const hintId = useId();

  return (
    <fieldset aria-describedby={hintId} className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          // Native radios (hidden visually, not from assistive tech) give arrow-key navigation for free.
          <label
            key={option}
            className="inline-flex min-h-9 min-w-12 cursor-pointer items-center justify-center rounded-full border border-input px-3 text-sm transition-colors hover:bg-muted has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:ring-3 has-focus-visible:ring-ring"
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={settings[setting] === option}
              onChange={() => update({ [setting]: option } as Partial<DisplaySettings>)}
              className="sr-only"
            />
            {format(option)}
          </label>
        ))}
      </div>
      <p id={hintId} className="text-xs text-muted-foreground">
        {hint}
      </p>
    </fieldset>
  );
}

export function DisplaySettingsButton() {
  const { reset } = useDisplaySettings();

  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="ghost" size="icon" title="Display settings" aria-label="Display settings" />}
      >
        <SlidersHorizontal />
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Display settings</DialogTitle>
          <DialogDescription>
            Changes apply straight away and are saved in this browser. They affect the CMS only, not the published
            site or the page preview.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <OptionGroup setting="theme" legend="Theme" options={themeOptions} hint="System follows your device's light or dark mode." />
          <OptionGroup setting="contrast" legend="Contrast" options={contrastOptions} hint="More makes text, borders and focus outlines darker and sharper." />
          <OptionGroup setting="motion" legend="Motion" options={motionOptions} hint="Reduced turns off animations and transitions." />
          <OptionGroup
            setting="textSize"
            legend="Text size"
            options={textSizeOptions}
            format={(value) => `${value}%`}
            hint="Scales all text in the CMS. Browser zoom (Ctrl or ⌘ and +) also enlarges everything else."
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={reset}>
            Reset to system settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
