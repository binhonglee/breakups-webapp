# People.js

### Refs

| Refs names | Details |
|:---------------|:--------|
| `name` | Name of the person |
| `email` | Email of the person |
| `amount` | Amount of money paid by the person |

### Relevant variables

| Variable names | Details |
|:---------------|:--------|
| `req` | An object containing `name`, `email`, and `amount` from the above |
| `infoToSend` | An object containing `{this.props.id}` in `id` and `req` in `info` |

### Props

| Props name | Details |
|:---------------|:--------|
| `info` | Just `infoToSend` |
