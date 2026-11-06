"use client"

import { useEffect, useState } from "react";
import { FieldLabel } from "@puckeditor/core";

type ColorSelectorProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
};

const isHexColor = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

export default function ColorSelector({
    label,
    value,
    onChange,
    readOnly,
}: ColorSelectorProps) {
    const [textValue, setTextValue] = useState(value);

    useEffect(() => {
        setTextValue(value);
    }, [value]);

    const pickerValue = isHexColor(value) ? value : "#000000";
    
    return (
        <FieldLabel label={label} el="div" readOnly={readOnly}>
            <div>
                <input
                aria-label="Choose color"
                type="color"
                value={pickerValue}
                disabled={readOnly}
                onChange={(event)=>{
                    const nextValue = event.currentTarget.value;
                    setTextValue(nextValue);
                    onChange(nextValue);
                }}
                />

                <input
                aria-label="Hex color"
                type="text"
                value={textValue}
                placeholder="#ff0000"
                disabled={readOnly}
                onChange={(event) => {
                    const nextValue = event.currentTarget.value;
                    setTextValue(nextValue);
                    if(isHexColor(nextValue)){
                        onChange(nextValue);
                    }
                }}
                />
            </div>
        </FieldLabel>
    );
}