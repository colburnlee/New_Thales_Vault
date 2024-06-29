require("dotenv").config();
const { ethers } = require("ethers");
const { wallet, arbWallet } = require("../constants");
const { thalesAMMContract: abi } = require("../contracts/ThalesAMM");

/**
 * Builds a list of orders for eligible markets.
 *
 * @param {Object[]} eligibleMarkets - An array of eligible markets.
 * @param {Object} tradeLog - A record of trades made in the current round.
 * @param {number} skewImpactLimit - Maximum allowed skew impact for the trade.
 * @param {number} round - Current round number.
 * @param {string} networkId - Network ID of the blockchain.
 * @param {number} minTradeAmount - Minimum trade amount.
 * @param {number} availableAllocationForRound - Available allocation for the round.
 * @returns {Object[]} An array of built orders.
 */
const buildOrder = async (
  eligibleMarkets,
  // tradeLog,
  skewImpactLimit,
  round,
  networkId,
  minTradeAmount,
  tradingAllocationForRound,
  db,
) => {
  let builtOrders = [];
  let thalesAMMContract;
  if (networkId == "10") {
    thalesAMMContract = new ethers.Contract(
      process.env.THALES_AMM_CONTRACT,
      abi.abi,
      wallet,
    );
  } else if (networkId == "42161") {
    thalesAMMContract = new ethers.Contract(
      process.env.ARBITRUM_THALES_AMM_CONTRACT,
      abi.abi,
      arbWallet,
    );
  }

  for (const key in eligibleMarkets) {
    let market = eligibleMarkets[key];
    let quote;
    let tradedInRoundAlready = false;

    console.log(
      `------------ Processing ${market.currencyKey} ${
        market.position > 0 ? "DOWN" : "UP"
      } at ${market.address} -----------`,
    );
    let { previousTradeTotal, previousTradeDirection } =
      await getPreviousTradeAmount(db, market.address);
    if (previousTradeTotal > 0) {
      console.log("PREVIOUSLY TRADED");
      tradedInRoundAlready = true;
      if (previousTradeDirection != market.position) {
        console.log(
          `Previous trade was in the opposite direction. Skipping...`,
        );
        continue;
      }
    }

    quote = await buildQuote(
      market,
      round,
      skewImpactLimit,
      thalesAMMContract,
      networkId,
      tradingAllocationForRound,
      tradedInRoundAlready,
      // tradeLog,
      previousTradeTotal,
    );
    if (quote.amount > 0) {
      // market example 1: eligible Market:  {  address: '0xfb227a2cdc11435bd5684ca2ec4426ebbeb5ed12', position: 0, currencyKey: 'SNX', price: 0.8115908079637828 }
      // market example 2: { address: '0xc1af77a1efea7326df378af9195306f0a3094f51', position: 1, currencyKey: 'LINK', price: 0.8111760272895937 }
      builtOrders.push({
        amount: quote.amount,
        quote: quote.quote,
        position: quote.position,
        market: market,
      });
    }
  }

  return builtOrders;
};

const buildQuote = async (
  market, // Market object containing details about the market to trade
  round, // Current round number
  skewImpactLimit, // Maximum allowed skew impact for the trade
  thalesAMMContract, // Thales AMM contract instance
  networkId, // Network ID of the blockchain
  allocation, // Total allocation for the round
  tradedInRoundAlready, // Flag indicating if the market has been traded in this round
  // tradeLog, // Trade log for the round
  previousTradeTotal, // Previous trade total
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
    )) / BigInt(1e18), // always 18 decimal places
  );

  // Get the available allocation for this market in this round
  // console.log(`Allocation for Round: ${ethers.formatUnits(allocation)}`);
  const availableAllocationForRound = BigInt(allocation) / BigInt(1e18);
  let availableAllocationForMarket;
  if (tradedInRoundAlready) {
    availableAllocationForMarket = ethers.formatUnits(
      BigInt(allocation) / BigInt(20) - BigInt(previousTradeTotal),
      "ether",
    );
    console.log(
      `Remaining allocation for ${market.currencyKey} ${market.position > 0 ? "DOWN" : "UP"}: ${availableAllocationForMarket}`,
    );
  } else {
    availableAllocationForMarket = Number(availableAllocationForRound) * 0.05;
    console.log(
      `Authorized amount is $${availableAllocationForMarket.toFixed(2)}`,
    );
  }

  const maxAllocationAmount = availableAllocationForMarket / market.price; // this is a cieling value, as it would a trade with zero slippage
  let amount = Math.round(maxAllocationAmount);
  console.log(
    `Max AMM Amount: ${maxAmmAmount}, Available Allocation: ${availableAllocationForMarket}, Market Price ${market.price}, amount: ${amount}`,
  );

  if (
    maxAmmAmount < minTradeAmount ||
    amount < minTradeAmount ||
    maxAmmAmount == 0
  ) {
    console.log(
      `AMM amount available to buy (${maxAmmAmount}) is too small OR the quoted amount (${amount}) is below the minimum of (${minTradeAmount})`,
    );
    return { amount: 0, quote: 0, position: market.position };
  }
  while (amount < maxAmmAmount) {
    let skewImpact =
      Number(
        await thalesAMMContract.buyPriceImpact(
          market.address,
          market.position,
          ethers.parseUnits(amount.toString(), "ether"),
        ),
      ) / 1e18;
    console.log(
      `Skew Impact for ${amount} ${market.currencyKey} ${
        market.position > 0 ? "DOWN" : "UP"
      }s: ${skewImpact}`,
    );

    console.log(
      `Simulated puchase impact for ${amount} ${market.currencyKey} ${
        market.position > 0 ? "DOWN" : "UP"
      }s = Skew Impact: ${
        skewImpact <= 0 ? "-" + skewImpact : skewImpact
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
  console.log(
    `attempting to buy: ${ethers.formatUnits(amount, decimals == 1e18 ? "ether" : "wei")} ${market.position} ${market.address}`,
  );
  quote =
    Number(
      await thalesAMMContract.buyFromAmmQuote(
        market.address,
        market.position,
        ethers.parseUnits(amount.toString(), "ether"),
      ),
    ) / decimals;
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
    quote =
      Number(
        await thalesAMMContract.buyFromAmmQuote(
          market.address,
          market.position,
          ethers.parseUnits(amount.toString(), "ether"),
        ),
      ) / decimals;
    console.log(
      `New quote: $${quote.toFixed(2)} for ${amount} ${market.currencyKey} ${
        market.position > 0 ? "DOWN" : "UP"
      }`,
    );
  }
  finalAmount = amount.toFixed(0);

  let finalQuote =
    Number(
      await thalesAMMContract.buyFromAmmQuote(
        market.address,
        market.position,
        ethers.parseUnits(amount.toString(), "ether"),
      ),
    ) / decimals;
  console.log("final quote: ", finalQuote);
  console.log(
    `Quoted Price: $${finalQuote} Max Allocation: $${+availableAllocationForMarket.toFixed(2)}. Amount to buy: ${+finalAmount}`,
  );
  return {
    amount: +finalAmount,
    quote: finalQuote,
    position: market.position,
    market: market,
  };
};

const getPreviousTradeAmount = async (
  db, // database reference
  market, // The market object for which to calculate remaining allocation
) => {
  const tradeLog = await db
    .collection("tradeLog")
    .where("market", "==", market)
    .get()
    .then((querySnapshot) => {
      const tradeLog = querySnapshot.docs.map((doc) => doc.data());
      return tradeLog;
    })
    .catch((error) => {
      console.log("No documents exist:  ", error);
      return 0n;
    });
  let previousTradeTotal = 0n;
  let previousTradeDirection;
  for (const key in tradeLog) {
    previousTradeTotal += BigInt(tradeLog[key].quote);
    previousTradeDirection = tradeLog[key].position == "UP" ? 0 : 1;
  }
  // console.log(`previousTradeTotal: ${previousTradeTotal} trade Direction: ${previousTradeDirection}`)
  return { previousTradeTotal, previousTradeDirection };
};

module.exports = { buildOrder };

// built order example
// [
//   {
//     amount: 6,
//     quote: 4.911048190607197,
//     position: 1,
//     market: {
//       address: '0xb678d8953067e6f6fbf101916871177ad245da6b',
//       position: 1,
//       currencyKey: 'BTC',
//       price: 0.822769149359188
//     }
//   }
// ]
