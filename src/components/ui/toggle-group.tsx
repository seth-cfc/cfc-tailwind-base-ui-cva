import { Toggle as BaseToggle } from '@base-ui/react/toggle'
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group'
import { mergeClassName } from '../../lib/cn'

export function ToggleGroup({ className, ...props }: BaseToggleGroup.Props) {
  return (
    <BaseToggleGroup
      className={mergeClassName(
        'inline-flex flex-wrap gap-1 rounded-lg bg-surface-sunken p-1',
        className,
      )}
      {...props}
    />
  )
}

export function Toggle({ className, ...props }: BaseToggle.Props) {
  return (
    <BaseToggle
      className={mergeClassName(
        [
          'h-7 rounded-md px-2.5 font-mono text-xs text-fg-muted transition-colors select-none',
          'hover:text-fg data-pressed:bg-surface data-pressed:text-fg data-pressed:shadow-sm',
          'focus-visible:outline-2 focus-visible:outline-ring',
        ].join(' '),
        className,
      )}
      {...props}
    />
  )
}
