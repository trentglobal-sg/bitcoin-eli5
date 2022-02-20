window.addEventListener("DOMContentLoaded", async function () {
    topList = await getTopList();
    // priceData = getPriceData("bitcoin")
    // candleData = getCandleData("bitcoin")
    initPage(topList);
});


