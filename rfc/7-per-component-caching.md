### Interop with reselect

```js
import { createSelector } from 'reselect'
import { L } from 'optice'

const todoSelector = createSelector(
  L.select(userLens),
  L.select(todoLens),
  (user, todo) => heavyCalculateTodoList(user, todo),
)
```
