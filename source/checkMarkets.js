require("dotenv").config();
const {
  positionalMarketDataContract: abi,
} = require("../contracts/PositionalMarketData");
const {
  PositionalMarketManagerContractAbi,
} = require("../contracts/PositionalMarketManager");
const thalesData = require("thales-data");
const ethers = require("ethers");

const checkMarkets = async (wallet, positionalContractAddress, networkId) => {
  // Get the number of active markets from the Positonal Market Manager Contract
  const PositionalMarketManagerContract = new ethers.Contract(
    process.env.POSITIONAL_MARKET_MANAGER,
    PositionalMarketManagerContractAbi.abi,
    wallet,
  );

  // const activeMarkets = Number(await PositionalMarketManagerContract.numActiveMarkets())
  let minMaturityValue = parseInt(new Date().getTime() / 1000);
  let activeMarkets = await thalesData.binaryOptions.markets({
    max: Infinity,
    network: +networkId,
    minMaturity: minMaturityValue,
  });
  // console.log("Active Markets: ", activeMarkets)

  const positionalMarketDataContract = new ethers.Contract(
    positionalContractAddress, // Address of the Positional Market contract.
    abi.abi, // ABI of the Positional Market contract.
    wallet, // Wallet object to use for transactions.
  );

  // Initialize two empty arrays to store prices and price impacts for all active markets.
  let [pricesForAllActiveMarkets, priceImpactForAllActiveMarkets] = [];

  // Use Promise.all to concurrently fetch the base prices and price impacts for all active markets.
  [pricesForAllActiveMarkets, priceImpactForAllActiveMarkets] =
    await Promise.all([
      positionalMarketDataContract.getBatchBasePricesForAllActiveMarkets(
        0,
        activeMarkets.length,
      ), // Get base prices for all active markets.
      positionalMarketDataContract.getBatchPriceImpactForAllActiveMarkets(
        0,
        activeMarkets.length,
      ), // Get price impacts for all active markets.
    ]);
  // eslint-disable-next-line no-constant-condition
  console.log(
    `Found ${activeMarkets.length} markets on ${(networkId = "10" ? "optimism" : "network")}. `,
  );

  return {
    pricesForAllActiveMarkets,
    priceImpactForAllActiveMarkets,
    activeMarkets,
  };
};

module.exports = {
  checkMarkets,
};
