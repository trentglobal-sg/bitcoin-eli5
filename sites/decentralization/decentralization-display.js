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

function populateNodeMarkers(map, nodeData) {
    let markerClusterLayer = L.markerClusterGroup();
    for (i of nodeData) {
        L.marker(i).addTo(markerClusterLayer);
    }

    markerClusterLayer.addTo(map);
}
