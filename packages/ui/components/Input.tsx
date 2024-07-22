import { InputHTMLAttributes } from "react";
import { cn } from "@shoppe_nextjs/utils/utils";
import { cva, type VariantProps } from "class-variance-authority";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
}

const inputVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        primary: "",
        secondary: ""
      },
    },
    defaultVariants: {
      variant: "default",
    }
  }
)

export default function Input({ variant, className, ...props }: InputProps) {
  return (
    <input
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  )
}
