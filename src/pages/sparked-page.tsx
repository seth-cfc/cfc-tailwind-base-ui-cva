import type { ReactNode } from 'react'
import { CodeBlock, InlineCode } from '../components/docs/code-block'
import { Page, PageHeader, Section } from '../components/docs/page'
import { Alert } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const sparkedLayers = [
  {
    name: 'daisyUI 5',
    job: 'Vocabulary + themes',
    tone: 'warning',
    body: 'Pre-built classes (btn, btn-primary, badge, card, skeleton) and semantic color roles (base-100, primary, error) defined per theme.',
  },
  {
    name: 'Tailwind v4',
    job: 'Tokens + gaps',
    tone: 'primary',
    body: 'Brand type scale, spacing, radius and touch-target tokens in @theme, plus utilities for whatever daisyUI cannot express.',
  },
  {
    name: 'Base UI',
    job: 'Behavior via adapter',
    tone: 'success',
    body: 'Focus, keyboard and ARIA. Only one folder may import @base-ui/react; everything else goes through a vendor-neutral barrel.',
  },
  {
    name: 'cva 1.0 beta',
    job: 'Typed daisy variants',
    tone: 'neutral',
    body: 'variant="outline" maps to btn-outline. A tailwind-merge hook is wired into cva itself via defineConfig.',
  },
] as const

const cssPipeline = [
  ['01-primitives.css', 'Every literal brand hex, once, as --sparked-* variables', 'Read only'],
  ['02-semantic.css', 'Two daisyUI themes (sparked, sparked-lite) mapping roles to primitives. No hex.', 'Read only'],
  ['03-tokens.css', 'Tailwind @theme: fonts, type scale, spacing, radius, touch target, color aliases', 'Read only'],
  ['04-base.css', '@layer base element defaults and the app canvas background', 'Read only'],
  ['05-components.css', 'App-wide daisyUI density tweaks', 'Editable'],
  ['06-print.css', '@page and print media rules', 'Editable'],
]

const globalsCode = `
/* app/globals.css: import order is contractual */
@import "tailwindcss";
@import "./styles/01-primitives.css";
@import "./styles/02-semantic.css";
@import "./styles/03-tokens.css";
@import "./styles/04-base.css";
@import "./styles/05-components.css";
@import "./styles/06-print.css";
`

const semanticCode = `
/* app/styles/02-semantic.css (excerpt) */
@plugin "daisyui" {
  themes: sparked --default, sparked-lite;
}

@plugin "daisyui/theme" {
  name: "sparked";
  default: true;
  color-scheme: dark;

  --color-base-100: var(--sparked-bg);
  --color-base-300: var(--sparked-bg-darkest);
  --color-primary: var(--sparked-green);
  --color-primary-content: var(--sparked-bg-darker);
  --color-error: var(--sparked-red);
  --color-error-content: var(--sparked-white);

  --radius-selector: 1.875rem;   /* drives badge, checkbox, toggle radius */
  --radius-field: 0.375rem;
  --radius-box: 0.5rem;
}

@plugin "daisyui/theme" {
  name: "sparked-lite";
  color-scheme: light;
  --color-base-100: var(--sparked-mint-50);
  --color-primary: var(--sparked-green-700);
  /* … */
}
`

const tokensCode = `
/* app/styles/03-tokens.css (excerpt) */
@theme {
  --text-2xl: 1.625rem;
  --text-2xl--line-height: 2.25rem;
  --text-2xl--font-weight: 600;

  --radius-pill: 1.875rem;   /* rounded-pill: buttons, pills */
  --radius-card: 1.25rem;    /* rounded-card */
  --size-touch: 2.75rem;     /* 44px, WCAG 2.5.5 */
  --spacing-8: 2.5rem;       /* intentional 40px, not Tailwind's 32px */
}

@utility min-h-touch {
  min-height: var(--size-touch);
}
`

const adapterCode = `
// components/external/base-ui/button.ts: the ONLY place allowed to import Base UI
import { Button as BaseUIButton } from '@base-ui/react/button'
export type HeadlessButtonProps = BaseUIButtonProps
export const HeadlessButton = BaseUIButton

// components/external/headless/index.ts: vendor-neutral barrel
export { HeadlessButton, HeadlessDialog, HeadlessSelect, HeadlessTabs, … } from '../base-ui'

// components/ui/Button/Button.tsx: the design system only sees "Headless*"
import { HeadlessButton } from '@/components/external/headless'
`

const cvaConfigCode = `
// cva.config.ts
import { defineConfig } from 'cva'
import { twMerge } from 'tailwind-merge'

export const { cva, cx, compose } = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
})

// lib/cn.ts: feature code gets the same merge
export function cn(...inputs: ClassValue[]) {
  return cx(clsx(...inputs))
}
`

const buttonCode = `
// components/ui/Button/Button.tsx (trimmed)
export const buttonVariants = cva({
  base: ['btn', 'inline-flex', 'w-fit', 'max-w-button', 'rounded-pill'],
  variants: {
    size:    { xs: 'btn-xs', sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg', xl: 'btn-xl' },
    color:   { primary: 'btn-primary', secondary: 'btn-secondary', error: 'btn-error', … },
    variant: { ghost: 'btn-ghost', link: 'btn-link', soft: 'btn-soft',
               outline: ['btn-outline', 'hover:bg-transparent'] },
    // Semantic meaning instead of a palette pick. Carries a contrast fix:
    // white on the dark theme's error red is 3.76:1, under the 4.5:1 floor.
    intent:  { destructive: '[[data-theme=sparked]_&]:text-base-300' },
    disabled: { true: 'btn-disabled' },
  },
  compoundVariants: [
    { color: 'primary', variant: undefined, size: 'md',
      class: ['min-h-touch px-8 border-2 text-lg font-semibold', 'hover:bg-accent …'] },
  ],
  defaultVariants: { color: 'primary', size: 'md' },
})

export interface ButtonProps
  extends PropsWithChildren<ButtonVariantProps>,
    Omit<HeadlessButtonProps, 'color' | 'className' | 'aria-busy'> {
  className?: string      // string only: Base UI's state-function form is not exposed
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, color, intent, size, variant, disabled = false, loading = false, type = 'button', ...props },
  ref,
) {
  const resolvedColor = intent === 'destructive' ? 'error' : color
  return (
    <HeadlessButton
      {...props}
      aria-busy={loading || undefined}
      className={cx(buttonVariants({ color: resolvedColor, intent, size, variant,
                                     disabled: disabled || loading }), className)}
      disabled={disabled || loading}
      ref={ref}
      type={type}
    >
      {loading && <span aria-hidden className="loading loading-spinner loading-sm" />}
      {children}
    </HeadlessButton>
  )
})
`

const tabsCode = `
// components/ui/Tab/Tab.tsx (excerpt): Base UI state + daisy roles + SparkEd tokens
export const tabTriggerVariants = cva({
  variants: {
    variant: {
      segmented: [
        'data-active:border-primary data-active:bg-tab-active data-active:text-white',
      ],
      wavy: [
        'data-active:z-20 data-active:text-white',
        '[[data-theme=sparked-lite]_&]:data-active:text-base-content',
      ],
    },
  },
})
`

const comparison: { topic: string; prototype: ReactNode; sparked: ReactNode }[] = [
  {
    topic: 'Where visual decisions live',
    prototype: 'Raw Tailwind utilities on semantic tokens (bg-primary, rounded-lg)',
    sparked: 'daisyUI component classes inside CVA (btn btn-primary btn-outline), Tailwind only to fill gaps',
  },
  {
    topic: 'Theme definition',
    prototype: ':root / .dark CSS variables + @theme inline',
    sparked: 'Two @plugin "daisyui/theme" blocks fed by a primitives file; switched with data-theme',
  },
  {
    topic: 'Per-theme overrides',
    prototype: 'dark: variant',
    sparked: '[[data-theme=sparked-lite]_&]: arbitrary variant, used for contrast fixes',
  },
  {
    topic: 'Base UI import boundary',
    prototype: 'components/ui imports @base-ui/react directly',
    sparked: 'Only components/external/base-ui may; the design system imports Headless* from a barrel',
  },
  {
    topic: 'CVA package',
    prototype: 'class-variance-authority 0.7 (stable) + a separate cn()',
    sparked: 'cva 1.0.0-beta.4 with defineConfig and a twMerge onComplete hook',
  },
  {
    topic: 'className prop',
    prototype: 'string or Base UI state function, via mergeClassName()',
    sparked: 'Omitted from Base UI props, then re-added as string only',
  },
  {
    topic: 'Framework',
    prototype: 'Vite + React Router (data mode)',
    sparked: 'Next.js 16 App Router; Base UI wrappers are client components',
  },
  {
    topic: 'Guardrails',
    prototype: 'Conventions written on the Putting it together page',
    sparked: 'Cursor rules, LLM read-only CSS files, a theme contrast test suite, a UI playground and Figma Code Connect per component',
  },
]

export function SparkedPage() {
  return (
    <Page>
      <PageHeader eyebrow="Prior art in our own codebase" title="How SparkEd does it">
        <p>
          SparkEd, the K–5 executive function app, already ships this stack in production, with
          daisyUI added on top. Its choices are the best evidence we have of what the combination
          looks like under real product pressure. Everything on this page is excerpted from the{' '}
          <InlineCode>sparked</InlineCode> repo (Next.js 16.3, daisyUI 5.5, Base UI 1.5,{' '}
          <InlineCode>cva</InlineCode> 1.0.0-beta.4) as of October 15, 2026.
        </p>
      </PageHeader>

      <Alert tone="info" title="Excerpts, not live demos">
        This prototype does not install daisyUI, so SparkEd&apos;s components are shown as source.
        Excerpts are trimmed for length; file paths point to the originals so they can be checked.
      </Alert>

      <Section
        title="Four layers instead of three"
        description="SparkEd keeps the same split of responsibilities as this prototype and inserts daisyUI between Tailwind and CVA. daisyUI supplies the names, CVA chooses between them, Tailwind fills the gaps, and Base UI makes everything behave."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {sparkedLayers.map((layer) => (
            <Card key={layer.name}>
              <CardHeader>
                <Badge tone={layer.tone} className="w-fit">
                  {layer.job}
                </Badge>
                <CardTitle className="pt-2">{layer.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 text-sm leading-relaxed text-fg-muted">{layer.body}</CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Theme: a six-file CSS pipeline"
        description={
          <>
            Instead of one stylesheet, SparkEd chains six files in a fixed order. Colors flow
            primitives → daisyUI theme roles → Tailwind aliases, so changing one hex in{' '}
            <InlineCode>01-primitives.css</InlineCode> recolors both themes and every component. The
            first four files open with <InlineCode>{'/* LLM Permissions: Read only */'}</InlineCode>, and
            coding agents are told not to touch the brand contract.
          </>
        }
      >
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-sunken text-xs text-fg-muted uppercase">
              <tr>
                <th className="px-4 py-2 font-semibold">File</th>
                <th className="px-4 py-2 font-semibold">Holds</th>
                <th className="px-4 py-2 font-semibold">Agents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cssPipeline.map(([file, holds, access]) => (
                <tr key={file}>
                  <td className="px-4 py-2 font-mono text-xs">{file}</td>
                  <td className="px-4 py-2 text-fg-muted">{holds}</td>
                  <td className="px-4 py-2">
                    <Badge tone={access === 'Read only' ? 'warning' : 'success'}>{access}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <CodeBlock code={globalsCode} title="sparked/app/globals.css" />
          <CodeBlock code={tokensCode} title="sparked/app/styles/03-tokens.css" />
        </div>
        <CodeBlock code={semanticCode} title="sparked/app/styles/02-semantic.css" />
        <p className="text-sm leading-relaxed text-fg-muted">
          Compare with this prototype&apos;s <InlineCode>src/index.css</InlineCode>: the job is the
          same (semantic roles that switch per theme), but daisyUI&apos;s theme plugin replaces the
          hand-written <InlineCode>:root</InlineCode> / <InlineCode>.dark</InlineCode> blocks and{' '}
          <InlineCode>@theme inline</InlineCode> mapping. The theme is chosen with{' '}
          <InlineCode>data-theme=&quot;sparked&quot;</InlineCode> on <InlineCode>&lt;html&gt;</InlineCode>.
        </p>
      </Section>

      <Section
        title="Base UI behind a swappable adapter"
        description="SparkEd treats the headless library as a replaceable vendor. Swapping Base UI for another library means rewriting one folder; components/ui import paths never change."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <AdapterStep
            path="components/external/base-ui/"
            body="One file per primitive. The only folder allowed to import @base-ui/react."
          />
          <AdapterStep
            path="components/external/headless/"
            body="Barrel that re-exports HeadlessButton, HeadlessDialog, HeadlessSelect… Repoint it to swap vendors."
          />
          <AdapterStep
            path="components/ui/"
            body="Design system. Composes Headless* with CVA + daisyUI. Never imports a vendor."
          />
        </div>
        <CodeBlock code={adapterCode} title="adapter chain" />
      </Section>

      <Section
        title="CVA: the 1.0 beta with merging built in"
        description={
          <>
            SparkEd uses the <InlineCode>cva</InlineCode> package (1.0 beta), not{' '}
            <InlineCode>class-variance-authority</InlineCode>. Its <InlineCode>defineConfig</InlineCode>{' '}
            runs tailwind-merge on every result, so <InlineCode>cx()</InlineCode> is both the joiner and
            the conflict resolver. The API also changes shape slightly: <InlineCode>cva(&#123; base,
            variants &#125;)</InlineCode> takes a single object, and <InlineCode>compose()</InlineCode>{' '}
            combines variant functions.
          </>
        }
      >
        <CodeBlock code={cvaConfigCode} title="sparked/cva.config.ts + lib/cn.ts" />
      </Section>

      <Section
        title="Anatomy of SparkEd's Button"
        description="The same shape as this prototype's Button, but every variant value is a daisyUI class. Worth noticing: the semantic intent prop, the contrast fix it carries, and daisy's loading spinner."
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
          <CodeBlock code={buttonCode} title="sparked/components/ui/Button/Button.tsx" />
          <ul className="flex flex-col gap-4 text-sm">
            <Observation title="daisyUI does the heavy lifting">
              <InlineCode>btn</InlineCode> brings padding, focus, hover and disabled styles. The CVA
              config mostly picks between daisy modifiers.
            </Observation>
            <Observation title="intent over color">
              <InlineCode>intent=&quot;destructive&quot;</InlineCode> says what the button does and
              inherits the contrast fix, so call sites never hand-pick <InlineCode>color=&quot;error&quot;</InlineCode>.
            </Observation>
            <Observation title="Function className is opted out">
              Base UI&apos;s <InlineCode>className</InlineCode> is omitted and re-declared as a string.
              That sidesteps the problem this prototype solved with <InlineCode>mergeClassName()</InlineCode>,
              at the cost of the state-function feature.
            </Observation>
            <Observation title="Accessibility is part of the API">
              <InlineCode>loading</InlineCode> sets <InlineCode>aria-busy</InlineCode> and disables the
              button, so pending states are announced rather than silent.
            </Observation>
          </ul>
        </div>
      </Section>

      <Section
        title="Where daisyUI and Base UI collide"
        description="daisyUI was designed around native HTML. Base UI renders its own DOM and reports state through data attributes. SparkEd documents three ways of resolving the mismatch."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">1. Skip the daisy component class</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 text-sm leading-relaxed text-fg-muted">
              daisy&apos;s <InlineCode>.checkbox</InlineCode> styles <InlineCode>:checked</InlineCode>,
              but Base UI renders <InlineCode>&lt;span role=&quot;checkbox&quot;&gt;</InlineCode>, so the
              class never activates. Checkbox and Select use Base UI&apos;s{' '}
              <InlineCode>data-checked</InlineCode> / <InlineCode>data-popup-open</InlineCode> with
              daisy <em>color</em> utilities instead.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">2. Stay native when Base UI&apos;s DOM won&apos;t map</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 text-sm leading-relaxed text-fg-muted">
              Toggle stays a native checkbox with daisy <InlineCode>toggle</InlineCode>, because Base
              UI&apos;s Switch DOM does not match daisy&apos;s selectors. A <em>native exception
              registry</em> lists every primitive that deliberately skips Base UI.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">3. Shared theme variables bite</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 text-sm leading-relaxed text-fg-muted">
              <InlineCode>--radius-selector</InlineCode> (30px for pill buttons) also rounds badges,
              checkboxes and toggles, which turns a daisy checkbox into a circle. One theme variable
              can&apos;t be narrowed for one component.
            </CardContent>
          </Card>
        </div>
        <p className="text-sm leading-relaxed text-fg-muted">
          Where Base UI and daisy do coexist, styling reads like this prototype: Base UI state
          attributes as Tailwind variants, with daisy roles and SparkEd tokens as values.
        </p>
        <CodeBlock code={tabsCode} title="sparked/components/ui/Tab/Tab.tsx" />
      </Section>

      <Section title="This prototype vs SparkEd, side by side">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-sunken text-xs text-fg-muted uppercase">
              <tr>
                <th className="px-4 py-2 font-semibold">Topic</th>
                <th className="px-4 py-2 font-semibold">This prototype</th>
                <th className="px-4 py-2 font-semibold">SparkEd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparison.map((row) => (
                <tr key={row.topic} className="align-top">
                  <td className="px-4 py-3 font-medium">{row.topic}</td>
                  <td className="px-4 py-3 text-fg-muted">{row.prototype}</td>
                  <td className="px-4 py-3 text-fg-muted">{row.sparked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="What the platform library could borrow"
        description="SparkEd solved several problems this prototype only noticed. These are candidates to adopt regardless of whether the platform library keeps daisyUI."
      >
        <div className="flex flex-col gap-3">
          <Alert tone="success" title="Adopt: the headless adapter boundary">
            Cheap to set up, and it turns &quot;Base UI is moving fast&quot; from a risk into a
            contained, one-folder upgrade.
          </Alert>
          <Alert tone="success" title="Adopt: cva 1.0's defineConfig merge hook">
            Removes the separate <InlineCode>cn()</InlineCode> wiring. It is still a beta, so pin the
            exact version as SparkEd does.
          </Alert>
          <Alert tone="success" title="Adopt: semantic intent props and a contrast test suite">
            SparkEd asserts every token pair&apos;s WCAG ratio in{' '}
            <InlineCode>lib/a11y/__tests__/theme-contrast.test.ts</InlineCode>, so a palette change
            that breaks contrast fails CI.
          </Alert>
          <Alert tone="warning" title="Decide: daisyUI or not">
            daisyUI gives a fast, shared vocabulary and theme plugin. In exchange, the library
            inherits daisy&apos;s native-HTML assumptions and shared theme variables, and needs the
            exception registry above. This prototype shows the no-daisy alternative; SparkEd shows
            the with-daisy one in production.
          </Alert>
          <Alert tone="info" title="Open question: string-only className">
            SparkEd&apos;s string-only <InlineCode>className</InlineCode> is simpler for product code.
            The platform library should pick one rule and enforce it everywhere.
          </Alert>
        </div>
      </Section>
    </Page>
  )
}

function AdapterStep({ path, body }: { path: string; body: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface-raised p-4">
      <code className="font-mono text-xs font-semibold text-primary">{path}</code>
      <p className="text-sm leading-relaxed text-fg-muted">{body}</p>
    </div>
  )
}

function Observation({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="flex flex-col gap-1">
      <p className="font-semibold">{title}</p>
      <p className="leading-relaxed text-fg-muted">{children}</p>
    </li>
  )
}
