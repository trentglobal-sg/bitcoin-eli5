//Global Flags


//Main page initilization function
function initPage() {
    initChartPrice();
}

//initialize chart skeleton
function initChartPrice() {
    var options = {
        series: [],
        chart: {
            type: "area",
            height: 500,
            id: "chartPrice", //selector name
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

    let chartPrice = new ApexCharts(document.querySelector("#chartPrice"), options);
    chartPrice.render();
}

//renders a apex line chart
function renderChartPrice(processedData) {
    startDate = new Date(processedData[0][0]);
    startDate = startDate.getUTCDate() + "/" + (startDate.getUTCMonth() + 1) + "/" + startDate.getUTCFullYear();
    endDate = new Date(processedData[processedData.length - 1][0]);
    endDate = endDate.getUTCDate() + "/" + (endDate.getUTCMonth() + 1) + "/" + endDate.getUTCFullYear();
    ApexCharts.exec("chartPrice", "updateSeries", [{ data: processedData }]);
    ApexCharts.exec(
        "chartPrice",
        "updateOptions",
        {
            title: {
                text: `Bitcoin Price Chart (From ${startDate} To ${endDate})`,
            },
        },
        true,
        true
    );
    ApexCharts.exec(
        "chartPrice",
        "updateOptions",
        {
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
        },
        true,
        true
    );
}

//hardcoded chart annotations as there are only 2 of them
function renderChartPriceAnnotations() {
    ApexCharts.exec(
        "chartPrice",
        "updateOptions",
        {
            annotations: {
                points: [
                    {
                        x: new Date("01 July 2016").getTime(),
                        y: 693,
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
                        y: 8611,
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
