# App.js

### State

| State names | Details |
|:---------------|:--------|
| `peoples` | Array of [`People`](People.md) component |
| `info` | Array for information of all the people involved |
| `paymentChain` | Generated return by the backend server |
| `actionButtons` | Just to store (and display) the 2 given buttons |
| `showResults` | Boolean that will be switched when result is received from server |

### Functions

| Function names | Details |
|:---------------|:--------|
| `getPaymentChain()` | Parse user input into JSON to be sent to backend and decipher the response from backend |
| `populatePeople(e)` | Fill `peoples` in `{this.state}` with `People` component based on user input in `Main-form` class |
| `updateInfo(e)` | Binded to each [`People`](people.md) as to update `{this.state.info}` when something in the [`People`](people.md) class is updated |
| `httpPost(data, callback)` | Used by `getPaymentChain()` to make `POST` request to [api.breakups.life/paymentChain](https://api.breakups.life) |
