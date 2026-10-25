import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { ComponentConfig } from "@puckeditor/core";
import { defineProps, field } from "@/lib/puck/define-props";
import { mediaField } from "@/components/puck/fields/media-field";
import { cn } from "@/lib/utils";

type NavRoute = {
  label: string;
  href: string;
  children?: NavRoute[];
};

const ROUTES: NavRoute[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "What is SGA?", href: "/about/what-is-sga" },
      { label: "Structure", href: "/about/structure" },
      { label: "Leadership", href: "/about/leadership" },
      { label: "Our Work", href: "/about/our-projects" },
      { label: "Governing Documents", href: "/about/docs" },
      { label: "In The Press", href: "/about/in-the-press" },
      { label: "Awards", href: "/about/awards" },
      { label: "Alumni", href: "/about/alumni" },
    ],
  },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Senate", href: "/senate" },
  { label: "Advocacy", href: "/advocacy" },
  {
    label: "Administrative",
    href: "/administrative",
    children: [{ label: "Operational Affairs", href: "/about/operational-affairs" }],
  },
  {
    label: "Elections",
    href: "/elections",
    children: [{ label: "Elections Board", href: "/about/elections-board" }],
  },
  {
    label: "Student Organizations",
    href: "/student-organizations",
    children: [{ label: "Overview", href: "/about/clubs" }],
  },
];

type NavBarProps = {
  logo: { mediaId: number; url: string } | null;
  backgroundImage: { mediaId: number; url: string } | null;
};

const props = defineProps({
  logo: field.raw(mediaField("Logo"), null),
  backgroundImage: field.raw(mediaField("Background image"), null),
});

const linkClasses = "block whitespace-nowrap px-3 py-2";

export const NavBar: ComponentConfig<NavBarProps> = {
  label: "Nav Bar",
  ...props,
  render: ({ logo, backgroundImage, puck }) => (
    <div ref={puck.dragRef} className="relative w-full">
      {backgroundImage?.url && (
        <Image
          src={backgroundImage.url}
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          unoptimized
          className="h-84 w-full object-cover"
        />
      )}
      <nav
        className={cn(
          "flex items-center justify-between gap-6 px-4 py-4 text-white/80",
          backgroundImage?.url ? "absolute inset-x-0 top-0 bg-black/50" : "bg-black",
        )}
      >
        {logo?.url ? (
          <Image
            src={logo.url}
            alt="SGA logo"
            width={96}
            height={96}
            unoptimized
            className="h-24 w-auto shrink-0"
          />
        ) : (
          <div className="flex size-24 shrink-0 items-center justify-center bg-muted">
            <ImageIcon className="size-8 text-muted-foreground" />
          </div>
        )}
        <ul className="flex flex-wrap items-center pr-4">
          {ROUTES.map((route) => (
            <li key={route.href} className="group relative">
              <a href={route.href} className={linkClasses}>
                {route.label}
              </a>
              {route.children && (
                <ul className="absolute left-0 top-full z-10 hidden min-w-full bg-black shadow-md group-focus-within:block group-hover:block">
                  {route.children.map((child) => (
                    <li key={child.href}>
                      <a href={child.href} className={linkClasses}>
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  ),
};
