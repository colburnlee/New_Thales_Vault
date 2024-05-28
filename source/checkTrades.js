
const ethers = require("ethers");


const Position = {
    UP: 0,
    DOWN: 1,
    DRAW: 2,
  };

const checkTrades = async (tradeLog, pricesForAllActiveMarkets, priceImpactForAllActiveMarkets, skewImpactLimit, activeMarkets, networkId, priceUpperLimit, priceLowerLimit, roundEndTime) => {
      // Initialize an empty array to store trading markets.
    let tradingMarkets = [];
  for (const market of activeMarkets) {
    console.log(market.address)
    const marketPrices = pricesForAllActiveMarkets.find(
      (prices) => prices.market.toLowerCase() === market.address
    );
    const marketPriceImpact = priceImpactForAllActiveMarkets.find(
      (priceImpact) => priceImpact.market.toLowerCase() === market.address
    );

    if (
      inTradingWeek(+market.maturityDate, +roundEndTime) &&
      marketPrices &&
      marketPriceImpact
    ) {
      try {
        let priceUP, priceDOWN, buyPriceImpactUP, buyPriceImpactDOWN;
        buyPriceImpactUP = Number(BigInt(marketPriceImpact.upPriceImpact) / BigInt(1e18));
        buyPriceImpactDOWN = Number(BigInt(marketPriceImpact.downPriceImpact) / BigInt(1e18));


        if (+networkId == "10" || +networkId == "56") {
          priceUP = Number(BigInt(marketPrices.upPrice) / BigInt(1e18));
          priceDOWN = Number(BigInt(marketPrices.downPrice) / BigInt(1e18));
        } else if (+networkId == "42161" || +networkId == "56") {
          priceUP = Number(BigInt(marketPrices.upPrice) / BigInt(1e6));
          priceDOWN = Number(BigInt(marketPrices.downPrice) / BigInt(1e6));
        }
        console.log(`Market: ${market.address} PriceUP: ${priceUP} PriceDOWN: ${priceDOWN}`)
        if (
          priceUP > priceLowerLimit &&
          priceUP < priceUpperLimit &&
          buyPriceImpactUP < skewImpactLimit
        ) {
          tradingMarkets.push({
            address: market.address,
            position: Position.UP,
            currencyKey: market.currencyKey,
            price: priceUP,
          });
          console.log(market.address, "PriceUP", priceUP);
        } else if (
          priceDOWN > priceLowerLimit &&
          priceDOWN < priceUpperLimit &&
          buyPriceImpactDOWN < skewImpactLimit
        ) {
          tradingMarkets.push({
            address: market.address,
            position: Position.DOWN,
            currencyKey: market.currencyKey,
            price: priceDOWN,
          });
          console.log(market.address, "PriceDOWN", priceDOWN);
        } else {
          continue;
        }
      } catch (error) {
        console.log(error);
      }
      
    }
    
    
  }console.log(
      `--------------${activeMarkets.length} Markets processed. ${tradingMarkets.length} Eligible -------------------`
    );
    return tradingMarkets;

}


const  inTradingWeek = (maturityDate, roundEndTime) => {
  const now = Date.now();
  console.log(
    `now: ${now} - maturityDate: ${new Date(
      maturityDate
    )} - roundEndTime: ${roundEndTime} - 900000: ${new Date(
      roundEndTime + 900000
    )} - ${
      Number(maturityDate) > Number(now) &&
      Number(maturityDate) < Number(roundEndTime + 900000)
    }`
  );
  if (
    Number(maturityDate) > Number(now) &&
    Number(maturityDate) < Number(roundEndTime)
  ) {
    return true;
  }
  return false;
}

module.exports={checkTrades}

 /* *
    Process individual markets
      Schema:  {
      customMarket: false,
      customOracle: '0x0000000000000000000000000000000000000000',
      address: '0x37dcb4ccf7f5cd5c78d97d20ae1b698865d54ba0',
      timestamp: 1677058735000,
      creator: '0x5027ce356c375a934b4d1de9240ba789072a5af1',
      currencyKey: 'SNX',
      strikePrice: 2.3,
      maturityDate: 1678293000000,
      expiryDate: 1686069000000,
      isOpen: true,
      poolSize: 305,
      longAddress: '0x02bbfd96b7db61855731f7f71eefa836def55220',
      shortAddress: '0x1f7f05b1c06f8a4015fe296727d1e1fcbfdd7d80',
      result: null,
      finalPrice: 0
    }
  **/