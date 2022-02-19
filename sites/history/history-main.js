window.addEventListener("DOMContentLoaded", async function () {
    topList = await getTopList();
    // priceData = getPriceData("bitcoin")
    // candleData = getCandleData("bitcoin")
    initPage(topList);
});

// // 1. We define the chart options.
// const options = {
//     chart: {
//         type: "line",
//         height: "100%",
//     },
//     // each series represents one set of data
//     series: [
//         {
//             name: "sightings",
//             data: [10, 13, 15, 22, 34, 23, 55, 78, 44],
//         },
//     ],
//     // what is are the labels along the x-axis (horizontal line)
//     xaxis: {
//         categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct"],
//     },
// };

// // create the chart
// const priceChart = new ApexCharts(document.querySelector("#price-chart"), options);

// // render the chart
// priceChart.render();
