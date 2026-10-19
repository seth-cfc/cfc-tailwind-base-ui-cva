import { createBrowserRouter } from 'react-router'
import { AppLayout } from './components/layout/app-layout'
import { BaseUiPage } from './pages/base-ui-page'
import { CvaPage } from './pages/cva-page'
import { FindingsPage } from './pages/findings-page'
import { NotFoundPage } from './pages/not-found-page'
import { OverviewPage } from './pages/overview-page'
import { TailwindPage } from './pages/tailwind-page'
import { TogetherPage } from './pages/together-page'

export const router = createBrowserRouter([
  {
    Component: AppLayout,
    children: [
      { index: true, Component: OverviewPage },
      { path: 'tailwind', Component: TailwindPage },
      { path: 'base-ui', Component: BaseUiPage },
      { path: 'cva', Component: CvaPage },
      { path: 'together', Component: TogetherPage },
      { path: 'findings', Component: FindingsPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
