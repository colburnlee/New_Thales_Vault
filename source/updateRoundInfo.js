const updateRoundInfo = async (db, round, roundEndTime, closingDate) => {
  console.log(
    `updateRoundInfo: ${round} roundEndTime: ${roundEndTime} closingDate: ${closingDate}`,
  );
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
  console.log(`tradeLog length: ${tradeLog.length}`);
  console.log(`errorLog length: ${errorLog.length}`);
  // if roundInfoRef is not found, create new document
  if (!roundInfoRef.exists) {
    await createNewEntry(db, round, roundEndTime, closingDate);
  }
  const roundInfo = roundInfoRef.data();
  const availableAllocationForMarket = roundInfo.availableAllocationForMarket;
  const availableAllocationForRound = roundInfo.availableAllocationForRound;
  return {
    availableAllocationForMarket,
    availableAllocationForRound,
    tradeLog,
    errorLog,
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
const createNewEntry = async (db, round, roundEndTime, closingDate) => {
  console.log(`creating a new database entry for round ${round}`);
  // Prepare the data to be stored in the database
  const data = {
    roundEndTime: roundEndTime.toString(), // Convert to string for database storage
    closingDate: closingDate.toString(), // Convert to string for database storage
    round: round.toString(), // Convert to string for database storage
    availableAllocationForMarket: {}, // Initialize an empty object for market allocations
    availableAllocationForRound: "50000000000000000000", // $50 initial allocation for the round
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
