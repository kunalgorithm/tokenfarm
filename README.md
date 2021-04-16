# Yield Farming App

Deposit mDAI into the decentralized application and yield DAPP, a reward token. This is based on the pricinciple of yield farming, which is popular in DeFi today.

## Architecture

- React
- Node
- Solidity

## Smart contracts

1. DAI
2. Dapp token
3. TokenFarm

## Explore the blockchain

```bash
truffle console
```

```truffle
> tokenFarm = await TokenFarm.deployed()
> tokenFarm.address

# Check mDai balance
> mDai = await DaiToken.deployed()

# get accounts
> accounts = await web3.eth.getAccounts()

> balance = await mDai.balanceOf(accounts[1])
> balance.toString()
'100000000000000000000'

> formattedBalance = web3.utils.fromWei(balance)
```

## Compile and migrate

```bash
truffle compile

truffle migrate --reset
```

## Debug

Error

```
Error: Could not find
import  from any sources; imported from /Users/kunal/dev/eth/defi_tutorial/src/contracts/TokenFarm.sol
```

Solution: use Semicolors (`;`) after lines of solidity code

## Tests

```
truffle test
```
