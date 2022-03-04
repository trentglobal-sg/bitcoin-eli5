//Global Data Variables
//for updating content-2's timer
timeElapsedMinsGlobal = 0;
timeElapsedSecsGlobal = 0;
//for updating content-5's price
priceGlobal = 0;

function initChartPage() {
    update1MinuteFunctions();
    initCharts();
    update1MinuteCharts();
    //functions that update every minute (60,000ms)
    window.setInterval(update1MinuteFunctions, 60000);
    window.setInterval(update1MinuteCharts, 60000);

    update1SecondFunctions();
    //functions that update every second (1,000ms)
    window.setInterval(update1SecondFunctions, 1000);
}

//////////////////////////////////////////////////////////
//functions that update every minute (60,000ms)
async function update1MinuteFunctions() {
    console.log("1 minute functions updating...");
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
    console.log("1 second functions updating...");
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

//////////////////////////////////////////////////////////
//charts that update every minute (60,000ms)
async function update1MinuteCharts() {
    updateChart1();
}

function updateChart1() {
    //     //Processing candle chart data (O,H,L,C)
    //     data = await getCandleData(id, days); //in data.js
    //     processedData = processCandleData(data);
    //     startDate = processedData[0].x;
    //     endDate = processedData.slice(-1)[0].x;
    //     console.log("Rendering Candle Chart:", id);
    //     //update candle chart series and options with a selector
    //     ApexCharts.exec("candleChart", "updateSeries", [{ data: processedData }]);
}

//To be called once after document is loaded
function initCharts() {
    initChart(document.querySelector("#chart-1"), "chart-1", "bar");
    initChart(document.querySelector("#chart-2"), "chart-2", "bar");
}

//Initialize chart Skeleton
//Input (DOM div, name of chart)
function initChart(DOMElement, chartName, chartType) {
    console.log("Initializing Chart");
    var options = {
        series: [],
        chart: {
            type: chartType,
            id: chartName, //selector name
            group: "charts",
            //disable chart zooming
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        //Pre-loading title while fetching price data
        title: {
            text: "Loading Charts...",
            align: "center",
            style: {
                color: "#f0f0f0",
                fontFamily: "Source Code Pro, monospace",
            },
        },
        //Data Labels are labels with value on the chart
        dataLabels: {
            enabled: false,
        },
        //Defining chart color
        colors: ["#FF9900"],
        //Line Stroke
        stroke: {
            show: true,
            curve: "smooth",
            lineCap: "butt",
            width: 2,
            dashArray: 0,
        },
        //Fill gradient to color
        //https://apexcharts.com/docs/options/fill/
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                shadeIntensity: 0.5,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 0,
                stops: [0, 99, 100],
            },
        },
        xaxis: {
            type: "datetime",
            labels: {
                style: {
                    colors: "#f0f0f0",
                    fontSize: "1rem",
                    fontFamily: "Source Code Pro, monospace",
                },
            },
            //vertical crosshairs styling
            crosshairs: {
                show: true,
                width: 1,
                stroke: {
                    colors: "#f0f0f0",
                    width: 2,
                    dashArray: 0,
                },
            },
            //x-axis tooltip
            tooltip: {
                enabled: false,
            },
        },
        //Words to show then chart is loading
        noData: {
            text: "Loading Charts...",
            align: "center",
            verticalAlign: "middle",
            style: {
                color: "#FF9900",
                fontSize: "1em",
                fontFamily: "Tourney, cursive",
            },
        },
    };

    let lineChart = new ApexCharts(DOMElement, options);
    lineChart.render();
}
// //global flags
// //Is volume being displayed currently?
// let volumeDisplayFlag = false;

// //Main page initilization function
// function initPage(list) {
//     initCandleChart();
//     initVolumeChart();
//     //Populate the list of dropdown with coin names
//     listOfCryptos = document.querySelector("#list-of-cryptos");
//     //populate the dropbar with name, logo, and event listener for each option
//     for (let item of list) {
//         let li = document.createElement("li");
//         let img = document.createElement("img");
//         let a = document.createElement("a");
//         a.className = "dropdown-item";
//         a.innerText = item.name;
//         a.addEventListener("click", function () {
//             //logic when a new coin is clicked
//             console.log("New Coin Clicked", item.id);
//             //render candle chart, default 7 day chart
//             renderCandleChart(item.id, item.name, 7);
//             //render days button
//             removeAndAddEventListenerDaysButton(item.id, item.name);
//             //render close button
//             renderCloseButton();
//             volumeDisplayFlag = false; //volume is not displayed on new chart by default
//             //change text on button
//             document.querySelector("#new-coin-dropdown>button").innerHTML = `Displaying ${item.name} <img src="${item.image}"/>`;
//             document.querySelector("#candle-chart-days>button").innerText = `7 Days`;
//         });
//         img.src = item.image;
//         a.prepend(img);
//         li.append(a);
//         listOfCryptos.append(li);
//     }

//     addEventListenerCloseButton();
// }

// //initialize candle chart skeleton
// function initCandleChart() {
//     var options = {
//         series: [],
//         chart: {
//             type: "candlestick",
//             height: 300,
//             id: "candleChart",
//             group: "charts",
//         },
//         title: {
//             text: "hi",
//             //`${coinName} Price Chart (From: ${startDate.toLocaleString()} To: ${endDate.toLocaleString()})`,
//             align: "left",
//         },
//         xaxis: {
//             type: "datetime",
//         },
//         yaxis: {
//             tooltip: {
//                 enabled: true,
//             },
//             labels: {
//                 minWidth: 40,
//             },
//         },
//     };
//     let candleChart = new ApexCharts(document.querySelector("#candle-chart"), options);
//     candleChart.render();
// }
// //initialize volume chart skeleton
// function initVolumeChart() {
//     var options = {
//         series: [],
//         chart: {
//             type: "area",
//             height: 200,
//             id: "volumeChart",
//             group: "charts",
//         },
//         title: {
//             text: `Volume Chart`,
//             align: "left",
//         },
//         xaxis: {
//             type: "datetime",
//         },
//         yaxis: {
//             tooltip: {
//                 enabled: true,
//             },
//             labels: {
//                 minWidth: 40,
//             },
//         },
//     };
//     let volumeChart = new ApexCharts(document.querySelector("#volume-chart"), options);
//     volumeChart.render();
// }

// //apex charts rendering and data retrieval
// //this function also needs to add event listeners to show volume
// async function renderCandleChart(id, coinName, days) {
//     //flag: does a volume chart exist for the selected day?
//     //Only for 1, 14, 30 and Max
//     let volumeSuitabilityFlag = false;
//     if ([1, 14, 30, "max"].includes(days)) {
//         volumeSuitabilityFlag = true;
//     }

//     //if volume is not suitable to be displayed
//     if (!volumeSuitabilityFlag) {
//         document.querySelector("#volume-chart").style.display = "none";
//         volumeDisplayFlag = false;
//         document.querySelector("#candle-chart-show-volume").innerHTML = "";
//     } else {
//         //since volume is suitable to be shown
//         if (volumeDisplayFlag) {
//             //if volume was already showing
//             removeAndAddEventListenerVolumeButton(id, days);
//             renderVolume(id, days);
//         } else {
//             // if volume isn't showning
//             removeAndAddEventListenerVolumeButton(id, days);
//         }
//     }

//     //Processing candle chart data (O,H,L,C)
//     data = await getCandleData(id, days); //in data.js
//     processedData = processCandleData(data);
//     startDate = processedData[0].x;
//     endDate = processedData.slice(-1)[0].x;

//     console.log("Rendering Candle Chart:", id);
//     //update candle chart series and options with a selector
//     ApexCharts.exec("candleChart", "updateSeries", [{ data: processedData }]);
//     ApexCharts.exec(
//         "candleChart",
//         "updateOptions",
//         {
//             title: {
//                 text: `${coinName} Price Chart (From: ${startDate.toLocaleString()} To: ${endDate.toLocaleString()})`,
//             },
//         },
//         true,
//         true
//     );
//     document.querySelector("#candle-chart").style.display = "block";
// }

// //rendering + add event listeners to days dropdown (will become visible)
// function removeAndAddEventListenerDaysButton(id, coinName) {
//     console.log("Rendering and adding add event listeners for Days:", coinName);
//     listOfDays = document.querySelector("#list-of-days");
//     listOfDays.innerHTML = ""; //cleaning all old buttons and their old listeners
//     //adding new listeners
//     dayOptions = [1, 7, 14, 30, 90, 180, 365, "Max"];
//     for (let i of dayOptions) {
//         let li = document.createElement("li");
//         let a = document.createElement("a");
//         a.className = "dropdown-item";
//         a.innerText = i + " days";
//         //adding event listener to each button in the chart option
//         a.addEventListener("click", function () {
//             console.log("Day is clicked:", coinName, i);
//             //logic when new day is selected, render a new candle chart
//             renderCandleChart(id, coinName, i == "Max" ? "max" : i);
//             //change button text
//             document.querySelector("#candle-chart-days>button").innerText = `${i} Days`;
//         });
//         li.append(a);
//         listOfDays.append(li);
//     }
//     //Make days dropdown visible
//     document.querySelector("#candle-chart-days").style.display = "inline-block";
// }

// //rendering close button (will become visible)
// function renderCloseButton() {
//     document.querySelector("#candle-chart-close").style.display = "inline-block";
// }

// //add event listeners to close button
// function addEventListenerCloseButton() {
//     //Add event listener for close button (applied for all situations)
//     document.querySelector("#candle-chart-close").addEventListener("click", function () {
//         //close the charts
//         document.querySelector("#candle-chart").style.display = "none";
//         document.querySelector("#volume-chart").style.display = "none";
//         //close the buttons
//         document.querySelector("#candle-chart-days").style.display = "none";
//         document.querySelector("#candle-chart-close").style.display = "none";
//         //clear text from new coin button
//         document.querySelector("#new-coin-dropdown>button").innerText = `Choose a Coin to Display`;
//         //clear all dropdowns from days
//         document.querySelector("#list-of-days").innerHTML = "";
//         //clear the event listener button from add volume
//         document.querySelector("#candle-chart-show-volume").innerHTML = "";
//         //set flags
//         volumeDisplayFlag = false;
//     });
// }

// function removeAndAddEventListenerVolumeButton(id, days) {
//     console.log("Removing and re-adding Volume Button:", id);
//     //remove old button
//     document.querySelector("#candle-chart-show-volume").innerHTML = "";

//     //create new button
//     volumeButton = document.createElement("button");
//     volumeButton.setAttribute("type", "button");
//     volumeButton.setAttribute("class", "btn btn-secondary");
//     if (volumeDisplayFlag) {
//         volumeButton.innerText = "Hide Volume Chart";
//     } else {
//         volumeButton.innerText = "Show Volume Chart";
//     }
//     volumeButton.addEventListener("click", function () {
//         //if volume isn't being shown...
//         if (!volumeDisplayFlag) {
//             renderVolume(id, days); //show volume chart
//             //change to Hide Volume Button
//             document.querySelector("#candle-chart-show-volume>button").innerText = "Hide Volume"; //switch button
//             volumeDisplayFlag = true; //set flag
//         } else {
//             //if volume is shown currently
//             console.log("Hiding Volume", id, days);
//             document.querySelector("#volume-chart").style.display = "none"; //hide volume chart
//             //change to Show Volume Button
//             document.querySelector("#candle-chart-show-volume>button").innerText = "Show Volume"; //switch button
//             volumeDisplayFlag = false; //set flag
//         }
//     });
//     document.querySelector("#candle-chart-show-volume").appendChild(volumeButton);
// }

// async function renderVolume(id, days) {
//     console.log("Showing Volume", id, days);
//     //get volume data
//     data = await getPriceData(id, days);
//     processedData = processVolumeData(data);

//     //Render Volume Chart
//     ApexCharts.exec("volumeChart", "updateSeries", [{ data: processedData }]);
//     document.querySelector("#volume-chart").style.display = "block";
// }
