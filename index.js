require("dotenv").config();
const process = require("process");
const { setVariables } = require("./source/setVariables");
const { checkMarkets } = require("./source/checkMarkets");
const { updateRoundInfo } = require("./source/updateRoundInfo");
const {
  positionalMarketDataContract,
} = require("./contracts/PositionalMarketData");
const { checkTrades } = require("./source/checkTrades");
const { buildOrder } = require("./source/buildOrder");
const { executeTrade } = require("./source/executeTrade");
const { initializeApp } = require("firebase-admin/app");
const serviceAccount = require("./firebase.json");
const { getFirestore } = require("firebase-admin/firestore");
var admin = require("firebase-admin");

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

// Initialize the Firebase Admin SDK with the service account credentials.
initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Get a reference to the Firestore database.
const db = getFirestore();

async function doMain() {
  console.log(
    "==================== START PROCESSING OP VAULT ====================",
  );
  const networkId = "10";
  const positionalContractAddress = process.env.POSITIONAL_MARKET_DATA_CONTRACT;

  // Set variables - current round info, set network information
  const {
    wallet,
    round,
    roundEndTime,
    closingDate,
    skewImpactLimit,
    priceUpperLimit,
    priceLowerLimit,
    minTradeAmount,
  } = await setVariables("optimism", db);
  // Get trade log from db. Update db with current round info
  const {
    availableAllocationForMarket,
    availableAllocationForRound,
    tradeLog,
    totalTraded,
  } = await updateRoundInfo(db, round, roundEndTime, closingDate, networkId);

  if (BigInt(totalTraded) >= BigInt(availableAllocationForRound)) {
    console.log("No more available funds for this round");
    return;
  }
  // check network for eligible markets
  const {
    pricesForAllActiveMarkets,
    priceImpactForAllActiveMarkets,
    activeMarkets,
  } = await checkMarkets(wallet, positionalContractAddress, networkId);

  // check markets for eligible markets
  const eligibleMarkets = await checkTrades(
    pricesForAllActiveMarkets,
    priceImpactForAllActiveMarkets,
    skewImpactLimit,
    activeMarkets,
    networkId,
    Number(priceUpperLimit) / Number(1e18),
    Number(priceLowerLimit) / Number(1e18),
    Number(closingDate),
  );

  // build and submit orders
  const builtOrders = await buildOrder(
    eligibleMarkets,
    tradeLog,
    skewImpactLimit,
    round,
    +networkId,
    minTradeAmount,
    availableAllocationForRound,
    availableAllocationForMarket,
  );

  const executedTrades = await executeTrade(
    builtOrders,
    round,
    networkId,
    db,
    tradeLog,
  );
  console.log(
    "===================== END PROCESSING OP VAULT =====================",
  );
}

doLoop();
