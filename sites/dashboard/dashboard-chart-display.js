function initChartPage() {
    initCharts();
    update1MinuteCharts();
    //functions that update every minute (60,000ms)
    window.setInterval(update1MinuteCharts, 60000);

    update1SecondCharts();
    //functions that update every second (1,000ms)
    window.setInterval(update1SecondCharts, 10000);
}

//////////////////////////////////////////////////////////
//charts that update every minute (60,000ms)
async function update1MinuteCharts() {
    updateChart1();

    //chart 2 data
    transactionsPerBlockData = await getTransactionsPerBlock();
    updateChart2(transactionsPerBlockData);
    //chart 3 data
    hashRatePieData = await getHashratePieData(4);
    processedHashRatePieData = processHashRatePieData(hashRatePieData);
    updateChart3(processedHashRatePieData);
}
//charts that update every Second (1,000ms)
async function update1SecondCharts() {
    //chart 4 data
    klineData = await getKlineData();
    processedKlineData = processKlineData(klineData);
    updateChart4(processedKlineData);

    //chart 5 data
    tradeData = await getTradeData();
    processedTradeData = processTradeData(tradeData);
    updateChart5(processedTradeData);
}

function updateChart1() {}
function updateChart2(transactionsPerBlockData) {
    ApexCharts.exec("chart-2", "updateSeries", transactionsPerBlockData, true, true);
}

function updateChart3(processedHashRatePieData) {
    let sumTotal = processedHashRatePieData[0].reduce((currSum, i) => currSum + i, 0);
    ApexCharts.exec("chart-3", "updateSeries", processedHashRatePieData[0], true, true);
    ApexCharts.exec(
        "chart-3",
        "updateOptions",
        {
            title: {
                text: `HASHRATE DISTRIBUTION`,
            },
            legend: {
                show: true,
                labels: {
                    colors: "#f0f0f0",
                },
                fontFamily: "Source Sans Pro, sans-serif",
                fontWeight: "200",
                fontSize: "14px",
                formatter: function (val, opts) {
                    return val + " - " + ((opts.w.globals.series[opts.seriesIndex] * 100) / sumTotal).toFixed(0) + "%";
                },
            },
            labels: processedHashRatePieData[1],
        },
        true,
        true
    );
}

function updateChart4(processedKlineData) {
    ApexCharts.exec("chart-4", "updateSeries", [{ data: processedKlineData }], true, true);
    ApexCharts.exec(
        "chart-4",
        "updateOptions",
        {
            title: {
                text: `25 MIN CANDLESTICK CHART`,
                offsetY: 20,
                style: {
                    fontFamily: "Source Sans Pro, sans-serif",
                    fontWeight: "800",
                    fontSize: "14px",
                },
            },
            tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    priceString = w.globals.initialSeries[0].data[dataPointIndex].y;
                    dateString = new Date(w.globals.initialSeries[0].data[dataPointIndex].x);
                    dateString = dateString.toLocaleTimeString();
                    return `
                    <div id="tooltip">
                    <div id="tooltip-top">${dateString}</div>
                    <div class="tooltip-bottom-candle">Open: $${Number(priceString[0]).toFixed(0).toLocaleString()}</div>
                    <div class="tooltip-bottom-candle">High: $${Number(priceString[1]).toFixed(0).toLocaleString()}</div>
                    <div class="tooltip-bottom-candle">Low: $${Number(priceString[2]).toFixed(0).toLocaleString()}</div>
                    <div class="tooltip-bottom-candle">Close: $${Number(priceString[3]).toFixed(0).toLocaleString()}</div>
                    </div>`;
                },
            },
            yaxis: {
                type: "numeric",
                tickAmount: 10,
                labels: {
                    style: {
                        colors: "#f0f0f0",
                        fontFamily: "Source Code Pro, monospace",
                    },
                    formatter: function (val) {
                        return "$" + Number(val.toFixed(0)).toLocaleString();
                    },
                    snap: true,
                },
            },
        },
        true,
        true
    );
}

function updateChart5(processedTradeData) {
    let tbody = document.querySelector("#chart-5 tbody");
    tbody.innerHTML = null;
    for (let entry of processedTradeData) {
        tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${entry[0]}</td>
        <td>$${Number(entry[1]).toLocaleString()}</td>
        <td>${entry[2]} BTC</td>
        <td>$${Number(entry[3]).toLocaleString()}</td>`;
        tbody.appendChild(tr);
        if (entry[0] == "BUY") {
            tr.style.color = "#75c237"
        } else {
            tr.style.color = "#F74B4B";
        }
    }
}

//To be called once after document is loaded
function initCharts() {
    initChart(document.querySelector("#chart-1"), "chart-1", "bar");
    initChart(document.querySelector("#chart-2"), "chart-2", "column");
    initChart(document.querySelector("#chart-3"), "chart-3", "donut");
    initChart(document.querySelector("#chart-4"), "chart-4", "candle");
}

//Initialize chart Skeleton
//Input (DOM div, name of chart)
function initChart(DOMElement, chartName, chartType) {
    let options = {};
    if (chartType == "donut") {
        options = {
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
                    fontFamily: "Source Sans Pro, sans-serif",
                    fontWeight: "700",
                    fontSize: "14px",
                },
            },
            //Defining chart color
            colors: ["#FF9900", "#F74B4B", "#75c237", "#ffd162", "#10a0de", "#f0f0f0", "#a0a0a0"],
            //Stroke is the Border
            stroke: {
                show: false,
            },
            //Fill gradient to color
            //https://apexcharts.com/docs/options/fill/
            fill: {
                type: "gradient",
                gradient: {
                    shade: "dark",
                    shadeIntensity: 1,
                    opacityFrom: 0,
                    opacityTo: 1,
                    stops: [0, 50, 100],
                },
            },
            //the percentages label
            dataLabels: {
                style: {
                    fontSize: "10px",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "bold",
                    colors: ["#202020"],
                },
                dropShadow: {
                    enabled: false,
                },
                formatter(val, opts) {
                    const name = opts.w.globals.labels[opts.seriesIndex];
                    return [name];
                },
            },
            //Size of the donut
            plotOptions: {
                pie: {
                    donut: {
                        size: "35%",
                    },
                },
            },
            tooltip: {
                enabled: true,
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
    } else if (chartType == "candle") {
        options = {
            series: [],
            chart: {
                type: "candlestick",
                id: chartName, //selector name
                group: "charts",
                //disable chart zooming
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
                offsetY: -15,
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
            xaxis: {
                type: "datetime",
                labels: {
                    style: {
                        colors: "#f0f0f0",
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
            plotOptions: {
                candlestick: {
                    wick: {
                        //useFillColor: true,
                    },
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
    } else {
        options = {
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
    }
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
