require("dotenv").config();
const { ethers } = require("ethers");
const { wallet } = require("../constants");
const { thalesAMMContract: abi } = require("../contracts/ThalesAMM");
const thalesAMMContract = new ethers.Contract(
  process.env.THALES_AMM_CONTRACT,
  abi.abi,
  wallet,
);

/**
 * Builds a list of orders for eligible markets.
 *
 * @param {Object[]} eligibleMarkets - An array of eligible markets.
 * @param {Object} tradeLog - A record of trades made in the current round.
 * @param {number} skewImpactLimit - Maximum allowed skew impact for the trade.
 * @param {number} round - Current round number.
 * @param {string} networkId - Network ID of the blockchain.
 * @param {number} minTradeAmount - Minimum trade amount.
 * @param {number} tradingAllocationForMarket - Trading allocation for the market.
 * @param {number} availableAllocationForRound - Available allocation for the round.
 * @returns {Object[]} An array of built orders.
 */
const buildOrder = async (
  eligibleMarkets,
  tradeLog,
  skewImpactLimit,
  round,
  networkId,
  minTradeAmount,
  tradingAllocationForRound,
  tradingAllocationForMarket,
) => {
  let builtOrders = [];
  for (const key in eligibleMarkets) {
    let market = eligibleMarkets[key];
    let quote;

    console.log(
      `--------------------Processing ${market.currencyKey} ${
        market.position > 0 ? "DOWN" : "UP"
      } at ${market.address}-------------------`,
    );

    // Check if this market has already been traded in this round. Returns true or false.
    const tradedInRoundAlready = tradedInRound(tradeLog, market);
    if (tradedInRoundAlready) {
      const ineligibleTrade = tradedOppositeInRound(tradeLog, market);
      if (ineligibleTrade) {
        continue;
      } else {
        console.log(
          `${market.currencyKey} ${
            market.position > 0 ? "DOWN" : "UP"
          } Market is eligible to trade.`,
        );
      }
    }
    quote = buildQuote(
      market,
      round,
      skewImpactLimit,
      thalesAMMContract,
      networkId,
      tradingAllocationForRound,
      tradedInRoundAlready,
      tradeLog,
    );
    if (quote.amount > 0) {
      // market example 1: eligible Market:  {  address: '0xfb227a2cdc11435bd5684ca2ec4426ebbeb5ed12', position: 0, currencyKey: 'SNX', price: 0.8115908079637828 }
      // market example 2: { address: '0xc1af77a1efea7326df378af9195306f0a3094f51', position: 1, currencyKey: 'LINK', price: 0.8111760272895937 }
      builtOrders.push({
        amount: quote.amount,
        quote: quote.price,
        position: quote.position,
        market: market,
      });
    }
  }
  console.log("built orders: ", builtOrders);
  return builtOrders;
};

/**
 * Checks if a market has been traded in the current round.
 *
 * @param {Object} tradeLog - A record of trades made in the current round.
 * @param {Object} market - The market to check.
 * @returns {boolean} True if the market has been traded, false otherwise.
 */
const tradedInRound = (tradeLog, market) => {
  // Iterate through the trade log.
  for (const key in tradeLog) {
    // Check if the current trade is for the same market.
    if (tradeLog[key].market === market.address) {
      console.log(
        `Market ${market.address} has already been traded in this round.`,
      );
      return true;
    }
  }
  // The market has not been traded in this round.
  return false;
};

/**
 * Checks if a market has been traded in the opposite direction in the current round.
 *
 * @param {Object} tradeLog - A record of trades made in the current round.
 * @param {Object} market - The market to check.
 * @returns {boolean} True if the market has been traded in the opposite direction, false otherwise.
 */
const tradedOppositeInRound = (tradeLog, market) => {
  // Iterate through the trade log.
  for (const key in tradeLog) {
    // Check if the current trade is for the same market.
    if (tradeLog[key].market === market.address) {
      // Check if the current trade is in the opposite direction.
      if (market.position != tradeLog[key].position) {
        console.log(`Market was traded in a different postion. Skipping...`);
        return true;
      }
    }
  }
  // The market has not been traded in the opposite direction.
  return false;
};

const buildQuote = async (
  market, // Market object containing details about the market to trade
  round, // Current round number
  skewImpactLimit, // Maximum allowed skew impact for the trade
  thalesAMMContract, // Thales AMM contract instance
  networkId, // Network ID of the blockchain
  allocation, // Total allocation for the round
  tradedInRoundAlready, // Flag indicating if the market has been traded in this round
  tradeLog, // Trade log for the round
) => {
  const minTradeAmount = 3;
  let finalAmount = 0,
    quote = 0,
    decimals = 1e18;

  if (networkId == "42161" || networkId == "137") {
    decimals = 1e6;
  }

  // Lists the maximum amount of tokens that can be bought from the AMM in a position direction (0=UP, 1=DOWN)
  const maxAmmAmount = Number(
    (await thalesAMMContract.availableToBuyFromAMM(
      market.address,
      market.position,
    )) / BigInt(1e18),
  );

  // Get the available allocation for this market in this round
  console.log(`Allocation for Round: ${allocation}`);
  const availableAllocationForRound = Number(BigInt(allocation) / BigInt(1e18));
  let availableAllocationForMarket;
  if (tradedInRoundAlready) {
    availableAllocationForMarket = GetAllocationForTradedInRound(
      tradeLog,
      market,
      availableAllocationForRound,
    );
  } else {
    availableAllocationForMarket = Number(availableAllocationForRound * 0.05);
    console.log(
      `No previous trades. Authorized amount is $${availableAllocationForMarket.toFixed(2)}`,
    );
  }

  const maxAllocationAmount = availableAllocationForMarket / market.price; // this is a cieling value, as it would a trade with zero slippage
  let amount = Math.round(maxAllocationAmount);
  if (
    maxAmmAmount < minTradeAmount ||
    amount < minTradeAmount ||
    maxAmmAmount == 0
  ) {
    return { amount: 0, quote: 0, position: market.position };
  }
  while (amount < maxAmmAmount) {
    let skewImpact =
      (await thalesAMMContract.buyPriceImpact(
        market.address,
        market.position,
        amount,
      )) / BigInt(decimals);
    console.log(
      `Skew Impact for ${amount} ${market.currencyKey} ${
        market.position > 0 ? "DOWN" : "UP"
      }s: ${skewImpact}`,
    );

    console.log(
      `Simulated puchase impact for ${amount} ${market.currencyKey} ${
        market.position > 0 ? "DOWN" : "UP"
      }s = Skew Impact: ${
        skewImpact <= 0 ? "-" + skewImpact.toFixed(5) : skewImpact.toFixed(5)
      } Skew Impact Limit: ${skewImpactLimit}`,
    );
    if (skewImpact <= skewImpactLimit) break;
    amount = Math.floor(amount * 0.95);
    if (amount <= minTradeAmount) {
      console.log(`Amount to buy is too small.`);
      return { amount: 0, quote: 0, position: market.position };
    }
  }

  // Get the quote for the amount of tokens to buy. If the quote is over the max allocation, then reduce the amount to buy
  quote = Number(
    (await thalesAMMContract.buyFromAmmQuote(
      market.address,
      market.position,
      amount,
    )) / BigInt(decimals),
  );
  console.log(
    `${amount} ${market.currencyKey} ${
      market.position > 0 ? "DOWN" : "UP"
    } Quote: Price: $${quote.toFixed(
      2,
    )} Max Allocation: $${availableAllocationForMarket.toFixed(2)}`,
  );
  while (quote > availableAllocationForMarket) {
    console.log(
      `Quoted price ($${quote.toFixed(
        2,
      )}) is too high. Reducing quantity from ${amount} to ${Math.floor(
        amount * 0.99,
      )}`,
    );
    amount = Math.floor(amount * 0.99);
    if (amount <= minTradeAmount) {
      console.log(`Amount to buy is too small.`);
      return { amount: 0, quote: 0, position: market.position };
    }
    quote = Number(
      (await thalesAMMContract.buyFromAmmQuote(
        market.address,
        market.position,
        amount,
      )) / BigInt(decimals),
    );
    console.log(
      `New quote: $${quote.toFixed(2)} for ${amount} ${market.currencyKey} ${
        market.position > 0 ? "DOWN" : "UP"
      }`,
    );
  }
  finalAmount = amount.toFixed(0);
  let finalQuote =
    (await thalesAMMContract.buyFromAmmQuote(
      market.address,
      market.position,
      finalAmount * 1e18,
    )) / decimals;
  console.log(
    `Quoted Price: $${finalQuote} Max Allocation: $${+availableAllocationForMarket.toFixed(2)}. Amount to buy: ${+finalAmount}`,
  );
  return {
    amount: finalAmount,
    quote: finalQuote,
    position: market.position,
    market: market,
  };
};

// Calculates the remaining allocation for a given market in a round, considering previous trades.
const GetAllocationForTradedInRound = (
  tradeLog, // Log of trades that have occurred in the round
  market, // The market object for which to calculate remaining allocation
  availableAllocationForRound, // The total allocation available for the round
) => {
  console.log(
    `Finding the remaining allocation for ${market.currencyKey} ${
      market.position > 0 ? "DOWN" : "UP"
    } Market`,
  );
  let remainingAllocation = availableAllocationForRound;
  // Iterate through the trade log to find trades related to the given market
  for (const key in tradeLog) {
    if (tradeLog[key].market === market.address) {
      let amount = Number(tradeLog[key].amount);
      let price = Number(tradeLog[key].price);
      // Subtract the cost of each trade from the remaining allocation
      remainingAllocation = remainingAllocation - amount * price;
    }
  }
  console.log(
    `Remaining allocation for ${market.currencyKey} ${
      market.position > 0 ? "DOWN" : "UP"
    }: ${remainingAllocation}`,
  );
  return remainingAllocation;
};

module.exports = { buildOrder };
