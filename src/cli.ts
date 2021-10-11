import type { AnyAction } from 'redux'

import type { Context, EnhancedWindow } from './types'

export default function exposeUtils(context: Context): void {
    const enhancedWindow: EnhancedWindow = window

    function dispatchAction(action: AnyAction) {
        context.storeRef.dispatch(action)
    }

    enhancedWindow.reduxConsoleDevtools = {
        addFilter: (filter: string) => {
            context.filtered.add(filter)
        },
        removeFilter: (filter: string) => {
            context.filtered.delete(filter)
        },
        mute: () => {
            context.muted = true
        },
        unmute: () => {
            context.muted = false
        },
        dispatch: dispatchAction,
    }
}
