

const buildOrder = (eligibleMarkets, tradeLog, skewImpactLimit, round) => {
  for (const key in eligibleMarkets) {
    let market = eligibleMarkets[key];

    console.log(
        `--------------------Processing ${market.currencyKey} ${
          market.position > 0 ? "DOWN" : "UP"
        } at ${market.address}-------------------`
      );
    
      // Check if this market has already been traded in this round. Returns true or false.
    
      const ineligibleTrade =  tradedInRoundAlready(tradeLog, market); 
      if (ineligibleTrade) {
        continue;
      } else {
        console.log(`${market.currencyKey} ${
            market.position > 0 ? "DOWN" : "UP"
          } Market is eligible to trade.`)
}
  }
  return
}

const tradedInRoundAlready = (tradeLog, market) => {
    for (const key in tradeLog) {
    if (tradeLog[key].market === market.address) {
        console.log(
          `Market ${market.address} has already been traded in this round.`
        )
         const tradedBeforePostion = tradeLog[key].position 
         if (market.position != tradedBeforePostion) {
            console.log(`Market was traded in a different postion. Skipping...`)
            return true;
        }
      return false;
    } 
  } 
  return false;
};

const amountToBuy = (market,
    round,
    skewImpactLimit,
    thalesAMMContract,
    networkId,
    allocation) => {

    };

module.exports = {buildOrder}