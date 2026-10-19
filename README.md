# Platform UI library prototype: Tailwind + Base UI + CVA

A Vite `react-ts` app that evaluates [Tailwind CSS v4](https://tailwindcss.com), [Base UI](https://base-ui.com) and [CVA](https://cva.style) as the foundation for a shared platform UI library. The app explains each layer with live examples and records findings for the platform decision.

```bash
pnpm install
pnpm dev     # http://localhost:5173
pnpm build   # typecheck + production build
pnpm lint    # oxlint
```

## Routes

| Route       | What it covers                                                        |
| ----------- | --------------------------------------------------------------------- |
| `/`         | How the three layers split responsibilities; anatomy of one component |
| `/tldr`     | Two-minute summary: verdict, short code samples, open decisions       |
| `/tailwind` | CSS-first config, semantic tokens, dark mode, state variants          |
| `/base-ui`  | Every wrapped primitive, the render prop, data attributes, CSS vars   |
| `/cva`      | Variant playground, compoundVariants, types, tailwind-merge overrides |
| `/together` | A realistic form + list built only from library components            |
| `/sparked`  | How SparkEd combines the stack with daisyUI in production             |
| `/nextjs`   | Porting the stack to the Next.js App Router (server/client boundary)  |
| `/findings` | Scorecard, friction points and open decisions                         |

## Layout

- `src/index.css`: Tailwind import, theme tokens, dark mode variant
- `src/lib/cn.ts`: `cn()` (clsx + tailwind-merge) and `mergeClassName()` for Base UI's state-function `className`
- `src/components/ui/`: the library itself, one file per component
- `src/components/docs/`: helpers for the guide pages (`Example`, `CodeBlock`)
- `src/pages/` + `src/router.tsx`: React Router data-mode routes
