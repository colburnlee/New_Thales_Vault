
const updateRoundInfo = async (db, round, roundEndTime, closingDate ) => {
    console.log(`updateRoundInfo: ${round} roundEndTime: ${roundEndTime} closingDate: ${closingDate}`)
    const roundInfoRef = await db.collection('round').where('round', '==', round.toString()).limit(1)
        .get()
        // console.log(roundInfoRef.docs[0].data())
    // if roundInfoRef is not found, create new document
    if (roundInfoRef.docs.length === 0) {
        console.log(`creating a new database entry for round ${round}`)
        await db.collection('round').add({
            roundEndTime: roundEndTime.toString(),
            closingDate: closingDate.toString(),
            round: round.toString(),
            tradeLog: {},
            errorLog: {}
        })
    }
    
    

}

module.exports = {
    updateRoundInfo
}