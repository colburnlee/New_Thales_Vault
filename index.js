require("dotenv").config();
const process = require("process");
const {setVariables} = require('./source/setVariables')
const { checkMarkets } = require('./source/checkMarkets')
const { updateRoundInfo } = require('./source/updateRoundInfo')



async function doLoop() {
    while (true) {
      try {
        await doMain(auth);
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
    // Set variables - current round info, set network information
    const { wallet, round, roundEndTime, closingDate, skewImpactLimit, db, priceUpperLimit, priceLowerLimit } = await setVariables("optimism")
    // Get trade log from db. Update db with current round info
    const tradeLog = await updateRoundInfo(db, round, roundEndTime, closingDate)
    // TODO: const trades = await checkHistory(db, round)
    // check db to return funds available to trade and contract addresses of vaults interacted with within same round
    // check markets on network for eligible trades
    // const openTrades = await checkMarkets(wallet, round, roundEndTime, closingDate, skewImpactLimit, priceUpperLimit, priceLowerLimit)
    // execute trades
    
    console.log(
      "++++++++++++++++++++ END PROCESSING OP VAULT ++++++++++++++++++++"
    );

  }

doMain()