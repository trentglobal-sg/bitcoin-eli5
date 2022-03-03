function initPage() {
    initLineChart();
    initInfoBoard();
}

//Initialize line chart Skeleton
function initLineChart() {
    var options = {
        series: [],
        chart: {
            type: "line",
            height: 500,
            id: "lineChart", //selector name
            group: "charts",
            toolbar: {
                show: true,
                tools: {
                    download: false,
                    selection: false,
                    zoom: "<div></div>",
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: '<button class="btn btn-outline-light">Reset Zoom</button>',
                },
            },
            zoom: {
                enabled: true,
                resetIcon: {
                    offsetX: 1000,
                    offsetY: 0,
                    fillColor: "#FF9900",
                    strokeColor: "#FF9900",
                },
                selection: {
                    background: "#FF9900",
                    border: "#FF9900",
                },
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
            width: 4,
            dashArray: 0,
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

//Line Chart Renderer
function renderLineChart() {
    //Get line data
    processedData = bitcoinSupplyData();

    //Start date of data and end date
    startDate = new Date(processedData[0][0]);
    startDate = startDate.getUTCDate() + "/" + (startDate.getUTCMonth() + 1) + "/" + startDate.getUTCFullYear();
    endDate = new Date(processedData[processedData.length - 1][0]);
    endDate = endDate.getUTCDate() + "/" + (endDate.getUTCMonth() + 1) + "/" + endDate.getUTCFullYear();

    //Update chart data
    ApexCharts.exec("lineChart", "updateSeries", [{ data: processedData }]);

    ApexCharts.exec(
        "lineChart",
        "updateOptions",
        {
            title: {
                text: `Bitcoin Supply Chart (From ${startDate} To ${endDate})`,
            },
            tooltip: {
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    priceString = Number(series[seriesIndex][dataPointIndex].toFixed(0));
                    dateString = new Date(w.globals.initialSeries[0].data[dataPointIndex][0]);
                    dateString = dateString.getUTCDate() + " " + dateString.toLocaleString("default", { month: "short" }) + " " + dateString.getUTCFullYear();
                    return `
                    <div id="tooltip">
                    <div id="tooltip-top">${dateString}</div>
                    <div id="tooltip-bottom">Supply: ${priceString.toLocaleString()}</div>
                    <div id="tooltip-bottom">% Mined: ${(priceString / 210000).toFixed(2)}%</div>
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
                        return Number(val.toFixed(0)).toLocaleString();
                    },
                    snap: true,
                },
            },
        },
        true,
        true
    );
}

//Chart Annotations
function renderChartAnnotations() {}

//Informational Dashboard
async function initInfoBoard() {
    data = await bitcoinStatsData();
    document.querySelector("#card-2>p").innerText = Number(data["minutes_between_blocks"]).toFixed(2) + " mins";
    document.querySelector("#card-4>p").innerText = data["n_blocks_total"].toLocaleString();
    document.querySelector("#card-5>p").innerText = 50 / 2 ** Math.floor(data["n_blocks_total"] / 210000) + " BTC";
    document.querySelector("#card-6>p").innerText = "$" + Number(((50 / 2 ** Math.floor(data["n_blocks_total"] / 210000)) * data["market_price_usd"]).toFixed(0)).toLocaleString();
    document.querySelector("#card-7>p").innerText = data["difficulty"].toLocaleString();
    //Antminer TH is 100 Th/s for consumption of 3050W
    document.querySelector("#card-8>p").innerText = (((data["hash_rate"] * 0.1) / (6000000 * 5)) * 3050).toLocaleString() + " KwH";
    //Cost price of electricity $0.1042 per KwH
    document.querySelector("#card-9>p").innerText = "$" + Number((((data["hash_rate"] * 0.1) / (6000000 * 5)) * 3050 * 0.1042).toFixed(0)).toLocaleString();
    document.querySelector("#card-10>p").innerText = "$" + data["market_price_usd"].toLocaleString();
    document.querySelector("#card-11>p").innerText = ((data["n_blocks_total"] - 210000 * 3) * 6.25 + 12.5 * 210000 + 25 * 210000 + 50 * 210000).toLocaleString() + " BTC";
}
