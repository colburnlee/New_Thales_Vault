require("dotenv").config();
const process = require("process");
const {setVariables} = require('./source/setVariables')
const { checkMarkets } = require('./source/checkMarkets')
const { updateRoundInfo } = require('./source/updateRoundInfo')
const { positionalMarketDataContract } = require('./contracts/PositionalMarketData')
const { checkTrades } = require('./source/checkTrades')





async function doLoop() {
    while (true) {
      try {
        await doMain();
        await delay(1000 * 60 * +process.env.DELAY_IN_MINUTES);
      } catch (e) {
        console.log(e);
      }
    }
  }
  
  // async function doMain(auth) {
  //   console.log(
  //     "==================== START PROCESSING OP VAULT ===================="
  //   );
  //   await personalVault.processVault("10");
    // console.log(
    //   "++++++++++++++++++++ END PROCESSING OP VAULT ++++++++++++++++++++"
    // );
    // console.log(
    //   "==================== START PROCESSING ARBITRUM VAULT ===================="
    // );
    // await personalVault.processVault(auth, "42161");
    // console.log(
    //   "++++++++++++++++++++ END PROCESSING ARBITRUM VAULT ++++++++++++++++++++"
    // );
    // console.log(
    //   "==================== START PROCESSING POLYGON VAULT ===================="
    // );
    // await personalVault.processVault(auth, "137");
    // console.log(
    //   "++++++++++++++++++++ END PROCESSING POLYGON VAULT ++++++++++++++++++++"
    // );
    // console.log(
    //   "==================== START PROCESSING BSC VAULT ===================="
    // );
    // await personalVault.processVault(auth, "56");
    // console.log(
    //   "++++++++++++++++++++ END PROCESSING BSC VAULT ++++++++++++++++++++"
    // );
  // }
  
  // doLoop();
  
  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  async function doMain() {
    console.log(
      "==================== START PROCESSING OP VAULT ===================="
    );
    const networkId = '10'
    const positionalContractAddress = process.env.POSITIONAL_MARKET_DATA_CONTRACT
    
    // Set variables - current round info, set network information
    const { wallet, round, roundEndTime, closingDate, skewImpactLimit, db, priceUpperLimit, priceLowerLimit } = await setVariables("optimism")
    // Get trade log from db. Update db with current round info
    const tradeLog = await updateRoundInfo(db, round, roundEndTime, closingDate)
    // check db to return funds available to trade and contract addresses of vaults interacted with within same round
    // check network for eligible markets
    const {pricesForAllActiveMarkets, priceImpactForAllActiveMarkets} = await checkMarkets(wallet, positionalContractAddress, networkId)    
    // check markets for eligible trades
    const eligibleTrades = await checkTrades(tradeLog, pricesForAllActiveMarkets, priceImpactForAllActiveMarkets, skewImpactLimit, priceUpperLimit, priceLowerLimit)
    // execute trades
    
    console.log(
      "++++++++++++++++++++ END PROCESSING OP VAULT ++++++++++++++++++++"
    );

  }

doMain()