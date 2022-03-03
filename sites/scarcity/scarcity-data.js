function bitcoinSupplyData() {
    const BLOCKTIME = 10; //in Minutes
    const EPOCHBLOCKS = 210000; //Blocks every halving
    let currDate = new Date("2009-01-04 02:15"); //date and time of first block
    let noOfBlocksFortnight = (24 * 60 * 14) / BLOCKTIME; //Total number of minutes in a day divided by block time
    let fortnightsPerEpoch = EPOCHBLOCKS / noOfBlocksFortnight; //Number of fortnights in an Epoch
    let blockReward = 50; //Initial block reward
    let currentSupply = 0; //Initial bitcoinSupplyData

    let dataArray = [];
    for (let i = 0; i < 12; i++) {
        for (let j = 1; j < fortnightsPerEpoch; j++) {
            currDate.setDate(currDate.getDate() + 14);
            currentSupply += blockReward * noOfBlocksFortnight;
            dataArray.push([new Date(currDate), currentSupply]);
        }
        blockReward = blockReward / 2;
    }

    return dataArray;
}

async function bitcoinStatsData() {
    response = await axios.get("https://api.blockchain.info/stats");
    return response.data;
}

