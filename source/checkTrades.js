
const ethers = require("ethers");


const Position = {
    UP: 0,
    DOWN: 1,
    DRAW: 2,
  };

const checkTrades = async (tradeLog, pricesForAllActiveMarkets, priceImpactForAllActiveMarkets, skewImpactLimit, priceUpperLimit, priceLowerLimit) => {
      // Initialize an empty array to store trading markets.
    let tradingMarkets = [];
    // Create a new ethers.Contract object for the Positional Market contract.
  console.log("Price impact: ", priceImpactForAllActiveMarkets)
    

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