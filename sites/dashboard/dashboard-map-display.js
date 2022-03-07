let map;

//first init of map
function initMap() {
    //Set central point of the world
    let midPoint = [0, 35];
    let zoomLevel = 1.75; //for a good world map view
    map = L.map("flexi-1", {
        zoomSnap: 0.25, //zoom snap levels
        zoomDelta: 0.25, //+- button speed
        wheelPxPerZoomLevel: 110, //mouse scroll speed
    }).setView(midPoint, zoomLevel);

    // setup the tile layers
    L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png", {
        minZoom: 1,
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
        if (zoomLevel < 3.5) {
            continentNodesLayerGroup.addTo(map);
            countryNodesLayerGroup.remove();
            cityNodesLayerGroup.remove();
            individualNodesLayerGroup.remove();
        } else if ((zoomLevel >= 3.5) & (zoomLevel < 4)) {
            countryNodesLayerGroup.addTo(map);
            continentNodesLayerGroup.remove();
            cityNodesLayerGroup.remove();
            individualNodesLayerGroup.remove();
        } else if ((zoomLevel >= 4) & (zoomLevel < 5.75)) {
            cityNodesLayerGroup.addTo(map);
            countryNodesLayerGroup.remove();
            continentNodesLayerGroup.remove();
            individualNodesLayerGroup.remove();
        } else {
            individualNodesLayerGroup.addTo(map);
            cityNodesLayerGroup.remove();
            countryNodesLayerGroup.remove();
            continentNodesLayerGroup.remove();
        }
    });
}

//group all nodes into a layer group
function individualNodeRender(individualNodes) {
    //individual nodes grouping into a MCG (for no lag maps at a zoomed level)
    individualNodesLayerGroup = L.markerClusterGroup();
    for (let key in individualNodes.nodes) {
        //Custom Icon
        let myIcon = new L.divIcon({
            className: "my-div-icon",
            html: `<i class="fa-solid fa-circle individual-circle"></i>`,
        });
        //create Marker
        individualNodeMarker = L.marker([individualNodes.nodes[key][8], individualNodes.nodes[key][9]], { icon: myIcon });
        let d = new Date(Number(individualNodes.nodes[key][2]) * 1000);
        //Popup Binding
        individualNodeMarker.bindPopup(`
        <table class="table table-striped">
            <tbody>
                <tr>
                    <th>IP Address &nbsp&nbsp</th>
                    <td>${key} <td>
                </tr>
                <tr>
                    <th>Protocol Version &nbsp&nbsp</th>
                    <td>${individualNodes.nodes[key][0]} <td>
                </tr>
                <tr>
                    <th>Live since &nbsp&nbsp</th>
                    <td>${d} <td>
                </tr>
                <tr>
                    <th>Block Height &nbsp&nbsp</th>
                    <td>${individualNodes.nodes[key][4]} <td>
                </tr>
                <tr>
                    <th>ISP Name &nbsp&nbsp</th>
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
            <div class="marker">
                <div class="marker-header">
                    <i class="fa-solid fa-circle"></i>
                    <div class="marker-counter">${cityNodeCount}</div>
                </div>
                <div class="marker-text">${key}</div>
            </div>`,
        });
        //Create Marker
        cityNodeMarker = L.marker(cityNodes[key].averageLocation, { icon: myIcon });
        //Popup Binding
        cityNodeMarker.bindPopup(`
        <table class="table table-striped">
            <tbody>
                <tr>
                    <th>City &nbsp&nbsp</th>
                    <td>${key} <td>
                </tr>
                <tr>
                    <th>Node Count &nbsp&nbsp</th>
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
            <div class="marker">
                <div class="marker-header">
                    <i class="fa-solid fa-circle"></i>
                    <div class="marker-counter">${countryNodeCount}</div>
                </div>
                <div class="marker-text">${key}</div>
            </div>`,
        });
        //Create Marker
        countryNodeMarker = L.marker(countryNodes[key].averageLocation, { icon: myIcon });
        //Popup Binding
        countryNodeMarker.bindPopup(`
        <table class="table table-striped">
            <tbody>
                <tr>
                    <th>Country &nbsp&nbsp</th>
                    <td>${key} <td>
                </tr>
                <tr>
                    <th>Node Count &nbsp&nbsp</th>
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
        fontSize = Number(continentNodeCount) / 10000 + 1;
        //Create custom icon for every continent
        let myIcon = new L.divIcon({
            className: "my-div-icon",
            html: `
            <div class="marker">
                <div class="marker-header">
                    <i class="fa-solid fa-circle"></i>
                    <div class="marker-counter">${continentNodeCount}</div>
                </div>
                <div class="marker-text">${key}</div>
            </div>`,
        });
        //Create Marker
        continentNodeMarker = L.marker(continentNodes[key].averageLocation, { icon: myIcon });

        //Popup Binding
        continentNodeMarker.bindPopup(`
        <table class="table table-striped">
            <tbody>
                <tr>
                    <th>Continent &nbsp&nbsp</th>
                    <td>${key} <td>
                </tr>
                <tr>
                    <th>Node Count &nbsp&nbsp</th>
                    <td>${continentNodes[key].count} <td>
                </tr>
            </tbody>
        </table>`);

        continentNodeMarker.addTo(continentNodesLayerGroup);
    }

    return continentNodesLayerGroup;
}
