import Link from "next/link";
import { getAllPages } from "../lib/get-page";

export default function RootPage() {
	const all = getAllPages();

	if (!all) {
		return (
			<div style={{ padding: 24 }}>
				<h1>No pages found</h1>
				<p>The local database.json does not exist or contains no pages.</p>
			</div>
		);
	}

	const entries = Object.keys(all).sort();

	return (
		<div style={{ padding: 24 }}>
			<h1>Pages</h1>
			<ul>
				{entries.map((path) => {
					const data = all[path];
					const title = data?.root?.props?.title || path;
					// Ensure root path maps to '/'
					const href = path === "/" ? "/" : path;

					return (
						<li key={path}>
							<Link href={href}>{title || path}</Link> - <span>{path}</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export const generateMetadata = async () => ({ title: "Index" });
