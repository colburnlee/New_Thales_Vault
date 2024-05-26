
const ethers = require("ethers");


const Position = {
    UP: 0,
    DOWN: 1,
    DRAW: 2,
  };

const checkTrades = async (priceLowerLimit,
    priceUpperLimit,
    roundEndTime,
    skewImpactLimit,
    wallet,
    positionalContractAddress,
    abi,
    networkId, 
    availableMarkets) => {
        let tradingMarkets = [];


        const positionalMarketDataContract = new ethers.Contract(
            positionalContractAddress,
            abi.abi,
            wallet
          );

}

module.exports={checkTrades}