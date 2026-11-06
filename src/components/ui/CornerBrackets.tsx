import { cn } from "@/lib/utils";

const POS = {
  "0": ["left-0 top-0", "right-0 top-0", "bottom-0 left-0", "bottom-0 right-0"],
  "2": ["left-2 top-2", "right-2 top-2", "bottom-2 left-2", "bottom-2 right-2"],
  "3": ["left-3 top-3", "right-3 top-3", "bottom-3 left-3", "bottom-3 right-3"],
  "4": ["left-4 top-4", "right-4 top-4", "bottom-4 left-4", "bottom-4 right-4"],
  "6": ["left-6 top-6", "right-6 top-6", "bottom-6 left-6", "bottom-6 right-6"],
  "8": ["left-8 top-8", "right-8 top-8", "bottom-8 left-8", "bottom-8 right-8"],
} as const;

/** Reference motif: four L-shaped corner marks framing a panel. */
export function CornerBrackets({
  size = "h-4 w-4",
  inset = "4",
  className = "border-primary",
}: {
  size?: string;
  inset?: keyof typeof POS;
  className?: string;
}) {
  const [tl, tr, bl, br] = POS[inset];
  return (
    <span aria-hidden className="pointer-events-none">
      <span className={cn("absolute border-l-2 border-t-2", size, tl, className)} />
      <span className={cn("absolute border-r-2 border-t-2", size, tr, className)} />
      <span className={cn("absolute border-b-2 border-l-2", size, bl, className)} />
      <span className={cn("absolute border-b-2 border-r-2", size, br, className)} />
    </span>
  );
}
