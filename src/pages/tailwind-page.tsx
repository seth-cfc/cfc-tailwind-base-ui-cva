import { useState, type CSSProperties, type ReactNode } from 'react'
import indexCssSource from '../index.css?raw'
import { CodeBlock, InlineCode } from '../components/docs/code-block'
import { Example } from '../components/docs/example'
import { Page, PageHeader, Section } from '../components/docs/page'
import { Alert } from '../components/ui/alert'
import { Button } from '../components/ui/button'

// Class names are written out in full on purpose: Tailwind finds classes by scanning
// source text, so `bg-${token}` would never be generated.
const colorTokens = [
  { name: 'surface', className: 'bg-surface' },
  { name: 'surface-raised', className: 'bg-surface-raised' },
  { name: 'surface-sunken', className: 'bg-surface-sunken' },
  { name: 'fg', className: 'bg-fg' },
  { name: 'fg-muted', className: 'bg-fg-muted' },
  { name: 'border', className: 'bg-border' },
  { name: 'border-strong', className: 'bg-border-strong' },
  { name: 'primary', className: 'bg-primary' },
  { name: 'primary-soft', className: 'bg-primary-soft' },
  { name: 'danger', className: 'bg-danger' },
  { name: 'danger-soft', className: 'bg-danger-soft' },
  { name: 'success', className: 'bg-success' },
  { name: 'success-soft', className: 'bg-success-soft' },
  { name: 'warning', className: 'bg-warning' },
  { name: 'warning-soft', className: 'bg-warning-soft' },
  { name: 'ring', className: 'bg-ring' },
]

const stateVariantsCode = `
<button className="
  bg-primary text-primary-fg
  hover:bg-primary-hover
  active:scale-95
  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
  disabled:opacity-50
">
  Hover, press, tab to me
</button>

{/* group: style children based on the parent's state */}
<a className="group rounded-xl border p-4 hover:border-primary">
  <p className="font-semibold group-hover:text-primary">Card title</p>
  <p className="translate-x-0 group-hover:translate-x-1 transition">Arrow →</p>
</a>

{/* peer: style a sibling based on another sibling's state */}
<input id="agree" type="checkbox" className="peer sr-only" />
<label htmlFor="agree" className="peer-checked:bg-success peer-checked:text-white peer-focus-visible:outline-2">
  I agree
</label>
`

const dataAttributeCode = `
const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

<div
  data-status={status}
  className="
    rounded-xl border p-4 transition-colors
    data-[status=saving]:border-warning data-[status=saving]:bg-warning-soft
    data-[status=saved]:border-success data-[status=saved]:bg-success-soft
  "
>
  Status: {status}
</div>
`

const containerQueryCode = `
{/* @container marks the box; @md: / @lg: respond to ITS width, not the viewport */}
<div className="@container resize-x overflow-auto">
  <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @2xl:grid-cols-4">
    {items.map((item) => <div key={item}>…</div>)}
  </div>
</div>
`

const escapeHatchCode = `
{/* v4 shorthand for CSS variables: w-(--sidebar-width) */}
<div style={{ '--sidebar-width': '12rem' }} className="w-(--sidebar-width) bg-primary-soft" />

{/* Arbitrary values for one-offs */}
<div className="bg-[conic-gradient(var(--primary),var(--success),var(--warning),var(--primary))]" />

{/* Arbitrary properties for anything Tailwind has no utility for */}
<p className="[text-wrap:balance] [font-variant-numeric:tabular-nums]">…</p>
`

const dynamicClassCode = `
// ❌ Never generated: Tailwind only sees the literal text "bg-\${tone}"
<div className={\`bg-\${tone}\`} />

// ✅ Map to complete class strings (or let CVA do it, see the CVA page)
const toneClass = { danger: 'bg-danger', success: 'bg-success' } as const
<div className={toneClass[tone]} />
`

export function TailwindPage() {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  function simulateSave() {
    setStatus('saving')
    window.setTimeout(() => setStatus('saved'), 1200)
  }

  return (
    <Page>
      <PageHeader eyebrow="Layer 1 · How it looks" title="Tailwind CSS v4">
        <p>
          Tailwind supplies the styling vocabulary. In v4 configuration moved out of JavaScript and
          into CSS, so the design tokens for the whole library live in one stylesheet. Everything else
          in this app is utilities that reference those tokens.
        </p>
      </PageHeader>

      <Section
        title="CSS-first configuration"
        description={
          <>
            There is no <InlineCode>tailwind.config.js</InlineCode>. The Vite plugin (
            <InlineCode>@tailwindcss/vite</InlineCode>) plus this one file is the entire setup. This is
            the real <InlineCode>src/index.css</InlineCode>.
          </>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
          <CodeBlock code={indexCssSource} title="src/index.css" />
          <dl className="flex flex-col gap-4 text-sm">
            <ConfigNote term="@import 'tailwindcss'">Pulls in preflight, the default theme and all utilities.</ConfigNote>
            <ConfigNote term="@custom-variant dark">
              Makes <InlineCode>dark:</InlineCode> key off a <InlineCode>.dark</InlineCode> class instead
              of the OS setting, so users can choose.
            </ConfigNote>
            <ConfigNote term=":root / .dark">
              Raw values for each theme. Swapping themes is just swapping these variables.
            </ConfigNote>
            <ConfigNote term="@theme inline">
              Generates utilities like <InlineCode>bg-surface</InlineCode> that keep a live{' '}
              <InlineCode>var()</InlineCode> reference, so the dark overrides apply at runtime.
            </ConfigNote>
            <ConfigNote term="@theme">Static tokens such as fonts and animations.</ConfigNote>
          </dl>
        </div>
      </Section>

      <Section
        title="Semantic color tokens"
        description="Components use names that describe purpose (surface, fg, primary, danger), never raw palette colors. Toggle dark mode in the header and watch every swatch change: no component code is involved."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {colorTokens.map((token) => (
            <div key={token.name} className="flex flex-col gap-2">
              <div className={`h-14 rounded-lg border border-border ${token.className}`} />
              <code className="truncate font-mono text-xs text-fg-muted">{token.name}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="State variants"
        description="Prefix any utility with a state to apply it conditionally. This replaces most of what CSS-in-JS used props for."
      >
        <Example title="hover, focus-visible, group and peer" code={stateVariantsCode}>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95">
            Hover, press, tab to me
          </button>

          <a
            href="#state"
            className="group rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary"
          >
            <p className="text-sm font-semibold group-hover:text-primary">Card title</p>
            <p className="text-sm text-fg-muted transition group-hover:translate-x-1">Arrow →</p>
          </a>

          <div>
            <input id="tw-agree" type="checkbox" className="peer sr-only" />
            <label
              htmlFor="tw-agree"
              className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm transition-colors peer-checked:border-success peer-checked:bg-success peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-ring"
            >
              I agree (click me)
            </label>
          </div>
        </Example>

        <Example
          title="Styling from data attributes"
          description={
            <>
              <InlineCode>data-[status=saving]:</InlineCode> styles an element from its own attributes.
              This is the bridge to Base UI, which reports open, checked, highlighted and similar states
              as data attributes.
            </>
          }
          code={dataAttributeCode}
        >
          <div className="flex w-full max-w-sm flex-col gap-3">
            <div
              data-status={status}
              className="rounded-xl border border-border bg-surface p-4 text-sm transition-colors data-[status=saved]:border-success data-[status=saved]:bg-success-soft data-[status=saving]:border-warning data-[status=saving]:bg-warning-soft"
            >
              Status: <strong>{status}</strong>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={simulateSave} disabled={status === 'saving'}>
                Save
              </Button>
              <Button size="sm" intent="outline" onClick={() => setStatus('idle')}>
                Reset
              </Button>
            </div>
          </div>
        </Example>
      </Section>

      <Section
        id="responsive"
        title="Container queries are built in"
        description={
          <>
            v4 ships container queries with no plugin. For a component library this is often more
            useful than viewport breakpoints, because components rarely know how wide the page is.
            Drag the bottom-right corner of the box to resize it.
          </>
        }
      >
        <Example title="@container + @md: / @2xl:" code={containerQueryCode} previewClassName="block">
          <div className="@container mx-auto w-full max-w-full min-w-48 resize-x overflow-auto rounded-lg border border-dashed border-border-strong bg-surface p-3">
            <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @2xl:grid-cols-4">
              {['Courses', 'Assignments', 'Students', 'Reports'].map((label) => (
                <div key={label} className="rounded-lg bg-primary-soft p-3 text-sm font-medium text-primary">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </Example>
      </Section>

      <Section title="Escape hatches">
        <Example
          title="CSS variables, arbitrary values and arbitrary properties"
          description="When the design system has no token for something, there is always an inline way out. These options are powerful, and they're also where consistency erodes, so a library should keep them inside components rather than in product code."
          code={escapeHatchCode}
        >
          <div
            style={{ '--sidebar-width': '12rem' } as CSSProperties}
            className="flex h-10 w-(--sidebar-width) items-center justify-center rounded-lg bg-primary-soft text-xs text-primary"
          >
            w-(--sidebar-width)
          </div>
          <div className="size-16 rounded-full bg-[conic-gradient(var(--primary),var(--success),var(--warning),var(--primary))]" />
          <p className="max-w-48 text-sm [text-wrap:balance]">Balanced text wraps evenly across lines</p>
        </Example>
      </Section>

      <Section title="The one gotcha everyone hits">
        <Alert tone="warning" title="Class names must exist as complete strings in source">
          Tailwind generates CSS by scanning files for class-like text. It never runs your code, so
          string interpolation silently produces classes with no CSS behind them.
        </Alert>
        <CodeBlock code={dynamicClassCode} />
      </Section>
    </Page>
  )
}

function ConfigNote({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-mono text-xs font-semibold text-primary">{term}</dt>
      <dd className="leading-relaxed text-fg-muted">{children}</dd>
    </div>
  )
}
