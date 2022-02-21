//first init of map
function initMap() {
    //Set central point
    let midPoint = [25, 0];
    let zoomLevel = 2;
    let map = L.map("map").setView(midPoint, zoomLevel);

    // setup the tile layers
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "pk.eyJ1IjoidGF5Ym9vbnNpYW5nOTAiLCJhIjoiY2t6a21pOXc2NHJ6NTJ3bzBicThtajRpdCJ9.0REMD3Dtjx2avR8W188LhA", //demo access token
    }).addTo(map);

    //Map Options buttons add event listeners
    addEventListenerIndividualBtn(map);
    addEventListenerCountryBtn(map);
    addEventListenerContinentBtn(map);

    return map;
}

function addEventListenerIndividualBtn(map) {
    document.querySelector("#individual-btn").addEventListener("click", function () {});
}
function addEventListenerCountryBtn(map) {
    document.querySelector("#country-btn").addEventListener("click", function () {});
}
function addEventListenerContinentBtn(map) {
    document.querySelector("#continent-btn").addEventListener("click", function () {});
}

//Populate the map with markers, individual -> city -> country -> continent

//expected logic of the function
//all nodes lat long -> city layer
//all city layers -> country layer
//all country layer -> continent layer
function populateNodeMarkers(map, sortedData) {
    continentLayerArray = [];
    for (let continent in sortedData) {
        let continentLayer = L.markerClusterGroup();
        let countryLayerArray = [];
        for (let country in sortedData[continent]) {
            let countryLayer = L.markerClusterGroup();
            let cityLayerArray = [];
            for (let city in sortedData[continent][country]) {
                let cityMarkerArray = [];
                let cityLayer = L.markerClusterGroup();
                for (let nodes in sortedData[continent][country][city]) {
                    nodeObject = sortedData[continent][country][city][nodes];
                    latlong = [nodeObject[8], nodeObject[9]];
                    nodeMarker = L.marker(latlong);
                    cityMarkerArray.push(nodeMarker);
                }
                cityLayer.addLayers(cityMarkerArray);
                cityLayerArray.push(cityLayer);
            }
            for (let cityLayer of cityLayerArray) {
                countryLayer.addLayers(cityLayer);
            }
            countryLayerArray.push(countryLayer);
        }
        for (let countryLayer of countryLayerArray) {
            continentLayer.addLayers(countryLayer);
        }
        continentLayerArray.push(continentLayer);
    }
    for (let continentLayer of continentLayerArray) {
        continentLayer.addTo(map);
    }
}

function defaultPopulateNodeMarkers(map, sortedData) {
    for (let key in sortedData) {
        let continentLayer = L.markerClusterGroup(); //Create a layer for continents
        let markerArray = [];
        for (let latlong of sortedData[key]) {
            nodeMarker = L.marker(latlong);
            markerArray.push(nodeMarker);
        }
        continentLayer.addLayers(markerArray);
        continentLayer.addTo(map);
    }
}
