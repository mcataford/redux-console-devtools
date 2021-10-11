export interface EnhancedWindow extends Window {
    reduxConsoleDevtools?: any
}

export interface Context {
    filtered: Set<string>
    muted: boolean
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
