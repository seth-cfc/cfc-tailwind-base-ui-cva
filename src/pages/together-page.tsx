import { useState } from 'react'
import { CodeBlock, InlineCode } from '../components/docs/code-block'
import { Page, PageHeader, Section } from '../components/docs/page'
import { Alert } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../components/ui/dialog'
import { Field, FieldDescription, FieldError, FieldLabel, Form } from '../components/ui/field'
import { Input } from '../components/ui/input'
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from '../components/ui/menu'
import { Select } from '../components/ui/select'
import { Switch } from '../components/ui/switch'
import { useToast } from '../components/ui/toast'
import { Tooltip } from '../components/ui/tooltip'

type CourseId = 'fractions' | 'reading' | 'science'

interface Assignment {
  id: string
  title: string
  course: CourseId
  dueDate: string
  allowLate: boolean
  status: 'draft' | 'published'
}

const courseOptions: { value: CourseId; label: string }[] = [
  { value: 'fractions', label: 'Intro to Fractions' },
  { value: 'reading', label: 'Reading Comprehension' },
  { value: 'science', label: 'Earth Science' },
]

const courseLabel = Object.fromEntries(courseOptions.map((o) => [o.value, o.label])) as Record<
  CourseId,
  string
>

const initialAssignments: Assignment[] = [
  { id: 'a1', title: 'Equivalent fractions worksheet', course: 'fractions', dueDate: '2026-10-23', allowLate: true, status: 'published' },
  { id: 'a2', title: 'Chapter 4 summary', course: 'reading', dueDate: '2026-10-27', allowLate: false, status: 'draft' },
]

const formCode = `
<Form errors={serverErrors} onFormSubmit={handleSubmit}>
  <Field name="title">
    <FieldLabel>Title</FieldLabel>
    <Input required minLength={4} onChange={clearServerErrors} />
    <FieldError match="valueMissing">Give the assignment a title.</FieldError>
    <FieldError match="tooShort">Use at least 4 characters.</FieldError>
    {/* Server message from <Form errors>: matched errors only read ValidityState */}
    {serverErrors.title && <FieldError match>{serverErrors.title}</FieldError>}
  </Field>

  <Field name="course">
    <FieldLabel>Course</FieldLabel>
    <Select options={courseOptions} placeholder="Choose a course" required />
    <FieldError />
  </Field>

  <Field name="allowLate">
    <div className="flex items-center justify-between">
      <FieldLabel>Accept late submissions</FieldLabel>
      <Switch defaultChecked />
    </div>
    <FieldDescription>Late work is marked, not rejected.</FieldDescription>
  </Field>

  <Button type="submit">Create assignment</Button>
</Form>
`

const conventions = [
  ['One file per component in src/components/ui', 'Easy to find and easy to copy into another app while the library is still a prototype.'],
  ['Re-export Base UI parts that need no styling', 'export const Dialog = BaseDialog.Root keeps one import path for product code.'],
  ['Collapse Portal → Positioner → Popup into …Content', 'Product engineers should never have to remember the portal plumbing.'],
  ['Put every visual decision in cva()', 'Variants are the design-system API. Free-form className is the escape hatch.'],
  ['Always merge className with mergeClassName()', 'Handles both strings and Base UI state functions, and lets overrides win.'],
  ['Reference semantic tokens only', 'bg-primary, never bg-indigo-600, so theming stays a CSS-only change.'],
  ['Export the cva function as well as the component', 'buttonVariants() styles links and other non-button elements.'],
]

export function TogetherPage() {
  const toast = useToast()
  const [assignments, setAssignments] = useState(initialAssignments)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const [pendingDelete, setPendingDelete] = useState<Assignment | null>(null)
  const [formKey, setFormKey] = useState(0)

  function handleSubmit(values: Record<string, unknown>) {
    const title = String(values.title ?? '').trim()

    // Simulates a uniqueness check that only the server could do.
    if (assignments.some((a) => a.title.toLowerCase() === title.toLowerCase())) {
      setServerErrors({ title: 'An assignment with this title already exists.' })
      return
    }

    setServerErrors({})
    setAssignments((current) => [
      {
        id: crypto.randomUUID(),
        title,
        course: values.course as CourseId,
        dueDate: String(values.dueDate ?? ''),
        allowLate: Boolean(values.allowLate),
        status: 'draft',
      },
      ...current,
    ])
    setFormKey((key) => key + 1)
    toast.add({ title: 'Assignment created', description: title, type: 'success' })
  }

  function togglePublished(assignment: Assignment) {
    const nextStatus = assignment.status === 'published' ? 'draft' : 'published'
    setAssignments((current) =>
      current.map((a) => (a.id === assignment.id ? { ...a, status: nextStatus } : a)),
    )
    toast.add({ title: nextStatus === 'published' ? 'Published' : 'Moved to drafts' })
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setAssignments((current) => current.filter((a) => a.id !== pendingDelete.id))
    toast.add({ title: 'Assignment deleted', description: pendingDelete.title })
    setPendingDelete(null)
  }

  return (
    <Page>
      <PageHeader eyebrow="All three layers" title="Putting it together">
        <p>
          A small but realistic feature built only from library components. Base UI handles the
          validation, focus and keyboard behavior, CVA supplies the variants, and Tailwind tokens
          supply the look. The page itself contains almost no styling decisions, which is the point
          of having a library.
        </p>
      </PageHeader>

      <Alert tone="info" title="Things to try">
        Submit the empty form to see client validation. Then create an assignment named{' '}
        <InlineCode>Chapter 4 summary</InlineCode> to see a server-style error coming back through{' '}
        <InlineCode>&lt;Form errors&gt;</InlineCode>. Row actions live in each row&apos;s menu.
      </Alert>

      <div className="grid gap-6 xl:grid-cols-[24rem_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>New assignment</CardTitle>
            <CardDescription>Validation runs on submit, then again on every change.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form
              key={formKey}
              aria-label="New assignment"
              errors={serverErrors}
              onFormSubmit={handleSubmit}
            >
              <Field name="title">
                <FieldLabel>Title</FieldLabel>
                <Input
                  required
                  minLength={4}
                  placeholder="e.g. Equivalent fractions worksheet"
                  onChange={() => serverErrors.title && setServerErrors({})}
                />
                <FieldError match="valueMissing">Give the assignment a title.</FieldError>
                <FieldError match="tooShort">Use at least 4 characters.</FieldError>
                {/* Validity-matched errors ignore <Form errors>, so server messages render explicitly. */}
                {serverErrors.title && <FieldError match>{serverErrors.title}</FieldError>}
              </Field>

              <Field name="course">
                <FieldLabel>Course</FieldLabel>
                <Select options={courseOptions} placeholder="Choose a course" required className="w-full" />
                <FieldError match="valueMissing">Pick the course this belongs to.</FieldError>
              </Field>

              <Field name="dueDate">
                <FieldLabel>Due date</FieldLabel>
                <Input type="date" required min="2026-01-01" />
                <FieldError match="valueMissing">Choose a due date.</FieldError>
                <FieldError match="rangeUnderflow">Due date must be in 2026 or later.</FieldError>
              </Field>

              <Field name="allowLate">
                <div className="flex items-center justify-between gap-4">
                  <FieldLabel>Accept late submissions</FieldLabel>
                  <Switch defaultChecked />
                </div>
                <FieldDescription>Late work is marked as late, not rejected.</FieldDescription>
              </Field>

              <div className="flex gap-2">
                <Button type="submit">Create assignment</Button>
                <Button type="reset" intent="ghost" onClick={() => setServerErrors({})}>
                  Clear
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>{assignments.length} total</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-fg-muted">
                No assignments yet. Create one with the form.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {assignments.map((assignment) => (
                  <li key={assignment.id} className="flex items-center gap-4 py-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="truncate text-sm font-medium">{assignment.title}</p>
                      <p className="text-xs text-fg-muted">
                        {courseLabel[assignment.course]} · due {assignment.dueDate}
                      </p>
                    </div>
                    {!assignment.allowLate && (
                      <Tooltip content="Late submissions are rejected">
                        <Badge tone="warning" tabIndex={0}>
                          strict
                        </Badge>
                      </Tooltip>
                    )}
                    <Badge
                      tone={assignment.status === 'published' ? 'success' : 'neutral'}
                      appearance={assignment.status === 'published' ? 'soft' : 'outline'}
                    >
                      {assignment.status}
                    </Badge>
                    <Menu>
                      <MenuTrigger
                        render={<Button intent="ghost" size="icon" className="size-8" />}
                        aria-label={`Actions for ${assignment.title}`}
                      >
                        ⋯
                      </MenuTrigger>
                      <MenuContent align="end">
                        <MenuItem onClick={() => togglePublished(assignment)}>
                          {assignment.status === 'published' ? 'Unpublish' : 'Publish'}
                        </MenuItem>
                        <MenuSeparator />
                        <MenuItem
                          className="text-danger data-highlighted:bg-danger-soft data-highlighted:text-danger"
                          onClick={() => setPendingDelete(assignment)}
                        >
                          Delete…
                        </MenuItem>
                      </MenuContent>
                    </Menu>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Controlled dialog: opened from a menu item rather than a trigger. */}
      <Dialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent size="sm">
          <DialogTitle>Delete assignment?</DialogTitle>
          <DialogDescription>
            “{pendingDelete?.title}” and any student submissions will be removed. This can&apos;t be
            undone.
          </DialogDescription>
          <div className="flex justify-end gap-2">
            <DialogClose render={<Button intent="outline" />}>Cancel</DialogClose>
            <Button intent="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Section title="The form, as product code sees it">
        <CodeBlock code={formCode} />
        <p className="text-sm leading-relaxed text-fg-muted">
          Notice what is missing: no <InlineCode>useState</InlineCode> per field, no{' '}
          <InlineCode>aria-describedby</InlineCode> wiring, no error-visibility logic. Base UI&apos;s{' '}
          <InlineCode>Field</InlineCode> builds on native constraint validation (
          <InlineCode>required</InlineCode>, <InlineCode>minLength</InlineCode>,{' '}
          <InlineCode>min</InlineCode>) and links label, description and error to the control. For
          larger forms it also works with React Hook Form or TanStack Form.
        </p>
      </Section>

      <Section
        title="Wrapper conventions this prototype settled on"
        description="If we adopt the stack, these are the rules we would write down for contributors."
      >
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-border">
              {conventions.map(([rule, why]) => (
                <tr key={rule}>
                  <td className="w-1/2 px-4 py-3 font-medium">{rule}</td>
                  <td className="px-4 py-3 text-fg-muted">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </Page>
  )
}
