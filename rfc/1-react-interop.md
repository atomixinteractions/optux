
### Connection to React component


```js
import { userLens } from './user/lenses'
import { userFetch } from './user/commands'

const todoSelector = createSelector(
  select(userLens),
  select(todoLens),
  (user, todo) => heavyCalculateTodoList(user, todo),
)

// optional
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

const enhance = withOptice(
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

const enhance = withOptice(
  () => ({ user: userLens }),
  ({ execute }) => ({ fetch: (id) => execute(userFetch, id + 1) }),
  () => (state, props) => ({ todo: todoSelector(state, props) }),
)

export const SomeView = () => {}

export const SomePage = enhance(SomeView)
```

