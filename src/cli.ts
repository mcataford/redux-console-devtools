import type { Action, Context, EnhancedWindow } from './types'

function getWindow() {
    return window
}

export default function exposeUtils(context: Context): void {
    const enhancedWindow: EnhancedWindow = getWindow()

    function dispatchAction(action: Action) {
        context.storeRef.dispatch(action)
    }

    enhancedWindow.reduxToolies = {
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
