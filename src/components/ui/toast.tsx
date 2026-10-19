import { Toast } from '@base-ui/react/toast'
import { cn } from '../../lib/cn'

export const ToastProvider = Toast.Provider
export const useToast = Toast.useToastManager

/** Renders the toast stack. Mount once, inside <ToastProvider>. */
export function Toaster() {
  return (
    <Toast.Portal>
      <Toast.Viewport className="fixed right-4 bottom-4 z-[60] flex w-[calc(100vw-2rem)] flex-col gap-2 sm:w-90">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  )
}

function ToastList() {
  const { toasts } = useToast()
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className={cn(
        'w-full rounded-xl border border-border bg-surface-raised text-fg shadow-lg',
        'transition-[translate,opacity] duration-300 ease-out',
        'data-starting-style:translate-y-4 data-starting-style:opacity-0',
        'data-ending-style:opacity-0 data-limited:opacity-0',
        'data-[type=success]:border-success/50 data-[type=error]:border-danger/50',
      )}
    >
      <Toast.Content className="flex items-start gap-3 p-4">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <Toast.Title className="text-sm font-semibold" />
          <Toast.Description className="text-sm text-fg-muted" />
        </div>
        <Toast.Close
          aria-label="Dismiss notification"
          className="rounded-md px-1.5 text-fg-muted hover:bg-surface-sunken hover:text-fg"
        >
          ×
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ))
}
