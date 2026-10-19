import { Popover as BasePopover } from '@base-ui/react/popover'
import { cn, mergeClassName } from '../../lib/cn'
import { popupSurface } from './popup-styles'

export const Popover = BasePopover.Root
export const PopoverTrigger = BasePopover.Trigger
export const PopoverClose = BasePopover.Close

export interface PopoverContentProps extends BasePopover.Popup.Props {
  side?: BasePopover.Positioner.Props['side']
  align?: BasePopover.Positioner.Props['align']
}

export function PopoverContent({ className, side, align, ...props }: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner className="z-50" sideOffset={8} side={side} align={align}>
        <BasePopover.Popup
          className={mergeClassName(cn(popupSurface, 'w-72 p-4'), className)}
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
}

export function PopoverTitle({ className, ...props }: BasePopover.Title.Props) {
  return <BasePopover.Title className={mergeClassName('text-sm font-semibold', className)} {...props} />
}

export function PopoverDescription({ className, ...props }: BasePopover.Description.Props) {
  return (
    <BasePopover.Description
      className={mergeClassName('mt-1 text-sm text-fg-muted', className)}
      {...props}
    />
  )
}
