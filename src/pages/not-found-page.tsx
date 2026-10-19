import { Link } from 'react-router'
import { buttonVariants } from '../components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-start gap-4 py-20">
      <p className="text-xs font-semibold tracking-widest text-primary uppercase">404</p>
      <h1 className="text-3xl font-bold">This page doesn&apos;t exist</h1>
      <p className="text-fg-muted">The link may be out of date. Head back to the overview to keep exploring.</p>
      <Link to="/" className={buttonVariants()}>
        Back to overview
      </Link>
    </div>
  )
}
