import type { ReactNode } from 'react'
import { Link } from 'react-router'
import buttonSource from '../components/ui/button.tsx?raw'
import { CodeBlock, InlineCode } from '../components/docs/code-block'
import { Page, PageHeader, Section } from '../components/docs/page'
import { Alert } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { buttonVariants } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const layers = [
  {
    name: 'Tailwind CSS v4',
    job: 'How it looks',
    tone: 'primary',
    points: [
      'Design tokens declared in CSS with @theme',
      'Utility classes for every style decision',
      'Variants for state: hover, focus-visible, dark, data-*',
    ],
  },
  {
    name: 'Base UI',
    job: 'How it behaves',
    tone: 'success',
    points: [
      'Unstyled, accessible primitives (Dialog, Menu, Select…)',
      'Keyboard, focus, ARIA and positioning handled for you',
      'Exposes state as data attributes for styling',
    ],
  },
  {
    name: 'CVA',
    job: 'How it is configured',
    tone: 'warning',
    points: [
      'Turns class lists into a typed variant API',
      'intent="danger" size="sm" instead of 30 classes',
      'TypeScript props inferred from the config',
    ],
  },
] as const

const projectTree = `
src/
├── index.css              ← Tailwind import, @theme tokens, dark mode
├── lib/cn.ts              ← cn() = clsx + tailwind-merge; mergeClassName()
├── components/
│   ├── ui/                ← THE LIBRARY: one file per component
│   │   ├── button.tsx     ← Base UI Button + cva variants
│   │   ├── dialog.tsx     ← Base UI Dialog parts, pre-styled
│   │   ├── select.tsx     ← options-driven wrapper over Base UI Select
│   │   └── …
│   ├── docs/              ← Example / CodeBlock helpers for this guide
│   └── layout/            ← App shell + React Router nav
├── pages/                 ← one route per topic
└── router.tsx             ← createBrowserRouter config
`

const tour = [
  { to: '/tailwind', title: 'Tailwind CSS', body: 'Tokens, theming, state variants and the v4 CSS-first config.' },
  { to: '/base-ui', title: 'Base UI', body: 'Every primitive we wrapped, plus the styling hooks Base UI exposes.' },
  { to: '/cva', title: 'CVA', body: 'An interactive variant playground and the type-safety story.' },
  { to: '/together', title: 'Putting it together', body: 'A realistic form built only from library components.' },
  { to: '/sparked', title: 'How SparkEd does it', body: 'The same stack plus daisyUI, as it ships in production today.' },
  { to: '/nextjs', title: 'Using with Next.js', body: 'Server vs client components, PostCSS setup, and the buttonVariants gotcha.' },
  { to: '/findings', title: 'Findings & tradeoffs', body: 'What worked, what hurt, and open questions for the platform.' },
]

export function OverviewPage() {
  return (
    <Page>
      <PageHeader eyebrow="UI library prototype" title="Tailwind + Base UI + CVA">
        <p>
          A working prototype for evaluating this stack as the foundation of a shared platform UI
          library. Each page covers one layer with live, editable examples. The later pages show how
          the layers combine, how SparkEd already uses them alongside daisyUI, and what the experience
          was actually like.
        </p>
      </PageHeader>

      <Section
        title="Three layers, three jobs"
        description="The stack works because each tool owns exactly one concern. None of them overlap, which is also why none of them is enough on its own."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {layers.map((layer) => (
            <Card key={layer.name}>
              <CardHeader>
                <Badge tone={layer.tone} className="w-fit">
                  {layer.job}
                </Badge>
                <CardTitle className="pt-2">{layer.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex list-disc flex-col gap-1.5 pl-4 text-sm text-fg-muted">
                  {layer.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Anatomy of one library component"
        description={
          <>
            This is the complete, real source of <InlineCode>src/components/ui/button.tsx</InlineCode>,
            imported with Vite&apos;s <InlineCode>?raw</InlineCode> suffix so it can never drift from what
            you see rendered. Almost every component in the library follows this same shape.
          </>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
          <CodeBlock code={buttonSource} title="src/components/ui/button.tsx" />
          <ol className="flex flex-col gap-4 text-sm">
            <AnatomyStep n={1} title="cva() holds the design decisions">
              Base classes plus a <InlineCode>variants</InlineCode> map. Every class is a Tailwind
              utility pointing at a semantic token (<InlineCode>bg-primary</InlineCode>, not{' '}
              <InlineCode>bg-indigo-600</InlineCode>).
            </AnatomyStep>
            <AnatomyStep n={2} title="VariantProps<> derives the types">
              <InlineCode>intent</InlineCode> and <InlineCode>size</InlineCode> become typed props
              automatically. Add a variant to the config and TypeScript knows about it immediately.
            </AnatomyStep>
            <AnatomyStep n={3} title="Base UI renders the element">
              <InlineCode>BaseButton</InlineCode> brings focus handling, disabled semantics and{' '}
              <InlineCode>data-disabled</InlineCode> for styling.
            </AnatomyStep>
            <AnatomyStep n={4} title="mergeClassName() keeps it overridable">
              Consumers can pass <InlineCode>className</InlineCode> as a string or a Base UI state
              function, and tailwind-merge resolves conflicts so the consumer wins.
            </AnatomyStep>
          </ol>
        </div>
      </Section>

      <Section title="How this prototype is organized">
        <CodeBlock code={projectTree} title="project structure" lang="text" />
        <Alert tone="info" title="Run it locally">
          <InlineCode>pnpm install</InlineCode> then <InlineCode>pnpm dev</InlineCode>. Toggle dark mode
          in the header: it flips one class on <InlineCode>&lt;html&gt;</InlineCode> and every token
          updates.
        </Alert>
      </Section>

      <Section title="Tour">
        <div className="grid gap-4 sm:grid-cols-2">
          {tour.map((stop, index) => (
            <Link
              key={stop.to}
              to={stop.to}
              className="group rounded-xl border border-border bg-surface-raised p-5 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-ring"
            >
              <p className="text-xs font-semibold text-fg-muted">Step {index + 1}</p>
              <p className="mt-1 font-semibold group-hover:text-primary">{stop.title} →</p>
              <CardDescription className="mt-1">{stop.body}</CardDescription>
            </Link>
          ))}
        </div>
        <div>
          <Link to="/tailwind" className={buttonVariants({ size: 'lg' })}>
            Start with Tailwind
          </Link>
        </div>
      </Section>
    </Page>
  )
}

function AnatomyStep({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
        {n}
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{title}</p>
        <p className="leading-relaxed text-fg-muted">{children}</p>
      </div>
    </li>
  )
}
