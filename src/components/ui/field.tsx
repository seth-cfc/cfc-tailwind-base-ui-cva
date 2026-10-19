import { Field as BaseField } from '@base-ui/react/field'
import { Form as BaseForm } from '@base-ui/react/form'
import { mergeClassName } from '../../lib/cn'

export function Form({ className, ...props }: BaseForm.Props) {
  return <BaseForm className={mergeClassName('flex flex-col gap-5', className)} {...props} />
}

export function Field({ className, ...props }: BaseField.Root.Props) {
  return <BaseField.Root className={mergeClassName('flex flex-col gap-1.5', className)} {...props} />
}

export function FieldLabel({ className, ...props }: BaseField.Label.Props) {
  return (
    <BaseField.Label
      className={mergeClassName('text-sm font-medium data-disabled:opacity-50', className)}
      {...props}
    />
  )
}

export function FieldDescription({ className, ...props }: BaseField.Description.Props) {
  return (
    <BaseField.Description
      className={mergeClassName('text-xs text-fg-muted', className)}
      {...props}
    />
  )
}

export function FieldError({ className, ...props }: BaseField.Error.Props) {
  return (
    <BaseField.Error
      className={mergeClassName('text-xs font-medium text-danger', className)}
      {...props}
    />
  )
}
