import type { CSSProperties, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { type CodeLanguage, languageFromTitle, useHighlightedTokens } from '../../lib/highlighter'
import { Button } from '../ui/button'
import { useToast } from '../ui/toast'

export interface CodeBlockProps {
  code: string
  title?: string
  /** Defaults to the title's file extension, then tsx. */
  lang?: CodeLanguage
  className?: string
}

export function CodeBlock({ code, title, lang, className }: CodeBlockProps) {
  const toast = useToast()
  const trimmedCode = code.trim()
  const language = lang ?? languageFromTitle(title)
  const tokens = useHighlightedTokens(trimmedCode, language)

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
        <span className="font-mono text-xs text-fg-muted">{title ?? language}</span>
        <Button intent="ghost" size="sm" onClick={copyCode}>
          Copy
        </Button>
      </div>
      <pre className="max-h-[32rem] overflow-auto p-4 font-mono text-[0.8rem] leading-relaxed">
        <code>
          {tokens
            ? tokens.map((line, lineIndex) => (
                <span key={lineIndex}>
                  {lineIndex > 0 && '\n'}
                  {line.map((token, tokenIndex) => (
                    <span
                      key={tokenIndex}
                      className="text-(--shiki-light) dark:text-(--shiki-dark)"
                      style={token.htmlStyle as CSSProperties}
                    >
                      {token.content}
                    </span>
                  ))}
                </span>
              ))
            : trimmedCode}
        </code>
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
