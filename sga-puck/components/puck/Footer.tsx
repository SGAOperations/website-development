import React from 'react';

type FooterProps = {
    showActionButtons?: boolean;
    actionButton1Text?: string;
    actionButton1Href?: string;
    actionButton2Text?: string;
    actionButton2Href?: string;
    actionButton3Text?: string;
    actionButton3Href?: string;
    showSocialMedia?: boolean;
    socialMedia1Label?: string;
    socialMedia1LogoSrc?: string;
    socialMedia1LogoAlt?: string;
    socialMedia2Label?: string;
    socialMedia2LogoSrc?: string;
    socialMedia2LogoAlt?: string;
    socialMedia3Label?: string;
    socialMedia3LogoSrc?: string;
    socialMedia3LogoAlt?: string;
    organizationName?: string;
    organizationAddress?: string;
    webmasterEmail?: string;
    webmasterLabel?: string;
    mediaInquiriesEmail?: string;
    mediaInquiriesLabel?: string;
};

export const Footer: React.FC<FooterProps> = ({
    showActionButtons = true,
    actionButton1Text = "GIVE FEEDBACK",
    actionButton1Href = "#",
    actionButton2Text = "MAILING LIST",
    actionButton2Href = "#",
    actionButton3Text = "GET INVOLVED",
    actionButton3Href = "#",
    showSocialMedia = true,
    socialMedia1Label = "SGA",
    socialMedia1LogoSrc = "",
    socialMedia1LogoAlt = "SGA Instagram",
    socialMedia2Label = "Campus Affairs",
    socialMedia2LogoSrc = "",
    socialMedia2LogoAlt = "Campus Affairs Instagram",
    socialMedia3Label = "SGA",
    socialMedia3LogoSrc = "",
    socialMedia3LogoAlt = "SGA TikTok",
    organizationName = "Northeastern University Student Government Association",
    organizationAddress = "332 Curry Student Center, 360 Huntington Avenue, Boston, MA 02115",
    webmasterEmail = "sgaOperations@northeastern.edu",
    webmasterLabel = "Webmaster:",
    mediaInquiriesEmail = "sgaExternalAffairs@northeastern.edu",
    mediaInquiriesLabel = "Media Inquiries:",
}) => (
    <footer className="bg-black relative bottom-0 left-0 w-screen text-center overflow-hidden mx-0 px-0">
        {showActionButtons && (
            <div className="button-container flex justify-center items-center pt-10">
                <button className="button bg-black text-white border-2 border-white transition-all duration-350 ease-in-out hover:bg-white hover:text-black">{actionButton1Text}</button>
                <button className="button bg-black text-white border-2 border-white transition-all duration-350 ease-in-out hover:bg-white hover:text-black">{actionButton2Text}</button>
                <button className="button bg-black text-white border-2 border-white transition-all duration-350 ease-in-out hover:bg-white hover:text-black">{actionButton3Text}</button>
            </div>
        )}

        {showSocialMedia && (
            <div className="flex justify-center items-center gap-5 py-6">
                <div className="flex flex-col items-center px-5">
                    <p className="text-white font-light pb-3">{socialMedia1Label}</p>
                    {socialMedia1LogoSrc ? (
                        <img src={socialMedia1LogoSrc} alt={socialMedia1LogoAlt} className="w-16 h-auto" />
                    ) : (
                        <div className="w-16 h-16 bg-gray-600 flex items-center justify-center text-white text-xs">Logo</div>
                    )}
                </div>
                <div className="flex flex-col items-center px-5">
                    <p className="text-white font-light pb-3">{socialMedia2Label}</p>
                    {socialMedia2LogoSrc ? (
                        <img src={socialMedia2LogoSrc} alt={socialMedia2LogoAlt} className="w-16 h-auto" />
                    ) : (
                        <div className="w-16 h-16 bg-gray-600 flex items-center justify-center text-white text-xs">Logo</div>
                    )}
                </div>
                <div className="flex flex-col items-center px-5">
                    <p className="text-white font-light pb-3">{socialMedia3Label}</p>
                    {socialMedia3LogoSrc ? (
                        <img src={socialMedia3LogoSrc} alt={socialMedia3LogoAlt} className="w-16 h-auto" />
                    ) : (
                        <div className="w-16 h-16 bg-gray-600 flex items-center justify-center text-white text-xs">Logo</div>
                    )}
                </div>
            </div>
        )}

        <div className="pb-10">
            <p className="text-white font-light pb-4">{organizationName}</p>
            <p className="text-white font-light pb-4">{organizationAddress}</p>
            <p className="text-white font-light pb-4">{webmasterLabel}&nbsp;
                <a
                    href={`mailto:${webmasterEmail}`}
                    className="underline text-white font-light hover:text-gray-300"
                >
                    {webmasterEmail}
                </a>
            </p>
            <p className="text-white font-light pb-4">{mediaInquiriesLabel}&nbsp;
                <a
                    href={`mailto:${mediaInquiriesEmail}`}
                    className="underline text-white font-light hover:text-gray-300 transition duration-300"
                >
                    {mediaInquiriesEmail}
                </a>
            </p>
        </div>
    </footer>
);
