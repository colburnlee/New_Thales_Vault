# New_Thales_Vault

# vault-bots

This repository contains bots that are used to execute trades on Vault contracts for Thales and OvertimeMarkets. It is a side project that is not maintained by Thales team. My goal is to use the Thales team code as a starting point and branch out from there.

Important files:

1. `index.js` - bot which checks markets, filters markets eligible for Vault trade and then executes trades.
2. `marketschecker.js` - script that filters markets based on Vault price limits
3. `vault.js` - script that is executing trades

NOTE: PLEASE CHECK ABI FILES TO BE UP TO DATE!

## Order of execution

_Old_
index.js -> doLoop() -> doMain() -> vault.js -> ...
processVault() -> await trade() -> await closeRound()

- New \*
  **index.js**

* [ ] Pull in wallet information (information neededt to execute an order)
* [ ] Pull in network information. This will include all needed
* [ ]

## Vault Addresses

- https://contracts.thalesmarket.io/

## .ENV file:

```
---------------------------
PRIVATE_KEY="WALLET PRIVATE KEY"
WALLET="WALLET ADDRESS"
INFURA="INFURA_KEY"
INFURA_URL="https://optimism.infura.io/v3/INFURA_KEY"
NETWORK="Optimism"
NETWORK_ID="10"

VAULT_CONTRACT="0x6c7Fd4321183b542E81Bcc7dE4DfB88F9DBca29F"
THALES_AMM_CONTRACT="0x278B5A44397c9D8E52743fEdec263c4760dc1A1A"
POSITIONAL_MARKET_DATA_CONTRACT="0x21382a033E581a2D685826449d6c9b3d6507e23C"
SPORT_POSITIONAL_MARKET_DATA_CONTRACT="0xd8Bc9D6840C701bFAd5E7cf98CAdC2ee637c0701"
TX_EXPLORER_URL="https://optimistic.etherscan.io/tx/"
DELAY_IN_MINUTES="1"

---------------------------
```

** NOTE: this properties are set is for kovan network please check next variables for MAIN **

## Vault Variables

```
---------------------------
Utilization rate: What is the maximum percentage of the total deposited that can be utilized on a trading strategy at any given moment
Price lower limit: The automated strategy will only buy positions at this price or higher
Price upper limit: The automated strategy will only buy positions up to this price.
Max Skew impact: Represents how much skew impact is the current strategy willing to accept when executing a trade. If set to 0, means that the strategy won’t execute any trade that has any amount of skew.
Max allocation on a single market: The maximum percentage of the total funds deposited to be used for a single position
Max total deposit: Maximum amount of collateral (from all the users or depositors) to be taken by the vault
Max users in the vault: Maximum amount of users (or addresses) in the vault.
Minimum amount on a single trade: Value in dollars defining the minimal size possible for a trade executed by the vault
Minimum deposit: Minimal amount (in sUSD) for a user to deposit into the vault
Round duration: How many days does a round last, initially the 3 vaults are set to a 1-week round duration
---------------------------
```
