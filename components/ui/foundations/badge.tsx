import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-800 dark:focus:ring-neutral-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/80 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/80",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80",
        destructive:
          "border-transparent bg-red-500 text-neutral-50 shadow hover:bg-red-500/80 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/80",
        outline: "text-neutral-950 dark:text-neutral-50",
        success:
          "border-transparent bg-green-50 ring-1 ring-inset ring-green-600/20 text-green-700 hover:bg-green-50",
        danger:
          "border-transparent bg-red-50 ring-1 ring-inset ring-red-600/20 text-red-700 hover:bg-red-50",
        tcs: "border-transparent bg-[#F21E26] text-white",
        blueex: "border-transparent bg-[#0047BA] text-white",
        leopard: "border-transparent bg-[#FFCB05] text-white",
        pending:
          "border-transparent bg-[#FFF8D6] text-[#C7A400] ring-1 ring-inset ring-yellow-600/20",
        pendingcod:
          "border-transparent bg-[#FFF0D2] text-[#A15C33] ring-1 ring-inset ring-orange-600/20",
        pendingigis:
          "border-transparent bg-[#D5E8FF] text-[#2A6D94] ring-1 ring-inset ring-blue-600/20",
        unverified:
          "border-transparent bg-[#EAEAEA] text-[#6C757D] ring-1 ring-inset ring-gray-400/20",
        confirmed:
          "border-transparent bg-[#D4EDDA] text-[#155724] ring-1 ring-inset ring-green-500/20",
        rejectedcod:
          "border-transparent bg-[#F8D7DA] text-[#721C24] ring-1 ring-inset ring-red-500/20",
        igiserror:
          "border-transparent bg-[#F4E1EC] text-[#9B2C5E] ring-1 ring-inset ring-pink-600/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
