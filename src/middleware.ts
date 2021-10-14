import { diff } from 'deep-diff'
import cloneDeep from 'lodash.clonedeep'
import { AnyAction, Dispatch, Middleware } from 'redux'

import type { Context, Hook } from './types'
import injectUtils from './cli'
import outputDifferences from './diff'

export default function reduxConsoleDevtools(): Middleware {
    const context: Context = {
        storeRef: null,
        extras: new Map(),
        preHooks: new Map<string, Hook>(),
    }

    function pre(action: AnyAction, state: any): boolean {
        for (const hook of context.preHooks.values()) {
            if (hook(action, context.extras, state) === false) return false
        }

        return true
    }

    const middleware =
        (store: any) => (next: Dispatch) => (action: AnyAction) => {
            // On first run, initialize context with store ref.
            if (!context.storeRef) context.storeRef = store

            const before = cloneDeep(store.getState())
            if (!pre(action, before)) return

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
