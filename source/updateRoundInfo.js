
const updateRoundInfo = async (db, round, roundEndTime, closingDate ) => {
    console.log(`updateRoundInfo: ${round} roundEndTime: ${roundEndTime} closingDate: ${closingDate}`)
    const roundInfoRef = await db.collection('round').where('round', '==', round.toString()).limit(1)
        .get()
        // console.log(roundInfoRef.docs[0].data())
    // if roundInfoRef is not found, create new document
    if (roundInfoRef.docs.length === 0) {
        console.log(`creating a new database entry for round ${round}`)
        const tradeLog = {}
        const errorLog = {} 
        await db.collection('round').add({
            roundEndTime: roundEndTime.toString(),
            closingDate: closingDate.toString(),
            round: round.toString(),
            availableAllocationForMarket : {},
            availableAllocationForRound: "50000000000000000000", // $50
            tradeLog: tradeLog,
            errorLog: errorLog
        })
        return {tradeLog, errorLog}
    } 
    const tradeLog = roundInfoRef.docs[0].tradeLog
    const errorLog = roundInfoRef.docs[0].errorLog
    const availableAllocationForMarket = roundInfoRef.docs[0].availableAllocationForMarket
    const availableAllocationForRound = roundInfoRef.docs[0].availableAllocationForRound
    

    return {availableAllocationForMarket, availableAllocationForRound, tradeLog, errorLog}
    
}

module.exports = {
    updateRoundInfo
}