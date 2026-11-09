import { describe, expect, it } from "vitest";
import type { ComponentData, Data } from "@puckeditor/core";
import { checkAccessibility, describeComponent, ROOT_ISSUE_ID } from "./a11y-check";

const page = (content: ComponentData[], title = "Home"): Data => ({ root: { props: { title } }, content });
const block = (type: string, id: string, props: Record<string, unknown> = {}): ComponentData => ({
  type,
  props: { id, ...props },
});
const image = (id: string, props: Record<string, unknown> = {}) =>
  block("Image", id, { image: { mediaId: 1, url: "/a.png" }, alt: "", decorative: false, ...props });
const messages = (data: Data) => checkAccessibility(data).map((i) => `${i.id}: ${i.message}`);

describe("checkAccessibility", () => {
  it("returns nothing for an accessible page", () => {
    const data = page([
      block("Anchor", "s", {
        bgColor: "background",
        textColor: "foreground",
        content: [
          block("Text", "t", { textColor: "foreground", content: "<h1>Welcome</h1><h2>Events</h2><p>See <a href='/e'>all events</a></p>" }),
          image("i", { alt: "Students at the fall town hall" }),
          block("Button", "b", { label: "Join a committee", href: "/join" }),
        ],
      }),
    ]);
    expect(checkAccessibility(data)).toEqual([]);
  });

  it("flags a missing page title", () => {
    expect(checkAccessibility(page([], " "))).toEqual([
      expect.objectContaining({ id: ROOT_ISSUE_ID, severity: "error", criterion: "2.4.2 Page Titled" }),
    ]);
  });

  it("checks image alt text, honouring decorative images and media library alt text", () => {
    const data = page([
      image("missing"),
      image("decorative", { decorative: true }),
      image("library", { image: { mediaId: 1, url: "/a.png", alt: "SGA logo" } }),
      image("filename", { alt: "IMG_2041.JPG" }),
      image("empty-slot", { image: null }),
    ]);
    expect(messages(data)).toEqual([
      "missing: Image has no alt text. Describe it, or mark it as decorative.",
      'filename: Alt text "IMG_2041.JPG" looks like a file name.',
    ]);
  });

  it("checks Text contrast against the nearest ancestor background", () => {
    const data = page([
      block("Anchor", "s", {
        bgColor: "sga-red",
        textColor: "background",
        content: [block("Text", "t", { textColor: "destructive", content: "<h2>Red on red</h2>" })],
      }),
    ]);
    const issues = checkAccessibility(data);
    expect(issues.map((i) => i.id)).toEqual(["t", "t"]);
    expect(issues[1].message).toMatch(/^H2 headings are SGA red/);
  });

  it("flags vague, empty and unlinked buttons and links", () => {
    const data = page([
      block("Button", "vague", { label: "Click here", href: "/x" }),
      block("Button", "empty", { label: " ", href: "/x" }),
      block("Button", "nolink", { label: "Join SGA", href: "" }),
      block("Text", "t", { textColor: "foreground", content: "<p><a href='/x'>Read more.</a> <a href='/y'><img></a></p>" }),
    ]);
    expect(messages(data)).toEqual([
      'vague: Button text "Click here" doesn\'t say what it does.',
      "empty: Button has no text.",
      "nolink: Button has no link URL, so it looks clickable but does nothing.",
      't: Link text "Read more." doesn\'t say where it goes.',
      "t: A link has no text.",
    ]);
  });

  it("checks links inside headings", () => {
    const data = page([
      block("Text", "t", { textColor: "foreground", content: "<h1><a href='/x'>Click here</a></h1><h2>Events <a href='/y'></a></h2>" }),
    ]);
    expect(messages(data)).toEqual([
      't: Link text "Click here" doesn\'t say where it goes.',
      "t: A link has no text.",
    ]);
  });

  it("checks heading structure across the whole page", () => {
    const data = page([
      block("Text", "a", { textColor: "foreground", content: "<h1>One</h1><h3>Skipped</h3>" }),
      block("Text", "b", { textColor: "foreground", content: "<h1>Two</h1><h2></h2>" }),
    ]);
    expect(messages(data)).toEqual([
      "b: An H2 heading is empty.",
      "b: Page has more than one H1. Use one H1 for the page's main topic.",
      "a: Heading jumps from H1 to H3. Don't skip levels.",
    ]);
  });

  it("flags duplicate main containers and anchor IDs", () => {
    const main = (id: string) => block("Group", id, { tag: "main", bgColor: "background", textColor: "foreground" });
    const section = (id: string, anchorId: string) => block("Anchor", id, { anchorId, bgColor: "background", textColor: "foreground" });
    const data = page([main("m1"), main("m2"), section("s1", "events"), section("s2", "events"), section("s3", "main-content")]);
    expect(checkAccessibility(data).map((i) => i.id)).toEqual(["m2", "s2", "s3"]);
  });
});

describe("describeComponent", () => {
  it("summarises blocks for screen readers", () => {
    expect(describeComponent(block("Text", "t", { content: "<p>Hello <b>world</b></p>" }), "Text")).toBe("Text: Hello world");
    expect(describeComponent(block("Text", "t", { content: "<h1>Welcome</h1><p>Hi</p>" }), "Text")).toBe("Text: Welcome Hi");
    expect(describeComponent(image("i", { decorative: true }), "Image")).toBe("Image: decorative");
    expect(describeComponent(image("i"), "Image")).toBe("Image: no alt text");
    expect(describeComponent(block("Group", "c", { tag: "div" }), "Group")).toBe("Group");
    expect(describeComponent(block("Group", "c", { tag: "nav" }), "Group")).toBe("Group: <nav>");
    expect(describeComponent(block("Text", "t", { content: "x".repeat(80) }), "Text")).toHaveLength("Text: ".length + 60);
  });
});
