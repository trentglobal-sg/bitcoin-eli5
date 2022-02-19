//global flags
//Is volume being displayed currently?
let volumeDisplayFlag = false;

//Main page initilization function
function initPage(list) {
    initCandleChart();
    initVolumeChart();
    //Populate the list of dropdown with coin names
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
            //render candle chart, default 7 day chart
            renderCandleChart(item.id, item.name, 7);
            //render days button
            renderAndAddEventListenerDaysButton(item.id, item.name);
            //render close button
            renderCloseButton();
            volumeDisplayFlag = false; //volume is not displayed on new chart by default
        });
        img.src = item.image;
        a.prepend(img);
        li.append(a);
        listOfCryptos.append(li);
    }

    addEventListenerCloseButton();
}

//initialize candle chart skeleton
function initCandleChart() {
    var options = {
        series: [],
        chart: {
            type: "candlestick",
            height: 300,
            id: "candleChart",
            group: "charts",
        },
        title: {
            text: "hi",
            //`${coinName} Price Chart (From: ${startDate.toLocaleString()} To: ${endDate.toLocaleString()})`,
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
}
//initialize volume chart skeleton
function initVolumeChart() {
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
}

//apex charts rendering and data retrieval
//this function also needs to add event listeners to show volume
async function renderCandleChart(id, coinName, days) {
    //flag: does a volume chart exist for the selected day?
    //Only for 1, 14, 30 and Max
    let volumeSuitabilityFlag = false;
    if ([1, 14, 30, "Max"].includes(days)) {
        volumeSuitabilityFlag = true;
    }

    //if volume is not suitable to be displayed
    if (!volumeSuitabilityFlag) {
        document.querySelector("#volume-chart").style.display = "none";
        volumeDisplayFlag = false;
        document.querySelector("#candle-chart-show-volume").innerHTML = "";
    } else {
        //since volume is suitable to be shown
        if (volumeDisplayFlag) {
            //if volume was already showing
            removeAndAddEventListenerVolumeButton(id, days);
            renderVolume(id, days);
        } else {
            // if volume isn't showning
            removeAndAddEventListenerVolumeButton(id, days);
        }
    }

    console.log("Rendering Candle Chart");
    //Processing candle chart data (O,H,L,C)
    data = await getCandleData(id, days); //in data.js
    processedData = processCandleData(data);
    startDate = processedData[0].x;
    endDate = processedData.slice(-1)[0].x;

    //update candle chart series and options with a selector
    ApexCharts.exec("candleChart", "updateSeries", [{ data: processedData }]);
    ApexCharts.exec(
        "candleChart",
        "updateOptions",
        {
            title: {
                text: `${coinName} Price Chart (From: ${startDate.toLocaleString()} To: ${endDate.toLocaleString()})`,
            },
        },
        true,
        true
    );
    document.querySelector("#candle-chart").style.display = "block";
}

//rendering + add event listeners to days dropdown (will become visible)
function renderAndAddEventListenerDaysButton(id, coinName) {
    listOfDays = document.querySelector("#list-of-days");
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
        });
        li.append(a);
        listOfDays.append(li);
    }
    //Make days dropdown visible
    document.querySelector("#candle-chart-days").style.display = "inline-block";
}

//rendering close button (will become visible)
function renderCloseButton() {
    document.querySelector("#candle-chart-close").style.display = "inline-block";
}

//add event listeners to close button
function addEventListenerCloseButton() {
    //Add event listener for close button (applied for all situations)
    document.querySelector("#candle-chart-close").addEventListener("click", function () {
        //close the charts
        document.querySelector("#candle-chart").style.display = "none";
        document.querySelector("#volume-chart").style.display = "none";
        //close the buttons
        document.querySelector("#candle-chart-days").style.display = "none";
        document.querySelector("#candle-chart-close").style.display = "none";
        //clear all dropdowns from days
        document.querySelector("#list-of-days").innerHTML = "";
        //clear the event listener button from add volume
        document.querySelector("#candle-chart-show-volume").innerHTML = "";
        //set flags
        volumeDisplayFlag = false;
    });
}

function removeAndAddEventListenerVolumeButton(id, days) {
    console.log("Removing and re-adding Volume Button");
    //remove old button
    document.querySelector("#candle-chart-show-volume").innerHTML = "";

    //create new button
    volumeButton = document.createElement("button");
    volumeButton.setAttribute("type", "button");
    volumeButton.setAttribute("class", "btn btn-secondary");
    if (volumeDisplayFlag) {
        volumeButton.innerText = "Hide Volume Chart";
    } else {
        volumeButton.innerText = "Show Volume Chart";
    }
    volumeButton.addEventListener("click", function () {
        //if volume isn't being shown...
        if (!volumeDisplayFlag) {
            console.log("Showing Volume");
            renderVolume(id, days); //show volume chart
            //change to Hide Volume Button
            document.querySelector("#candle-chart-show-volume>button").innerText = "Hide Volume"; //switch button
            volumeDisplayFlag = true; //set flag
        } else {
            //if volume is shown currently
            console.log("Hiding Volume");
            document.querySelector("#volume-chart").style.display = "none"; //hide volume chart
            //change to Show Volume Button
            document.querySelector("#candle-chart-show-volume>button").innerText = "Show Volume"; //switch button
            volumeDisplayFlag = false; //set flag
        }
    });
    document.querySelector("#candle-chart-show-volume").appendChild(volumeButton);
}

async function renderVolume(id, days) {
    //get volume data
    data = await getPriceData(id, days);
    processedData = processVolumeData(data);

    //Render Volume Chart
    ApexCharts.exec("volumeChart", "updateSeries", [{ data: processedData }]);
    document.querySelector("#volume-chart").style.display = "block";
}
