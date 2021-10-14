import { AnyAction } from 'redux'

export interface EnhancedWindow extends Window {
    reduxConsoleDevtools?: any
}

export type FilterFunction = (action: AnyAction) => boolean

export type Hook = (
    action: AnyAction,
    extras?: Map<string, any>,
    prevState?: any,
    nextState?: any,
) => boolean | undefined

export interface CLIUtil {
    description?: string
    handler: (...args: unknown[]) => void
}

export interface Context {
    extras: Map<string, any>
    preHooks: Map<string, Hook>
    storeRef: any
}

export interface Difference<T> {
    path: string[]
    lhs: T | null
    rhs: T | null
    item: Difference<T> | null
    kind: 'A' | 'E' | 'N' | 'D'
    index: number | null
}
