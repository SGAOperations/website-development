import {Config, ComponentConfig, Slot } from '@puckeditor/core';
import React from 'react';
import { defineProps, responsive, field } from "@/lib/puck/define-props";
import { cn } from '@/lib/utils';
import { 
    bgColor,
    textColor,
    type Color,
    textAlign,
    type TextAlign,
    padding,
    Spacing,
    Layout,
    CrossAxisAlign,
    Justify,
    layout,
    justify,
    crossAxisAlign,
    gap as gapToken,
    layout as layoutToken,
    ColumnCount,
    columnCount,
    gridRows,
    GridRows,
    EmailCount,
    emailCount,
} from '@/lib/puck/tokens';
import { ResponsiveValue } from '@/lib/puck/responsive';
import { resolveResponsive } from '@/lib/puck/responsive-tailwind';


type FooterProps = {
    title: string;
    textLines: string;
    buttonSpace: Slot;
    align: TextAlign;
    titleColor : Color;
    textColor : Color;
    backgroundColor : Color;
    padding : ResponsiveValue<Spacing> 
    layout: Layout;
    gap: ResponsiveValue<Spacing>;
    slotAlign: CrossAxisAlign;
    justify: Justify;
    numEmails: EmailCount;
    email1: string;
    email2: string;
    email3: string;
    email4: string;
    email5: string;
    email6: string;
}

const props = defineProps({
    title: field.raw(
        { type: "text", contentEditable: true},
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    ),
    textLines: field.raw({type: "text", contentEditable: false}, "Lorem ipsum dolor sit amet"),
    buttonSpace: field.slot(),
    align: field.radio(textAlign, { label: "Text align", default: "center" }),
    titleColor : field.select(textColor, {label: "Title Text Color", default: "sga-red"}),
    textColor: field.select(textColor, {label: "Body Text Color", default: "background"}),
    backgroundColor: field.select(bgColor, {label: "Background Color", default: "foreground"}),
    padding: responsive.select(padding, { label: "Padding", default: "md"}),
    layout : field.radio(layout, {label: "Layout", default: "stack"}),
    justify : field.radio(justify, {label: "Justify"}),
    slotAlign : field.radio(crossAxisAlign, {label: "Align items"}),
    gap: responsive.select(gapToken, { label: "Icon Gap", default: "md" }),
    numEmails : field.select(emailCount, {label: "Number of Emails", default: "3"}),
    email1: field.raw({type: "text", contentEditable: true },"Contact: sga@northeastern.edu"),
    email2: field.raw({type: "text", contentEditable: true}, "Media Inquiries: sgaExternalAffairs@northeastern.edu"),
    email3: field.raw({type: "text", contentEditable: true}, "Webmaster: sgaOperations@northeastern.edu"),
    email4: field.raw({type: "text", contentEditable: true},""),
    email5: field.raw({type: "text", contentEditable: true}, ""),
    email6: field.raw({type: "text", contentEditable: true}, "")
});

export const Footer: ComponentConfig<FooterProps> = {
    label: "Footer",
    ...props,
   resolveFields: (data) => ({
    ...props.fields,
    email2: {
        ...props.fields.email2,
        visible: data.props.numEmails >= "2",
    },
    email3: {
        ...props.fields.email2,
        visible: data.props.numEmails >= "3",
    },
    email4: {
        ...props.fields.email2,
        visible: data.props.numEmails >= "4",
    },
    email5: {
        ...props.fields.email2,
        visible: data.props.numEmails >= "5",
    },
    email6: {
        ...props.fields.email2,
        visible: data.props.numEmails >= "6",
    },
   }),

    render: ({ title, textLines, buttonSpace: Content, align, titleColor : tic, textColor : txc, backgroundColor, padding : p, layout : l, gap, slotAlign : s, justify : j, numEmails, email1, email2, email3, email4, email5, email6}) => {
       const slotClasses = cn(
        "slot section",
        layoutToken.classes[l],
        crossAxisAlign.classes[s],
        justify.classes[j],
        resolveResponsive(gap, gapToken.classes),
       );

       const emailClasses = cn(
        "email bit",
        textAlign.classes[align],
        textColor.classes[txc],
        bgColor.classes[backgroundColor],
        resolveResponsive(p, padding.classes),
       );

        return (
            <div style={{display: 'flex', flexDirection: 'column', margin: 0, gap: 0}}>
                <div className={cn(
                    "Title section",
                    textAlign.classes[align],
                    textColor.classes[tic],
                    bgColor.classes[backgroundColor],

                    resolveResponsive(p, padding.classes),
                )}>
                    {title}
                </div>
                <div className={cn(
                    "Text lines section",
                    textAlign.classes[align],
                    textColor.classes[txc],
                    bgColor.classes[backgroundColor],

                    resolveResponsive(p, padding.classes),
                )}>
                    {textLines}
                </div>
                <div className = {cn(
                    "Slot section outer class",
                    bgColor.classes[backgroundColor],
                )}>
                    {Content && (
                      <Content className={slotClasses} minEmptyHeight="200px" />
                    )}
                </div>
                <div style = {{display: 'flex', flexDirection: 'row', margin: 0, gap: 0, backgroundColor: '#000000', justifyContent: 'center'}}>
                    <div className = {emailClasses}>
                        {email1}
                    </div>
                    {numEmails >= "2" && <div className = {emailClasses}>
                        {email2}
                    </div>}
                    {numEmails >= "3" && <div className = {emailClasses}>
                        {email3}
                    </div>}
                    {numEmails >= "4" && <div className = {emailClasses}>
                        {email4}
                    </div>}
                    {numEmails >= "5" && <div className = {emailClasses}>
                        {email5}
                    </div>}
                    {numEmails >= "6" && <div className = {emailClasses}>
                        {email6}
                    </div>}
                </div>
            </div>
        );
    }
}


//notes for when i resume:
//Implement emails input fields 1 thru X
//Create a var to determine whether those emails are input or auto-set (look at other blocks to figure out examples, shouldn't matter what set to as long as set to something)

//Add an emailCount field and necessary boolean values to <div></div>s
//add a new gap token for the email list
//Confirm that the slot settings work, see about adding more in