import { CodeBlock, InlineCode } from '../components/docs/code-block'
import { Page, PageHeader, Section } from '../components/docs/page'
import { Alert } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'

const layerChanges = [
  {
    layer: 'Tailwind v4',
    vite: '@tailwindcss/vite plugin in vite.config.ts; src/index.css imported from main.tsx',
    next: '@tailwindcss/postcss in postcss.config.mjs; app/globals.css imported once from app/layout.tsx',
  },
  {
    layer: 'Base UI',
    vite: 'Everything runs in the browser; no directives needed',
    next: "Every wrapper file starts with 'use client'. Server Components can render them but can only pass serializable props.",
  },
  {
    layer: 'CVA',
    vite: 'buttonVariants() callable anywhere',
    next: "Pure function, so it works on the server, unless it is exported from a 'use client' module (see the gotcha below)",
  },
  {
    layer: 'Routing',
    vite: 'React Router createBrowserRouter in src/router.tsx',
    next: 'File-system routes under app/; next/link and usePathname replace Link and NavLink',
  },
  {
    layer: 'Fonts',
    vite: 'Google Fonts <link> in index.html',
    next: 'next/font (local or google) exposes a CSS variable that @theme points at',
  },
  {
    layer: 'Theme',
    vite: 'useTheme() toggles .dark after mount',
    next: 'Server renders the theme attribute on <html> so the first paint is correct',
  },
]

const postcssCode = `
// postcss.config.mjs  (replaces the Vite plugin)
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
export default config
`

const globalsCode = `
/* app/globals.css: the same file as this prototype's src/index.css */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

:root { --surface: oklch(0.99 0 0); --primary: oklch(0.55 0.2 264); /* … */ }
.dark { --surface: oklch(0.18 0.01 264); /* … */ }

@theme inline {
  --color-surface: var(--surface);
  --color-primary: var(--primary);
  --font-sans: var(--font-inter);        /* set by next/font in layout.tsx */
  --font-mono: var(--font-jetbrains-mono);
}
`

const layoutCode = `
// app/layout.tsx: a Server Component
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { cookies } from 'next/headers'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = { title: 'Platform UI' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = (await cookies()).get('theme')?.value === 'dark' ? 'dark' : ''

  return (
    <html lang="en" className={\`\${inter.variable} \${mono.variable} \${theme}\`}>
      <body className="bg-surface font-sans text-fg antialiased">
        {/* Base UI asks for an isolated root so portaled popups sit above page z-indexes.
            Next has no #root, so the layout provides one. */}
        <div className="isolate">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  )
}
`

const providersCode = `
// app/providers.tsx
'use client'

import { ToastProvider, Toaster } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </ToastProvider>
  )
}
`

const useClientCode = `
// components/ui/dialog.tsx
'use client'   // Base UI uses state, effects, and refs, so the wrapper is a client entry point

import { Dialog as BaseDialog } from '@base-ui/react/dialog'
export const Dialog = BaseDialog.Root
export const DialogTrigger = BaseDialog.Trigger
// …
`

const serverPageCode = `
// app/assignments/page.tsx: a Server Component (no directive)
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getAssignments } from '@/lib/api'

export default async function AssignmentsPage() {
  const assignments = await getAssignments()   // runs on the server

  return (
    <Dialog>
      {/* ✅ A rendered element is serializable, so the render prop can cross */}
      <DialogTrigger render={<Button intent="outline">View {assignments.length}</Button>} />
      <DialogContent>…</DialogContent>
    </Dialog>
  )
}
`

const serializableCode = `
// Still inside the Server Component above:

<Button onClick={() => track('open')}>Open</Button>
// ❌ Functions cannot be passed from a Server Component to a Client Component

<Tab className={(state) => (state.active ? 'font-bold' : '')} />
// ❌ Same rule: Base UI's function-form className is a function prop

<Tab className="data-active:font-bold" />
// ✅ Express state with data-* variants instead; the string crosses fine
`

const variantsGotchaCode = `
// components/ui/button.tsx
'use client'
export const buttonVariants = cva(/* … */)
export function Button(props) { /* … */ }

// app/page.tsx (Server Component)
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

<Link href="/new" className={buttonVariants({ intent: 'primary' })}>New</Link>
// 💥 Error: Attempted to call buttonVariants() from the server but buttonVariants
//    is on the client. It's not possible to invoke a client function from the
//    server, it can only be rendered as a Component or passed to props of a
//    Client Component.
`

const variantsFixCode = `
// Option A: split pure styling from the client wrapper
// components/ui/button.variants.ts   (no directive, importable from anywhere)
export const buttonVariants = cva(/* … */)

// components/ui/button.tsx
'use client'
import { buttonVariants } from './button.variants'

// Option B (what SparkEd does): wrap the call in a client component
// components/ui/ButtonLink/ButtonLink.tsx
'use client'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'

export function ButtonLink({ variant, size, className, ...props }) {
  return <Link {...props} className={cx(buttonVariants({ variant, size }), className)} />
}
`

const linksCode = `
// Menu items that navigate: Base UI owns the keyboard behavior, Next owns the routing
'use client'
import Link from 'next/link'

<MenuLinkItem render={<Link href="/settings" />}>Settings</MenuLinkItem>

// Active nav state: React Router's NavLink becomes usePathname()
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavItem({ href, children }) {
  const active = usePathname() === href
  return (
    <Link href={href} aria-current={active ? 'page' : undefined}
      className="rounded-lg px-3 py-2 aria-[current=page]:bg-primary-soft">
      {children}
    </Link>
  )
}
`

const themeCode = `
// app/theme-switch.tsx
'use client'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'

export function ThemeSwitch({ initialDark }: { initialDark: boolean }) {
  const router = useRouter()
  return (
    <Switch
      defaultChecked={initialDark}
      onCheckedChange={(dark) => {
        document.cookie = \`theme=\${dark ? 'dark' : 'light'}; path=/; max-age=31536000\`
        document.documentElement.classList.toggle('dark', dark)
        router.refresh()   // keeps server-rendered HTML in sync with the cookie
      }}
    />
  )
}
`

const routeMap = [
  ['/', 'app/page.tsx'],
  ['/tailwind', 'app/tailwind/page.tsx'],
  ['/base-ui', 'app/base-ui/page.tsx'],
  ['/cva', 'app/cva/page.tsx'],
  ['/together', 'app/together/page.tsx'],
  ['/sparked', 'app/sparked/page.tsx'],
  ['/nextjs', 'app/nextjs/page.tsx'],
  ['/findings', 'app/findings/page.tsx'],
  ['AppLayout (sidebar + header)', 'app/layout.tsx + a client <Sidebar /> for active state'],
  ['* (NotFoundPage)', 'app/not-found.tsx'],
]

const componentSplit = [
  {
    side: 'Server',
    tone: 'success',
    items: 'Card, Alert, Badge, PageHeader, Section, layout chrome, anything that only takes strings and children',
  },
  {
    side: 'Client',
    tone: 'primary',
    items: "Button, Dialog, Menu, Select, Popover, Tooltip, Tabs, Accordion, Switch, ToggleGroup, Field/Form, Toast. Every Base UI wrapper.",
  },
] as const

export function NextjsPage() {
  return (
    <Page>
      <PageHeader eyebrow="Framework integration" title="Using it with Next.js">
        <p>
          This prototype runs on Vite, but most CFC product apps (SparkEd included) are Next.js App
          Router apps. The stack ports over almost unchanged. What changes is that every component
          now lives on one side of the server/client boundary, and that decides where Base UI, CVA,
          and function props are allowed. Details below are checked against the Next.js 16.3 docs
          shipped in SparkEd&apos;s <InlineCode>node_modules/next/dist/docs</InlineCode>.
        </p>
      </PageHeader>

      <Alert tone="info" title="Code on this page is illustrative">
        This app cannot run Server Components, so the Next.js snippets are shown as source. They
        use this prototype&apos;s component names so you can compare them with the live demos on
        the other pages.
      </Alert>

      <Section
        title="What changes, layer by layer"
        description="Tailwind and CVA barely notice the framework. Base UI and routing are where the real work is."
      >
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-sunken text-xs text-fg-muted uppercase">
              <tr>
                <th className="px-4 py-2 font-semibold">Layer</th>
                <th className="px-4 py-2 font-semibold">Vite (this prototype)</th>
                <th className="px-4 py-2 font-semibold">Next.js App Router</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {layerChanges.map((row) => (
                <tr key={row.layer} className="align-top">
                  <td className="px-4 py-3 font-medium">{row.layer}</td>
                  <td className="px-4 py-3 text-fg-muted">{row.vite}</td>
                  <td className="px-4 py-3 text-fg-muted">{row.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Setup: Tailwind, fonts, and providers"
        description={
          <>
            Next.js compiles CSS through PostCSS, so Tailwind v4 uses{' '}
            <InlineCode>@tailwindcss/postcss</InlineCode> instead of the Vite plugin. The stylesheet
            itself is unchanged: tokens, <InlineCode>@theme inline</InlineCode>, and the dark variant
            copy over as they are.
          </>
        }
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <CodeBlock code={postcssCode} title="postcss.config.mjs" />
          <CodeBlock code={globalsCode} title="app/globals.css" />
        </div>
        <CodeBlock code={layoutCode} title="app/layout.tsx" />
        <CodeBlock code={providersCode} title="app/providers.tsx" />
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-fg-muted">
          <li>
            <strong className="text-fg">Fonts:</strong> <InlineCode>next/font</InlineCode> self-hosts
            the files and sets a CSS variable on <InlineCode>&lt;html&gt;</InlineCode>;{' '}
            <InlineCode>@theme</InlineCode> points <InlineCode>--font-sans</InlineCode> at it, so{' '}
            <InlineCode>font-sans</InlineCode> keeps working. SparkEd uses{' '}
            <InlineCode>next/font/local</InlineCode> rather than <InlineCode>/google</InlineCode>{' '}
            because the Google variant downloads at build time, which Cloud Agents&apos; network
            allowlist blocks.
          </li>
          <li>
            <strong className="text-fg">Providers:</strong> Toast and Tooltip providers hold state,
            so they live in a <InlineCode>&apos;use client&apos;</InlineCode> file. The layout stays a
            Server Component and passes the page in as <InlineCode>children</InlineCode>, which are
            already-rendered elements and may cross the boundary.
          </li>
          <li>
            <strong className="text-fg">Isolation:</strong> Base UI&apos;s quick start puts{' '}
            <InlineCode>isolation: isolate</InlineCode> on the app root so portaled popups always
            stack above page content. This prototype sets it on <InlineCode>#root</InlineCode>; in
            Next.js the layout&apos;s wrapper <InlineCode>div</InlineCode> does the job.
          </li>
        </ul>
      </Section>

      <Section
        title="The server/client boundary"
        description={
          <>
            App Router pages are Server Components by default. Base UI components need state,
            effects, and refs, so each wrapper file is marked <InlineCode>&apos;use client&apos;</InlineCode>.
            A Server Component can still render them directly; the directive only marks where the
            client bundle starts.
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {componentSplit.map((group) => (
            <div key={group.side} className="flex flex-col gap-2 rounded-xl border border-border bg-surface-raised p-4">
              <Badge tone={group.tone} className="w-fit">
                {group.side} Component
              </Badge>
              <p className="text-sm leading-relaxed text-fg-muted">{group.items}</p>
            </div>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-fg-muted">
          SparkEd follows the same split: across its 36 <InlineCode>components/ui</InlineCode>{' '}
          folders, only 16 files carry <InlineCode>&apos;use client&apos;</InlineCode> (the Base
          UI-backed ones), while primitives like{' '}
          <InlineCode>Card</InlineCode>, <InlineCode>Heading</InlineCode>, and{' '}
          <InlineCode>Skeleton</InlineCode> stay on the server and ship no JavaScript.
        </p>
        <div className="grid gap-4 xl:grid-cols-2">
          <CodeBlock code={useClientCode} title="components/ui/dialog.tsx" />
          <CodeBlock code={serverPageCode} title="app/assignments/page.tsx" />
        </div>
        <p className="text-sm leading-relaxed text-fg-muted">
          The one rule that bites: props passed from a Server Component to a Client Component must
          be serializable. Strings, numbers, plain objects, and rendered elements cross; functions do
          not. That includes Base UI&apos;s function-form <InlineCode>className</InlineCode>, which
          this prototype&apos;s <InlineCode>mergeClassName()</InlineCode> supports.
        </p>
        <CodeBlock code={serializableCode} title="What can cross the boundary" />
        <Alert tone="info" title="This is a point for SparkEd's string-only className">
          The Findings page lists string-only <InlineCode>className</InlineCode> as an open question.
          In Next.js the function form only works inside client files, while{' '}
          <InlineCode>data-*</InlineCode> variants work from both sides. That makes strings the safer
          default for a platform library.
        </Alert>
      </Section>

      <Section
        title={"Gotcha: calling buttonVariants() from the server"}
        description={
          <>
            CVA functions are pure, so they should work in Server Components. They do, unless they
            are exported from a <InlineCode>&apos;use client&apos;</InlineCode> file. Every export of
            such a file becomes a client reference on the server, and calling one throws.
          </>
        }
      >
        <CodeBlock code={variantsGotchaCode} title="Fails at render time" />
        <CodeBlock code={variantsFixCode} title="Two fixes" />
        <p className="text-sm leading-relaxed text-fg-muted">
          Option A also fixes the oxlint fast-refresh warnings this prototype gets for exporting{' '}
          <InlineCode>buttonVariants</InlineCode> next to <InlineCode>Button</InlineCode>. Option B
          keeps the variants private and gives product code one obvious component for button-styled
          links. SparkEd&apos;s <InlineCode>ButtonLink</InlineCode> doc comment says it exists to
          &quot;use in Server Components that need button-styled navigation without importing{' '}
          <InlineCode>buttonVariants</InlineCode> across the client boundary.&quot;
        </p>
      </Section>

      <Section
        title="Routing: React Router to the app directory"
        description={
          <>
            Each route in <InlineCode>src/router.tsx</InlineCode> becomes a folder with a{' '}
            <InlineCode>page.tsx</InlineCode>. Base UI still never routes on its own; you hand it
            Next&apos;s <InlineCode>Link</InlineCode> through <InlineCode>render</InlineCode>, the same
            way this prototype hands it React Router&apos;s.
          </>
        }
      >
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-sunken text-xs text-fg-muted uppercase">
              <tr>
                <th className="px-4 py-2 font-semibold">This prototype</th>
                <th className="px-4 py-2 font-semibold">App Router file</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {routeMap.map(([route, file]) => (
                <tr key={route}>
                  <td className="px-4 py-2 font-mono text-xs">{route}</td>
                  <td className="px-4 py-2 font-mono text-xs text-fg-muted">{file}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock code={linksCode} title="Links inside Base UI components" />
      </Section>

      <Section
        title="Theming without a flash"
        description={
          <>
            This prototype&apos;s <InlineCode>useTheme()</InlineCode> reads localStorage after the
            app mounts. With server rendering, the HTML arrives before that code runs, so a saved dark
            preference would briefly show the light theme. The fix is to let the server know the
            theme.
          </>
        }
      >
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-fg-muted">
          <li>
            <strong className="text-fg">Cookie (shown in the layout above):</strong> the layout reads
            the cookie and renders the right class on <InlineCode>&lt;html&gt;</InlineCode>. The
            first paint is correct, but reading cookies makes the route dynamic.
          </li>
          <li>
            <strong className="text-fg">Inline script:</strong> a small blocking script in{' '}
            <InlineCode>&lt;head&gt;</InlineCode> sets the class from localStorage before paint, so
            pages can stay static. Because the class then differs from the server HTML,{' '}
            <InlineCode>&lt;html&gt;</InlineCode> needs <InlineCode>suppressHydrationWarning</InlineCode>.
          </li>
          <li>
            <strong className="text-fg">SparkEd today:</strong> ships a single theme, hard-coding{' '}
            <InlineCode>data-theme=&quot;sparked&quot;</InlineCode> in{' '}
            <InlineCode>app/layout.tsx</InlineCode>. Only the <InlineCode>/ui-playground</InlineCode>{' '}
            route swaps to <InlineCode>sparked-lite</InlineCode>, from a client toggle.
          </li>
        </ul>
        <CodeBlock code={themeCode} title="app/theme-switch.tsx (cookie approach)" />
      </Section>

      <Section title="Porting checklist">
        <div className="flex flex-col gap-3">
          <Alert tone="success" title="Copies over unchanged">
            <InlineCode>index.css</InlineCode> tokens, <InlineCode>cn()</InlineCode>, every{' '}
            <InlineCode>cva()</InlineCode> definition, and the Base UI wrapper bodies.
          </Alert>
          <Alert tone="warning" title="Needs a small change">
            Add <InlineCode>&apos;use client&apos;</InlineCode> to Base UI wrappers, swap the Vite
            plugin for <InlineCode>@tailwindcss/postcss</InlineCode>, move providers into{' '}
            <InlineCode>app/providers.tsx</InlineCode>, and replace React Router links with{' '}
            <InlineCode>next/link</InlineCode>.
          </Alert>
          <Alert tone="danger" title="Decide before the library ships">
            Where <InlineCode>*Variants</InlineCode> functions live (separate files or client-only
            wrappers like <InlineCode>ButtonLink</InlineCode>), whether function-form{' '}
            <InlineCode>className</InlineCode> is supported at all, and how themes reach the server.
          </Alert>
        </div>
      </Section>
    </Page>
  )
}
