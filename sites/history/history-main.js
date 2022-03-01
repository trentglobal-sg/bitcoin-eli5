window.addEventListener("DOMContentLoaded", async function () {
    initPage();
    data = await getBitcoinPriceData();
    renderChartPrice(data.prices);
    renderChartPriceAnnotations();

});


