import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../ui/button'
import { useToast } from '../ui/toast'

export interface CodeBlockProps {
  code: string
  title?: string
  className?: string
}

export function CodeBlock({ code, title, className }: CodeBlockProps) {
  const toast = useToast()

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code.trim())
      toast.add({ title: 'Copied to clipboard', type: 'success', timeout: 2000 })
    } catch {
      toast.add({
        title: 'Could not copy',
        description: 'Your browser blocked clipboard access. Select the code and copy it manually.',
        type: 'error',
      })
    }
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-surface-sunken', className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-1.5">
        <span className="font-mono text-xs text-fg-muted">{title ?? 'tsx'}</span>
        <Button intent="ghost" size="sm" onClick={copyCode}>
          Copy
        </Button>
      </div>
      <pre className="max-h-[32rem] overflow-auto p-4 font-mono text-[0.8rem] leading-relaxed">
        <code>{code.trim()}</code>
      </pre>
    </div>
  )
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[0.85em] text-fg">
      {children}
    </code>
  )
}
