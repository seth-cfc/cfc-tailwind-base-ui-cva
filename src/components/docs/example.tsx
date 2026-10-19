import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Tab, Tabs, TabsList, TabsPanel } from '../ui/tabs'
import { CodeBlock } from './code-block'

export interface ExampleProps {
  title: string
  description?: ReactNode
  code: string
  codeTitle?: string
  children: ReactNode
  previewClassName?: string
}

/** A live demo with its source one tab away. */
export function Example({
  title,
  description,
  code,
  codeTitle,
  children,
  previewClassName,
}: ExampleProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold">{title}</h3>
        {description && <div className="text-sm leading-relaxed text-fg-muted">{description}</div>}
      </div>
      <Tabs defaultValue="preview">
        <TabsList>
          <Tab value="preview">Preview</Tab>
          <Tab value="code">Code</Tab>
        </TabsList>
        <TabsPanel value="preview">
          <div
            className={cn(
              'flex min-h-36 flex-wrap items-center justify-center gap-3 rounded-xl border border-border bg-surface-raised p-8',
              '[background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px]',
              previewClassName,
            )}
          >
            {children}
          </div>
        </TabsPanel>
        <TabsPanel value="code">
          <CodeBlock code={code} title={codeTitle} />
        </TabsPanel>
      </Tabs>
    </section>
  )
}
