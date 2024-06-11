require("dotenv").config();
const { etherprovider, viemAccount, wallet } = require("../constants");
const { ethers } = require("ethers");
const { thalesAMMContract } = require("../contracts/ThalesAMM");
const { createPublicClient, http } = require("viem");
const { optimism } = require("viem/chains");
const infuraURL = process.env.INFURA_OP_URL;
const w3utils = require("web3-utils");
const { publicActionsL2 } = require("viem/op-stack");

const OPclient = createPublicClient({
  chain: optimism,
  transport: http(infuraURL),
}).extend(publicActionsL2());

const executeTrade = async (builtOrders, round, networkId, db) => {
  const contract = setVariable(networkId);

  for (const order of builtOrders) {
    // {
    //     market: { address: '0xc1af77a1efea7326df378af9195306f0a3094f51', position: 1, currencyKey: 'LINK', price: 0.8111760272895937 },
    //     amount: quote.amount,
    //     quote: quote.quote,
    //     position: quote.position,
    //   }
    // }

    if (order.amount > 0) {
      try {
        // determine gas price
        let fee =
          (await OPclient.estimateTotalFee({
            account: viemAccount,
          })) / BigInt(1e18);

        // Execute trade
        let tx = await contract.buyFromAMM(
          order.market.address,
          order.position.toString(),
          w3utils.toWei(order.amount, "ether"),
          w3utils.toWei(order.quote, "ether"),
          "2500000000000000",
          {
            gasLimit: "10000000",
          },
        );
        let reciept = await tx.wait(2);
        let transactionHash = reciept.hash;
        let timestamp = new Date().toLocaleString("en-US");
        console.log(`Transaction hash: ${transactionHash}`);
        let tradeLog = {
          network: networkId,
          round: round.toString(),
          currencyKey: order.market.currencyKey,
          market: order.market.address,
          position: order.position > 0 ? "DOWN" : "UP",
          amount: w3utils.toWei(order.amount, "ether"),
          quote: w3utils.toWei(order.quote, "ether"),
          timestamp: timestamp,
          transactionHash: transactionHash,
        };
        // append to db
        const res = await db
          .collection("tradeLog")
          .doc(transactionHash ? transactionHash : order.market.address)
          .set(tradeLog);
        console.log(
          `Trade added to tradelog successfully with hash: ${res.toString()}`,
        );
      } catch (e) {
        let error = e.reason ? e.reason : e.message;
        let timestamp = new Date().toLocaleString("en-US");
        let errorMessage = {
          network: networkId,
          round: round.toString(),
          currencyKey: order.market.currencyKey,
          market: order.market.address,
          position: order.position > 0 ? "DOWN" : "UP",
          amount: order.amount,
          quote: order.quote.toString(),
          error: error,
          timestamp: timestamp,
        };
        console.log(error);
        // append to db
        // const res = await db
        //   .collection("round")
        //   .where("round", "==", round.toString());
        const res = await db.collection("errorLog").add(errorMessage);
        console.log(`error added to db with hash: ${res.id}`);
      }
    }
  }
};

const setVariable = (networkId) => {
  if (+networkId == 10) {
    const contract = new ethers.Contract(
      process.env.THALES_AMM_CONTRACT,
      thalesAMMContract.abi,
      wallet,
    );
    return contract;
  }
};

module.exports = { executeTrade };
