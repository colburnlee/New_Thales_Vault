const { etherprovider } = require("../constants");
const { ethers, wallet } = require("ethers");
const ammVaultContract = require("../contracts/VaultContract");

const executeTrade = async (builtOrders, round, networkId, db) => {
  const gasPrice = (await etherprovider.getFeeData()).gasPrice;
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
        // Execute trade
        let tx = await contract.buyFromAMM(
          order.market.address,
          order.position.toString(),
          (BigInt(order.amount) / BigInt(1e18)).toString(),
          (BigInt(order.quote) / BigInt(1e18)).toString(),
          "2500000000000000",
          {
            gasLimit: "10000000",
            gasPrice: gasPrice.add(gasPrice.div(5)).toString(),
          },
        );
        let reciept = await tx.wait();
        let transactionHash = reciept.transactionHash;
        let timestamp = new Date().toLocaleString("en-US");
        console.log(`Transaction hash: ${transactionHash}`);
        let tradeLog = {
          network: networkId,
          round: round.toString(),
          currencyKey: order.market.currencyKey,
          market: order.market.address,
          position: order.position > 0 ? "DOWN" : "UP",
          amount: order.amount,
          quote: order.quote.toString(),
          timestamp: timestamp,
          transactionHash: transactionHash,
        };
        // append to db
        const res = await db.collection("trades").add(tradeLog);
        console.log(`Trade added to db with id: ${res.id}`);
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
        const res = await db
          .collection("round")
          .where("round", "==", round.toString());
        console.log(`Trade added to db with id: ${res.id}`);
      }
    }
  }
};

const setVariable = (networkId) => {
  if (+networkId == 10) {
    const contract = new ethers.Contract(
      process.env.AMM_VAULT_CONTRACT,
      ammVaultContract.abi,
      wallet,
    );
    return contract;
  }
};

module.exports = { executeTrade };
