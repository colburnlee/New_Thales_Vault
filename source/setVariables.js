const Vault = require("../contracts/Vault.js");
// const Vault = require("../contracts/VaultContract.js");
const { ethers } = require("ethers");
require("dotenv").config();
const { wallet, arbWallet } = require("../constants.js");
const { erc20Contract } = require("../contracts/erc20");
const { thalesAMMContract } = require("../contracts/ThalesAMM");

/**
 * This function initializes the Firebase Admin SDK and retrieves relevant data from the blockchain and Firestore.
 *
 * @param {string} network The name of the network to retrieve data for.
 * @returns {Promise<{round: number, roundEndTime: string, closingDate: number, skewImpactLimit: string, db: Firestore}>} An object containing the retrieved data.
 */
const setVariables = async (network, db) => {
  // const decimals = network == "optimism" ? 18 : 6;
  const decimals = 18;

  const networkWallet = network == "optimism" ? wallet : arbWallet;

  // Create a new ethers.Contract object for interacting with the AMM Vault contract.
  // Note: Always use the OP-Main network. This is for internal tracking purposes
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
  const {
    timeLeftInDays,
    timeLeftInHours,
    timeLeftInMinutes,
    timeLeftInSeconds,
  } = getTimeLeft(timeLeft);

  console.log(
    `============================ ROUND ${round} ============================= `,
  );
  console.log(
    `============ TIME REMAINING - DAYS:${timeLeftInDays} HR:${timeLeftInHours} MIN:${timeLeftInMinutes} SEC:${timeLeftInSeconds} ===========`,
  );

  // Query the 'network' collection for the network with the specified name.
  const networkRef = db.collection("network").where("name", "==", network);
  const networkData = await networkRef.get();
  // Check if the network reference is empty.
  if (networkData.empty) {
    console.log("Ref empty!");
  }

  // Set the skew impact limit to networkData reference
  const skewImpactLimit = networkData.docs[0].data().skewImpactLimit;
  const priceUpperLimit = networkData.docs[0].data().priceUpperLimit;
  const priceLowerLimit = networkData.docs[0].data().priceLowerLimit;
  const minTradeAmount = networkData.docs[0].data().minTradeAmount;
  // const tradingAllocation = networkData.docs[0].data().tradingAllocation;

  // // get ethers wallet for optimism
  // const susd = new ethers.Contract(
  //   process.env.OP_SUSD_CONTRACT,
  //   erc20Contract.abi,
  //   wallet,
  // );

  // get ethers wallet for optimism
  const usdLeft = await getUsdLeft(wallet, network);
  console.log(
    `================ USD LEFT: $${Number(ethers.formatUnits(usdLeft, decimals)).toFixed(2)} ================`,
  );

  console.log(
    `============ PRICE RANGE: $${ethers.formatUnits(priceLowerLimit, "ether")} - ${ethers.formatUnits(priceUpperLimit, "ether")}  SKEW LIMIT: ${skewImpactLimit} ==============`,
  );
  return {
    wallet: networkWallet,
    round,
    roundEndTime,
    closingDate,
    skewImpactLimit,
    priceUpperLimit,
    priceLowerLimit,
    minTradeAmount,
    usdLeft,
  };
};

const getTimeLeft = (timeLeft) => {
  // format timeleft into days hours minutes seconds
  const timeLeftInDays = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const timeLeftInHours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const timeLeftInMinutes = Math.floor(
    (timeLeft % (1000 * 60 * 60)) / (1000 * 60),
  );
  const timeLeftInSeconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  return {
    timeLeftInDays,
    timeLeftInHours,
    timeLeftInMinutes,
    timeLeftInSeconds,
  };
};

// const setVariable = (networkId) => {
//   if (+networkId == 10) {
//     const contract = new ethers.Contract(
//       process.env.THALES_AMM_CONTRACT,
//       thalesAMMContract.abi,
//       wallet,
//     );
//     return contract;
//   }
//   if (+networkId == 42161) {
//     const contract = new ethers.Contract(
//       process.env.ARBITRUM_THALES_AMM_CONTRACT,
//       thalesAMMContract.abi,
//       arbWallet,
//     );
//     return contract;
//   }
// };

const getUsdLeft = async (wallet, network) => {
  const susd = new ethers.Contract(
    network == "optimism"
      ? process.env.OP_SUSD_CONTRACT
      : process.env.ARBITRUM_USDC_CONTRACT,
    erc20Contract.abi,
    network == "optimism" ? wallet : arbWallet,
  );
  let usdLeft = await susd.balanceOf(wallet.address);
  if (network == "arbitrum") {
    usdLeft = ethers.parseUnits(usdLeft.toString(), 12);
  }
  return usdLeft;
};

module.exports = { setVariables };
