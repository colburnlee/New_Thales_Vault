

const executeTrade = async (market, result, round, gasp, contract, networkId) => {

    let network =
    networkId == "42161"
      ? "arbitrum"
      : networkId == "56"
      ? "bsc"
      : networkId == "137"
      ? "polygon"
      : "optimism";

      
}

module.exports = {executeTrade}