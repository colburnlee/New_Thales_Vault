const updateRoundInfo = async (db, round, roundEndTime, closingDate) => {
  console.log(
    `updateRoundInfo: ${round} roundEndTime: ${roundEndTime} closingDate: ${closingDate}`,
  );
  const roundInfoRef = await db.collection("round").doc(round.toString()).get();
  // if roundInfoRef is not found, create new document
  if (!roundInfoRef.exists) {
    await createNewEntry(db, round, roundEndTime, closingDate);
  }
  const tradeLog = roundInfoRef.data.tradeLog;
  const errorLog = roundInfoRef.data.errorLog;
  const availableAllocationForMarket =
    roundInfoRef.data.availableAllocationForMarket;
  const availableAllocationForRound =
    roundInfoRef.data.availableAllocationForRound;

  return {
    availableAllocationForMarket,
    availableAllocationForRound,
    tradeLog,
    errorLog,
  };
};

const createNewEntry = async (db, round, roundEndTime, closingDate) => {
  console.log(`creating a new database entry for round ${round}`);
  const tradeLog = {};
  const errorLog = {};
  const data = {
    roundEndTime: roundEndTime.toString(),
    closingDate: closingDate.toString(),
    round: round.toString(),
    availableAllocationForMarket: {},
    availableAllocationForRound: "50000000000000000000", // $50
    tradeLog: tradeLog,
    errorLog: errorLog,
  };

  const ref = db.collection("round").doc(round.toString());
  const setData = async (data) => await ref.set(data);
  await setData(data);
};

module.exports = {
  updateRoundInfo,
};
