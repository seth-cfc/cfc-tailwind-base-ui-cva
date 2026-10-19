import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import badgeSource from '../components/ui/badge.tsx?raw'
import { CodeBlock, InlineCode } from '../components/docs/code-block'
import { Example } from '../components/docs/example'
import { Page, PageHeader, Section } from '../components/docs/page'
import { Alert } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { Button, buttonVariants, type ButtonVariantProps } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Switch } from '../components/ui/switch'
import { Toggle, ToggleGroup } from '../components/ui/toggle-group'

type Intent = NonNullable<ButtonVariantProps['intent']>
type Size = NonNullable<ButtonVariantProps['size']>

const intents: Intent[] = ['primary', 'secondary', 'outline', 'ghost', 'danger']
const sizes: Size[] = ['sm', 'md', 'lg', 'icon']
const tones = ['neutral', 'primary', 'success', 'warning', 'danger'] as const
const appearances = ['solid', 'soft', 'outline'] as const

const minimalCvaCode = `
import { cva, type VariantProps } from 'class-variance-authority'

const button = cva('inline-flex items-center rounded-lg font-medium', {
  variants: {
    intent: {
      primary: 'bg-primary text-primary-fg hover:bg-primary-hover',
      outline: 'border border-border-strong hover:bg-surface-sunken',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
    },
  },
  defaultVariants: { intent: 'primary', size: 'md' },
})

button()                                  // primary + md
button({ intent: 'outline', size: 'sm' }) // outline + sm

type ButtonProps = VariantProps<typeof button>
//   ^? { intent?: 'primary' | 'outline' | null; size?: 'sm' | 'md' | null }
`

const typeSafetyCode = `
<Button intent="primary" size="lg" />   // ✅
<Button intent="warning" />             // ❌ Type '"warning"' is not assignable to type
                                        //    '"primary" | "secondary" | "outline" | "ghost" | "danger"'
<Button fullWidth />                    // ✅ boolean variants become boolean props
`

const mergeCode = `
// cn() = twMerge(clsx(...)). Later conflicting classes replace earlier ones.
cn(buttonVariants(), 'bg-pink-600 rounded-full')
// → "… text-primary-fg … bg-pink-600 rounded-full"   (bg-primary and rounded-lg removed)

// Plain string concatenation keeps both. Which one wins is decided by
// the order rules appear in the generated stylesheet, not by your intent.
\`\${buttonVariants()} bg-pink-600 rounded-full\`
`

const linkCode = `
// Base UI says links should not be rendered as <Button>.
// Because CVA returns a plain string, links can still look like buttons:
<Link to="/together" className={buttonVariants({ intent: 'outline' })}>
  See it all together
</Link>
`

export function CvaPage() {
  const [intent, setIntent] = useState<Intent>('primary')
  const [size, setSize] = useState<Size>('md')
  const [fullWidth, setFullWidth] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const generatedClassName = buttonVariants({ intent, size, fullWidth })
  const usageCode = `<Button intent="${intent}" size="${size}"${fullWidth ? ' fullWidth' : ''}${
    disabled ? ' disabled' : ''
  }>${size === 'icon' ? '★' : 'Save changes'}</Button>`

  return (
    <Page>
      <PageHeader eyebrow="Layer 3 · How it is configured" title="Class Variance Authority">
        <p>
          CVA is a roughly 1&nbsp;KB function that maps variant props to class strings. It is the
          piece that turns &quot;a pile of Tailwind classes&quot; into a component API designers and
          engineers can talk about: <InlineCode>intent</InlineCode>, <InlineCode>size</InlineCode>,{' '}
          <InlineCode>tone</InlineCode>. It has no React dependency and no runtime styling. It only
          builds strings.
        </p>
      </PageHeader>

      <Section title="The whole API in one example">
        <CodeBlock code={minimalCvaCode} title="button.ts" />
      </Section>

      <Section
        title="Variant playground"
        description="Pick variants and watch the props, the rendered button and the exact class string CVA produced."
      >
        <Card>
          <CardContent className="grid gap-6 lg:grid-cols-[18rem_1fr]">
            <div className="flex flex-col gap-5">
              <PlaygroundControl label="intent">
                <ToggleGroup
                  aria-label="Intent"
                  value={[intent]}
                  onValueChange={(next) => next[0] && setIntent(next[0] as Intent)}
                >
                  {intents.map((option) => (
                    <Toggle key={option} value={option}>
                      {option}
                    </Toggle>
                  ))}
                </ToggleGroup>
              </PlaygroundControl>
              <PlaygroundControl label="size">
                <ToggleGroup
                  aria-label="Size"
                  value={[size]}
                  onValueChange={(next) => next[0] && setSize(next[0] as Size)}
                >
                  {sizes.map((option) => (
                    <Toggle key={option} value={option}>
                      {option}
                    </Toggle>
                  ))}
                </ToggleGroup>
              </PlaygroundControl>
              <label className="flex items-center justify-between gap-3 text-sm">
                <span className="font-mono text-xs text-fg-muted">fullWidth</span>
                <Switch size="sm" checked={fullWidth} onCheckedChange={setFullWidth} />
              </label>
              <label className="flex items-center justify-between gap-3 text-sm">
                <span className="font-mono text-xs text-fg-muted">disabled (Base UI prop)</span>
                <Switch size="sm" checked={disabled} onCheckedChange={setDisabled} />
              </label>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex min-h-32 items-center justify-center rounded-xl border border-border bg-surface p-6">
                <Button intent={intent} size={size} fullWidth={fullWidth} disabled={disabled}>
                  {size === 'icon' ? '★' : 'Save changes'}
                </Button>
              </div>
              <CodeBlock code={usageCode} title="usage" />
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-fg-muted">
                  buttonVariants(&#123; intent, size, fullWidth &#125;) returned:
                </p>
                <p className="rounded-lg bg-surface-sunken p-3 font-mono text-xs leading-relaxed break-words">
                  {generatedClassName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section
        title="compoundVariants: when two variants decide together"
        description={
          <>
            A badge&apos;s color depends on both its <InlineCode>tone</InlineCode> and its{' '}
            <InlineCode>appearance</InlineCode>. Instead of nested ternaries, each combination is a
            row in <InlineCode>compoundVariants</InlineCode>. 5 tones × 3 appearances gives 15 entries,
            which is honest but verbose. See the findings page for the tradeoff.
          </>
        }
      >
        <Example title="Badge matrix" code={badgeSource} codeTitle="src/components/ui/badge.tsx" previewClassName="block">
          <div className="mx-auto grid w-fit grid-cols-[auto_repeat(3,auto)] items-center gap-x-6 gap-y-3 text-sm">
            <span />
            {appearances.map((appearance) => (
              <span key={appearance} className="font-mono text-xs text-fg-muted">
                {appearance}
              </span>
            ))}
            {tones.map((tone) => (
              <BadgeRow key={tone} tone={tone} />
            ))}
          </div>
        </Example>
      </Section>

      <Section
        title="Types come for free"
        description={
          <>
            <InlineCode>VariantProps&lt;typeof buttonVariants&gt;</InlineCode> reads the config, so the
            component props and the styles cannot drift apart. Autocomplete lists every intent.
          </>
        }
      >
        <CodeBlock code={typeSafetyCode} />
      </Section>

      <Section
        title="Overrides: why cn() uses tailwind-merge"
        description="Library components need an escape hatch: consumers pass className. Without tailwind-merge, an override and a default fight, and the result depends on stylesheet order."
      >
        <Example
          title="Same override, two merge strategies"
          code={mergeCode}
          description={
            <>
              Both buttons receive <InlineCode>bg-pink-600 rounded-full</InlineCode>. The first goes
              through <InlineCode>cn()</InlineCode>, the second is plain concatenation.
            </>
          }
        >
          <div className="flex flex-col items-center gap-2">
            <Button className="rounded-full bg-pink-600 hover:bg-pink-700">With cn()</Button>
            <span className="font-mono text-xs text-fg-muted">override wins</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button className={`${buttonVariants()} rounded-full bg-pink-600`}>Concatenated</button>
            <span className="font-mono text-xs text-fg-muted">stylesheet order decides</span>
          </div>
        </Example>
      </Section>

      <Section
        title="Variants are just strings, so they work anywhere"
        description="CVA output is not tied to a component. That matters when you need the look of a component on a different element."
      >
        <Example title="A router Link styled as a button" code={linkCode}>
          <Link to="/together" className={buttonVariants({ intent: 'outline' })}>
            See it all together →
          </Link>
        </Example>
        <Alert tone="info" title="What about tailwind-variants?">
          <InlineCode>tailwind-variants</InlineCode> is the main alternative. It adds{' '}
          <em>slots</em> (variants for multi-part components like Dialog or Tabs) and merges classes
          automatically. In this prototype, multi-part components needed one <InlineCode>cva()</InlineCode>{' '}
          per part plus a React context to share the variant. Look at{' '}
          <InlineCode>tabs.tsx</InlineCode> for the cost.
        </Alert>
      </Section>
    </Page>
  )
}

function PlaygroundControl({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-xs text-fg-muted">{label}</span>
      {children}
    </div>
  )
}

function BadgeRow({ tone }: { tone: (typeof tones)[number] }) {
  return (
    <>
      <span className="font-mono text-xs text-fg-muted">{tone}</span>
      {appearances.map((appearance) => (
        <Badge key={appearance} tone={tone} appearance={appearance}>
          {tone}
        </Badge>
      ))}
    </>
  )
}
