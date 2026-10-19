import { Input as BaseInput } from '@base-ui/react/input'
import { cva, type VariantProps } from 'class-variance-authority'
import { mergeClassName } from '../../lib/cn'

export const inputVariants = cva(
  [
    'w-full rounded-lg border border-border-strong bg-surface px-3 text-fg shadow-xs',
    'placeholder:text-fg-muted transition-colors',
    'focus:border-primary focus:outline-2 focus:-outline-offset-1 focus:outline-ring/40',
    // Base UI's Field sets data-invalid on the control after validation runs.
    'data-invalid:border-danger data-invalid:focus:outline-danger/40',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 text-sm',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

export interface InputProps
  extends Omit<BaseInput.Props, 'size'>, VariantProps<typeof inputVariants> {}

export function Input({ className, size, ...props }: InputProps) {
  return <BaseInput className={mergeClassName(inputVariants({ size }), className)} {...props} />
}
