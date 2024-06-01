const { etherprovider } = require("../constants");
const { ethers, wallet } = require("ethers");
const ammVaultContract = require("../contracts/VaultContract");

const executeTrade = async (builtOrders, round, networkId) => {
  const gasPrice = (await etherprovider.getFeeData()).gasPrice;
  const contract = setVariable(networkId);

  for (const order of builtOrders) {
    // {
    //     market: market.address,
    //     amount: quote.amount,
    //     quote: quote.quote,
    //     position: quote.position,
    //   }
    // }

    if (order.amount > 0) {
      // Execute trade
      let tx = await contract.buyFromAMM(
        market.address,
        result.position.toString(),
        (BigInt(order.amount) / BigInt(1e18)).toString(),
        (BigInt(order.amount) / BigInt(1e18)).toString(),
        "2500000000000000",
        {
          gasLimit: "10000000",
          gasPrice: gasPrice.add(gasPrice.div(5)).toString(),
        },
      );
      let reciept = await tx.wait();
      let transactionHash = reciept.transactionHash;
      console.log(`Transaction hash: ${transactionHash}`);
    } else {
      console.log(
        `No trade made for ${market.currencyKey} ${
          market.position > 0 ? "DOWN" : "UP"
        } at ${market.address}`,
      );
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
