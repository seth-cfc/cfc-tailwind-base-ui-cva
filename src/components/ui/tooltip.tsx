import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import type { ReactElement, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export const TooltipProvider = BaseTooltip.Provider

export interface TooltipProps {
  content: ReactNode
  /** The trigger element. Base UI merges its props/ref into this element via `render`. */
  children: ReactElement
  side?: BaseTooltip.Positioner.Props['side']
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner className="z-50" side={side} sideOffset={8}>
          <BaseTooltip.Popup
            className={cn(
              'origin-(--transform-origin) rounded-md bg-fg px-2 py-1 text-xs font-medium text-surface shadow-md',
              'transition-[scale,opacity] duration-100',
              'data-starting-style:scale-90 data-starting-style:opacity-0',
              'data-ending-style:scale-90 data-ending-style:opacity-0',
              'data-instant:transition-none',
            )}
          >
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}
