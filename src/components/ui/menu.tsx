import { Menu as BaseMenu } from '@base-ui/react/menu'
import { cn, mergeClassName } from '../../lib/cn'
import { popupItem, popupSurface } from './popup-styles'

export const Menu = BaseMenu.Root
export const MenuTrigger = BaseMenu.Trigger
export const MenuGroup = BaseMenu.Group

export interface MenuContentProps extends BaseMenu.Popup.Props {
  align?: BaseMenu.Positioner.Props['align']
  side?: BaseMenu.Positioner.Props['side']
}

export function MenuContent({ className, align = 'start', side, ...props }: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner className="z-50 outline-none" sideOffset={6} align={align} side={side}>
        <BaseMenu.Popup
          className={mergeClassName(cn(popupSurface, 'min-w-48 p-1'), className)}
          {...props}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

export function MenuItem({ className, ...props }: BaseMenu.Item.Props) {
  return <BaseMenu.Item className={mergeClassName(popupItem, className)} {...props} />
}

export function MenuLinkItem({ className, ...props }: BaseMenu.LinkItem.Props) {
  return <BaseMenu.LinkItem className={mergeClassName(popupItem, className)} {...props} />
}

export function MenuGroupLabel({ className, ...props }: BaseMenu.GroupLabel.Props) {
  return (
    <BaseMenu.GroupLabel
      className={mergeClassName(
        'px-2.5 pt-2 pb-1 text-xs font-medium tracking-wide text-fg-muted uppercase',
        className,
      )}
      {...props}
    />
  )
}

export function MenuSeparator({ className, ...props }: BaseMenu.Separator.Props) {
  return (
    <BaseMenu.Separator
      className={mergeClassName('mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}
