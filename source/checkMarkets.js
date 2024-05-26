require("dotenv").config();
const thalesData = require("thales-data");
const ethers = require("ethers");
const Position = {
    UP: 0,
    DOWN: 1,
    DRAW: 2,
  };
const checkMarkets = async () => {

}

function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
  
  function inTradingWeek(maturityDate, roundEndTime) {
    const now = Date.now();
    // console.log(
    //   `now: ${now} - maturityDate: ${new Date(
    //     maturityDate
    //   )} - roundEndTime: ${roundEndTime} - 900000: ${new Date(
    //     roundEndTime + 900000
    //   )} - ${
    //     Number(maturityDate) > Number(now) &&
    //     Number(maturityDate) < Number(roundEndTime + 900000)
    //   }`
    // );
    if (
      Number(maturityDate) > Number(now) &&
      Number(maturityDate) < Number(roundEndTime)
    ) {
      return true;
    }
    return false;
  }

module.exports = {
    checkMarkets
}