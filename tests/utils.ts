import { AnyAction, Reducer } from 'redux'

export interface ConsoleMocks {
    log: jest.SpyInstance
    groupCollapsed: jest.SpyInstance
    group: jest.SpyInstance
}

export const MOCK_ACTION_TYPE = 'mockAction'

export function getMockAction(
    payload?: unknown,
    type = MOCK_ACTION_TYPE,
): AnyAction {
    return {
        type,
        payload,
    }
}

export function mockReducer(state: any, action: AnyAction): Reducer {
    if (action.type === MOCK_ACTION_TYPE) return { ...state, ...action.payload }
    return state
}
