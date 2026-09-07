import { cn } from "@/lib/utils";

type AdSlotProps = {
  /** Reserved width in px (desktop). */
  width: number;
  /** Reserved height in px (desktop). */
  height: number;
  /** Reserved height in px on small screens; defaults to `height`. */
  mobileHeight?: number;
  label?: string;
  className?: string;
};

/**
 * Layout-stable ad boundary. Space is reserved up front via explicit
 * min-width / min-height so an incoming ad can never shift content (CLS = 0).
 * Ad network scripts get mounted inside this box later.
 */
export function AdSlot({
  width,
  height,
  mobileHeight,
  label = "Advertisement",
  className,
}: AdSlotProps) {
  return (
    <aside
      aria-label={label}
      className={cn("mx-auto flex w-full max-w-full flex-col items-center gap-1.5", className)}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <div
        data-ad-slot={`${width}x${height}`}
        style={{
          minHeight: mobileHeight ?? height,
          maxWidth: width,
          ["--ad-h" as string]: `${height}px`,
        }}
        className="ad-frame flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/40"
      >
        <span className="text-xs text-muted-foreground">
          {width} × {height}
        </span>
      </div>
    </aside>
  );
}
