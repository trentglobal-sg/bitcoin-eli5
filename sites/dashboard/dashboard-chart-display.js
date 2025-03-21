let processedData = [];

function initChartPage() {
    initCharts();

    update1SecondCharts();
    //functions that update every second (1,000ms)
    // window.setInterval(update1SecondCharts, 60000);

    update10SecondCharts();
    //functions that update every 10 seconds (10,000ms)
    // window.setInterval(update10SecondCharts, 10000);

    update1MinuteCharts();
    //functions that update every minute (60,000ms)
    // window.setInterval(update1MinuteCharts, 60000);
}

//////////////////////////////////////////////////////////
//charts that update every minute (60,000ms)
async function update1MinuteCharts() {
    //chart 2 data
    transactionsPerBlockData = await getTransactionsPerBlock();
    processedTransactionsPerBlockData = processTransactionsPerBlockData(transactionsPerBlockData);
    // updateChart2(processedTransactionsPerBlockData);
    //chart 3 data
    hashRatePieData = await getHashratePieData(4);
    processedHashRatePieData = processHashRatePieData(hashRatePieData);
    updateChart3(processedHashRatePieData);
    //chart 4 data
    totalHashRateData = await getTotalHashRate();
    processedtotalHashRateData = processTotalHashRateData(totalHashRateData);
    updateChart4(processedtotalHashRateData);
    //chart-8 //flexi-2 //flexi-3
    marketChartData = await getMarketChart();
    processedMarketChartData = processMarketChartData(marketChartData);
    updateChart8(processedMarketChartData.prices);
    updateFlexi2(processedMarketChartData.total_volumes);
    updateFlexi3(processedMarketChartData.market_caps);

    //Chart 1 Data
    blockData = await getLastBlocksData();
    updateChart1(blockData);
}
//functions that update every minute (60,000ms)
async function update10SecondCharts() {
    //flexi-4
    exchangeData = await getExchangeData();
    processedExchangeData = processExchangeData(exchangeData);
    updateFlexi4(processedExchangeData);
}
//charts that update every Second (1,000ms)
async function update1SecondCharts() {
    //chart 5 data
    tradeData = await getTradeData();
    processedTradeData = processTradeData(tradeData);
    updateChart5(processedTradeData);

    //chart 9 data
    klineData = await getKlineData();
    processedKlineData = processKlineData(klineData);
    updateChart9(processedKlineData);

    //chart 10 data
    updateChart10(priceGlobal);
}

function updateChart1(blockData) {
    let tbody = document.querySelector("#chart-1 tbody");
    tbody.innerHTML = null;
    for (let i = 1; i < blockData.length; i++) {
        let blockTimestamp = new Date(blockData[i].time * 1000);
        tr = document.createElement("tr");
        td1 = document.createElement("td");
        td1btn = document.createElement("btn");
        td1btn.addEventListener("click", function () {
            updateChart6(blockData, i);
        });
        td1btn.innerText = blockData[i].height;
        td1btn.classList.add("table-pointer");
        td1.appendChild(td1btn);
        tr.appendChild(td1);
        td2 = document.createElement("td");
        td2.innerText = blockTimestamp.toLocaleTimeString();
        tr.appendChild(td2);
        td3 = document.createElement("td");
        td3.innerText = blockData[i].n_tx;
        tr.appendChild(td3);
        td4 = document.createElement("td");
        td4.innerText = blockData[i].fee;
        tr.appendChild(td4);
        tbody.appendChild(tr);
    }
    updateChart6(blockData, 1);
}
function updateChart2(processedTransactionsPerBlockData) {
    // console.log(processedTransactionsPerBlockData)

    const formattedData = processedTransactionsPerBlockData.map(point => ({
        x: new Date(point.x).toLocaleDateString('en-US'), // or any format you like
        y: point.y
    }));
    
    ApexCharts.exec("chart-2", "updateSeries", [
        { name: "Transactions", data: formattedData }
    ], true, true);

    // draw processed transactions per block data in chart-2

    // ApexCharts.exec(
    //     "chart-2",
    //     "updateOptions",
    //     {
    //         title: {
    //             text: `AVG TRANSACTIONS PER BLOCK`,
    //             offsetY: 20,
    //             style: {
    //                 fontFamily: "Source Sans Pro, sans-serif",
    //                 fontWeight: "800",
    //                 fontSize: "14px",
    //             },
    //         },
    //         // tooltip: {
    //         //     custom: function ({ series, seriesIndex, dataPointIndex, w }) {
    //         //         dataString = w.globals.initialSeries[0].data[dataPointIndex].y;
    //         //         dateString = new Date(w.globals.initialSeries[0].data[dataPointIndex].x);
    //         //         dateString = dateString.toLocaleDateString();
    //         //         return `
    //         //         <div id="tooltip">
    //         //         <div id="tooltip-top">Date: ${dateString}</div>
    //         //         <div class="tooltip-bottom-candle">Avg Tx/Block: ${Number(dataString).toFixed(0).toLocaleString()}</div>
    //         //         </div>`;
    //         //     },
    //         // },
    //         // yaxis: {
    //         //     type: "numeric",
    //         //     tickAmount: 5,
    //         //     labels: {
    //         //         style: {
    //         //             colors: "#f0f0f0",
    //         //             fontFamily: "Source Code Pro, monospace",
    //         //         },
    //         //         formatter: function (val) {
    //         //             return Number(val.toFixed(0)).toLocaleString();
    //         //         },
    //         //         snap: true,
    //         //     },
    //         // },
    //     },
    //     true,
    //     true
    // );
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
            tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    let label = w.globals.labels[seriesIndex];
                    let percentageShare = Number((series[seriesIndex] / series.reduce((partialSum, a) => partialSum + a, 0)) * 100).toFixed(0);
                    return `
                    <div id="tooltip">
                    <div id="tooltip-top">${label}</div>
                    <div id="tooltip-bottom">${percentageShare}%</div>
                    </div>`;
                },
            },
            labels: processedHashRatePieData[1],
        },
        true,
        true
    );
}
function updateChart4(processedtotalHashRateData) {
    ApexCharts.exec("chart-4", "updateSeries", [{ data: processedtotalHashRateData }], true, true);
    ApexCharts.exec(
        "chart-4",
        "updateOptions",
        {
            title: {
                text: `DAILY NETWORK HASHRATE TH/s`,
                offsetY: 20,
                style: {
                    fontFamily: "Source Sans Pro, sans-serif",
                    fontWeight: "800",
                    fontSize: "14px",
                },
            },
            tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    dataString = w.globals.initialSeries[0].data[dataPointIndex].y;
                    dateString = new Date(w.globals.initialSeries[0].data[dataPointIndex].x);
                    dateString = dateString.toLocaleDateString();
                    return `
                    <div id="tooltip">
                    <div id="tooltip-top">Date: ${dateString}</div>
                    <div class="tooltip-bottom-candle">${Number(Number(dataString).toFixed(0)).toLocaleString()} TH/s</div>
                    </div>`;
                },
            },
            yaxis: {
                type: "numeric",
                tickAmount: 5,
                labels: {
                    style: {
                        colors: "#f0f0f0",
                        fontFamily: "Source Code Pro, monospace",
                    },
                    formatter: function (val) {
                        return `${Number((val / 1000000).toFixed(0)).toLocaleString()}m`;
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
            tr.style.color = "#75c237";
        } else {
            tr.style.color = "#F74B4B";
        }
    }
}
function updateChart6(blockData, i) {
    let tbodyInner = document.querySelector("#chart-6 tbody");
    let theadInner = document.querySelector("#chart-6 thead");
    tbodyInner.innerHTML = ``;
    theadInner.innerHTML = `<tr>
                                        <th>#</th>
                                        <th>Transaction List for Block #${blockData[i].height}</th>
                                    </tr>`;
    for (let j = 0; j < Math.min(50, blockData[i].tx.length); j++) {
        let tr = document.createElement("tr");
        let transactionId = `${blockData[i].tx[j].hash.substring(0, 10)}...${blockData[i].tx[j].hash.slice(-10)}`;
        let td1 = document.createElement("td");
        td1.innerText = j + 1;
        tr.appendChild(td1);
        let td2 = document.createElement("td");
        td2.innerText = transactionId;
        td2.classList.add("table-pointer");
        td2.addEventListener("click", function () {
            updateChart7(blockData, i, j, transactionId);
        });
        tr.appendChild(td2);
        tbodyInner.appendChild(tr);
        if (j == 0) {
            updateChart7(blockData, i, j, transactionId);
        }
    }
}
async function updateChart7(blockData, i, j, transactionId) {
    let outputSum = 0;
    for (let n = 0; n < blockData[i].tx[j].out.length; n++) {
        outputSum += Number(blockData[i].tx[j].out[n].value);
    }
    let inputSum = blockData[i].tx[j].inputs[0].prev_out.value;
    let tbodyInner = document.querySelector("#chart-7 tbody");
    let theadInner = document.querySelector("#chart-7 thead");
    theadInner.innerHTML = `<tr>
                            <th>#</th>
                            <th>TxId Details: ${transactionId}</th>
                        </tr>`;
    tbodyInner.innerHTML = `
    <tr>
        <td> Input BTC </td>
        <td> ${inputSum / 100000000} BTC</td>
    </tr>
    <tr>
        <td> Output BTC </td>
        <td> ${outputSum / 100000000} BTC</td>
    </tr>
    <tr>
        <td> Net BTC Moved</td>
        <td> ${Math.abs(inputSum - outputSum) / 100000000} BTC</td>
    </tr>
    <tr>
        <td> Value Moved</td>
        <td> $${Number(Math.abs((Math.max(inputSum, outputSum) / 100000000) * priceGlobal).toFixed(2)).toLocaleString()}</td>
    </tr>
    <tr>
        <td> Fees </td>
        <td> ${blockData[i].tx[j].fee / 100000000}</td>
    </tr>
    <tr>
        <td> Size </td>
        <td> ${blockData[i].tx[j].weight} KB</td>
    </tr>`;
}
function updateChart8(priceData) {
    ApexCharts.exec("chart-8", "updateSeries", [{ data: priceData }], true, true);
    ApexCharts.exec(
        "chart-8",
        "updateOptions",
        {
            title: {
                text: `Price (3 Months)`,
                offsetY: 20,
                style: {
                    fontFamily: "Source Sans Pro, sans-serif",
                    fontWeight: "800",
                    fontSize: "14px",
                },
            },
            tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    dataString = w.globals.initialSeries[0].data[dataPointIndex][1];
                    dateString = new Date(w.globals.initialSeries[0].data[dataPointIndex][0]);
                    dateString = dateString.toLocaleDateString();
                    return `
                    <div id="tooltip">
                    <div id="tooltip-top">Date: ${dateString}</div>
                    <div class="tooltip-bottom-candle">$${Number(Number(dataString).toFixed(0)).toLocaleString()}</div>
                    </div>`;
                },
            },
            yaxis: {
                type: "numeric",
                tickAmount: 5,
                labels: {
                    style: {
                        colors: "#f0f0f0",
                        fontFamily: "Source Code Pro, monospace",
                    },
                    formatter: function (val) {
                        return `$${Number(val.toFixed(0)).toLocaleString()}`;
                    },
                    snap: true,
                },
            },
        },
        true,
        true
    );
}
function updateChart9(processedKlineData) {
    ApexCharts.exec("chart-9", "updateSeries", [{ data: processedKlineData }], true, true);
    ApexCharts.exec(
        "chart-9",
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
function updateChart10(lastPrice) {
    processedData.push([new Date(), lastPrice]);
    processedData = processedData.slice(-60);
    ApexCharts.exec("chart-10", "updateSeries", [{ data: processedData }], true, true);
    ApexCharts.exec(
        "chart-10",
        "updateOptions",
        {
            chart: {
                animations: {
                    enabled: true,
                    easing: "linear",
                    dynamicAnimation: {
                        speed: 1000,
                    },
                },
            },
            title: {
                text: `Price (1 Min)`,
                offsetY: 20,
                style: {
                    fontFamily: "Source Sans Pro, sans-serif",
                    fontWeight: "800",
                    fontSize: "14px",
                },
            },
            tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    priceString = "$" + Number(series[seriesIndex][dataPointIndex].toFixed(0)).toLocaleString();
                    dateString = new Date(w.globals.initialSeries[0].data[dataPointIndex][0]);
                    dateString = dateString.toLocaleTimeString();
                    return `
                    <div id="tooltip">
                    <div id="tooltip-top">${dateString}</div>
                    <div id="tooltip-bottom">${priceString}</div>
                    </div>`;
                },
            },
            yaxis: {
                type: "numeric",
                tickAmount: 5,
                labels: {
                    style: {
                        colors: "#f0f0f0",
                        fontSize: "1rem",
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
function updateFlexi2(marketVolumeData) {
    ApexCharts.exec("flexi-2", "updateSeries", [{ data: marketVolumeData }], true, true);
    ApexCharts.exec(
        "flexi-2",
        "updateOptions",
        {
            title: {
                text: `Total Exchange Volume (3 Months)`,
                offsetY: 20,
                style: {
                    fontFamily: "Source Sans Pro, sans-serif",
                    fontWeight: "800",
                    fontSize: "14px",
                },
            },
            tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    dataString = w.globals.initialSeries[0].data[dataPointIndex][1];
                    dateString = new Date(w.globals.initialSeries[0].data[dataPointIndex][0]);
                    dateString = dateString.toLocaleDateString();
                    return `
                    <div id="tooltip">
                    <div id="tooltip-top">Date: ${dateString}</div>
                    <div class="tooltip-bottom-candle">$${Number(Number(dataString).toFixed(0)).toLocaleString()}</div>
                    </div>`;
                },
            },
            yaxis: {
                type: "numeric",
                tickAmount: 5,
                labels: {
                    style: {
                        colors: "#f0f0f0",
                        fontFamily: "Source Code Pro, monospace",
                    },
                    formatter: function (val) {
                        return `$${Number((val / 1000000000).toFixed(0)).toLocaleString()}B`;
                    },
                    snap: true,
                },
            },
        },
        true,
        true
    );
}
function updateFlexi3(marketCapData) {
    ApexCharts.exec("flexi-3", "updateSeries", [{ data: marketCapData }], true, true);
    ApexCharts.exec(
        "flexi-3",
        "updateOptions",
        {
            title: {
                text: `Market Capitalization (3 Months)`,
                offsetY: 20,
                style: {
                    fontFamily: "Source Sans Pro, sans-serif",
                    fontWeight: "800",
                    fontSize: "14px",
                },
            },
            tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    dataString = w.globals.initialSeries[0].data[dataPointIndex][1];
                    dateString = new Date(w.globals.initialSeries[0].data[dataPointIndex][0]);
                    dateString = dateString.toLocaleDateString();
                    return `
                    <div id="tooltip">
                    <div id="tooltip-top">Date: ${dateString}</div>
                    <div class="tooltip-bottom-candle">$${Number(Number(dataString).toFixed(0)).toLocaleString()}</div>
                    </div>`;
                },
            },
            yaxis: {
                type: "numeric",
                tickAmount: 5,
                labels: {
                    style: {
                        colors: "#f0f0f0",
                        fontFamily: "Source Code Pro, monospace",
                    },
                    formatter: function (val) {
                        return `$${Number((val / 1000000000).toFixed(0)).toLocaleString()}B`;
                    },
                    snap: true,
                },
            },
        },
        true,
        true
    );
}
function updateFlexi4(processedExchangeData) {
    let tbody = document.querySelector("#flexi-4 tbody");
    tbody.innerHTML = null;
    for (let key in processedExchangeData) {
        let entry = processedExchangeData[key];
        let colorFont = "";
        if (Number(entry.last) >= priceGlobal) {
            colorFont = "#75c237";
        } else {
            colorFont = "#F74B4B";
        }
        tr = document.createElement("tr");
        tr.innerHTML = `
        <td><img class="flexi-4-image" src="${entry.market.logo}"></img>  <a href="${entry.trade_url}"   target="_blank">${entry.market.name}</a></td>
        <td style="color:${colorFont}">$${Number(entry.last).toLocaleString()}</td>
        <td style="color:${colorFont}">$${Number(entry.volume).toLocaleString()}</td>
        <td style="color:${colorFont}">±${Number(entry.bid_ask_spread_percentage * 100).toLocaleString()}%</td>
        <td style="color:${entry.trust_score}"><i class="fa-solid fa-circle-dot"></i></td>`;
        tbody.appendChild(tr);
        if (entry[0] == "BUY") {
            tr.style.color = "#75c237";
        } else {
            tr.style.color = "#F74B4B";
        }
    }
}

//To be called once after document is loaded
function initCharts() {
    // initChart(document.querySelector("#chart-2"), "chart-2", "column");
    initChart(document.querySelector("#chart-3"), "chart-3", "donut");
    initChart(document.querySelector("#chart-4"), "chart-4", "area");
    initChart(document.querySelector("#chart-8"), "chart-8", "area");
    initChart(document.querySelector("#chart-9"), "chart-9", "candle");
    initChart(document.querySelector("#chart-10"), "chart-10", "line");
    initChart(document.querySelector("#flexi-2"), "flexi-2", "area");
    initChart(document.querySelector("#flexi-3"), "flexi-3", "area");
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
                offsetY: 12,
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
    } else if (chartType == "column") {
        options = {
            series: [],
            chart: {
                type: "bar",
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
            dataLabels: {
                enabled: false,
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
            //Fill gradient to color
            //https://apexcharts.com/docs/options/fill/
            fill: {
                colors: [
                    function ({ value, seriesIndex, w }) {
                        if (value < 1600) {
                            return "#75c237";
                        } else if (value >= 1600 && value < 1800) {
                            return "#ffd162";
                        } else {
                            return "#F74B4B";
                        }
                    },
                ],
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
    } else if (chartType == "area") {
        options = {
            series: [],
            chart: {
                type: "area",
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
    } else {
        options = {
            series: [],
            chart: {
                type: "line",
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
            //Defining chart color
            colors: ["#FF9900"],
            //Line Stroke
            stroke: {
                show: true,
                curve: "smooth",
                lineCap: "butt",
                width: 3,
                dashArray: 0,
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
    let newChart = new ApexCharts(DOMElement, options);
    newChart.render();
}
