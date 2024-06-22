/**
 * Evaluates the current trading markets for the thales AMM given certain criteria
 *
 * @param {Array<Object>} pricesForAllActiveMarkets - An array of objects containing market prices.
 * @param {Array<Object>} priceImpactForAllActiveMarkets - An array of objects containing price impact data.
 * @param {number} skewImpactLimit - The maximum allowed skew impact.
 * @param {Array<Object>} activeMarkets - An array of active market objects.
 * @param {string} networkId - The ID of the network.
 * @param {number} priceUpperLimit - The upper price limit for trading.
 * @param {number} priceLowerLimit - The lower price limit for trading.
 * @param {number} closingDate - The closing date for trading.
 * @returns {Array<Object>} - An array of eligible trading markets.
 */
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
  console.log("===================== PROCESSING MARKETS =====================");
  // Initialize an empty array to store trading markets.
  let tradingMarkets = [];
  for (const market of activeMarkets) {
    const marketPrices = pricesForAllActiveMarkets.find(
      (prices) => prices.market.toLowerCase() === market.address,
    );
    const marketPriceImpact = priceImpactForAllActiveMarkets.find(
      (priceImpact) => priceImpact.market.toLowerCase() === market.address,
    );

    if (
      inTradingWeek(+market.maturityDate, +closingDate) &&
      marketPrices &&
      marketPriceImpact
    ) {
      try {
        let priceUP, priceDOWN, buyPriceImpactUP, buyPriceImpactDOWN;
        buyPriceImpactUP = Number(marketPriceImpact.upPriceImpact) / 1e18;
        buyPriceImpactDOWN = Number(marketPriceImpact.downPriceImpact) / 1e18;

        if (networkId == "10" || networkId == "56") {
          priceUP = Number(marketPrices.upPrice) / Number(1e18);
          priceDOWN = Number(marketPrices.downPrice) / Number(1e18);
        }
        if (networkId == "42161" || networkId == "56") {
          priceUP = Number(marketPrices.upPrice) / Number(1e6);
          priceDOWN = Number(marketPrices.downPrice) / Number(1e6);
        }

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
    `============ MARKETS PROCESSED: ${activeMarkets.length} ELIGIBLE: ${tradingMarkets.length} ==================`,
  );
  return tradingMarkets;
};

/**
 * Checks if the given maturity date is within the current trading week.
 *
 * @param {number} maturityDate - The timestamp of the maturity date.
 * @param {number} closingDate - The timestamp of the closing date of the trading week.
 * @returns {boolean} True if the maturity date is within the current trading week, false otherwise.
 */
const inTradingWeek = (maturityDate, closingDate) => {
  const now = Date.now(); // Get the current timestamp.
  const weekFromNow = now + 604800000; // Add 7 days to the current timestamp.

  // Check if the maturity date is after the current time and before the closing date.
  if (
    Number(maturityDate) > Number(now) &&
    Number(maturityDate) < Number(weekFromNow)
  ) {
    return true; // Maturity date is within the trading week.
  }
  return false; // Maturity date is not within the trading week.
};

const Position = {
  UP: 0,
  DOWN: 1,
  DRAW: 2,
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
