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
          'bg-[#16587B] text-[#F5EEDD] hover:bg-[#0e3f59] shadow-md shadow-[#16587B]/20 hover:shadow-lg hover:shadow-[#16587B]/30',
        destructive:
          'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
        outline:
          'border border-[#16587B]/30 bg-white text-[#16587B] hover:bg-[#F5EEDD]/70 hover:border-[#16587B] shadow-2xs',
        secondary:
          'bg-[#84B3CE]/25 text-[#16587B] hover:bg-[#84B3CE]/40 font-bold',
        ghost:
          'text-[#16587B] hover:bg-[#16587B]/10 hover:text-[#0e3f59]',
        link:
          'text-[#16587B] underline-offset-4 hover:underline',
        glow:
          'bg-[#16587B] text-[#F5EEDD] hover:bg-[#0e3f59] shadow-[0_4px_20px_rgba(22,88,123,0.25)] hover:shadow-[0_6px_25px_rgba(22,88,123,0.4)]',
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
