import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      tone: {
        neutral: '',
        primary: '',
        success: '',
        warning: '',
        danger: '',
      },
      appearance: {
        solid: '',
        soft: '',
        outline: 'border bg-transparent',
      },
    },
    // Color depends on BOTH tone and appearance, which is exactly what compoundVariants is for.
    compoundVariants: [
      { tone: 'neutral', appearance: 'solid', className: 'bg-fg text-surface' },
      { tone: 'neutral', appearance: 'soft', className: 'bg-surface-sunken text-fg' },
      { tone: 'neutral', appearance: 'outline', className: 'border-border-strong text-fg' },
      { tone: 'primary', appearance: 'solid', className: 'bg-primary text-primary-fg' },
      { tone: 'primary', appearance: 'soft', className: 'bg-primary-soft text-primary' },
      { tone: 'primary', appearance: 'outline', className: 'border-primary text-primary' },
      { tone: 'success', appearance: 'solid', className: 'bg-success text-white' },
      { tone: 'success', appearance: 'soft', className: 'bg-success-soft text-success' },
      { tone: 'success', appearance: 'outline', className: 'border-success text-success' },
      { tone: 'warning', appearance: 'solid', className: 'bg-warning text-black' },
      { tone: 'warning', appearance: 'soft', className: 'bg-warning-soft text-fg' },
      { tone: 'warning', appearance: 'outline', className: 'border-warning text-fg' },
      { tone: 'danger', appearance: 'solid', className: 'bg-danger text-danger-fg' },
      { tone: 'danger', appearance: 'soft', className: 'bg-danger-soft text-danger' },
      { tone: 'danger', appearance: 'outline', className: 'border-danger text-danger' },
    ],
    defaultVariants: {
      tone: 'neutral',
      appearance: 'soft',
    },
  },
)

export interface BadgeProps extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, appearance, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, appearance }), className)} {...props} />
}
