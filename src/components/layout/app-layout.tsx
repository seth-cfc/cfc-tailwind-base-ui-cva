import { NavLink, Outlet, useLocation } from 'react-router'
import { useEffect } from 'react'
import { cn } from '../../lib/cn'
import { useTheme } from '../../lib/theme'
import { Switch } from '../ui/switch'

export const navItems = [
  { to: '/', label: 'Overview', end: true },
  { to: '/tailwind', label: 'Tailwind CSS' },
  { to: '/base-ui', label: 'Base UI' },
  { to: '/cva', label: 'CVA' },
  { to: '/together', label: 'Putting it together' },
  { to: '/findings', label: 'Findings & tradeoffs' },
] as const

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
    isActive ? 'bg-primary-soft text-primary' : 'text-fg-muted hover:bg-surface-sunken hover:text-fg',
  )
}

export function AppLayout() {
  const { theme, setTheme } = useTheme()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-fg">
              UI
            </span>
            <span className="hidden sm:inline">Platform UI Library Prototype</span>
          </NavLink>
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            Dark mode
            <Switch
              size="sm"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </label>
        </div>
        <nav
          aria-label="Sections"
          className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 lg:hidden"
        >
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={'end' in item} className={navLinkClassName}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="mx-auto flex max-w-7xl gap-10 px-4 sm:px-6">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 flex-col gap-1 py-8 lg:flex">
          <p className="px-3 pb-2 text-xs font-semibold tracking-wide text-fg-muted uppercase">
            Guide
          </p>
          <nav aria-label="Sections" className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={'end' in item} className={navLinkClassName}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto rounded-xl border border-border p-3 text-xs leading-relaxed text-fg-muted">
            Every component on these pages comes from <code className="font-mono">src/components/ui</code>.
            The app dogfoods its own library.
          </div>
        </aside>

        <main className="min-w-0 flex-1 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
