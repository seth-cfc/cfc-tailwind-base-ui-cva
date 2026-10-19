import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn, mergeClassName } from '../../lib/cn'

export const Dialog = BaseDialog.Root
export const DialogTrigger = BaseDialog.Trigger
export const DialogClose = BaseDialog.Close

const dialogPopupVariants = cva(
  [
    'fixed top-1/2 left-1/2 z-50 flex max-h-[85dvh] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4',
    'overflow-y-auto rounded-2xl border border-border bg-surface-raised p-6 text-fg shadow-2xl outline-none',
    'transition-[scale,opacity] duration-150 ease-out',
    'data-starting-style:scale-95 data-starting-style:opacity-0',
    'data-ending-style:scale-95 data-ending-style:opacity-0',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

export interface DialogContentProps
  extends BaseDialog.Popup.Props, VariantProps<typeof dialogPopupVariants> {}

/** Portal + Backdrop + Popup in one, since every dialog in the app needs all three. */
export function DialogContent({ className, size, ...props }: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        className={cn(
          'fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity duration-150',
          'data-starting-style:opacity-0 data-ending-style:opacity-0',
        )}
      />
      <BaseDialog.Popup
        className={mergeClassName(dialogPopupVariants({ size }), className)}
        {...props}
      />
    </BaseDialog.Portal>
  )
}

export function DialogTitle({ className, ...props }: BaseDialog.Title.Props) {
  return <BaseDialog.Title className={mergeClassName('text-lg font-semibold', className)} {...props} />
}

export function DialogDescription({ className, ...props }: BaseDialog.Description.Props) {
  return (
    <BaseDialog.Description
      className={mergeClassName('text-sm text-fg-muted', className)}
      {...props}
    />
  )
}
