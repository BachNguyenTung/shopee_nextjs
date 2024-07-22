import { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@shoppe_nextjs/utils/utils";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const buttonVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        primary: "",
        secondary: ""
      },
      size: {
        small: "",
        medium: "",
        large: ""
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium"
    }
  }
)

export default function Button({ asChild = false, className, size, variant, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
