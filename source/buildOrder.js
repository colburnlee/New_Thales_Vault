require("dotenv").config();
const thalesAMMContract = process.env.THALES_AMM_CONTRACT

const buildOrder = (eligibleMarkets, tradeLog, skewImpactLimit, round, networkId, minTradeAmount, tradingAllocation) => {
  for (const key in eligibleMarkets) {
    let market = eligibleMarkets[key];

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

      
        const amountToBuy = amountToBuy(market, round, skewImpactLimit, thalesAMMContract, networkId, tradingAllocation);
}
  }
  return
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

const amountToBuy = async (market,
    round,
    skewImpactLimit,
    thalesAMMContract,
    networkId,
    allocation) => {
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
  const availableAllocationForMarket = availableAllocationForRound * 0.05;



    };

module.exports = {buildOrder}