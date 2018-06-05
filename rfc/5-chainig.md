### Chaining connection

```js
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
```
