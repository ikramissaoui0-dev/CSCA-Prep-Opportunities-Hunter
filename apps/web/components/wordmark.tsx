// The CSCAprepa wordmark as live text (not the raster from the brand sheet)
// so it stays crisp at any size and flips to a light "CSCA" in dark mode:
// near-black/bold "CSCA" + brand-red "prepa", as in the logo.
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`whitespace-nowrap tracking-tight ${className}`}>
      <span className="font-bold text-foreground">CSCA</span>
      <span className="font-medium text-primary">prepa</span>
    </span>
  );
}
