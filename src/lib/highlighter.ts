import { useEffect, useState } from 'react'
import type { HighlighterCore, ThemedToken } from 'shiki/core'

export type CodeLanguage = 'tsx' | 'ts' | 'js' | 'css' | 'text'

const shikiLanguageIds: Record<CodeLanguage, string> = {
  tsx: 'tsx',
  ts: 'typescript',
  js: 'javascript',
  css: 'css',
  text: 'text',
}

let highlighterPromise: Promise<HighlighterCore> | undefined

async function createHighlighter() {
  const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
    import('shiki/core'),
    import('shiki/engine/javascript'),
  ])
  return createHighlighterCore({
    themes: [import('@shikijs/themes/github-light'), import('@shikijs/themes/github-dark')],
    langs: [
      import('@shikijs/langs/tsx'),
      import('@shikijs/langs/typescript'),
      import('@shikijs/langs/javascript'),
      import('@shikijs/langs/css'),
    ],
    engine: createJavaScriptRegexEngine(),
  })
}

function getHighlighter() {
  highlighterPromise ??= createHighlighter()
  return highlighterPromise
}

export function languageFromTitle(title: string | undefined): CodeLanguage {
  const extension = title?.match(/\.([a-z]+)\b/)?.[1]
  switch (extension) {
    case 'css':
      return 'css'
    case 'ts':
      return 'ts'
    case 'js':
    case 'mjs':
      return 'js'
    default:
      return 'tsx'
  }
}

/**
 * Tokens carry `--shiki-light` / `--shiki-dark` CSS variables instead of a fixed color,
 * so the `.dark` class on <html> switches themes without re-highlighting.
 * Returns null until the highlighter has loaded; callers render plain text meanwhile.
 */
export function useHighlightedTokens(code: string, language: CodeLanguage) {
  const [highlighted, setHighlighted] = useState<{ code: string; tokens: ThemedToken[][] } | null>(null)

  useEffect(() => {
    let cancelled = false
    getHighlighter()
      .then((highlighter) => {
        if (cancelled) return
        const { tokens } = highlighter.codeToTokens(code, {
          lang: shikiLanguageIds[language],
          themes: { light: 'github-light', dark: 'github-dark' },
          defaultColor: false,
        })
        setHighlighted({ code, tokens })
      })
      .catch((error: unknown) => {
        console.warn('Syntax highlighting unavailable; showing plain code.', error)
      })
    return () => {
      cancelled = true
    }
  }, [code, language])

  return highlighted?.code === code ? highlighted.tokens : null
}
