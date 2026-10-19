import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export const alertVariants = cva('flex gap-3 rounded-xl border p-4 text-sm leading-relaxed', {
  variants: {
    tone: {
      info: 'border-primary/30 bg-primary-soft',
      success: 'border-success/30 bg-success-soft',
      warning: 'border-warning/40 bg-warning-soft',
      danger: 'border-danger/30 bg-danger-soft',
    },
  },
  defaultVariants: {
    tone: 'info',
  },
})

const iconByTone = {
  info: 'i',
  success: '✓',
  warning: '!',
  danger: '×',
} as const

export interface AlertProps
  extends Omit<ComponentProps<'div'>, 'title'>, VariantProps<typeof alertVariants> {
  title?: ReactNode
}

export function Alert({ className, tone, title, children, ...props }: AlertProps) {
  const resolvedTone = tone ?? 'info'
  return (
    <div role="note" className={cn(alertVariants({ tone }), className)} {...props}>
      <span
        aria-hidden
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-fg/10 text-xs font-bold"
      >
        {iconByTone[resolvedTone]}
      </span>
      <div className="flex flex-col gap-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-fg/85">{children}</div>
      </div>
    </div>
  )
}
