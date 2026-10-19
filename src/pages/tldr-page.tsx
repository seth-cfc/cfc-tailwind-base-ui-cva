import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { CodeBlock, InlineCode } from '../components/docs/code-block'
import { Page, PageHeader, Section } from '../components/docs/page'
import { Alert } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Switch } from '../components/ui/switch'

const tailwindCode = `
/* index.css: tokens are CSS variables */
:root { --primary: oklch(0.55 0.2 264); }
.dark { --primary: oklch(0.7 0.16 264); }

@theme inline {
  --color-primary: var(--primary);  /* → bg-primary, text-primary */
}
`

const baseUiCode = `
// Behavior + ARIA, no styles. State shows up as data-* attributes.
<Switch.Root className="bg-border data-checked:bg-primary">
  <Switch.Thumb className="data-checked:translate-x-5" />
</Switch.Root>
`

const cvaCode = `
const badgeVariants = cva('rounded-full px-2 text-xs', {
  variants: {
    tone: { neutral: 'bg-surface-sunken', danger: 'bg-danger-soft text-danger' },
  },
  defaultVariants: { tone: 'neutral' },
})

badgeVariants({ tone: 'danger' })  // → "rounded-full px-2 text-xs bg-danger-soft text-danger"
`

const buttonCode = `
// src/components/ui/button.tsx (trimmed)
import { Button as BaseButton } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center rounded-lg font-medium focus-visible:outline-2 data-disabled:opacity-50',
  {
    variants: {
      intent: {
        primary: 'bg-primary text-primary-fg hover:bg-primary-hover',
        outline: 'border border-border-strong hover:bg-surface-sunken',
        danger: 'bg-danger text-danger-fg hover:bg-danger-hover',
      },
      size: { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-sm' },
    },
    defaultVariants: { intent: 'primary', size: 'md' },
  },
)

export function Button({ intent, size, className, ...props }: ButtonProps) {
  return <BaseButton className={cn(buttonVariants({ intent, size }), className)} {...props} />
}

// Usage: typed props, no class strings in product code
<Button intent="danger" size="sm">Delete</Button>
`

const nextjsCode = `
// components/ui/button.tsx
'use client'                      // every Base UI wrapper needs this
export const buttonVariants = cva(/* … */)

// app/page.tsx (Server Component)
<Button onClick={…} />            // ❌ functions can't cross to the client
<Link className={buttonVariants()} />
                                  // ❌ throws: buttonVariants is on the client
<ButtonLink href="/new" />        // ✅ wrap it in a client component (SparkEd's fix)
`

const layers = [
  {
    name: 'Tailwind v4',
    job: 'Looks',
    tone: 'primary',
    body: 'Design tokens as CSS variables, utilities to apply them. One class on <html> flips dark mode.',
    code: tailwindCode,
    title: 'index.css',
  },
  {
    name: 'Base UI',
    job: 'Behavior',
    tone: 'success',
    body: 'Unstyled, accessible primitives: focus, keyboard, ARIA, positioning. You bring every class.',
    code: baseUiCode,
    title: 'switch.tsx',
  },
  {
    name: 'CVA',
    job: 'API',
    tone: 'warning',
    body: 'Turns class strings into typed variant props, so product code says intent="danger", not 12 classes.',
    code: cvaCode,
    title: 'badge.ts',
  },
] as const

const good = [
  'Accessibility came free: we wrote zero ARIA or focus code.',
  "Base UI's data-* attributes plug straight into Tailwind variants (data-checked:bg-primary).",
  'Enter and exit animations are plain CSS transitions; no animation library.',
  'Setup is one Vite plugin and three installs. Base UI docs ship inside the npm package.',
]

const watch = [
  'CVA has no slots: multi-part components (Tabs) need several cva() calls plus a context.',
  'Base UI is young (v1.0 in Dec 2025, already v1.9) and some minor releases broke things.',
  'Long class strings need the Prettier plugin and editor IntelliSense to stay readable.',
  'tailwind-merge silently drops classes for custom non-color scales until configured.',
]

const decisions = [
  ['Distribution', 'npm package (consumers add an @source line) or copy-in like shadcn (manual upgrades)?'],
  ['Tokens', 'Generate the CSS variables from a design-token pipeline so design and code share one source?'],
  ['daisyUI', 'Layer it under CVA like SparkEd does, or keep full control of the variant API?'],
  ['className', "Allow Base UI's function form, or go string-only like SparkEd (simpler, and Next.js friendly)?"],
]

const deeperReads = [
  { to: '/tailwind', label: 'Tailwind CSS' },
  { to: '/base-ui', label: 'Base UI' },
  { to: '/cva', label: 'CVA' },
  { to: '/together', label: 'Putting it together' },
  { to: '/sparked', label: 'How SparkEd does it' },
  { to: '/nextjs', label: 'Using with Next.js' },
  { to: '/findings', label: 'Findings & tradeoffs' },
]

export function TldrPage() {
  return (
    <Page>
      <PageHeader eyebrow="The two-minute version" title="TL;DR">
        <p>
          The short answer for anyone who doesn&apos;t want the full explainer. Every point links to a
          deeper page if you want the details.
        </p>
      </PageHeader>

      <Alert tone="success" title="Verdict: a good fit for the platform library">
        Tailwind, Base UI, and CVA split the work cleanly, building with them was pleasant, and
        accessibility came for free. SparkEd already runs this stack in production. The risks are
        manageable: Base UI is still young, and four design decisions are open (bottom of this page).
      </Alert>

      <Section title="Who does what" description="Each tool owns one job, and none of them overlap.">
        <div className="flex flex-col gap-4">
          {layers.map((layer) => (
            <Card key={layer.name} className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              <CardHeader className="lg:pb-5">
                <Badge tone={layer.tone} className="w-fit">
                  {layer.job}
                </Badge>
                <CardTitle className="pt-2">{layer.name}</CardTitle>
                <p className="pt-1 text-sm leading-relaxed text-fg-muted">{layer.body}</p>
              </CardHeader>
              <CardContent>
                <CodeBlock code={layer.code} title={layer.title} />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="All three in one component"
        description="Base UI provides the element and behavior, CVA maps props to classes, and Tailwind classes reference the tokens. Every component in this prototype follows this shape."
      >
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-raised p-4">
          <Button>Save</Button>
          <Button intent="outline">Cancel</Button>
          <Button intent="danger" size="sm">
            Delete
          </Button>
          <Button disabled>Disabled</Button>
          <label className="ml-auto flex items-center gap-2 text-sm text-fg-muted">
            <Switch defaultChecked /> Base UI switch
          </label>
        </div>
        <CodeBlock code={buttonCode} title="src/components/ui/button.tsx" />
      </Section>

      <Section title="Good and watch-outs">
        <div className="grid gap-4 md:grid-cols-2">
          <BulletCard title="What felt good" tone="success" items={good} />
          <BulletCard title="Watch out for" tone="warning" items={watch} />
        </div>
      </Section>

      <Section
        title="In Next.js"
        description={
          <>
            The stack ports almost unchanged; swap the Vite plugin for{' '}
            <InlineCode>@tailwindcss/postcss</InlineCode>. The catch is the server/client boundary.
          </>
        }
      >
        <CodeBlock code={nextjsCode} title="the two rules that bite" />
      </Section>

      <Section title="Decisions still open">
        <ol className="flex flex-col gap-3">
          {decisions.map(([topic, question], index) => (
            <li key={topic} className="flex gap-3 rounded-xl border border-border bg-surface-raised p-4 text-sm">
              <span className="font-mono font-semibold text-primary">{index + 1}</span>
              <p className="leading-relaxed">
                <strong>{topic}:</strong> <span className="text-fg-muted">{question}</span>
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Want the details?">
        <div className="flex flex-wrap gap-2">
          {deeperReads.map((page) => (
            <Link
              key={page.to}
              to={page.to}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-ring"
            >
              {page.label} →
            </Link>
          ))}
        </div>
      </Section>
    </Page>
  )
}

function BulletCard({
  title,
  tone,
  items,
}: {
  title: string
  tone: 'success' | 'warning'
  items: readonly string[]
}) {
  return (
    <Card>
      <CardHeader>
        <Badge tone={tone} className="w-fit">
          {title}
        </Badge>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-fg-muted">
          {items.map((item) => (
            <BulletItem key={item}>{item}</BulletItem>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function BulletItem({ children }: { children: ReactNode }) {
  return <li className="list-inside list-disc">{children}</li>
}
