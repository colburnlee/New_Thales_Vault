require("dotenv").config();
const { positionalMarketDataContract: abi }  = require("../contracts/PositionalMarketData")
const { PositionalMarketManagerContractAbi } = require("../contracts/PositionalMarketManager")
const ethers = require("ethers");


const checkMarkets = async (wallet, positionalContractAddress, networkId) => {
  // Get the number of active markets from the Positonal Market Manager Contract
  const PositionalMarketManagerContract = new ethers.Contract(
    process.env.POSITIONAL_MARKET_MANAGER,
    PositionalMarketManagerContractAbi.abi,
    wallet
  )
  const activeMarkets = Number(await PositionalMarketManagerContract.numActiveMarkets())
  console.log("Active Markets: ", activeMarkets)

  const positionalMarketDataContract = new ethers.Contract(
  positionalContractAddress, // Address of the Positional Market contract.
  abi.abi, // ABI of the Positional Market contract.
  wallet // Wallet object to use for transactions.
  );
  
  // Initialize two empty arrays to store prices and price impacts for all active markets.
  let [pricesForAllActiveMarkets, priceImpactForAllActiveMarkets] = [];

    
  // Use Promise.all to concurrently fetch the base prices and price impacts for all active markets.
  [pricesForAllActiveMarkets, priceImpactForAllActiveMarkets] = await Promise.all([
  positionalMarketDataContract.getBatchBasePricesForAllActiveMarkets(0,activeMarkets), // Get base prices for all active markets.
  positionalMarketDataContract.getBatchPriceImpactForAllActiveMarkets(0,activeMarkets), // Get price impacts for all active markets.
  ]);
  // eslint-disable-next-line no-constant-condition
  console.log(`Found ${activeMarkets} markets on ${networkId="10"?"optimism":"network"}. `)

  return {pricesForAllActiveMarkets, priceImpactForAllActiveMarkets}
}



module.exports = {
    checkMarkets
}