
### Create and provide store

> Like in react-redux

```js
import React from 'react'
import ReactDom from 'react-dom'
import { createStore } from 'optice'
import { OptuxProvider } from 'optux'

const initialState = {
  user: {
    name: '',
    email: '',
    id: 0,
  },
  auth: {
    token: '',
  },
  todo: {
    list: [],
  },
}

const store = createStore(initialState)

const Root = () => (
  <OptuxProvider store={store}>
    <App />
  </OptuxProvider>
)

ReactDom.render(<Root />, document.getElementById('root'))
```

### Setup

```js
// lenses.js
import { L } from 'optice'

export const userLens = L.prop('user')
export const authLens = L.prop('auth')
export const authTokenLens = L.compose(authLens, L.prop('token'))
```

```js
// commands.js
import { authTokenLens, userLens } from './lenses'

export const userFetch = (userId) => (
  async ({ readStore, updateStore }) => {
    const token = readStore(authTokenLens)
    const user = await fetch(`/users/${userId}`, { headers: { Token: token } })
    // no validation and errors handling here
    // just example
    updateStore(userLens, user)
  }
)
```

```js
// selectors.js
import { createSelector } from 'reselect'

export const todoSelectors = createSelector(
  (state) => state.todo,
  (todo) => todo.list,
)
```


### Connection to React component

```js
import { userLens } from './lenses'
import { userFetch } from './commands'
import { todoSelectors } from './selectors'

// Use lens to read value from store and map it to prop
const mapLensesToProps = {
  user: userLens,
}

// Bind `execute` to command and map it to props
// Like mapDispatchToProps in react-redux
const mapCommandsToProps = {
  fetch: userFetch,
}

// Map inner props and store state to props
const mapStateToProps = (state, props) => ({
  todo: todoSelector(state, props),
})

// `withOptice` makes HOC
const enhance = withOptice(mapLensesToProps, mapCommandsToProps, mapStateToProps)

export const SomeView = ({ user, fetch, todo }) => {
  // `user` is a object from store, selected by lens
  // `fetch` is command `userFetch` binded to `store.execute`
  // `todo` is a object selected from store by `todoSelector`

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <button onClick={fetch}>Fetch user</button>
    </div>
  )
}

// component "connected" to store
export const SomePage = enhance(SomeView)
```

