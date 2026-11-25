import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

/**
 * Renders lesson notes: Markdown (headings, lists, tables, bold) plus LaTeX
 * math — `$a^2+b^2=c^2$` inline, `$$ ... $$` on its own lines as a block.
 *
 * Raw HTML in the source is NOT rendered (react-markdown's default), so
 * notes authored by a content manager can't inject markup/scripts.
 * `throwOnError: false` makes a malformed formula show up as red source
 * text instead of breaking the whole lesson page.
 */
export function MathContent({ children }: { children: string }) {
  return (
    <div className="math-content text-sm leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
