require("dotenv").config();
const process = require("process");
const { setVariables } = require("./source/setVariables");
const { checkMarkets } = require("./source/checkMarkets");
const { updateRoundInfo } = require("./source/updateRoundInfo");
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

const checkNetwork = async (networkId, positionalContractAddress) => {
  const network = networkId == "10" ? "optimism" : "arbitrum";
  // const positionalContractAddress = process.env.POSITIONAL_MARKET_DATA_CONTRACT;

  console.log(
    `================== START PROCESSING ${network.toUpperCase()} VAULT ==================`,
  );

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
    usdLeft,
  } = await setVariables(network, db);
  // Get trade log from db. Update db with current round info
  const { availableAllocationForRound } = await updateRoundInfo(
    db,
    round,
    roundEndTime,
    closingDate,
    networkId,
  );

  if (usdLeft < minTradeAmount) {
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
    skewImpactLimit,
    round,
    +networkId,
    minTradeAmount,
    availableAllocationForRound,
    db,
  );

  const executedTrades = await executeTrade(builtOrders, round, networkId, db);
  console.log(
    `===================== END PROCESSING ${network.toUpperCase()} VAULT =====================`,
  );
};

// TEMPORARY
const buildNetwork = async (networkId, positionalContractAddress) => {
  const network = networkId == "10" ? "optimism" : "arbitrum";

  console.log(
    `================== START PROCESSING ${network.toUpperCase()} VAULT ==================`,
  );

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
    usdLeft,
  } = await setVariables(network, db);
  // Get trade log from db. Update db with current round info
  const { availableAllocationForRound } = await updateRoundInfo(
    db,
    round,
    roundEndTime,
    closingDate,
    networkId,
  );

  if (usdLeft < minTradeAmount) {
    console.log("No more available funds for this round");
    return;
  }
  // // check network for eligible markets
  const {
    pricesForAllActiveMarkets,
    priceImpactForAllActiveMarkets,
    activeMarkets,
  } = await checkMarkets(wallet, positionalContractAddress, networkId);

  // // check markets for eligible markets
  const eligibleMarkets = await checkTrades(
    pricesForAllActiveMarkets,
    priceImpactForAllActiveMarkets,
    skewImpactLimit,
    activeMarkets,
    networkId,
    Number(priceUpperLimit) / Number(1e18), // Always 18 decimal places
    Number(priceLowerLimit) / Number(1e18), // Always 18 decimal places
    Number(closingDate),
  );

  // // build and submit orders
  // const builtOrders = await buildOrder(
  //   eligibleMarkets,
  //   skewImpactLimit,
  //   round,
  //   +networkId,
  //   minTradeAmount,
  //   availableAllocationForRound,
  //   db,
  // );

  // const executedTrades = await executeTrade(builtOrders, round, networkId, db);
  console.log(
    `===================== END PROCESSING ${network.toUpperCase()} VAULT =====================`,
  );
};

async function doMain() {
  // checkNetwork(
  //   process.env.NETWORK_ID,
  //   process.env.POSITIONAL_MARKET_DATA_CONTRACT,
  // );
  buildNetwork(
    process.env.ARBITRUM_NETWORK_ID,
    process.env.ARBITRUM_POSITIONAL_MARKET_DATA_CONTRACT,
  );
}

doLoop();
