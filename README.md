# redux-console-devtools
⌨ Redux devtools in your browser console

## The road thus far

This is inspired by several other tools and gaps in each of them that never quite seem to get bridged. Building from the
general offering of the [Redux DevTools](https://github.com/reduxjs/redux-devtools) extension and largely
unmaintained middleware
packages such as [`redux-logger`](https://github.com/LogRocket/redux-logger) and various Redux debuggers that expose
the store and the actions dispatched to it, `redux-console-devtools` aims to bring thorough and extensible Redux debugging capabilities to the browser console.

## Featureset

The devtools middleware exposes customizable utilities to the browser console, allowing you to see what actions are
fired and how they mutate state, dispatch actions manually and much more.

## Usage

```js
import { ReduxConsoleDevtools } from 'redux-console-devtools'

import { createStore, applyMiddleware } from 'redux'

const neatReducer = (...) => { ... }

const neatDefaultState = {}

const store = createStore(
    neatReducer,
    neatDefaultState,
    applyMiddleware(ReduxConsoleDevtools())
)

...
```

When initialized, the middleware will inject utilities in the `window` global, making them accessible via
`reduxConsoleDevtools` in your browser.
