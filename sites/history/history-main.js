window.addEventListener("DOMContentLoaded", async function () {
    initPage();
    renderLineChart("max");
    renderChartAnnotations();
    initCandleChart(); //Call init candle chart after all that to reduce lag

});


