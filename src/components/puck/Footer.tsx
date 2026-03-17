import { ComponentConfig } from '@puckeditor/core';
import React from 'react';

export type FooterProps = {
    showActionButtons?: boolean;
    actionButtons: Array<{
        label: string;
        href: string;
    }>;
    showSocialMedia?: boolean;
    socialMedia: Array<{
        label: string;
        logoSrc: string;
        logoAlt: string;
    }>;
    organizationName?: string;
    organizationAddress?: string;
    emailDisplay: Array<{
        label: string;
        email: string;
    }>;
};

export const Footer: React.FC<FooterProps> = ({
    showActionButtons,
    actionButtons,
    showSocialMedia,
    socialMedia,
    organizationName,
    organizationAddress,
    emailDisplay,
}) => (
    <footer className="bg-black w-full text-center overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">

        {showActionButtons && (
            <div className="flex justify-center items-center pt-10 gap-5">
                { actionButtons.map((group, index) => (
                    <a href={group.href}>
                        <button key={index} className="button bg-black text-white border-2 p-5 border-white transition-all duration-350 ease-in-out hover:bg-white hover:text-black">
                           {group.label}
                        </button>
                    </a>
                ))}
            </div>
        )}

        {showSocialMedia && (
            <div className="flex flex-wrap justify-center items-center gap-8 py-6 px-4">
                { socialMedia.map((group, index) => (
                    <div key={index} className="flex flex-col items-center px-5">
                        <p className="text-white font-light pb-3">{group.label}</p>
                            {group.logoSrc ? (
                            <img src={group.logoSrc} alt={group.logoAlt} className="w-16 h-auto" />
                        ) : (
                            <div className="w-16 h-16 bg-gray-600 flex items-center justify-center text-white text-xs">Logo</div>
                        )}
                    </div>
                    ))}
            </div>
        )}

        <div className="pb-10">
            <p className="text-white font-light pb-4">{organizationName}</p>
            <p className="text-white font-light pb-4">{organizationAddress}</p>
            { emailDisplay.map((group, index) => (
                <p key={index} className="text-white font-light pb-4 break-words">{group.label}&nbsp;
                    <a
                        href={`mailto:${group.email}`}
                        className="underline text-white font-light hover:text-gray-300 wrap-break-word"
                    >
                        {group.email}
                    </a>
                </p>
            ))}
        </div>
        </div>
    </footer>
);


export const FooterConfig: ComponentConfig<FooterProps> = {
    fields: {
        showActionButtons: {
            type: "radio",
            options: [
                { label: "Show", value: true },
                { label: "Hide", value: false },
            ]
        },
        actionButtons: {
            type: "array",
            arrayFields: {
                label: { type: "text" },
                href: { type: "text" },
            },
        },
        showSocialMedia: {
            type: "radio",
            options: [
                { label: "Show", value: true },
                { label: "Hide", value: false },
            ]
        },
        socialMedia: {
            type: "array",
            arrayFields: {
                label: { type: "text" },
                logoSrc: { type: "text" },
                logoAlt: { type: "text" },
            },
        },
        organizationName: { type: "text" },
        organizationAddress: { type: "text" },
        emailDisplay: {
            type: "array",
            arrayFields: {
                label: { type: "text" },
                email: { type: "text" },
            },
        },
    },
    defaultProps: {
        showActionButtons: true,
        actionButtons: [
            { label: "GIVE FEEDBACK", href: "#"  },
            { label: "MAILING LIST", href: "#"  },
            { label: "GET INVOLVED", href: "#"  },
        ],
        showSocialMedia: true,
        socialMedia: [
            { label: "SGA", logoSrc: "", logoAlt: "SGA Instagram" },
            { label: "Campus Affairs", logoSrc: "", logoAlt: "Campus Affairs Instagram" },
            { label: "SGA", logoSrc: "", logoAlt: "SGA TikTok" },
        ],
        organizationName: "Northeastern University Student Government Association",
        organizationAddress: "332 Curry Student Center, 360 Huntington Avenue, Boston, MA 02115",
        emailDisplay: [
            { label: "Webmaster:", email: "sgaOperations@northeastern.edu"  },
            { label: "Media Inquiries:", email: "sgaExternalAffairs@northeastern.edu"  },
        ],
    },
    render: (props) => <Footer {...props} />,
};