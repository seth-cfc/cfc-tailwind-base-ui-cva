import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Joins class names and resolves Tailwind conflicts (last one wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type StatefulClassName<State> = string | ((state: State) => string | undefined) | undefined

/**
 * Base UI accepts `className` as either a string or a function of component state.
 * A plain `cn(base, className)` would stringify the function, so wrappers use this instead.
 */
export function mergeClassName<State>(
  baseClassName: string,
  className: StatefulClassName<State>,
): StatefulClassName<State> {
  if (typeof className === 'function') {
    return (state: State) => cn(baseClassName, className(state))
  }
  return cn(baseClassName, className)
}
