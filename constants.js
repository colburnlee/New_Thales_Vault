const ethers = require("ethers");
require("dotenv").config();
const privateKey = process.env.PRIVATE_KEY;
// Import the Firebase SDK for JavaScript



const serviceAccount = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEARUREMENT_ID
};


// let etherprovider = new ethers.providers.AlchemyProvider(
//   process.env.NETWORK,
//   process.env.ALCHEMY
// );

// let etherprovider = new ethers.providers.JsonRpcProvider(
//   "https://rpc.ankr.com/optimism"
// );

// let etherprovider = new ethers.providers.JsonRpcProvider("https://1rpc.io/op"); //https://endpoints.omniatech.io/v1/op/mainnet/public

let etherprovider = new ethers.providers.JsonRpcProvider(process.env.OMNIA_URL);
let arbitrumProvider = new ethers.providers.JsonRpcProvider(
  process.env.ARBITRUM_OMNIA_URL
);

// let arbitrumProvider = new ethers.providers.JsonRpcProvider(
//   process.env.ARBITRUM_1RPC_URL
// );

let bscProvider = new ethers.providers.JsonRpcProvider(
  process.env.BSC_1RPC_URL
);

let polygonProvider = new ethers.providers.JsonRpcProvider(
  process.env.POLYGON_LLAMANODE_URL
);

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
  serviceAccount
};