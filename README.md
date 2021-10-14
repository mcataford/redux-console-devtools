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

## Utilities

The following utilities are defined on `reduxConsoleDevtools` and are accessible in the browser console via
`reduxConsoleDevtools.<utility>`:

### `setFilter`

```
reduxConsoleDevtools.setFilter(
    label: string,
    handler: (action: AnyAction) => boolean
)
```

Adds a filter identified by `label` which runs on every action processed by the middleware. If the filter
function returns `false`, the corresponding action is silently processed.

### `removeFilter`

```
reduxConsoleDevtools.removeFilter(
    label: string,
)
```

Removes the filter identified by `label` from the filter list.

### `showFilters`

```
reduxConsoleDevtools.showFilters()
```

Prints all active filters alongside their label.

### `mute`

```
reduxConsoleDevtools.mute()
```

Silences the middleware.

### `unmute`

```
reduxConsoleDevtools.unmute()
```

Undoes any previous call to `mute`.

### `dispatch`

```
reduxConsoleDevtools.dispatch(
    action: AnyAction
)
```

Dispatches an action passed as argument to the store. Actions dispatched through `dispatch` will act as if
they were dispatched from within your application.
