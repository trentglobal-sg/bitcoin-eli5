//Global Flags
//Global Indicators
let candleSwitchFlag = false;
let logSwitchFlag = false;
let timeIndicator = "max"; //Goes from 0 to 6, 1M, 3M, 6M, 1Y, 3Y, 5Y, MAX

//Main page initilization function
function initPage() {
    initLineChart();
    //Chart Options Dashboard Add Event Listeners
    document.querySelector("#candle-switch").addEventListener("click", function () {
        candleSwitchFlag = !candleSwitchFlag;
        renderChart();
        renderChartAnnotations();
    });
    document.querySelector("#log-switch").addEventListener("click", function () {
        logSwitchFlag = !logSwitchFlag;
        renderChart();
        renderChartAnnotations();
    });
    timeOptionsBtn = document.querySelectorAll(".time-options-btn");
    for (let btn of timeOptionsBtn) {
        btn.addEventListener("click", function () {
            document.querySelector("#time-options .active").classList.remove("active");
            this.classList.add("active");
            timeIndicator = this.value;
            renderChart();
            renderChartAnnotations();
        });
    }
}

//Initialize line chart Skeleton
function initLineChart() {
    var options = {
        series: [],
        chart: {
            type: "area",
            height: 500,
            id: "lineChart", //selector name
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
                fontSize: "3em",
                fontFamily: "Tourney, cursive",
            },
        },
    };

    let lineChart = new ApexCharts(document.querySelector("#lineChart"), options);
    lineChart.render();
}

//Initialize candle chart skeleton
function initCandleChart() {
    var options = {
        series: [],
        chart: {
            type: "candlestick",
            height: 500,
            id: "candleChart", //selector name
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
                fontSize: "3em",
                fontFamily: "Tourney, cursive",
            },
        },
    };

    let candleChart = new ApexCharts(document.querySelector("#candleChart"), options);
    candleChart.render();
}

//hardcoded chart annotations as there are only 2 of them
function renderChartAnnotations() {
    //Line chart or Candle Chart?
    let chartType = "";
    candleSwitchFlag ? (chartType = "candleChart") : (chartType = "lineChart");

    //Logarithmic
    let marker1 = 693;
    let marker2 = 8611;
    if (logSwitchFlag) {
        marker1 = Math.log(marker1);
        marker2 = Math.log(marker2);
    }

    ApexCharts.exec(
        chartType,
        "updateOptions",
        {
            annotations: {
                points: [
                    {
                        x: new Date("01 July 2016").getTime(),
                        y: marker1,
                        marker: {
                            size: 3,
                            fillColor: "#f0f0f0",
                            strokeColor: "#202020",
                            radius: 2,
                        },
                        label: {
                            borderColor: "#202020",
                            offsetY: 0,
                            style: {
                                color: "#202020",
                                background: "#f0f0f0",
                                fontFamily: "Tourney, cursive",
                            },
                            text: "Second Halving",
                        },
                    },
                    {
                        x: new Date("01 May 2020").getTime(),
                        y: marker2,
                        marker: {
                            size: 3,
                            fillColor: "#f0f0f0",
                            strokeColor: "#202020",
                            radius: 2,
                        },
                        label: {
                            borderColor: "#202020",
                            offsetY: 0,
                            style: {
                                color: "#202020",
                                background: "#f0f0f0",
                                fontFamily: "Tourney, cursive",
                            },
                            text: "Third Halving",
                        },
                    },
                ],
            },
        },
        true,
        true
    );
}

//Event Listener for Candlestick Charts Switch
async function renderChart() {
    //check global flag to see if line/candle is showing
    if (candleSwitchFlag) {
        renderCandleChart();
    } else {
        renderLineChart();
    }
}

//Candle Chart Renderer
async function renderCandleChart() {
    //If candlestick chart needs to be shown
    //Goal is to show candlestick chart
    document.querySelector("#lineChart").style.display = "none";
    document.querySelector("#candleChart").style.display = "block";

    let flagTime = false;
    let days = timeIndicator;

    //Special cases as the API do not have 3 year and 5 year data
    if (timeIndicator == 1825 || timeIndicator == 1095) {
        flagTime = true;
        days = "max";
    }

    //Get candlestick data
    data = await getBitcoinCandleData(days);
    processedData = processCandleData(data, logSwitchFlag);

    //Start date of data and end date
    startDate = processedData[0].x;
    startDate = startDate.getUTCDate() + "/" + (startDate.getUTCMonth() + 1) + "/" + startDate.getUTCFullYear();
    endDate = processedData[processedData.length - 1].x;
    endDate = endDate.getUTCDate() + "/" + (endDate.getUTCMonth() + 1) + "/" + endDate.getUTCFullYear();

    //Update chart data
    ApexCharts.exec("candleChart", "updateSeries", [{ data: processedData }]);

    if (logSwitchFlag) {
        //If the chart is logarithmic
        ApexCharts.exec(
            "candleChart",
            "updateOptions",
            {
                title: {
                    text: `Bitcoin Logarithmic Candlestick Chart (From ${startDate} To ${endDate})`,
                },
                tooltip: {
                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        priceString = w.globals.initialSeries[0].data[dataPointIndex].y;
                        dateString = new Date(w.globals.initialSeries[0].data[dataPointIndex].x);
                        dateString = dateString.getUTCDate() + " " + dateString.toLocaleString("default", { month: "short" }) + " " + dateString.getUTCFullYear();
                        return `
                    <div id="tooltip">
                    <div id="tooltip-top">${dateString}</div>
                    <div class="tooltip-bottom-candle">Open: $${Number((Math.E ** priceString[0]).toFixed(0)).toLocaleString()}</div>
                    <div class="tooltip-bottom-candle">High: $${Number((Math.E ** priceString[1]).toFixed(0)).toLocaleString()}</div>
                    <div class="tooltip-bottom-candle">Low: $${Number((Math.E ** priceString[2]).toFixed(0)).toLocaleString()}</div>
                    <div class="tooltip-bottom-candle">Close: $${Number((Math.E ** priceString[3]).toFixed(0)).toLocaleString()}</div>
                    </div>`;
                    },
                },
                yaxis: {
                    type: "numeric",
                    tickAmount: 10,
                    labels: {
                        style: {
                            colors: "#f0f0f0",
                            fontSize: "1rem",
                            fontFamily: "Source Code Pro, monospace",
                        },
                        formatter: function (val) {
                            return "$" + Number((Math.E ** val).toFixed(0)).toLocaleString();
                        },
                        snap: true,
                    },
                },
            },
            true,
            true
        );
    } else {
        //If the chart is not logarithmic
        //Update tooltips and title
        ApexCharts.exec(
            "candleChart",
            "updateOptions",
            {
                title: {
                    text: `Bitcoin Candlestick Chart (From ${startDate} To ${endDate})`,
                },
                tooltip: {
                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        priceString = w.globals.initialSeries[0].data[dataPointIndex].y;
                        dateString = new Date(w.globals.initialSeries[0].data[dataPointIndex].x);
                        dateString = dateString.getUTCDate() + " " + dateString.toLocaleString("default", { month: "short" }) + " " + dateString.getUTCFullYear();
                        return `
                    <div id="tooltip">
                    <div id="tooltip-top">${dateString}</div>
                    <div class="tooltip-bottom-candle">Open: $${Number(priceString[0].toFixed(0)).toLocaleString()}</div>
                    <div class="tooltip-bottom-candle">High: $${Number(priceString[1].toFixed(0)).toLocaleString()}</div>
                    <div class="tooltip-bottom-candle">Low: $${Number(priceString[2].toFixed(0)).toLocaleString()}</div>
                    <div class="tooltip-bottom-candle">Close: $${Number(priceString[3].toFixed(0)).toLocaleString()}</div>
                    </div>`;
                    },
                },
                yaxis: {
                    type: "numeric",
                    tickAmount: 10,
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
    //for the times that aren't present from the api
    if (flagTime) {
        let d = new Date();
        d.setDate(d.getDate() - timeIndicator);
        ApexCharts.exec(
            "candleChart",
            "updateOptions",
            {
                xaxis: {
                    min: d.getTime(),
                },
            },
            true,
            true
        );
    }
}

//Line Chart Renderer
async function renderLineChart() {
    //If line chart needs to be shown
    //Goal is to show line chart
    document.querySelector("#lineChart").style.display = "block";
    document.querySelector("#candleChart").style.display = "none";

    //Get line data
    data = await getBitcoinPriceData(timeIndicator);
    processedData = processLineData(data.prices, logSwitchFlag);

    //Start date of data and end date
    startDate = new Date(processedData[0][0]);
    startDate = startDate.getUTCDate() + "/" + (startDate.getUTCMonth() + 1) + "/" + startDate.getUTCFullYear();
    endDate = new Date(processedData[processedData.length - 1][0]);
    endDate = endDate.getUTCDate() + "/" + (endDate.getUTCMonth() + 1) + "/" + endDate.getUTCFullYear();

    //Update chart data
    ApexCharts.exec("lineChart", "updateSeries", [{ data: processedData }]);

    if (logSwitchFlag) {
        //If the chart is logarithmic
        ApexCharts.exec(
            "lineChart",
            "updateOptions",
            {
                title: {
                    text: `Bitcoin Logarithmic Price Chart (From ${startDate} To ${endDate})`,
                },
                tooltip: {
                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        priceString = "$" + Number((Math.E ** series[seriesIndex][dataPointIndex]).toFixed(0)).toLocaleString();
                        dateString = new Date(w.globals.initialSeries[0].data[dataPointIndex][0]);
                        dateString = dateString.getUTCDate() + " " + dateString.toLocaleString("default", { month: "short" }) + " " + dateString.getUTCFullYear();
                        return `
                    <div id="tooltip">
                    <div id="tooltip-top">${dateString}</div>
                    <div id="tooltip-bottom">${priceString}</div>
                    </div>`;
                    },
                },
                yaxis: {
                    type: "numeric",
                    tickAmount: 10,
                    labels: {
                        style: {
                            colors: "#f0f0f0",
                            fontSize: "1rem",
                            fontFamily: "Source Code Pro, monospace",
                        },
                        formatter: function (val) {
                            return "$" + Number((Math.E ** val).toFixed(0)).toLocaleString();
                        },
                        snap: true,
                    },
                },
            },
            true,
            true
        );
    } else {
        //If the chart is not logarithmic
        ApexCharts.exec(
            "lineChart",
            "updateOptions",
            {
                title: {
                    text: `Bitcoin Price Chart (From ${startDate} To ${endDate})`,
                },
                tooltip: {
                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        priceString = "$" + Number(series[seriesIndex][dataPointIndex].toFixed(0)).toLocaleString();
                        dateString = new Date(w.globals.initialSeries[0].data[dataPointIndex][0]);
                        dateString = dateString.getUTCDate() + " " + dateString.toLocaleString("default", { month: "short" }) + " " + dateString.getUTCFullYear();
                        return `
                    <div id="tooltip">
                    <div id="tooltip-top">${dateString}</div>
                    <div id="tooltip-bottom">${priceString}</div>
                    </div>`;
                    },
                },
                yaxis: {
                    type: "numeric",
                    tickAmount: 10,
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
}
