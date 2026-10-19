import { Button as BaseButton } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { mergeClassName } from '../../lib/cn'

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none',
    'rounded-lg transition-colors duration-150',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
  ],
  {
    variants: {
      intent: {
        primary: 'bg-primary text-primary-fg shadow-sm hover:bg-primary-hover',
        secondary: 'bg-surface-sunken text-fg hover:bg-border',
        outline: 'border border-border-strong bg-surface text-fg hover:bg-surface-sunken',
        ghost: 'text-fg hover:bg-surface-sunken',
        danger: 'bg-danger text-danger-fg shadow-sm hover:bg-danger-hover',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    compoundVariants: [
      // Ghost buttons sit inline with text, so the small size gets tighter padding.
      { intent: 'ghost', size: 'sm', className: 'px-2' },
    ],
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  },
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>

export interface ButtonProps extends BaseButton.Props, ButtonVariantProps {}

export function Button({ className, intent, size, fullWidth, ...props }: ButtonProps) {
  return (
    <BaseButton
      className={mergeClassName(buttonVariants({ intent, size, fullWidth }), className)}
      {...props}
    />
  )
}
