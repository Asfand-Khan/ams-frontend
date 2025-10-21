import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900",
  {
    variants: {
      variant: {
        // 🎯 Default System
        default:
          "border-transparent bg-neutral-900 text-white shadow-sm hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
        outline:
          "border border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800",
        destructive:
          "border-transparent bg-red-600 text-white shadow hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800",

        // 🌿 Semantic Colors
        success:
          "border-transparent bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-500/20 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300",
        danger:
          "border-transparent bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-500/20 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-300",
        warning:
          "border-transparent bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-500/20 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300",
        info:
          "border-transparent bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-500/20 hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300",
        neutral:
          "border-transparent bg-zinc-100 text-zinc-700 ring-1 ring-inset ring-zinc-400/20 hover:bg-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-300",

        // 🏷️ Custom Business States
        pending:
          "border-transparent bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-400/30 hover:bg-yellow-100 dark:bg-yellow-900/40 dark:text-yellow-300",
        pendingcod:
          "border-transparent bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-500/30 hover:bg-orange-100 dark:bg-orange-900/40 dark:text-orange-300",
        pendingigis:
          "border-transparent bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-400/30 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300",
        unverified:
          "border-transparent bg-neutral-100 text-neutral-600 ring-1 ring-inset ring-neutral-400/20 hover:bg-neutral-200 dark:bg-neutral-800/40 dark:text-neutral-400",
        confirmed:
          "border-transparent bg-green-50 text-green-700 ring-1 ring-inset ring-green-500/20 hover:bg-green-100 dark:bg-green-900/40 dark:text-green-300",
        rejectedcod:
          "border-transparent bg-red-50 text-red-700 ring-1 ring-inset ring-red-400/20 hover:bg-red-100 dark:bg-red-900/40 dark:text-red-300",
        igiserror:
          "border-transparent bg-pink-50 text-pink-700 ring-1 ring-inset ring-pink-400/20 hover:bg-pink-100 dark:bg-pink-900/40 dark:text-pink-300",

        // 🚚 Courier Variants
        tcs: "border-transparent bg-[#F21E26] text-white shadow hover:opacity-90",
        blueex: "border-transparent bg-[#0047BA] text-white shadow hover:opacity-90",
        leopard: "border-transparent bg-[#FFCB05] text-[#5E4300] shadow hover:opacity-90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
