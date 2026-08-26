import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { projectsData, socialData } from "./index";

const projectItems = projectsData.creationItems;
const socials = socialData;
const publicPath = (assetPath) => join(process.cwd(), "public", assetPath);

describe("project links", () => {
  it("uses HTTPS for every non-empty project URL", () => {
    const projectLinks = projectItems
      .map((item) => item.link)
      .filter(Boolean);

    expect(projectLinks.length).toBeGreaterThan(0);

    for (const link of projectLinks) {
      expect(link).toMatch(/^https:\/\//);
      expect(() => new URL(link)).not.toThrow();
    }
  });

  it("has image files for project cards and modals", () => {
    for (const item of projectItems) {
      expect(existsSync(publicPath(item.imgLink))).toBe(true);
      expect(existsSync(publicPath(item.imgLinkLg))).toBe(true);
    }
  });
});

describe("social links", () => {
  it("has valid HTTPS profile links", () => {
    for (const item of socials) {
      expect(item.link).toMatch(/^https:\/\//);
      expect(() => new URL(item.link)).not.toThrow();
    }
  });
});
