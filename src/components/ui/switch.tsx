import { Switch as BaseSwitch } from '@base-ui/react/switch'
import { cva, type VariantProps } from 'class-variance-authority'
import { mergeClassName } from '../../lib/cn'

const switchRootVariants = cva(
  [
    'relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5',
    'bg-border-strong transition-colors duration-150',
    'data-checked:bg-primary',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

const switchThumbVariants = cva(
  'rounded-full bg-white shadow-sm transition-transform duration-150 ease-out',
  {
    variants: {
      size: {
        sm: 'size-4 data-checked:translate-x-4',
        md: 'size-5 data-checked:translate-x-5',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export interface SwitchProps
  extends BaseSwitch.Root.Props, VariantProps<typeof switchRootVariants> {}

export function Switch({ className, size, ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root className={mergeClassName(switchRootVariants({ size }), className)} {...props}>
      <BaseSwitch.Thumb className={switchThumbVariants({ size })} />
    </BaseSwitch.Root>
  )
}
