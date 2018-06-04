
### Testing commands

```js

// Command

import { get } from 'root/api'
import { tokenGet } from './auth/commands'

const userRequest = (id) => ({ execute }) => execute(get)(`/user/${id}`)

const userFetch = (id) => (
  async ({ readStore, updateStore, execute }) => {
    const token = await execute(tokenGet, id)

    const user = await execute(userRequest, { id, token })

    updateStore(userLens, user)
  }
)


test('user fetch', async t => {
  const id = 1
  const command = userFetch(1)

  const store = createFakeStore()

  const tokenGetSpy = spy().resolve({ data: 'token' })
  const userRequestSpy = spy().resolve({ user: { id } })

  store.commandMock(tokenGet, tokenGetSpy)
  store.commandMock(userRequest, userRequestSpy)

  const result = await command(store)

  tokenGetSpy.calledWith(id)
  userRequestSpy.calledWith({ id, token: { data: 'token' } })

  store.updatedWith(userLens, { user: { id } })
})

```
