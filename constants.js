const { ethers, JsonRpcProvider, getGasPrice } = require("ethers");
require("dotenv").config();
const privateKey = process.env.PRIVATE_KEY;

// const serviceAccount = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MEASUREMENT_ID
// };
// console.log(serviceAccount)

// let etherprovider = new AlchemyProvider(
//   process.env.NETWORK,
//   process.env.ALCHEMY
// );

// let etherprovider = new JsonRpcProvider(
//   "https://rpc.ankr.com/optimism"
// );

let etherprovider = new JsonRpcProvider("https://1rpc.io/op"); //https://endpoints.omniatech.io/v1/op/mainnet/public

// let etherprovider = new JsonRpcProvider(process.env.OMNIA_URL);
// let etherprovider = new JsonRpcProvider(
//   "https://optimism-rpc.publicnode.com"
// );

let arbitrumProvider = new JsonRpcProvider(process.env.ARBITRUM_OMNIA_URL);

// let arbitrumProvider = new JsonRpcProvider(
//   process.env.ARBITRUM_1RPC_URL
// );

let bscProvider = new JsonRpcProvider(process.env.BSC_1RPC_URL);

let polygonProvider = new JsonRpcProvider(process.env.POLYGON_LLAMANODE_URL);

let baseUrl = process.env.BASE_URL;

let wallet = new ethers.Wallet(privateKey, etherprovider);

module.exports = {
  privateKey,
  etherprovider,
  baseUrl,
  arbitrumProvider,
  bscProvider,
  polygonProvider,
  wallet,
};
