//first init of map
function initMap() {
    //Set central point of the world
    let midPoint = [36, 0];
    let zoomLevel = 2; //for a good world map view
    let map = L.map("map", {
        zoomSnap: 0.25, //zoom snap levels
        zoomDelta: 0.25, //+- button speed
        wheelPxPerZoomLevel: 150, //mouse scroll speed
    }).setView(midPoint, zoomLevel);

    // setup the tile layers
    L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}", {
        minZoom: 2,
        maxZoom: 16,
        subdomains: "abcd",
        ext: "jpg",
        accessToken: "pk.eyJ1IjoidGF5Ym9vbnNpYW5nOTAiLCJhIjoiY2t6a21pOXc2NHJ6NTJ3bzBicThtajRpdCJ9.0REMD3Dtjx2avR8W188LhA", //demo access token
    }).addTo(map);

    return map;
}

//Populate the map with markers, individual -> city -> country -> continent
function populateNodeMarkers(map, continentNodes, countryNodes, cityNodes, individualNodes) {
    individualNodesLayerGroup = individualNodeRender(individualNodes);
    cityNodesLayerGroup = cityNodeRender(cityNodes);
    countryNodesLayerGroup = countryNodeRender(countryNodes);
    continentNodesLayerGroup = continentNodeRender(continentNodes);

    //on initial zoom, show continent markers
    continentNodesLayerGroup.addTo(map);

    map.on("zoomend", function () {
        zoomLevel = map.getZoom();
        document.querySelector("#map-title").innerHTML = zoomLevel;
        if (zoomLevel < 4) {
            continentNodesLayerGroup.addTo(map);
            countryNodesLayerGroup.remove();
        } else if ((zoomLevel >= 4) & (zoomLevel < 6)) {
            countryNodesLayerGroup.addTo(map);
            continentNodesLayerGroup.remove();
            cityNodesLayerGroup.remove();
        } else if ((zoomLevel >= 6) & (zoomLevel < 7)) {
            cityNodesLayerGroup.addTo(map);
            countryNodesLayerGroup.remove();
            individualNodesLayerGroup.remove();
        } else {
            individualNodesLayerGroup.addTo(map);
            cityNodesLayerGroup.remove();
        }
    });
}

//group all nodes into a layer group
function individualNodeRender(individualNodes) {
    //individual nodes grouping into a MCG (for no lag maps at a zoomed level)
    individualNodesLayerGroup = L.markerClusterGroup();
    for (let key in individualNodes.nodes) {
        //create Marker
        individualNodeMarker = L.marker([individualNodes.nodes[key][8], individualNodes.nodes[key][9]]);
        let d = new Date(Number(individualNodes.nodes[key][2])*1000);
        //Popup Binding
        individualNodeMarker.bindPopup(`
        <table class="table table-striped">
            <tbody>
                <tr>
                    <th>IP Address </th>
                    <td>${key} <td>
                </tr>
                <tr>
                    <th>Protocol Version </th>
                    <td>${individualNodes.nodes[key][0]} <td>
                </tr>
                <tr>
                    <th>Live since </th>
                    <td>${d} <td>
                </tr>
                <tr>
                    <th>Block Height </th>
                    <td>${individualNodes.nodes[key][4]} <td>
                </tr>
                <tr>
                    <th>ISP Name </th>
                    <td>${individualNodes.nodes[key][12]} <td>
                </tr>
            </tbody>
        </table>`);
        individualNodeMarker.addTo(individualNodesLayerGroup);
    }

    return individualNodesLayerGroup;
}

//group all nodes into a layer group
function cityNodeRender(cityNodes) {
    //city node grouping into LayerGroup
    cityNodesLayerGroup = L.layerGroup();
    for (let key in cityNodes) {
        //Let city node count decide font size
        cityNodeCount = cityNodes[key].count;
        fontSize = Number(cityNodeCount) / 2000 + 1.2;
        //Create custom icon for every city
        let myIcon = new L.divIcon({
            className: "my-div-icon",
            html: `
            <div class="marker" style="font-size:${fontSize}em">
                <div class="markerCounter"><i class="fa-brands fa-hashnode"></i> ${cityNodeCount}</div>
                <div class="markerText">${key}</div>
            </div>`,
        });
        //Create Marker
        cityNodeMarker = L.marker(cityNodes[key].averageLocation, { icon: myIcon });
        //Popup Binding
        cityNodeMarker.bindPopup(`
        <table class="table table-striped">
            <tbody>
                <tr>
                    <th>City </th>
                    <td>${key} <td>
                </tr>
                <tr>
                    <th>Node Count </th>
                    <td>${cityNodes[key].count} <td>
                </tr>
            </tbody>
        </table>`);

        cityNodeMarker.addTo(cityNodesLayerGroup);
    }

    return cityNodesLayerGroup;
}

//group all nodes into a layer group
function countryNodeRender(countryNodes) {
    //country node grouping into LayerGroup
    countryNodesLayerGroup = L.layerGroup();
    for (let key in countryNodes) {
        //Let country node count decide font size
        countryNodeCount = countryNodes[key].count;
        fontSize = Number(countryNodeCount) / 2000 + 1.2;
        //Create custom icon for every country
        let myIcon = new L.divIcon({
            className: "my-div-icon",
            html: `
            <div class="marker" style="font-size:${fontSize}em">
                <div class="markerCounter"><i class="fa-brands fa-hashnode"></i> ${countryNodeCount}</div>
                <div class="markerText">${key}</div>
            </div>`,
        });
        //Create Marker
        countryNodeMarker = L.marker(countryNodes[key].averageLocation, { icon: myIcon });
        //Popup Binding
        countryNodeMarker.bindPopup(`
        <table class="table table-striped">
            <tbody>
                <tr>
                    <th>Country </th>
                    <td>${key} <td>
                </tr>
                <tr>
                    <th>Node Count </th>
                    <td>${countryNodes[key].count} <td>
                </tr>
            </tbody>
        </table>`);

        countryNodeMarker.addTo(countryNodesLayerGroup);
    }

    return countryNodesLayerGroup;
}

//group all nodes into a layer group
function continentNodeRender(continentNodes) {
    //continent node grouping into LayerGroup
    continentNodesLayerGroup = L.layerGroup();
    for (let key in continentNodes) {
        //Let continent node count decide font size
        continentNodeCount = continentNodes[key].count;
        fontSize = Number(continentNodeCount) / 7000 + 1.5;
        //Create custom icon for every continent
        let myIcon = new L.divIcon({
            className: "my-div-icon",
            html: `
            <div class="marker" style="font-size:${fontSize}em">
                <div class="markerCounter"><i class="fa-brands fa-hashnode"></i> ${continentNodeCount}</div>
                <div class="markerText">${key}</div>
            </div>`,
        });
        //Create Marker
        continentNodeMarker = L.marker(continentNodes[key].averageLocation, { icon: myIcon });
        //Popup Binding
        continentNodeMarker.bindPopup(`
        <table class="table table-striped">
            <tbody>
                <tr>
                    <th>Continent </th>
                    <td>${key} <td>
                </tr>
                <tr>
                    <th>Node Count </th>
                    <td>${continentNodes[key].count} <td>
                </tr>
            </tbody>
        </table>`);

        continentNodeMarker.addTo(continentNodesLayerGroup);
    }

    return continentNodesLayerGroup;
}
