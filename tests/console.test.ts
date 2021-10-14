import { AnyAction, applyMiddleware, createStore } from 'redux'

import type { EnhancedWindow } from '../src/types'
import { ReduxConsoleDevtools } from '../src'

import {
    ConsoleMocks,
    MOCK_ACTION_TYPE,
    getMockAction,
    mockReducer,
} from './utils'

describe('Console commands', () => {
    let store: any
    let consoleMocks: ConsoleMocks

    beforeEach(() => {
        store = createStore(
            mockReducer,
            {},
            applyMiddleware(ReduxConsoleDevtools()),
        )

        consoleMocks = {
            log: jest.spyOn(console, 'log').mockImplementation(),
            group: jest.spyOn(console, 'group').mockImplementation(),
            groupCollapsed: jest
                .spyOn(console, 'groupCollapsed')
                .mockImplementation(),
        }
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('does not output anything when mute() is used', () => {
        ;(window as EnhancedWindow).reduxConsoleDevtools.mute()

        store.dispatch(getMockAction())

        expect(consoleMocks.groupCollapsed).not.toHaveBeenCalled()
    })

    it('resumes output when unmute() is used', () => {
        ;(window as EnhancedWindow).reduxConsoleDevtools.mute()

        store.dispatch(getMockAction())

        expect(consoleMocks.groupCollapsed).not.toHaveBeenCalled()
        ;(window as EnhancedWindow).reduxConsoleDevtools.unmute()

        store.dispatch(getMockAction())

        expect(consoleMocks.groupCollapsed).toHaveBeenCalled()
    })

    it('filters output based on handler if provided to addFilter', () => {
        ;(window as EnhancedWindow).reduxConsoleDevtools.addFilter(
            'f1',
            (action: AnyAction) => action.type !== MOCK_ACTION_TYPE,
        )

        store.dispatch(getMockAction())
        store.dispatch(getMockAction(null, 'otherAction'))

        expect(consoleMocks.groupCollapsed).toHaveBeenCalledTimes(1)
        expect(consoleMocks.groupCollapsed).toHaveBeenCalledWith(
            '[Action] otherAction',
        )
    })

    it('removeFilter removes existing filter', () => {
        const filterLabel = 'f1'

        ;(window as EnhancedWindow).reduxConsoleDevtools.addFilter(
            filterLabel,
            (action: AnyAction) => action.type !== MOCK_ACTION_TYPE,
        )

        store.dispatch(getMockAction())

        expect(consoleMocks.groupCollapsed).not.toHaveBeenCalled()
        ;(window as EnhancedWindow).reduxConsoleDevtools.removeFilter(
            filterLabel,
        )

        store.dispatch(getMockAction())

        expect(consoleMocks.groupCollapsed).toHaveBeenCalled()
    })
})
