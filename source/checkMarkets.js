require("dotenv").config();
const thalesData = require("thales-data");

const checkMarkets = async (networkId) => {
  const minMaturityValue = parseInt(new Date().getTime() / 1000);
  const positionalMarkets = await thalesData.binaryOptions.markets({
    max: Infinity,
    network: +networkId,
    minMaturity: minMaturityValue,
  });
  console.log(`Found ${positionalMarkets.length} markets on ${networkId}. `)
}

module.exports = {
    checkMarkets
}