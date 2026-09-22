"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-choppa-red text-white hover:bg-choppa-red-dark shadow-pop disabled:bg-choppa-red/50",
  secondary:
    "bg-choppa-green text-choppa-cream hover:bg-choppa-green-light disabled:opacity-50",
  outline:
    "border border-choppa-ink/15 bg-white text-choppa-ink hover:border-choppa-ink/30 hover:bg-choppa-peach-light disabled:opacity-50",
  ghost: "text-choppa-ink hover:bg-choppa-ink/5 disabled:opacity-50",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-full",
  md: "h-11 px-5 text-sm rounded-full",
  lg: "h-13 px-7 text-base rounded-full",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>(({ className = "", variant = "primary", size = "md", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
});
Button.displayName = "Button";
