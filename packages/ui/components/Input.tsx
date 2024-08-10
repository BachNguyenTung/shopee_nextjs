import { forwardRef, InputHTMLAttributes } from "react";
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
        secondary: "",
        invalid: "user-profile__user-input--invalid",
      },
    },
    defaultVariants: {
      variant: "default",
    }
  }
)
const Input = forwardRef<
  HTMLInputElement,
  InputProps
>(function Input({ variant, className, ...props }: InputProps, ref) {
  return (
    <input
      ref={ref}
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  )
});
export default Input
