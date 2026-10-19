import { cn } from '../../lib/cn'

/**
 * Shared surface for every floating Base UI popup (menu, select, popover, tooltip).
 * Base UI sets `data-starting-style` / `data-ending-style` during enter/exit, and exposes
 * `--transform-origin` so the scale animation grows out of the trigger.
 */
export const popupSurface = cn(
  'origin-(--transform-origin) rounded-xl border border-border bg-surface-raised text-fg shadow-lg outline-none',
  'transition-[scale,opacity] duration-150 ease-out',
  'data-starting-style:scale-95 data-starting-style:opacity-0',
  'data-ending-style:scale-95 data-ending-style:opacity-0',
)

/** Shared row style for highlighted items inside menus and selects. */
export const popupItem = cn(
  'flex cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-sm outline-none select-none',
  'data-highlighted:bg-primary-soft data-highlighted:text-primary',
  'data-disabled:opacity-50',
)
