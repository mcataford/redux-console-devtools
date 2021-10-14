import type { AnyAction } from 'redux'

import type { Context, EnhancedWindow, FilterFunction } from './types'

export default function exposeUtils(context: Context): void {
    const enhancedWindow: EnhancedWindow = window

    enhancedWindow.reduxConsoleDevtools = {
        setFilter: (label: string, handler: FilterFunction) => {
            context.preHooks.set(`filter__${label}`, handler)
        },
        removeFilter: (label: string) => {
            context.preHooks.delete(`filter__${label}`)
        },
        showFilters: () => {
            const filters = [...context.preHooks.keys()].filter((key: string) =>
                key.startsWith('filter__'),
            )

            for (const filter of filters) {
                console.log(
                    filter.replace(/^filter__/, ''),
                    context.preHooks.get(filter)?.toString(),
                )
            }
        },
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
