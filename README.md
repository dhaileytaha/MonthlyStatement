![CI](https://github.com/Ivan-on-Tech-Academy/eth-monthly-statement/workflows/CI/badge.svg?branch=main)

[![Netlify Status](https://api.netlify.com/api/v1/badges/f37df3fd-9608-4df6-9863-7ef9e7e74a78/deploy-status)](https://app.netlify.com/sites/monthlystatement/deploys)

# Monthly Ethereum Statements

## Quick start
Make sure yarn is installed
Run `yarn install` to install dependencies
Run `yarn start` to start local development environment

## Limitations
CoinGecko api can only handle 100 requests per minute. So it is possible to time-out the server when doing a lot of requests: i.e. fetching a lot of data multiple times within a minute

Etherscan api is limited to 5 calls per second, so we have build in a timeout of 1 second when we do a lot of calls (fetching transactions).

Only simple trades/swaps work. It seems that a 1inch swap is with chi tokens does not work correctly.

We have access to internal transactions like Eth -> Weth -> Ampl. But we are not using those. We are only using the 'normal' transactions and ERC20 transfers.

## Assumptions
ERC20 transfers happen in the following way
- ETH to a token: So we pay Ether and get an ERC20 transfer
- Token to a token: we pay no Ether (only gas) and get 2 ERC20 transfers (1 from ourself and 1 to ourself)
Etherscan is sometimes slow to respons:  a few seconds

It does not account for assets that have a rebase or any distribution method aside from ERC20 transfers. We calculate the value based on the ERC20 transfer events.

We cannot determine the USD value of more exotic tokens. Only tokens that can be retreived from coingecko.

## Coin matching
We are interacting with 2 APIs: Etherscan and CoinGecko. We need to match the token names that we get from Etherscan to a name that CoinGecko can use. To do this we are checking in the following way:

1) We are loading a list of all Coingecko tokens on startup
2) When we need to fetch a price we are calling `findCoinGeckoTokenId` to find a CoinGecko match based on a provided Etherscan token nameand symbol

To determine the tokenId we check:
1) We do a lookup in a local list of coins (`data/etherscanCoinGeckoMatch`). Where we try to find the match first (It is possilbe that matching in step 2) and 3) are wrong, so we need an own lookup)
2) If we don't get a match there, then we try to make a match based on a **name** from all CoinGecko coins
3) If we don't get a match there, then we try to make a match based on a **symbol** from all CoinGecko coins
4) If we don't get a match there, we don't fetch the price details

## Token migrations
Token migrations are described in data/tokenmigrations
With these migrations, we add a few customizations to the transactions
- Depending on the date (before or after migration) and contract address. We show the new token, the old token or the renamed old token (OLD TKN). This happens in the adjustForMigrations.ts file.
- Also, we show a 'custom transaction' with the message XXX are converted to OLD xxx. This is not a **real** transaction. But needed for clarity in bookkeeping to indicate that the tokens have no value anymore, but are still in posession.


## Debugging
To debug transactions:
- type `window.debug=true` in the console
- fetch the transactions (again)
- expand a transaction row to see its details

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
