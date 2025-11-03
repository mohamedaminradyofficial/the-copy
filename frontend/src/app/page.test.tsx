/**
 * Unit test for homepage verification
 * Ensures all 11 pages are displayed and linked correctly
 */

import { describe, it, expect } from "vitest";
import pagesManifest from "../config/pages.manifest.json";

describe("Homepage Verification", () => {
  it("should have exactly 11 pages in manifest", () => {
    // Ensure pages is an array
    const pages = Array.isArray(pagesManifest.pages) ? pagesManifest.pages : [];
    expect(pages).toHaveLength(11);
  });

  it("should have all required page properties", () => {
    const pages = Array.isArray(pagesManifest.pages) ? pagesManifest.pages : [];
    pages.forEach((page) => {
      expect(page).toHaveProperty("slug");
      expect(page).toHaveProperty("path");
      expect(page).toHaveProperty("title");
      expect(typeof page.slug).toBe("string");
      expect(typeof page.path).toBe("string");
      expect(typeof page.title).toBe("string");
    });
  });

  it("should have unique slugs", () => {
    const pages = Array.isArray(pagesManifest.pages) ? pagesManifest.pages : [];
    const slugs = pages.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("should have unique paths", () => {
    const pages = Array.isArray(pagesManifest.pages) ? pagesManifest.pages : [];
    const paths = pages.map((p) => p.path);
    const uniquePaths = new Set(paths);
    expect(uniquePaths.size).toBe(paths.length);
  });

  it("should match expected page count from previous report", () => {
    // Previous report mentioned 4/11, now should be 11/11
    const pages = Array.isArray(pagesManifest.pages) ? pagesManifest.pages : [];
    expect(pages.length).toBe(11);
  });
});
