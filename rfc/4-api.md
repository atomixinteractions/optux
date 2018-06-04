
### API functions

```js

// Library code
export const createApi = (request) => ({
  get: (path, options = {}) => (store) => request('GET', { path, options }, store),
  post: (path, body, options = {}) => (store) => request('POST', { path, body, options }, store),
  put: (path, body, options = {}) => (store) => request('PUT', { path, body, options }, store),
  patch: (path, body, options = {}) => (store) => request('PATCH', { path, body, options }, store),
  destroy: (path, options = {}) => (store) => request('DELETE', { path, body, options }, store),
})


// User code

import { createApi } from 'optux'

const request = (method, request, { readStore }) => {
  const token = readStore(tokenLens)
  const serverUrl = readStore(serverUrlLens)

  return fetch({ method, url: `${serverUrl}/${request}`, headers: { token } })
}

export const { get, path, post } = createApi(request)

```
