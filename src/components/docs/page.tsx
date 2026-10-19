import type { ReactNode } from 'react'

export interface PageHeaderProps {
  eyebrow: string
  title: string
  children: ReactNode
}

export function PageHeader({ eyebrow, title, children }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 border-b border-border pb-8">
      <p className="text-xs font-semibold tracking-widest text-primary uppercase">{eyebrow}</p>
      <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h1>
      <div className="max-w-3xl text-base leading-relaxed text-fg-muted">{children}</div>
    </header>
  )
}

export interface SectionProps {
  id?: string
  title: string
  description?: ReactNode
  children: ReactNode
}

export function Section({ id, title, description, children }: SectionProps) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <div className="max-w-3xl text-sm leading-relaxed text-fg-muted">{description}</div>
        )}
      </div>
      {children}
    </section>
  )
}

export function Page({ children }: { children: ReactNode }) {
  return <div className="flex animate-fade-in flex-col gap-14 pb-24">{children}</div>
}
