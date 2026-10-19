import { Select as BaseSelect } from '@base-ui/react/select'
import { cn, mergeClassName } from '../../lib/cn'
import { inputVariants } from './input'
import { popupItem, popupSurface } from './popup-styles'

export interface SelectOption<Value extends string = string> {
  value: Value
  label: string
}

export interface SelectProps<Value extends string>
  extends Omit<BaseSelect.Root.Props<Value>, 'items' | 'children'> {
  options: SelectOption<Value>[]
  placeholder?: string
  className?: string
  /** Accessible name when there is no surrounding <Field.Label>. */
  'aria-label'?: string
}

/**
 * Opinionated, options-driven Select. Base UI's compound parts are still available
 * for one-off layouts, but most product screens just want "a list of options".
 */
export function Select<Value extends string>({
  options,
  placeholder = 'Select…',
  className,
  'aria-label': ariaLabel,
  ...rootProps
}: SelectProps<Value>) {
  return (
    <BaseSelect.Root items={options} {...rootProps}>
      <BaseSelect.Trigger
        aria-label={ariaLabel}
        className={cn(
          inputVariants(),
          'flex min-w-44 cursor-default items-center justify-between gap-2 text-left',
          'data-popup-open:border-primary',
          className,
        )}
      >
        <BaseSelect.Value
          className="truncate data-placeholder:text-fg-muted"
          placeholder={placeholder}
        />
        <BaseSelect.Icon className="text-fg-muted transition-transform data-popup-open:rotate-180">
          <ChevronIcon />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner className="z-50 outline-none" sideOffset={6} alignItemWithTrigger={false}>
          <BaseSelect.Popup
            className={cn(popupSurface, 'max-h-(--available-height) min-w-(--anchor-width) p-1')}
          >
            <BaseSelect.List>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}

function SelectItem({ className, children, ...props }: BaseSelect.Item.Props) {
  return (
    <BaseSelect.Item
      className={mergeClassName(cn(popupItem, 'grid grid-cols-[1rem_1fr] pl-2'), className)}
      {...props}
    >
      <BaseSelect.ItemIndicator className="col-start-1 text-primary">
        <CheckIcon />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText className="col-start-2">{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  )
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="m2.5 6.5 2.5 2.5 4.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
