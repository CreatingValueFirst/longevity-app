import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] touch-manipulation select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-premium-sm hover:shadow-premium hover:bg-primary/90 hover:-translate-y-0.5 active:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-premium-sm hover:shadow-premium hover:bg-destructive/90 hover:-translate-y-0.5 active:bg-destructive/80",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-primary/50 active:bg-accent/80",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-premium-sm active:bg-secondary/70",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline",
        premium:
          "bg-gradient-to-r from-primary via-chart-4 to-chart-2 text-primary-foreground shadow-premium hover:shadow-premium-lg hover:-translate-y-0.5 hover:brightness-110 active:brightness-95",
        glow:
          "bg-primary text-primary-foreground glow-primary hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:-translate-y-0.5 active:shadow-[0_0_15px_hsl(var(--primary)/0.3)]",
      },
      size: {
        default: "h-11 px-4 py-2 min-w-[44px]",
        sm: "h-9 rounded-md px-3 text-xs min-w-[44px]",
        lg: "h-12 rounded-lg px-8 text-base min-w-[44px]",
        xl: "h-14 rounded-xl px-10 text-lg font-semibold min-w-[44px]",
        icon: "h-11 w-11 min-w-[44px] min-h-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
