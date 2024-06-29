require("dotenv").config();
const {
  positionalMarketDataContractAbi,
} = require("../contracts/PositionalMarketData");
const {
  positionalMarketDataContractArb,
} = require("../contracts/ArbitrumPositionalMarketData");
const thalesData = require("thales-data");
const ethers = require("ethers");

const checkMarkets = async (wallet, positionalContractAddress, networkId) => {
  console.log(
    "===================== FINDING ACTIVE MARKETS =====================",
  );
  let minMaturityValue = parseInt(new Date().getTime() / 1000);
  let activeMarkets = await thalesData.binaryOptions.markets({
    max: Infinity,
    network: +networkId,
    minMaturity: minMaturityValue,
  });

  const positionalAbi =
    networkId == "10"
      ? positionalMarketDataContractAbi.abi
      : positionalMarketDataContractArb.abi;

  const positionalMarketDataContract = new ethers.Contract(
    positionalContractAddress, // Address of the Positional Market contract.
    positionalAbi, // ABI of the Positional Market contract.
    wallet, // Wallet object to use for transactions.
  );

  // Initialize two empty arrays to store prices and price impacts for all active markets.
  let [pricesForAllActiveMarkets, priceImpactForAllActiveMarkets] = [];

  // Use Promise.all to concurrently fetch the base prices and price impacts for all active markets.
  if (networkId == "10") {
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
  }
  if (networkId == "42161") {
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
  }
  console.log(
    `===================== FOUND ${activeMarkets.length} MARKETS =====================. `,
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
