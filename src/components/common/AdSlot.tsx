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
 * Ads are temporarily hidden while the workspace is being polished.
 * The component is kept in place so the ad slots can be re-enabled later.
 */
export function AdSlot(_props: AdSlotProps) {
  return null;
}
