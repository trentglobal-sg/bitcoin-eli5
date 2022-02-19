//global flags
//Is volume being displayed currently?
let volumeDisplayFlag = false;
//Is the chart freshly generated (aka clicking on a new coin)? (Show volume logic)
let newCoinFlag = true;

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
            //logic when a new coin is clicked
            console.log("Rendering New Coin Candle Chart:", item.id);
            renderCandleOptions(id, coinName);
            renderCandleChart(id, coinName, 7);
            newCoinFlag = true; //new coin is called
            volumeDisplayFlag = false; //Volume is not displayed on new chart
        });
        img.src = item.image;
        a.prepend(img);
        li.append(a);
        listOfCryptos.append(li);
    }
}

//apex charts rendering and data retrieval
async function renderCandleChart(id, coinName, days) {

    //flag: does a volume chart exist for this selected days?
    //Only for 1, 14, 30 and Max
    let volumeSuitabilityFlag = false;
    if ([1, 14, 30, "Max"].includes(days)) {
        volumeSuitabilityFlag = true;
    }

    //if volume is not opted to be displayed or if volume is not suitable to be displayed
    //remove the volume chart
    if (!volumeDisplayFlag || !volumeSuitabilityFlag) {
        document.querySelector("#volume-chart").innerHTML = "";
    }
    //Render the show volume button
    //Only render for 1, 14, 30 and Max because the option isn't available for the rest
    if (volumeSuitabilityFlag) {
        console.log("Rendering Volume Button");
        //if a new coin has been choosen (without this flag (indicates new coin choosen), there will be multiple add event listeners added to Add volume button)
        if (newCoinFlag) {
            renderVolumeButton(id, days);
        } else if (volumeDisplayFlag) {
            //if a new coin wasn't choosen, check if the volume was previously on
            //if volume was displayed even before switching days
            renderVolume(id, days);
        }
    } else {
        //don't display show volume at all
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
            id: "candleChart",
            group: "charts",
        },
        title: {
            text: `${coinName} Price Chart (From: ${startDate.toLocaleString()} To: ${endDate.toLocaleString()})`,
            align: "left",
        },
        xaxis: {
            type: "datetime",
        },
        yaxis: {
            tooltip: {
                enabled: true,
            },
            labels: {
                minWidth: 40,
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
                            <button type="button" class="btn btn-secondary">Close Charts</button>
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
            //logic when new day is selected, render a new candle chart
            renderCandleChart(id, coinName, i == "Max" ? "max" : i);
            newCoinFlag = false;
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
                <div id="volume-chart"></div>
            </div>`;
    });
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
        //if volume isn't being shown...
        if (!volumeDisplayFlag) {
            console.log("Showing Volume");
            renderVolume(id, days);
            //change to Hide Volume Button
            document.querySelector("#candle-chart-show-volume>button").innerText = "Hide Volume"; //switch button
            volumeDisplayFlag = true; //set flag
        } else {
            //if volume is shown currently
            console.log("Hiding Volume");
            document.querySelector("#candle-chart-show-volume>button").innerText = "Show Volume"; //switch button
            document.querySelector("#volume-chart").innerHTML = ""; //clear volume chart
            volumeDisplayFlag = false; //set flag
        }
    });
    newCoinFlag = false;
}

async function renderVolume(id, days) {
    //get volume data
    data = await getPriceData(id, days);
    processedData = processVolumeData(data);

    //Render Volume Chart
    var options = {
        series: [],
        chart: {
            type: "area",
            height: 200,
            id: "volumeChart",
            group: "charts",
        },
        title: {
            text: `Volume Chart`,
            align: "left",
        },
        xaxis: {
            type: "datetime",
        },
        yaxis: {
            tooltip: {
                enabled: true,
            },
            labels: {
                minWidth: 40,
            },
        },
    };
    let volumeChart = new ApexCharts(document.querySelector("#volume-chart"), options);
    volumeChart.render();
    volumeChart.updateSeries([{ data: processedData }]);
}
