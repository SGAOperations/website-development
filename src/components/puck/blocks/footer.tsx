import { ComponentConfig, Slot } from '@puckeditor/core';
import React from 'react';
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import { cn } from '@/lib/utils';


type FooterProps = {
    title: string;
    textLines: string;
    buttonSpace: Slot;
    emails: string;
}

const props = defineProps({
    title: field.raw(
        { type: "text", contentEditable: true },
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    ),
    textLines: field.raw(
        { type: "text", contentEditable: true },
        "Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit.",
    ),
    buttonSpace: field.slot(),
    emails: field.raw(
        { type: "text", contentEditable: true },
        "Contact: myname@mydomain.com\nInquiries: myfunding@mydomain.com\nWebmaster: webmaster@mydomain.com"
    ),
});

export const Footer: ComponentConfig<FooterProps> = {
    label: "Footer",
    ...props,
    render: ({title, textLines, buttonSpace: Content, emails}) => {
        return (
            <div className={cn(
                "test-sample-footer"
            )}>
                {title}
            </div>
        );
    }
}