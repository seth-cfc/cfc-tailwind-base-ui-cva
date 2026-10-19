import { useState } from 'react'
import { Link } from 'react-router'
import { CodeBlock, InlineCode } from '../components/docs/code-block'
import { Example } from '../components/docs/example'
import { Page, PageHeader, Section } from '../components/docs/page'
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '../components/ui/accordion'
import { Alert } from '../components/ui/alert'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuSeparator,
  MenuTrigger,
} from '../components/ui/menu'
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from '../components/ui/popover'
import { Select } from '../components/ui/select'
import { Switch } from '../components/ui/switch'
import { Tab, Tabs, TabsList, TabsPanel } from '../components/ui/tabs'
import { useToast } from '../components/ui/toast'
import { Tooltip } from '../components/ui/tooltip'

const dialogCode = `
<Dialog>
  {/* render: Base UI merges its trigger behavior into OUR Button */}
  <DialogTrigger render={<Button intent="danger" />}>Archive course</DialogTrigger>
  <DialogContent size="sm">
    <DialogTitle>Archive “Intro to Fractions”?</DialogTitle>
    <DialogDescription>
      Students will lose access. You can restore it later from Settings.
    </DialogDescription>
    <div className="flex justify-end gap-2">
      <DialogClose render={<Button intent="outline" />}>Cancel</DialogClose>
      <DialogClose render={<Button intent="danger" />}>Archive</DialogClose>
    </div>
  </DialogContent>
</Dialog>
`

const menuCode = `
<Menu>
  <MenuTrigger render={<Button intent="outline" />}>Actions ▾</MenuTrigger>
  <MenuContent>
    <MenuGroup>
      <MenuGroupLabel>Course</MenuGroupLabel>
      <MenuItem onClick={() => toast.add({ title: 'Duplicated' })}>Duplicate</MenuItem>
      <MenuItem disabled>Export (coming soon)</MenuItem>
    </MenuGroup>
    <MenuSeparator />
    {/* LinkItem + render: menu keyboard nav, React Router navigation */}
    <MenuLinkItem render={<Link to="/cva" />}>Go to the CVA page</MenuLinkItem>
  </MenuContent>
</Menu>
`

const selectCode = `
const gradeOptions = [
  { value: 'k', label: 'Kindergarten' },
  { value: '1', label: '1st grade' },
  …
]

const [grade, setGrade] = useState<string | null>(null)

<Select
  aria-label="Grade level"
  options={gradeOptions}
  placeholder="Choose a grade"
  value={grade}
  onValueChange={setGrade}
/>
`

const popoverTooltipCode = `
<Popover>
  <PopoverTrigger render={<Button intent="outline" />}>What is mastery?</PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>Mastery</PopoverTitle>
    <PopoverDescription>A student reaches mastery after 3 correct attempts in a row.</PopoverDescription>
  </PopoverContent>
</Popover>

<Tooltip content="Bold (⌘B)">
  <Button intent="outline" size="icon" aria-label="Bold">B</Button>
</Tooltip>
`

const tabsCode = `
<Tabs defaultValue="overview">
  <TabsList appearance="pill">
    <Tab value="overview">Overview</Tab>
    <Tab value="roster">Roster</Tab>
    <Tab value="grades">Grades</Tab>
  </TabsList>
  <TabsPanel value="overview">…</TabsPanel>
  <TabsPanel value="roster">…</TabsPanel>
  <TabsPanel value="grades">…</TabsPanel>
</Tabs>
`

const accordionCode = `
<Accordion>
  <AccordionItem>
    <AccordionTrigger>Who can see student progress?</AccordionTrigger>
    <AccordionPanel>Teachers and admins assigned to the class.</AccordionPanel>
  </AccordionItem>
  …
</Accordion>
`

const switchCode = `
{/* Uncontrolled: Base UI owns the state */}
<Switch defaultChecked />

{/* Controlled: you own the state */}
const [notify, setNotify] = useState(false)
<Switch checked={notify} onCheckedChange={setNotify} />

{/* className as a function of component state */}
<Switch
  className={(state) => (state.checked ? 'ring-4 ring-success/30' : undefined)}
/>
`

const toastCode = `
const toast = useToast()

toast.add({ title: 'Saved', description: 'Lesson plan updated.', type: 'success' })

toast.promise(saveLesson(), {
  loading: 'Saving…',
  success: 'Lesson saved',
  error: 'Could not save. Try again.',
})
`

const renderPropCode = `
// Element form: Base UI clones the element and merges props + ref into it
<DialogTrigger render={<Button intent="primary" />}>Open</DialogTrigger>

// Function form: full control, receives props and component state
<Switch.Thumb
  render={(props, state) => (
    <span {...props}>{state.checked ? '✓' : ''}</span>
  )}
/>
`

const gradeOptions = [
  { value: 'k', label: 'Kindergarten' },
  { value: '1', label: '1st grade' },
  { value: '2', label: '2nd grade' },
  { value: '3', label: '3rd grade' },
  { value: '4', label: '4th grade' },
  { value: '5', label: '5th grade' },
]

const dataAttributes = [
  ['data-open / data-closed', 'Popups, dialogs, accordion items', 'data-open:shadow-lg'],
  ['data-popup-open', 'Trigger while its popup is open', 'data-popup-open:bg-surface-sunken'],
  ['data-checked / data-unchecked', 'Switch, checkbox, radio', 'data-checked:bg-primary'],
  ['data-highlighted', 'Keyboard/pointer-focused menu or select item', 'data-highlighted:bg-primary-soft'],
  ['data-active', 'The selected tab', 'data-active:text-fg'],
  ['data-pressed', 'Toggle and pressed triggers', 'data-pressed:shadow-sm'],
  ['data-disabled', 'Any disabled part', 'data-disabled:opacity-50'],
  ['data-invalid / data-valid', 'Field controls after validation', 'data-invalid:border-danger'],
  ['data-starting-style / data-ending-style', 'First/last frame of enter and exit', 'data-starting-style:opacity-0'],
  ['data-side', 'Which side a popup was placed on', 'data-[side=top]:mb-1'],
]

const cssVariables = [
  ['--transform-origin', 'Popups: animate from the trigger'],
  ['--anchor-width', 'Popups: match the trigger width'],
  ['--available-height', 'Popups: cap height to the viewport space left'],
  ['--active-tab-left / --active-tab-width', 'Tabs.Indicator position'],
  ['--accordion-panel-height', 'Animate accordion open/close'],
]

export function BaseUiPage() {
  const toast = useToast()
  const [grade, setGrade] = useState<string | null>(null)
  const [notify, setNotify] = useState(false)

  function simulateSave() {
    const saveLesson = new Promise<void>((resolve) => window.setTimeout(resolve, 1500))
    void toast.promise(saveLesson, {
      loading: 'Saving lesson…',
      success: { title: 'Lesson saved', type: 'success' },
      error: { title: 'Could not save', description: 'Try again in a moment.', type: 'error' },
    })
  }

  return (
    <Page>
      <PageHeader eyebrow="Layer 2 · How it behaves" title="Base UI">
        <p>
          Base UI ships behavior with no styles: focus trapping, keyboard navigation, ARIA wiring,
          collision-aware positioning, scroll locking and animation lifecycle. The library adds the
          look on top. It comes from the people behind Radix, Floating UI and Material UI, and it
          hit v1 in late 2025.
        </p>
      </PageHeader>

      <Alert tone="info" title="Try these with only a keyboard">
        Tab to a trigger, then press Enter or Space. Use the arrow keys inside menus, selects and
        tabs, and Escape to close. Focus returns to the trigger. None of that is code we wrote.
      </Alert>

      <Section
        title="Overlays"
        description={
          <>
            Each wrapper collapses Base UI&apos;s <InlineCode>Portal → Positioner → Popup</InlineCode>{' '}
            anatomy into a single <InlineCode>…Content</InlineCode> component. Product code gets one
            obvious way to build an overlay, and the raw parts stay available for edge cases.
          </>
        }
      >
        <Example
          title="Dialog"
          description="Focus is trapped inside, page scroll is locked, Escape and backdrop clicks close it, and focus goes back to the trigger afterward."
          code={dialogCode}
        >
          <Dialog>
            <DialogTrigger render={<Button intent="danger" />}>Archive course</DialogTrigger>
            <DialogContent size="sm">
              <DialogTitle>Archive “Intro to Fractions”?</DialogTitle>
              <DialogDescription>
                Students will lose access. You can restore it later from Settings.
              </DialogDescription>
              <div className="flex justify-end gap-2">
                <DialogClose render={<Button intent="outline" />}>Cancel</DialogClose>
                <DialogClose
                  render={<Button intent="danger" />}
                  onClick={() => toast.add({ title: 'Course archived', type: 'success' })}
                >
                  Archive
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </Example>

        <Example
          title="Menu"
          description={
            <>
              Arrow keys move the highlight and typing jumps to items by name. Disabled items are
              skipped. <InlineCode>MenuLinkItem</InlineCode> with <InlineCode>render</InlineCode> sends
              navigation through React Router.
            </>
          }
          code={menuCode}
        >
          <Menu>
            <MenuTrigger render={<Button intent="outline" />}>Actions ▾</MenuTrigger>
            <MenuContent>
              <MenuGroup>
                <MenuGroupLabel>Course</MenuGroupLabel>
                <MenuItem onClick={() => toast.add({ title: 'Course duplicated' })}>Duplicate</MenuItem>
                <MenuItem onClick={() => toast.add({ title: 'Share link copied' })}>Share</MenuItem>
                <MenuItem disabled>Export (coming soon)</MenuItem>
              </MenuGroup>
              <MenuSeparator />
              <MenuLinkItem render={<Link to="/cva" />}>Go to the CVA page</MenuLinkItem>
            </MenuContent>
          </Menu>
        </Example>

        <Example
          title="Popover and Tooltip"
          description="Both come from the same positioning engine (Floating UI). Tooltips open on hover and focus with a shared delay, so moving between buttons in a toolbar feels instant."
          code={popoverTooltipCode}
        >
          <Popover>
            <PopoverTrigger render={<Button intent="outline" />}>What is mastery?</PopoverTrigger>
            <PopoverContent>
              <PopoverTitle>Mastery</PopoverTitle>
              <PopoverDescription>
                A student reaches mastery after 3 correct attempts in a row on a skill.
              </PopoverDescription>
            </PopoverContent>
          </Popover>
          <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
            <Tooltip content="Bold (⌘B)">
              <Button intent="ghost" size="icon" aria-label="Bold" className="size-8 font-bold">
                B
              </Button>
            </Tooltip>
            <Tooltip content="Italic (⌘I)">
              <Button intent="ghost" size="icon" aria-label="Italic" className="size-8 italic">
                I
              </Button>
            </Tooltip>
            <Tooltip content="Underline (⌘U)">
              <Button intent="ghost" size="icon" aria-label="Underline" className="size-8 underline">
                U
              </Button>
            </Tooltip>
          </div>
        </Example>
      </Section>

      <Section title="Inputs and disclosure">
        <Example
          title="Select"
          description="Typeahead, keyboard selection and form integration are built in. Our wrapper takes an options array so the common case is a single line."
          code={selectCode}
        >
          <div className="flex flex-col items-center gap-2">
            <Select
              aria-label="Grade level"
              options={gradeOptions}
              placeholder="Choose a grade"
              value={grade}
              onValueChange={setGrade}
            />
            <p className="text-xs text-fg-muted">
              Selected value: <InlineCode>{grade ?? 'null'}</InlineCode>
            </p>
          </div>
        </Example>

        <Example
          title="Tabs"
          description={
            <>
              Base UI measures the active tab and exposes its position as CSS variables, which is how
              the sliding indicator animates without any JavaScript in our code. The Preview/Code
              switcher on every example is this same component with{' '}
              <InlineCode>appearance=&quot;underline&quot;</InlineCode>.
            </>
          }
          code={tabsCode}
        >
          <Tabs defaultValue="overview" className="w-full max-w-md">
            <TabsList appearance="pill">
              <Tab value="overview">Overview</Tab>
              <Tab value="roster">Roster</Tab>
              <Tab value="grades">Grades</Tab>
            </TabsList>
            <TabsPanel value="overview" className="text-sm text-fg-muted">
              24 students · 6 units · next lesson Tuesday.
            </TabsPanel>
            <TabsPanel value="roster" className="text-sm text-fg-muted">
              Ada, Grace, Katherine, Margaret, and 20 more.
            </TabsPanel>
            <TabsPanel value="grades" className="text-sm text-fg-muted">
              Class average: 87%.
            </TabsPanel>
          </Tabs>
        </Example>

        <Example
          title="Accordion"
          description={
            <>
              The panel height animates through <InlineCode>--accordion-panel-height</InlineCode>,
              which Base UI measures for you.
            </>
          }
          code={accordionCode}
          previewClassName="block"
        >
          <Accordion className="mx-auto max-w-lg bg-surface">
            <AccordionItem>
              <AccordionTrigger>Who can see student progress?</AccordionTrigger>
              <AccordionPanel>Teachers and admins assigned to the class. Parents see their own child only.</AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionTrigger>Can I reuse a course next year?</AccordionTrigger>
              <AccordionPanel>Yes. Duplicate it from the Actions menu and the roster is cleared.</AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionTrigger>How is mastery calculated?</AccordionTrigger>
              <AccordionPanel>Three correct attempts in a row on the same skill.</AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Example>

        <Example
          title="Switch: uncontrolled, controlled, and state-driven className"
          description={
            <>
              Every Base UI component works both ways: pass <InlineCode>defaultChecked</InlineCode> and
              forget about it, or own the state with <InlineCode>checked</InlineCode> and{' '}
              <InlineCode>onCheckedChange</InlineCode>. <InlineCode>className</InlineCode> can also be a
              function of the component&apos;s state.
            </>
          }
          code={switchCode}
        >
          <label className="flex items-center gap-2 text-sm">
            <Switch defaultChecked /> Uncontrolled
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={notify} onCheckedChange={setNotify} /> Controlled:{' '}
            <InlineCode>{String(notify)}</InlineCode>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch className={(state) => (state.checked ? 'ring-4 ring-success/30' : undefined)} />
            className function
          </label>
        </Example>

        <Example
          title="Toast"
          description="Imperative API with a stacked, swipe-to-dismiss viewport. The Toaster is mounted once in main.tsx."
          code={toastCode}
        >
          <Button
            intent="outline"
            onClick={() =>
              toast.add({ title: 'Saved', description: 'Lesson plan updated.', type: 'success' })
            }
          >
            Success toast
          </Button>
          <Button intent="outline" onClick={simulateSave}>
            Promise toast
          </Button>
        </Example>
      </Section>

      <Section
        title="The render prop: how composition works"
        description={
          <>
            Base UI never makes you choose between its behavior and your component. Passing{' '}
            <InlineCode>render</InlineCode> swaps the element it renders while keeping every handler,
            ARIA attribute and ref. That is why the triggers above are our own{' '}
            <InlineCode>&lt;Button&gt;</InlineCode>, and why the menu link goes through React Router.
          </>
        }
      >
        <CodeBlock code={renderPropCode} />
      </Section>

      <Section
        title="Styling hooks Base UI exposes"
        description="These are the only contract between Base UI and Tailwind. Every interactive style in the library is one of these attributes or variables paired with a Tailwind variant."
      >
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-sunken text-xs text-fg-muted uppercase">
              <tr>
                <th className="px-4 py-2 font-semibold">Attribute</th>
                <th className="px-4 py-2 font-semibold">Present on</th>
                <th className="px-4 py-2 font-semibold">Tailwind usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {dataAttributes.map(([attribute, where, usage]) => (
                <tr key={attribute}>
                  <td className="px-4 py-2 font-mono text-xs">{attribute}</td>
                  <td className="px-4 py-2 text-fg-muted">{where}</td>
                  <td className="px-4 py-2 font-mono text-xs text-primary">{usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-sunken text-xs text-fg-muted uppercase">
              <tr>
                <th className="px-4 py-2 font-semibold">CSS variable</th>
                <th className="px-4 py-2 font-semibold">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cssVariables.map(([variable, use]) => (
                <tr key={variable}>
                  <td className="px-4 py-2 font-mono text-xs">{variable}</td>
                  <td className="px-4 py-2 text-fg-muted">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </Page>
  )
}
