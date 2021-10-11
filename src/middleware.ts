import { diff } from 'deep-diff'
import cloneDeep from 'lodash.clonedeep'
import { AnyAction, Dispatch, Middleware } from 'redux'

import type { Context } from './types'
import injectUtils from './cli'
import outputDifferences from './diff'

export default function reduxConsoleDevtools(): Middleware {
    const context: Context = {
        filtered: new Set(),
        muted: false,
        storeRef: null,
    }

    function shouldSkip(action: AnyAction) {
        return context.muted || context.filtered.has(action.type)
    }

    const middleware =
        (store: any) => (next: Dispatch) => (action: AnyAction) => {
            // On first run, initialize context with store ref.
            if (!context.storeRef) context.storeRef = store

            if (shouldSkip(action)) return
            const before = cloneDeep(store.getState())
            next(action)
            const after = store.getState()
            const difference = diff(before, after)
            console.groupCollapsed(`[Action] ${action.type}`)
            console.group('Payload')
            console.log(action.payload ?? 'None')
            console.groupEnd()

            console.group('State changes')

            if (difference) outputDifferences(difference)
            else console.log('None')

            console.groupEnd()
            console.groupEnd()
        }

    injectUtils(context)

    return middleware
}
