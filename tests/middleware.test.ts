import { applyMiddleware, createStore } from 'redux'

import { ReduxConsoleDevtools } from '../src'

interface ConsoleMocks {
    log: jest.SpyInstance
    groupCollapsed: jest.SpyInstance
    group: jest.SpyInstance
}

const MOCK_ACTION_TYPE = 'mockAction'

function getMockAction(payload?: unknown, type = MOCK_ACTION_TYPE) {
    return {
        type,
        payload,
    }
}

function mockReducer(state: any, action: any) {
    if (action.type === MOCK_ACTION_TYPE) return { ...state, ...action.payload }
    return state
}

describe('Middleware output', () => {
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

    it('Outputs formatted group for action type', () => {
        const action = getMockAction()
        store.dispatch(action)
        expect(consoleMocks.groupCollapsed).toHaveBeenCalledWith(
            `[Action] ${action.type}`,
        )
    })

    it.each`
        variant                                 | actionPayload       | loggedPayload
        ${'without payload'}                    | ${undefined}        | ${'None'}
        ${'with payload, without state change'} | ${{ key: 'value' }} | ${{ key: 'value' }}
    `(
        'Outputs formatted group for action payload ($variant)',
        ({ actionPayload, loggedPayload }) => {
            const action = getMockAction(actionPayload, MOCK_ACTION_TYPE)
            store.dispatch(action)

            expect(consoleMocks.group).toHaveBeenNthCalledWith(1, 'Payload')
            expect(consoleMocks.log).toHaveBeenNthCalledWith(1, loggedPayload)
        },
    )

    it('Outputs formatted group for state changes (without state change)', () => {
        const action = getMockAction(undefined, MOCK_ACTION_TYPE)
        store.dispatch(action)

        expect(consoleMocks.group).toHaveBeenNthCalledWith(2, 'State changes')

        expect(consoleMocks.log).toHaveBeenNthCalledWith(2, 'None')
    })

    it('Outputs formatted group for state changes (with ADD state change)', () => {
        const payload: { [key: string]: string } = { stateKey: 'value' }
        const action = getMockAction(payload, MOCK_ACTION_TYPE)
        store.dispatch(action)

        expect(consoleMocks.group).toHaveBeenNthCalledWith(2, 'State changes')
        let offset = 0
        for (const key of Object.keys(payload)) {
            expect(consoleMocks.group).toHaveBeenNthCalledWith(
                3 + offset,
                `${key} %cAddition`,
                'color: green;',
            )
            expect(consoleMocks.log).toHaveBeenNthCalledWith(
                2 + offset,
                payload[key],
            )
            offset++
        }
    })

    it('Outputs formatted group for state changes (with EDIT state change)', () => {
        const payload: { [key: string]: string } = { stateKey: 'value' }
        const action = getMockAction(payload)
        store.dispatch(action)

        // Flush mock after initial change.
        jest.resetAllMocks()
        const secondPayload: { [key: string]: string } = { stateKey: 'updated' }

        const secondAction = getMockAction(secondPayload)
        store.dispatch(secondAction)
        expect(consoleMocks.group).toHaveBeenNthCalledWith(2, 'State changes')
        let offset = 0
        for (const key of Object.keys(payload)) {
            expect(consoleMocks.group).toHaveBeenNthCalledWith(
                3 + offset,
                `${key} %cEdit`,
                'color: goldenrod;',
            )
            expect(consoleMocks.log).toHaveBeenNthCalledWith(
                2 + offset,
                `${payload[key]}`,
                '~',
                `${secondPayload[key]}`,
            )
            offset++
        }
    })
})
