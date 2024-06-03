const Position = {
  UP: 0,
  DOWN: 1,
  DRAW: 2,
};

const checkTrades = async (
  pricesForAllActiveMarkets,
  priceImpactForAllActiveMarkets,
  skewImpactLimit,
  activeMarkets,
  networkId,
  priceUpperLimit,
  priceLowerLimit,
  closingDate,
) => {
  // Initialize an empty array to store trading markets.
  let tradingMarkets = [];
  for (const market of activeMarkets) {
    const marketPrices = pricesForAllActiveMarkets.find(
      (prices) => prices.market.toLowerCase() === market.address,
    );
    const marketPriceImpact = priceImpactForAllActiveMarkets.find(
      (priceImpact) => priceImpact.market.toLowerCase() === market.address,
    );

    // console.log(` Market: ${market.address}, maturity date: ${market.maturityDate}, roundEndTime: ${roundEndTime} `)
    if (
      inTradingWeek(+market.maturityDate, +closingDate) &&
      marketPrices &&
      marketPriceImpact
    ) {
      console.log(
        `Market: ${market.address} Prices: ${marketPrices} PriceImpact: ${marketPriceImpact}  `,
      );
      try {
        let priceUP, priceDOWN, buyPriceImpactUP, buyPriceImpactDOWN;
        buyPriceImpactUP = Number(marketPriceImpact.upPriceImpact) / 1e18;
        buyPriceImpactDOWN = Number(marketPriceImpact.downPriceImpact) / 1e18;
        // console.log(`Market: ${market.address} PriceImpactUP: ${marketPriceImpact.upPriceImpact} vs ${buyPriceImpactUP} PriceDOWN: ${buyPriceImpactDOWN} vs ${marketPriceImpact.downPriceImpact} `)

        if (networkId == "10" || networkId == "56") {
          priceUP = Number(marketPrices.upPrice) / Number(1e18);
          priceDOWN = Number(marketPrices.downPrice) / Number(1e18);
        }
        if (networkId == "42161" || networkId == "56") {
          priceUP = Number(marketPrices.upPrice) / Number(1e6);
          priceDOWN = Number(marketPrices.downPrice) / Number(1e6);
        }
        // console.log(`Market: ${market.address} PriceUP: ${marketPrices.upPrice} vs ${priceUP} PriceDOWN: ${priceDOWN} vs ${marketPrices.downPrice} `)
        console.log(
          `checking:  ${priceUP} > ${priceLowerLimit} && ${priceUP} < ${priceUpperLimit} && ${buyPriceImpactUP} < ${skewImpactLimit}`,
        );
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
  }
  console.log(
    `--------------${activeMarkets.length} Markets processed. ${tradingMarkets.length} Eligible -------------------`,
  );
  return tradingMarkets;
};

const inTradingWeek = (maturityDate, closingDate) => {
  const now = Date.now();
  console.log(
    `maturityDate greater than now? ${Number(maturityDate) > Number(now)}. closingDate greater than maturity date? ${Number(maturityDate) < Number(closingDate)}`,
  );
  if (
    Number(maturityDate) > Number(now) &&
    Number(maturityDate) < Number(closingDate)
  ) {
    return true;
  }
  return false;
};

module.exports = { checkTrades };

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

/**
     * Example output:
     * 
     * [
  {
    address: '0xeddebe9023e8b1c62cdc3f0ec302af90ec12b1b6',
    position: 0,
    currencyKey: 'SNX',
    price: 0.7582090230864841
  }
]
     * 
     */
