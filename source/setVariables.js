const constants = require("../constants.js");
const Vault = require("../Vault.json");
const { ethers } = require("ethers");
require("dotenv").config();
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

const setVariables = async() => {
    const contract = new ethers.Contract(
        process.env.AMM_VAULT_CONTRACT,
        Vault.vaultContract.abi,
        wallet
      );
    const round = await contract.round();
    const roundEndTime = (await contract.getCurrentRoundEnd()).toString();
  const closingDate = new Date(roundEndTime * 1000.0).getTime();
  console.log(
    `Vault Information... Round: ${round}, Round End Time: ${roundEndTime}, Closing Date: ${closingDate} Price Upper Limit: ${priceUpperLimit}, Price Lower Limit: ${priceLowerLimit}, Skew Impact Limit: ${skewImpactLimit}  `
  );
    
}

module.exports = setVariables;