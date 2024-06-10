const { formatUnits } = require("ethers");

const updateRoundInfo = async (
  db,
  round,
  roundEndTime,
  closingDate,
  networkId,
) => {
  const roundInfoRef = await db.collection("round").doc(round.toString()).get();
  const tradeLogRef = await db
    .collection("tradeLog")
    .where("round", "==", round.toString())
    .get();
  const errorLogRef = await db
    .collection("errorLog")
    .where("round", "==", round.toString())
    .get();
  const tradeLog = tradeLogRef.docs.map((doc) => doc.data());
  const errorLog = errorLogRef.docs.map((doc) => doc.data());
  // if roundInfoRef is not found, create new document
  if (!roundInfoRef.exists) {
    await createNewEntry(db, round, roundEndTime, closingDate, networkId);
  }
  const roundInfo = roundInfoRef.data();
  const availableAllocationForMarket = roundInfo.availableAllocationForMarket;
  const availableAllocationForRound = roundInfo.availableAllocationForRound;
  const totalTraded = roundInfo.totalTradedOP;

  // review tradelog to find amount traded and updates in db if needed
  await updateTotalTraded(tradeLog, networkId, BigInt(totalTraded), round, db);

  console.log(
    `========== TRADED IN ROUND ${round}: $${formatUnits(totalTraded, "ether")} ALLOCATION: $${formatUnits(
      availableAllocationForRound,
      "ether",
    )} ==========`,
  );
  return {
    availableAllocationForMarket,
    availableAllocationForRound,
    tradeLog,
    errorLog,
    totalTraded,
  };
};

/**
 * Creates a new entry in the database for a given round.
 *
 * @param {Object} db - The database object.
 * @param {number} round - The round number.
 * @param {Date} roundEndTime - The end time of the round.
 * @param {Date} closingDate - The closing date of the round.
 */
const createNewEntry = async (
  db,
  round,
  roundEndTime,
  closingDate,
  networkId,
) => {
  console.log(`creating a new database entry for round ${round}`);
  // Prepare the data to be stored in the database
  const networkAllocationRef = db
    .collection("network")
    .where("name", "==", networkId);
  const networkAllocation =
    networkAllocationRef.docs[0].data().tradingAllocation;
  if (networkAllocation === undefined) {
    let error = "Network allocation not found";
    let timestamp = new Date().toLocaleString("en-US");
    let errorMessage = {
      network: networkId,
      round: round.toString(),
      currencyKey: "",
      market: "",
      position: "",
      amount: "",
      quote: "",
      error: error,
      timestamp: timestamp,
    };
    console.log(error);
    console.log(`error added to db with id: ${res.id}`);
    const res = await db.collection("errorLog").add(errorMessage);
    throw new Error("Network allocation not found");
  }
  const data = {
    roundEndTime: roundEndTime.toString(), // Convert to string for database storage
    closingDate: closingDate.toString(), // Convert to string for database storage
    round: round.toString(), // Convert to string for database storage
    availableAllocationForMarket: {}, // Initialize an empty object for market allocations
    availableAllocationForRound: networkAllocation, // $100 initial allocation for the round
  };
  // Get a reference to the document for this round in the "round" collection
  const ref = db.collection("round").doc(round.toString());
  // Define a function to set the data in the database
  const setData = async (data) => await ref.set(data);
  // Set the data in the database
  await setData(data);
};

const updateTotalTraded = async (
  tradeLog,
  networkId,
  totalTraded,
  round,
  db,
) => {
  let total = BigInt(0);
  for (const key in tradeLog) {
    if (tradeLog[key].network == networkId) {
      total += BigInt(tradeLog[key].quote);
    }
  }
  console.log(
    `comparing total traded: ${total} to totalTraded: ${totalTraded}`,
  );
  if (total != totalTraded) {
    const res = await db.collection("round").doc(round.toString()).update({totalTradedOP: total.toString()});
    console.log(
      `++++++++++ Total traded updated to: $${formatUnits(totalTraded)} ++++++++++`,
    );
  }
};

module.exports = {
  updateRoundInfo,
};
