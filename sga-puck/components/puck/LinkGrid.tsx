export interface LinkGridProps {
    links: {
        label: string;
        url: string;
    }[];
    minimumColumnWidth?: number;
}

export const LinkGrid: React.FC<LinkGridProps> = ({
    links,
    minimumColumnWidth = 250
}) => {
    return (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${minimumColumnWidth}px, 1fr))`, gridAutoRows: '1fr' }}>
            {links.map((link, index) => (
                <a
                    key={index}
                    href={link.url}
                    className="bg-sga-red hover:bg-sga-red-alt text-white rounded-lg p-4 flex items-center justify-center text-center"
                >
                    {link.label}
                </a>
            ))}
        </div>
    )
}