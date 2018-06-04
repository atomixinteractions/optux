
### Connection to React component


```js
import { userLens } from './user/lenses'
import { userFetch } from './user/commands'

const todoSelector = createSelector(
  select(userLens),
  select(todoLens),
  (user, todo) => heavyCalculateTodoList(user, todo),
)

// optional (candidate 1)
/*
const TodoList = optice()
  .lenses({
    user: userLens,
  })
  .commands({
    fetch: userFetch,
  })
  .props((state, props) => ({
    todo: todoSelector(state, props),
    todoSelector
  }))
  .withProps((props) => <TodoView todo={props.todo} />)
*/

const connect = withOptice(
  {
    user: userLens,
  },
  {
    fetch: userFetch,
  },
  (state, props) => ({
    todo: todoSelector(state, props),
    todoSelector,
  }),
)

// caching per component
// TODO: implement it
const connect = withOptice(
  () => ({ user: userLens }),
  ({ execute }) => ({ fetch: (id) => execute(userFetch, id + 1) }),
  () => (state, props) => ({ todo: todoSelector(state, props) }),
)

export const SomeView = () => {}

export const SomePage = connect(SomeView)
```


### Provide Store

```js
import React from 'react'
import ReactDom from 'react-dom'
import { L, createStore } from 'optice'
import { OptuxProvider } from 'optux'

const initialState = {
  user: {
    name: '',
    email: '',
  },
  company: {
    name: '',
    okato: 0,
  }
}

const store = createStore(initialState)

const Root = () => (
  <OptuxProvider store={store}>
    <App />
  </OptuxProvider>
)

ReactDom.render(<Root />, document.getElementById('root'))
```

