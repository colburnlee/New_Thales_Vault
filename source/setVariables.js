const Vault = require("../contracts/Vault.js");
// const Vault = require("../contracts/VaultContract.js");
const { ethers, formatUnits } = require("ethers");
require("dotenv").config();
const { wallet, etherprovider, gasPrice } = require("../constants.js");
const { initializeApp } = require("firebase-admin/app");
const serviceAccount = require("../firebase.json");
const { getFirestore } = require("firebase-admin/firestore");
var admin = require("firebase-admin");

/**
 * This function initializes the Firebase Admin SDK and retrieves relevant data from the blockchain and Firestore.
 *
 * @param {string} network The name of the network to retrieve data for.
 * @returns {Promise<{round: number, roundEndTime: string, closingDate: number, skewImpactLimit: string, db: Firestore}>} An object containing the retrieved data.
 */
const setVariables = async (network) => {
  // Initialize the Firebase Admin SDK with the service account credentials.
  initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  // Create a new ethers.Contract object for interacting with the AMM Vault contract.
  const contract = new ethers.Contract(
    process.env.AMM_VAULT_CONTRACT,
    Vault.abi,
    wallet,
  );

  // Get the current round number from the contract.
  const round = await contract.round();

  // Get the end time of the current round from the contract.
  const roundEndTime = (await contract.getCurrentRoundEnd()).toString();

  // Convert the round end time to a JavaScript Date object and then get the timestamp.
  const closingDate = new Date(roundEndTime * 1000.0).getTime();

  // Find the amount of time left in the round by subtracting closingDate from now()
  const timeLeft = closingDate - Date.now();
  // format timeleft into days hours minutes seconds
  const timeLeftInDays = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const timeLeftInHours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const timeLeftInMinutes = Math.floor(
    (timeLeft % (1000 * 60 * 60)) / (1000 * 60),
  );
  const timeLeftInSeconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  console.log(
    `============================ ROUND ${round} ============================= `,
  );
  console.log(
    `============ TIME REMAINING - DAYS:${timeLeftInDays} HR:${timeLeftInHours} MIN:${timeLeftInMinutes} SEC:${timeLeftInSeconds} ===========`,
  );

  // Get a reference to the Firestore database.
  const db = getFirestore();

  // Query the 'network' collection for the network with the specified name.
  const networkRef = db.collection("network").where("name", "==", network);
  const networkData = await networkRef.get();
  // Check if the network reference is empty.
  if (networkData.empty) {
    console.log("Ref empty!");
  }

  // const tradeLogRef = db.collection(round.toString()).doc("tradeLog");
  // const errorLogRef = db.collection(round.toString()).doc("errorLog");

  // Set the skew impact limit to networkData reference
  const skewImpactLimit = networkData.docs[0].data().skewImpactLimit;
  const priceUpperLimit = networkData.docs[0].data().priceUpperLimit;
  const priceLowerLimit = networkData.docs[0].data().priceLowerLimit;
  const minTradeAmount = networkData.docs[0].data().minTradeAmount;
  const tradingAllocation = networkData.docs[0].data().tradingAllocation;

  // // Get Gas Price
  // const gasPrice = await etherprovider.getGasPrice();

  // Log the vault information.
  console.log(
    `PRICE RANGE: $${ethers.formatUnits(priceLowerLimit, "ether")} - ${ethers.formatUnits(priceUpperLimit, "ether")}  SKEW LIMIT: ${skewImpactLimit}  TRADING ALLOCATION: $${ethers.formatUnits(tradingAllocation, "ether")}`,
  );

  return {
    wallet,
    round,
    roundEndTime,
    closingDate,
    skewImpactLimit,
    db,
    priceUpperLimit,
    priceLowerLimit,
    minTradeAmount,
    // tradeLogRef,
    // errorLogRef
  };
};

module.exports = { setVariables };
