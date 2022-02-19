function populateListOfCryptos(list) {
    listOfCryptos = document.querySelector("#list-of-cryptos");

    //populate the dropbar with name, logo, and event listener for each option
    for (let item of list) {
        let li = document.createElement("li");
        let img = document.createElement("img");
        let a = document.createElement("a");
        a.className = "dropdown-item";
        a.innerText = item.name;
        a.addEventListener("click", function () {
            console.log("A Call to render Candle Chart:", item.id);
            renderCandle(item.id, item.name, 7);
        });
        img.src = item.image;
        a.prepend(img);
        li.append(a);
        listOfCryptos.append(li);
    }
}

//parent function of rendering candlestick charts with options tab
function renderCandle(id, coinName, days) {
    renderCandleOptions(id, coinName);
    renderCandleChart(id, coinName, days);
}

//apex charts rendering and data retrieval
async function renderCandleChart(id, coinName, days) {
    //Render the show volume button
    //Only render for 1, 14, 30 and Max because the option isn't available for the rest
    if ([1, 14, 30, "Max"].includes(days)) {
        console.log("Rendering Volume Button");
        renderVolumeButton(id, days);
    } else {
        document.querySelector("#candle-chart-show-volume").innerHTML = "";
    }

    console.log("Rendering Candle Chart");
    //Process Candle Chart Data (O,H,L,C)
    data = await getCandleData(id, days); //in data.js
    processedData = processCandleData(data);
    startDate = processedData[0].x;
    endDate = processedData.slice(-1)[0].x;

    //Render Candle Chart
    var options = {
        series: [],
        chart: {
            type: "candlestick",
            height: 300,
        },
        title: {
            text: `${coinName} Chart (From: ${startDate.toLocaleString()} To: ${endDate.toLocaleString()})`,
            align: "left",
        },
        xaxis: {
            type: "datetime",
        },
        yaxis: {
            tooltip: {
                enabled: true,
            },
        },
    };
    let candleChart = new ApexCharts(document.querySelector("#candle-chart"), options);
    candleChart.render();
    candleChart.updateSeries([{ data: processedData }]);

    console.log("chartrendered:", id);
}

//rendering chart options on top of apex charts
function renderCandleOptions(id, coinName) {
    console.log("Rendering Candle Options");
    //Populate Chart Options
    options = document.querySelector("#candle-chart-options");
    options.innerHTML = `<span class="dropdown" id="candle-chart-dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">Days</button>
                            <ul class="dropdown-menu" id="list-of-days">                                                     
                            </ul>
                        </span>
                        <span id="candle-chart-show-volume">
                        </span>
                        <span id="candle-chart-close">
                            <button type="button" class="btn btn-secondary">Close</button>
                        </span>`;

    //Render the dropdown for the number of days option
    listOfDays = options.querySelector("#list-of-days");
    dayOptions = [1, 7, 14, 30, 90, 180, 365, "Max"];
    for (let i of dayOptions) {
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.className = "dropdown-item";
        a.innerText = i + " days";
        //adding event listener to each button in the chart option
        a.addEventListener("click", function () {
            renderCandleChart(id, coinName, i);
        });
        li.append(a);
        listOfDays.append(li);
    }

    //Render the close button
    console.log("Rendering close button");
    //adding event listener to close button
    options.querySelector("#candle-chart-close").addEventListener("click", function () {
        console.log("Closing all candle charts");
        document.querySelector("#candle").innerHTML = `<div id="candle">
                <div id="candle-chart-options"></div>
                <div id="candle-chart"></div>
            </div>`;
    });
    console.log("Rendering show volume button");
}

//Render the show volume button
function renderVolumeButton(id, days) {
    //Only render for 1, 14, 30 and Max because the option isn't available for the rest
    document.querySelector("#candle-chart-show-volume").innerHTML = `
                                <button type="button" class="btn btn-secondary">
                                    Show Volume
                                </button>`;

    //adding event listener to show volume button
    document.querySelector("#candle-chart-show-volume").addEventListener("click", function () {
        console.log("Showing Volume");
        renderVolume(id, days);
    });
}

function renderVolume(id, days) {
    //get volume data
}
