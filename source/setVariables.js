const Vault = require("../contracts/Vault.js");
// const Vault = require("../contracts/VaultContract.js");
const { ethers } = require("ethers");
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

  // Log a message indicating that the contract is being read.
  console.log("reading contract: ", process.env.AMM_VAULT_CONTRACT);

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
  console.log(
    `round: ${round}, Round End Time: ${roundEndTime}, Closing Date: ${closingDate}`,
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

  // // Get Gas Price
  // const gasPrice = await etherprovider.getGasPrice();

  // Log the vault information.
  console.log(
    `Vault Information... Round: ${round}, Round End Time: ${roundEndTime}, Closing Date: ${closingDate}, Skew Impact Limit: ${skewImpactLimit} price upper limit: ${priceUpperLimit} price lower limit: ${priceLowerLimit} `,
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
