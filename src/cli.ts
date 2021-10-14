import type { AnyAction } from 'redux'

import type { Context, EnhancedWindow, FilterFunction } from './types'

export default function exposeUtils(context: Context): void {
    const enhancedWindow: EnhancedWindow = window

    enhancedWindow.reduxConsoleDevtools = {
        setFilter: (handler: FilterFunction) => {
            context.preHooks.set('filter', handler)
        },
        clearFilter: () => {
            context.preHooks.delete('filter')
        },
        showFilter: () =>
            context.preHooks.get('filter')?.toString() ?? 'No filter set',
        mute: () => {
            context.preHooks.set('mute', () => false)
        },
        unmute: () => {
            context.preHooks.delete('mute')
        },
        dispatch: (action: AnyAction) => {
            context.storeRef.dispatch(action)
        },
    }
}
