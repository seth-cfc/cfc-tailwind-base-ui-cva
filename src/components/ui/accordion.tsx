import { Accordion as BaseAccordion } from '@base-ui/react/accordion'
import { mergeClassName } from '../../lib/cn'

export function Accordion({ className, ...props }: BaseAccordion.Root.Props) {
  return (
    <BaseAccordion.Root
      className={mergeClassName('divide-y divide-border rounded-xl border border-border', className)}
      {...props}
    />
  )
}

export const AccordionItem = BaseAccordion.Item

export function AccordionTrigger({ className, children, ...props }: BaseAccordion.Trigger.Props) {
  return (
    <BaseAccordion.Header>
      <BaseAccordion.Trigger
        className={mergeClassName(
          'group flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium hover:bg-surface-sunken focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
          className,
        )}
        {...props}
      >
        {children}
        <span
          aria-hidden
          className="text-fg-muted transition-transform duration-200 group-data-panel-open:rotate-45"
        >
          +
        </span>
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  )
}

export function AccordionPanel({ className, children, ...props }: BaseAccordion.Panel.Props) {
  return (
    <BaseAccordion.Panel
      className={mergeClassName(
        // Base UI measures content into --accordion-panel-height so height can animate.
        'h-(--accordion-panel-height) overflow-hidden text-sm text-fg-muted transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0',
        className,
      )}
      {...props}
    >
      <div className="px-4 pb-4">{children}</div>
    </BaseAccordion.Panel>
  )
}
