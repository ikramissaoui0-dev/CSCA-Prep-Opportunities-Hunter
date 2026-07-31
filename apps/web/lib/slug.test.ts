import { describe, it, expect } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("Machine Learning Basics")).toBe("machine-learning-basics");
  });

  it("trims surrounding whitespace before slugifying", () => {
    expect(slugify("  Algebra  ")).toBe("algebra");
  });

  it("collapses punctuation and non-alphanumeric runs into a single hyphen", () => {
    expect(slugify("Chinese: Grammar & Reading!!")).toBe("chinese-grammar-reading");
  });

  it("strips leading and trailing hyphens produced by leading/trailing punctuation", () => {
    expect(slugify("--Physics--")).toBe("physics");
  });

  it("falls back to a non-empty placeholder for input with no alphanumeric characters", () => {
    expect(slugify("!!!")).toBe("item");
    expect(slugify("")).toBe("item");
  });
});
