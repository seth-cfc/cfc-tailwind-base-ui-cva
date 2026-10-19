import type { ReactNode } from 'react'
import { CodeBlock, InlineCode } from '../components/docs/code-block'
import { Page, PageHeader, Section } from '../components/docs/page'
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '../components/ui/accordion'
import { Alert } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

type Verdict = 'strong' | 'good' | 'watch'

const scorecard: { area: string; verdict: Verdict; note: string }[] = [
  { area: 'Accessibility & keyboard', verdict: 'strong', note: 'Came free with every Base UI primitive. We wrote zero ARIA or focus code.' },
  { area: 'Setup cost', verdict: 'strong', note: 'Tailwind v4 is one Vite plugin and one CSS import. CVA and Base UI are plain installs.' },
  { area: 'Theming / dark mode', verdict: 'strong', note: 'CSS variables plus @theme inline. Dark mode is one class on <html>.' },
  { area: 'Type safety of the component API', verdict: 'good', note: 'VariantProps derives props from the config, and Base UI ships typed parts.' },
  { area: 'Multi-part component variants', verdict: 'watch', note: 'CVA has no slots. Tabs needed three cva() calls plus a context.' },
  { area: 'Readability of class strings', verdict: 'watch', note: 'Long strings. Needs the Prettier plugin and editor IntelliSense to stay sane.' },
  { area: 'API stability', verdict: 'watch', note: 'Base UI v1.0 shipped Dec 2025 and is on v1.9 already, with a few breaking changes in minors.' },
]

const verdictBadge: Record<Verdict, { tone: 'success' | 'primary' | 'warning'; label: string }> = {
  strong: { tone: 'success', label: 'Strong' },
  good: { tone: 'primary', label: 'Good' },
  watch: { tone: 'warning', label: 'Watch' },
}

const mergeClassNameCode = `
// ❌ Base UI allows className={(state) => …}. cn() would stringify the function.
<BaseSwitch.Root className={cn(base, className)} />

// ✅ src/lib/cn.ts
export function mergeClassName<State>(base: string, className?: string | ((s: State) => string | undefined)) {
  return typeof className === 'function'
    ? (state: State) => cn(base, className(state))
    : cn(base, className)
}
`

const sourceDirectiveCode = `
/* In each consuming app's CSS, if the library ships as an npm package */
@import 'tailwindcss';
@import '@platform/ui/tokens.css';
@source '../node_modules/@platform/ui/dist';   /* otherwise library classes are never generated */
`

const twMergeCode = `
// If we add a custom font-size token such as text-label,
// tailwind-merge assumes it is a COLOR and drops text-fg when both appear.
import { extendTailwindMerge } from 'tailwind-merge'

export const twMerge = extendTailwindMerge({
  extend: { theme: { text: ['label', 'caption'] } },
})
`

export function FindingsPage() {
  return (
    <Page>
      <PageHeader eyebrow="For the platform decision" title="Findings & tradeoffs">
        <p>
          First-hand notes from building this prototype: what was pleasant, what caused friction, and
          what still needs a decision before this becomes the platform library. Each point links back
          to code in this repo so it can be checked.
        </p>
      </PageHeader>

      <Section title="Scorecard">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-sunken text-xs text-fg-muted uppercase">
              <tr>
                <th className="px-4 py-2 font-semibold">Area</th>
                <th className="px-4 py-2 font-semibold">Verdict</th>
                <th className="px-4 py-2 font-semibold">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {scorecard.map((row) => (
                <tr key={row.area}>
                  <td className="px-4 py-3 font-medium">{row.area}</td>
                  <td className="px-4 py-3">
                    <Badge tone={verdictBadge[row.verdict].tone}>{verdictBadge[row.verdict].label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-fg-muted">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="What felt good">
        <div className="grid gap-4 md:grid-cols-2">
          <FindingCard title="Base UI's data attributes line up with Tailwind's variants">
            Base UI reports state as attributes (<InlineCode>data-checked</InlineCode>,{' '}
            <InlineCode>data-highlighted</InlineCode>, <InlineCode>data-popup-open</InlineCode>), and
            Tailwind v4 accepts those directly as variants: <InlineCode>data-checked:bg-primary</InlineCode>.
            No arbitrary <InlineCode>[data-state=open]</InlineCode> syntax and no JavaScript.
          </FindingCard>
          <FindingCard title="Animations without an animation library">
            <InlineCode>data-starting-style</InlineCode> / <InlineCode>data-ending-style</InlineCode>{' '}
            plus plain CSS transitions handle every enter and exit in the app. Base UI waits for the
            transition to finish before unmounting.
          </FindingCard>
          <FindingCard title="Composition through render is clean">
            <InlineCode>render=&#123;&lt;Button /&gt;&#125;</InlineCode> let every trigger reuse our
            Button, and <InlineCode>MenuLinkItem render=&#123;&lt;Link /&gt;&#125;</InlineCode> plugged
            React Router into a menu with no adapter code.
          </FindingCard>
          <FindingCard title="Docs ship inside the npm package">
            <InlineCode>node_modules/@base-ui/react/docs</InlineCode> holds the full markdown docs,
            Tailwind examples included, pinned to the installed version. This was the most reliable
            source while building, for people and AI agents alike.
          </FindingCard>
          <FindingCard title="CVA is small enough to understand completely">
            The whole API is <InlineCode>cva()</InlineCode>, <InlineCode>variants</InlineCode>,{' '}
            <InlineCode>compoundVariants</InlineCode>, <InlineCode>defaultVariants</InlineCode> and{' '}
            <InlineCode>VariantProps</InlineCode>. A new contributor can read{' '}
            <InlineCode>button.tsx</InlineCode> and follow it.
          </FindingCard>
          <FindingCard title="Forms lean on the platform">
            Base UI <InlineCode>Field</InlineCode> builds on native constraint validation and accepts
            server errors through <InlineCode>&lt;Form errors&gt;</InlineCode>. The whole demo form on
            the previous page has no per-field state.
          </FindingCard>
        </div>
      </Section>

      <Section title="Where we hit friction">
        <Accordion className="bg-surface-raised">
          <AccordionItem>
            <AccordionTrigger>className can be a function, so the usual cn() pattern breaks</AccordionTrigger>
            <AccordionPanel>
              <p className="pb-3">
                The common shadcn-style <InlineCode>cn(base, className)</InlineCode> silently produces
                garbage when a consumer passes Base UI&apos;s state function. Every wrapper in this
                repo uses a small helper instead. If we adopt the stack, this belongs in the library
                core and in a lint rule.
              </p>
              <CodeBlock code={mergeClassNameCode} title="src/lib/cn.ts" />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>CVA has no slots, so multi-part components need extra plumbing</AccordionTrigger>
            <AccordionPanel>
              A Tabs <InlineCode>appearance</InlineCode> variant has to style the list, each tab and
              the indicator. With CVA that means three <InlineCode>cva()</InlineCode> definitions and a
              React context to pass the variant down (see <InlineCode>tabs.tsx</InlineCode>).{' '}
              <InlineCode>tailwind-variants</InlineCode> solves this with slots and is worth a
              side-by-side spike before we commit.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>compoundVariants gets verbose for color matrices</AccordionTrigger>
            <AccordionPanel>
              Badge has 5 tones × 3 appearances = 15 explicit entries. It is readable and greppable,
              but each new tone costs three lines. Driving tone through a CSS variable (
              <InlineCode>--badge-color</InlineCode>) would collapse it, at the cost of less obvious
              code.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Base UI anatomy is verbose. You are building a library, not installing one.</AccordionTrigger>
            <AccordionPanel>
              A styled select is about 10 nested parts (Root, Trigger, Value, Icon, Portal, Positioner,
              Popup, List, Item, ItemIndicator, ItemText). That is great for flexibility, but product
              teams must never see it, so the wrapper layer is mandatory work. Projects like coss ui
              publish ready-made Base UI + Tailwind components and could be a starting point.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Fast-moving dependency</AccordionTrigger>
            <AccordionPanel>
              Base UI went from v1.0.0 (Dec 11, 2025) to v1.9.0. The changelog flags a few breaking
              changes in minor releases, mostly around components leaving preview. Pin exact versions
              in the library and read the changelog on every upgrade.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Links are not buttons</AccordionTrigger>
            <AccordionPanel>
              Base UI&apos;s Button deliberately refuses to render as an <InlineCode>&lt;a&gt;</InlineCode>.
              The fix is easy (export <InlineCode>buttonVariants</InlineCode> and put it on{' '}
              <InlineCode>&lt;Link&gt;</InlineCode>), but people coming from{' '}
              <InlineCode>asChild</InlineCode> patterns will trip over it.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Custom client messages and server errors don&apos;t compose cleanly</AccordionTrigger>
            <AccordionPanel>
              <InlineCode>&lt;FieldError match=&quot;valueMissing&quot;&gt;</InlineCode> only reads the
              browser&apos;s ValidityState, so it never shows errors passed through{' '}
              <InlineCode>&lt;Form errors&gt;</InlineCode>. A matchless{' '}
              <InlineCode>&lt;FieldError /&gt;</InlineCode> does show them, but it also repeats the
              browser&apos;s default message next to our custom ones. The demo form renders the server
              message conditionally with <InlineCode>match</InlineCode> and clears it on change.
              Finding that took reading Base UI&apos;s source. The library should hide this behind a
              single <InlineCode>&lt;FieldErrors messages=&#123;…&#125; /&gt;</InlineCode> helper.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Exporting cva() next to components trips the fast-refresh lint rule</AccordionTrigger>
            <AccordionPanel>
              <InlineCode>react/only-export-components</InlineCode> warns on every file that exports
              both <InlineCode>Button</InlineCode> and <InlineCode>buttonVariants</InlineCode>. Either
              move variants into <InlineCode>button.variants.ts</InlineCode> files or relax the rule
              for <InlineCode>src/components/ui</InlineCode>. The prototype leaves the warnings
              visible on purpose.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Long class strings need tooling</AccordionTrigger>
            <AccordionPanel>
              The Tailwind VS Code / Cursor IntelliSense extension and{' '}
              <InlineCode>prettier-plugin-tailwindcss</InlineCode> (class sorting) should be considered
              required. Without them, reviewing diffs of class strings is painful.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section
        title="Decisions needed before this becomes the platform library"
        description="These were out of scope for a single-app prototype, but each one changes how the library is built."
      >
        <div className="flex flex-col gap-4">
          <Alert tone="warning" title="1. Distribution: npm package or copy-in?">
            If the library ships as a package, every consuming app must tell Tailwind to scan it,
            because Tailwind only generates classes it finds in source. Copy-in (shadcn-style) avoids
            this but makes upgrades manual.
          </Alert>
          <CodeBlock code={sourceDirectiveCode} title="consumer app.css" />
          <Alert tone="warning" title="2. Where do tokens come from?">
            Tokens here are hand-written in <InlineCode>index.css</InlineCode>. The existing{' '}
            <InlineCode>cfc-tokens</InlineCode> repo could generate the <InlineCode>:root</InlineCode>{' '}
            / <InlineCode>.dark</InlineCode> variables so that design and code share one source of truth.
          </Alert>
          <Alert tone="warning" title="3. Custom scales need tailwind-merge configuration">
            Semantic colors merge correctly as-is. Custom non-color scales do not, and the failure is
            silent.
          </Alert>
          <CodeBlock code={twMergeCode} />
          <Alert tone="info" title="4. Compare against the DaisyUI + Base UI prototype">
            The sibling <InlineCode>cfc-daisy-ui-and-base-ui</InlineCode> repo takes the opposite
            approach: pre-built component classes from DaisyUI instead of our own CVA variants. Building
            the same screen in both would make the tradeoff concrete: less code and faster start
            versus full control of the variant API.
          </Alert>
        </div>
      </Section>
    </Page>
  )
}

function FindingCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 text-sm leading-relaxed text-fg-muted">{children}</CardContent>
    </Card>
  )
}
