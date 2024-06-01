require("dotenv").config();
const thalesAMMContract = process.env.THALES_AMM_CONTRACT

const buildOrder = (eligibleMarkets, tradeLog, skewImpactLimit, round, networkId, minTradeAmount, tradingAllocation) => {
  let builtOrders = [];
  for (const key in eligibleMarkets) {
    let market = eligibleMarkets[key];
    let quote;

    console.log(
        `--------------------Processing ${market.currencyKey} ${
          market.position > 0 ? "DOWN" : "UP"
        } at ${market.address}-------------------`
      );
    
      // Check if this market has already been traded in this round. Returns true or false.
    const tradedInRoundAlready = tradedInRound(tradeLog, market)
    if (tradedInRoundAlready) {
      const ineligibleTrade =  tradedOppositeInRound(tradeLog, market); 
      if (ineligibleTrade) {
        continue;
      } else {
        console.log(`${market.currencyKey} ${
            market.position > 0 ? "DOWN" : "UP"
          } Market is eligible to trade.`)
    }
 } 
      
        quote = buildQuote(market, round, skewImpactLimit, thalesAMMContract, networkId, tradingAllocation, tradedInRoundAlready, tradeLog);
        if (quote.amount > 0) {
          builtOrders.push({
            market: market.address,
            amount: quote.amount,
            quote: quote.quote,
            position: quote.position,
          });
        }  

     
  }
  return builtOrders;
}

const tradedInRound =  (tradeLog, market) => {
  for (const key in tradeLog) {
  if (tradeLog[key].market === market.address) {
      console.log(
        `Market ${market.address} has already been traded in this round.`
      )
    return true;
  } 
} 
return false;
};

const tradedOppositeInRound =  (tradeLog, market) => {
    for (const key in tradeLog) {
    if (tradeLog[key].market === market.address) {
         if (market.position != tradeLog[key].position) {
            console.log(`Market was traded in a different postion. Skipping...`)
            return true;
        }
    } 
  } 
  return false;
};

const buildQuote = async (market,
    round,
    skewImpactLimit,
    thalesAMMContract,
    networkId,
    allocation, tradedInRoundAlready, tradeLog) => {
      const minTradeAmount = 3;
      let finalAmount = 0, 
      quote = 0,
      decimals = 1e18;

      if (networkId == "42161" || networkId == "137") {
        decimals = 1e6;
      }

        // Lists the maximum amount of tokens that can be bought from the AMM in a position direction (0=UP, 1=DOWN)
  const maxAmmAmount =
    (await thalesAMMContract.availableToBuyFromAMM(market.address, market.position)) /
    1e18;

      // Get the available allocation for this market in this round
  const availableAllocationForRound = Number( BigInt(allocation) / BigInt(1e18));
  let availableAllocationForMarket;
  if (tradedInRoundAlready) {
    availableAllocationForMarket = GetAllocationForTradedInRound(tradeLog, market, availableAllocationForRound)
  } else {
    availableAllocationForMarket = Number(availableAllocationForRound * 0.05)
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
        Number( BigInt(amount) / BigInt(1e18))
      )) / 1e18;
    console.log(
      `Simulated puchase impact for ${amount} ${market.currencyKey} ${
        market.position > 0 ? "DOWN" : "UP"
      }s = Skew Impact: ${
        skewImpact <= 0 ? skewImpact.toFixed(5) : skewImpact.toFixed(5)
      } Skew Impact Limit: ${skewImpactLimit}`
    );
    if (skewImpact <= skewImpactLimit) break;
    amount = Math.floor(amount * 0.95);
    if (amount <= minTradeAmount) {
      console.log(`Amount to buy is too small.`);
      return { amount: 0, quote: 0, position: market.position };
    }
  }

  // Get the quote for the amount of tokens to buy. If the quote is over the max allocation, then reduce the amount to buy
  quote =
    (await thalesAMMContract.buyFromAmmQuote(
      market.address,
      market.position,
      Number( BigInt(amount) / BigInt(1e18))
    )) / decimals;
  console.log(
    `${amount} ${market.currencyKey} ${
      market.position > 0 ? "DOWN" : "UP"
    } Quote: Price: $${quote.toFixed(
      2
    )} Max Allocation: $${availableAllocationForMarket.toFixed(2)}`
  );
  while (quote > availableAllocationForMarket) {
    console.log(
      `Quoted price ($${quote.toFixed(
        2
      )}) is too high. Reducing quantity from ${amount} to ${Math.floor(
        amount * 0.99
      )}`
    );
    amount = Math.floor(amount * 0.99);
    if (amount <= minTradeAmount) {
      console.log(`Amount to buy is too small.`);
      return { amount: 0, quote: 0, position: market.position };
    }
    quote =
      (await thalesAMMContract.buyFromAmmQuote(
        market.address,
        market.position,
        Number( BigInt(amount) / BigInt(1e18))
      )) / decimals;
    console.log(
      `New quote: $${quote.toFixed(2)} for ${amount} ${market.currencyKey} ${
        market.position > 0 ? "DOWN" : "UP"
      }`
    );
  }
  finalAmount = amount.toFixed(1);
  let finalQuote =
  (await thalesAMMContract.buyFromAmmQuote(
    market.address,
    market.position,
    Number( BigInt(amount) / BigInt(1e18))
  )) / decimals;
console.log(
  `Quoted Price: $${finalQuote.toFixed(
    2
  )} Max Allocation: $${availableAllocationForMarket.toFixed(
    2
  )}. Amount to buy: ${finalAmount}`
);
return { amount: finalAmount, quote: finalQuote, position: market.position };

    };

    const GetAllocationForTradedInRound =  (tradeLog, market, availableAllocationForRound) => {
      console.log(
        `Finding the remaining allocation for ${market.currencyKey} ${
          market.position > 0 ? "DOWN" : "UP"
        } Market`
      ); 
      let remainingAllocation = availableAllocationForRound
      for (const key in tradeLog) {
      if (tradeLog[key].market === market.address) {
          let amount = Number(tradeLog[key].amount);
          let price = Number(tradeLog[key].price);
          remainingAllocation = remainingAllocation - (amount * price);
      } 
    } console.log(`Remaining allocation for ${market.currencyKey} ${
            market.position > 0 ? "DOWN" : "UP"
          }: ${remainingAllocation}`)
    return remainingAllocation
    };



module.exports = {buildOrder}