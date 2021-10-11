export type Action = any

export type Store = any

export type Dispatch = any

export interface EnhancedWindow extends Window {
    reduxToolies?: any
}

export interface Context {
    filtered: Set<string>
    muted: boolean
    storeRef: Store
}

export interface Difference<T> {
    path: string[]
    lhs: T | null
    rhs: T | null
    item: Difference<T> | null
    kind: 'A' | 'E' | 'N' | 'D'
    index: number | null
}
