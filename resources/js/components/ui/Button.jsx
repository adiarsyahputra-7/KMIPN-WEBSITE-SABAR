import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Button — SABAR Design System
 * Warna utama: Venice Blue (#16587B) & Merino (#F5EEDD)
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[#16587B] text-[#F5EEDD] hover:bg-[#1a6e98] shadow-lg shadow-[#16587B]/30 hover:shadow-[#16587B]/50',
        destructive:
          'bg-red-500 text-white hover:bg-red-600',
        outline:
          'border border-[#84B3CE]/40 bg-transparent text-[#F5EEDD] hover:bg-[#16587B]/20 hover:border-[#84B3CE]',
        secondary:
          'bg-[#84B3CE]/20 text-[#F5EEDD] hover:bg-[#84B3CE]/30',
        ghost:
          'text-[#84B3CE] hover:bg-[#16587B]/20 hover:text-[#F5EEDD]',
        link:
          'text-[#84B3CE] underline-offset-4 hover:underline',
        glow:
          'bg-[#16587B] text-[#F5EEDD] hover:bg-[#1a6e98] shadow-[0_0_20px_rgba(22,88,123,0.6)] hover:shadow-[0_0_35px_rgba(22,88,123,0.8)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8 text-base',
        xl: 'h-13 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
