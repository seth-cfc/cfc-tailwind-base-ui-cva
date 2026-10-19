import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import { createContext, useContext } from 'react'
import { cn, mergeClassName } from '../../lib/cn'

type TabsAppearance = NonNullable<VariantProps<typeof tabsListVariants>['appearance']>

/** Lets each Tab pick up the appearance set once on <TabsList>. */
const TabsAppearanceContext = createContext<TabsAppearance>('underline')

export const Tabs = BaseTabs.Root

const tabsListVariants = cva('relative z-0 flex', {
  variants: {
    appearance: {
      underline: 'gap-4 border-b border-border',
      pill: 'w-fit gap-1 rounded-lg bg-surface-sunken p-1',
    },
  },
  defaultVariants: { appearance: 'underline' },
})

const tabVariants = cva(
  [
    'relative flex h-9 items-center justify-center text-sm font-medium whitespace-nowrap text-fg-muted outline-none select-none',
    'transition-colors hover:text-fg data-active:text-fg',
    'focus-visible:outline-2 focus-visible:outline-ring',
  ],
  {
    variants: {
      appearance: {
        underline: 'px-0.5',
        pill: 'h-8 rounded-md px-3',
      },
    },
    defaultVariants: { appearance: 'underline' },
  },
)

// Base UI measures the active tab and exposes --active-tab-left / --active-tab-width.
const tabIndicatorVariants = cva(
  'absolute left-0 -z-10 w-(--active-tab-width) translate-x-(--active-tab-left) transition-[translate,width] duration-200 ease-out',
  {
    variants: {
      appearance: {
        underline: 'bottom-[-1px] h-0.5 bg-primary',
        pill: 'top-1/2 h-8 -translate-y-1/2 rounded-md bg-surface shadow-sm',
      },
    },
    defaultVariants: { appearance: 'underline' },
  },
)

export interface TabsListProps
  extends BaseTabs.List.Props, VariantProps<typeof tabsListVariants> {}

export function TabsList({ className, appearance, children, ...props }: TabsListProps) {
  const resolvedAppearance = appearance ?? 'underline'
  return (
    <TabsAppearanceContext.Provider value={resolvedAppearance}>
      <BaseTabs.List
        className={mergeClassName(tabsListVariants({ appearance }), className)}
        {...props}
      >
        {children}
        <BaseTabs.Indicator className={tabIndicatorVariants({ appearance })} />
      </BaseTabs.List>
    </TabsAppearanceContext.Provider>
  )
}

export function Tab({ className, ...props }: BaseTabs.Tab.Props) {
  const appearance = useContext(TabsAppearanceContext)
  return <BaseTabs.Tab className={mergeClassName(tabVariants({ appearance }), className)} {...props} />
}

export function TabsPanel({ className, ...props }: BaseTabs.Panel.Props) {
  return (
    <BaseTabs.Panel
      className={mergeClassName(cn('pt-4 outline-none'), className)}
      {...props}
    />
  )
}
