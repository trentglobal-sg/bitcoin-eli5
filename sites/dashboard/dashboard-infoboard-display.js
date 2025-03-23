//Global Data Variables
//for updating content-2's timer
timeElapsedMinsGlobal = 0;
timeElapsedSecsGlobal = 0;
//for updating content-5's price
priceGlobal = 0;

function initInfoboardpage() {
    update1MinuteFunctions();
    //functions that update every minute (60,000ms)
    //window.setInterval(update1MinuteFunctions, 60000);

    update1SecondFunctions();
    //functions that update every second (1,000ms)
    //window.setInterval(update1SecondFunctions, 1000);
}

//////////////////////////////////////////////////////////
//functions that update every minute (60,000ms)
async function update1MinuteFunctions() {
    //Data required for content-1
    let currentBlockHeight = await getCurrentBlockHeight();
    let activeNodes = await getActiveNodes();
    //Data required for content-2
    let currentBlockData = await getBlockData(currentBlockHeight);
    let currentBlockTimestamp = currentBlockData.time;
    let noOfTx = currentBlockData.n_tx;
    //Data required for content-3
    let averageBlockInterval = await getAverageBlockInterval();
    let currentBlockReward = await getCurrentBlockReward();
    //Data required for content-4
    let averageHashRate = await getAverageHashrate();
    let hashesToWin = await getHashesToWin();
    //Data required for content-5
    let highLowData = await getHighLowData();

    updateContent1(currentBlockHeight, activeNodes);
    [timeElapsedMinsGlobal, timeElapsedSecsGlobal] = updateContent2(currentBlockTimestamp, noOfTx);
    updateContent3(averageBlockInterval, currentBlockReward);
    updateContent4(averageHashRate, hashesToWin);
    updateContent5(highLowData);
}
//functions that update every second (1,000ms)
async function update1SecondFunctions() {
    //Data required for content-5
    let currentPrice = await getCurrentPrice();

    updateContent2Timer();
    updateContent5Timer(currentPrice);
    priceGlobal = Number(currentPrice);
}

//////////////////////////////////////////////////////////
//function to update content-1
function updateContent1(currentBlockHeight, activeNodes) {
    //main
    currentBlockHeight = currentBlockHeight.toLocaleString();
    document.querySelector("#content-1-data").innerText = "#" + currentBlockHeight;
    //details
    document.querySelector("#content-1-details .content-details-data").innerText = `${activeNodes - 1234}/${activeNodes}`;
}
//functions to update content-2
//returns the timeElapsedMins and timeElapsedSecs
function updateContent2(currentBlockTimestamp, noOfTx) {
    //main
    let currentTime = new Date();
    let timeElapsed = currentTime - new Date(currentBlockTimestamp * 1000);
    let timeElapsedMins = Math.floor(timeElapsed / 60000);
    let timeElapsedSecs = ((timeElapsed % 60000) / 1000).toFixed(0);
    document.querySelector("#content-2-data").innerText = `${timeElapsedMins}m ${timeElapsedSecs}s ago`;
    //details
    document.querySelector("#content-2-details .content-details-data").innerText = noOfTx;

    //return
    return [Number(timeElapsedMins), Number(timeElapsedSecs)];
}
function updateContent2Timer() {
    timeElapsedSecsGlobal += 1;
    if (timeElapsedSecsGlobal == 60) {
        timeElapsedSecsGlobal = 0;
        timeElapsedMinsGlobal += 1;
    }
    if (timeElapsedMinsGlobal >= 10) {
        //When the block time is above average, change to red
        document.querySelector("#content-2 i").style.color = "#F74B4B";
        document.querySelector("#content-2-data").style.color = "#F74B4B";
    } else {
        document.querySelector("#content-2 i").style.color = "#75C237";
        document.querySelector("#content-2-data").style.color = "#75C237";
    }
    document.querySelector("#content-2-data").innerText = `${timeElapsedMinsGlobal}m ${timeElapsedSecsGlobal}s ago`;
}
//function to update content-3
function updateContent3(averageBlockInterval, currentBlockReward) {
    //main
    let averageBlockIntervalMins = Math.floor(averageBlockInterval / 60);
    let averageBlockIntervalSecs = (averageBlockInterval % 60).toFixed(0);
    document.querySelector("#content-3-data").innerText = `${averageBlockIntervalMins}m ${averageBlockIntervalSecs}s`;
    //details
    document.querySelector("#content-3-details .content-details-data").innerText = currentBlockReward + " BTC";
}
//function to update content-4
function updateContent4(averageHashRate, hashesToWin) {
    //main
    averageHashRate = (averageHashRate / 1000000000).toFixed(0);
    document.querySelector("#content-4-data").innerText = `${averageHashRate}m TH/s`;
    //details
    hashesToWin = Number((hashesToWin / 1000000000000).toFixed(0)).toLocaleString();
    document.querySelector("#content-4-details .content-details-data").innerText = hashesToWin + " TH";
}
//functions to update content-5
function updateContent5(highLowData) {
    //details
    document.querySelector("#content-5-details .content-details-data").innerText = `$ ${Number(highLowData[0]).toFixed(0)} / $ ${Number(highLowData[1]).toFixed(0)}`;
}
function updateContent5Timer(currentPrice) {
    currentPrice = Number(currentPrice).toFixed(2);
    if (currentPrice > priceGlobal) {
        document.querySelector("#content-5 i").style.color = "#75C237";
        document.querySelector("#content-5-data").style.color = "#75C237";
    } else if (currentPrice < priceGlobal) {
        document.querySelector("#content-5 i").style.color = "#F74B4B";
        document.querySelector("#content-5-data").style.color = "#F74B4B";
    }
    document.querySelector("#content-5-data").innerText = `${Number(currentPrice).toLocaleString()}`;
}