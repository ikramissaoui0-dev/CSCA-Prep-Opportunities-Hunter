import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MathContent } from "./math-content";

// Runs under vitest.components.config.ts (regular React, not the
// "react-server" condition the main config uses).
const render = (source: string) => renderToStaticMarkup(createElement(MathContent, null, source));

describe("MathContent", () => {
  it("renders inline LaTeX as KaTeX markup", () => {
    const html = render("Les racines vérifient $x^2-5x+6=0$.");
    expect(html).toContain('class="katex"');
    expect(html).not.toContain("$x^2");
  });

  it("renders a block formula with a real fraction", () => {
    // `$$` must sit on its own lines to be a block; `$$x$$` on one line
    // is inline math (remark-math's rule).
    const html = render("$$\n\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}\n$$");
    expect(html).toContain("katex-display");
    expect(html).toContain("<mfrac");
  });

  it("renders Markdown tables and lists", () => {
    const html = render("| A | B |\n|---|---|\n| 1 | 2 |\n\n- un\n- deux");
    expect(html).toContain("<table>");
    expect(html).toContain("<li>un</li>");
  });

  it("never turns raw HTML in the notes into real elements", () => {
    const html = render('<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
  });

  it("shows a malformed formula as text instead of throwing", () => {
    expect(() => render("$\\frac{1}$")).not.toThrow();
  });
});
