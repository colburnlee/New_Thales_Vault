const { formatUnits } = require("ethers");

const updateRoundInfo = async (
  db,
  round,
  roundEndTime,
  closingDate,
  networkId,
) => {
  let roundInfoRef = await db.collection("round").doc(round.toString()).get();
  // if roundInfoRef is not found, create new document
  let roundInfo;
  if (!roundInfoRef.exists) {
    roundInfo = await createNewEntry(
      db,
      round,
      roundEndTime,
      closingDate,
      networkId,
    );
    roundInfoRef = await db.collection("round").doc(round.toString()).get();
  }
  roundInfo = roundInfoRef.data();

  const availableAllocationForRound = roundInfo.availableAllocationForRound;
  // let totalTraded = roundInfo.totalTradedOP;

  console.log(
    `========== TRADED IN ROUND ${round}: ALLOCATION: $${formatUnits(
      availableAllocationForRound,
      "ether",
    )} ==========`,
  );
  return {
    availableAllocationForRound,
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
  const networkRef = db.collection("network").doc(networkId.toString());
  const networkData = await networkRef.get();
  const networkAllocation = networkData.data().tradingAllocation;
  if (networkAllocation === undefined) {
    let error = "Network allocation not found";
    let timestamp = new Date().toLocaleString("en-US");
    let errorMessage = {
      network: networkId,
      round: round.toString(),
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
    availableAllocationForRound: networkAllocation, // initial allocation for the round
    totalTradedOP: "0",
  };
  // Get a reference to the document for this round in the "round" collection
  const ref = db.collection("round").doc(round.toString());
  // Define a function to set the data in the database
  const setData = async (data) => await ref.set(data);
  // Set the data in the database
  await setData(data);
};

module.exports = {
  updateRoundInfo,
};
