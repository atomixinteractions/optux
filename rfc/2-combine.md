
### Combine lens

Select object by passed lenses.

When set, update store only for passed fields through lenses.

```js
const data = L.combine({
  user: userLens,
  accounts: accountsLens,
})

```
