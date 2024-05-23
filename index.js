require("dotenv").config();
const process = require("process");
const { initializeApp } = require('firebase-admin/app');
const serviceAccount = require('./constants');
const { getFirestore } = require('firebase-admin/firestore');
const setVariables = require('./source/setVariables')


initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

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
  
  doLoop();
  
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
     await setVariables(db)
    // Set history of trades within same round
    // check wallet to return funds available to trade and contract addresses of vaults interacted with within same round
    // check vaults on network to 
    // 
    
    console.log(
      "++++++++++++++++++++ END PROCESSING OP VAULT ++++++++++++++++++++"
    );

  }