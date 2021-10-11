import type { Diff } from 'deep-diff'

import type { Difference } from './types'

function normalizeDiff(difference: Diff<any, any>): Difference<any> {
    return {
        path: 'path' in difference ? difference.path ?? [] : [],
        rhs: 'rhs' in difference ? difference.rhs : null,
        lhs: 'lhs' in difference ? difference.lhs : null,
        item: 'item' in difference ? normalizeDiff(difference.item) : null,
        index: 'index' in difference ? difference.index ?? null : null,
        kind: difference.kind,
    }
}

export default function outputDifferences(differences: Diff<any, any>[]): void {
    const normalizedDifferences = differences.map(normalizeDiff)
    for (const diff of normalizedDifferences) {
        const before = diff.lhs || diff.item?.lhs
        const after = diff.rhs || diff.item?.rhs
        const joinedPath = diff.path.join('/')

        if (diff.kind === 'A' || diff.kind === 'N') {
            console.group(`${joinedPath} %cAddition`, 'color: green;')
            console.log(after)
            console.groupEnd()
        } else if (diff.kind === 'E') {
            console.group(`${joinedPath} %cEdit`, 'color: goldenrod;')
            console.log(before, '~', after)
            console.groupEnd()
        }
    }
}
