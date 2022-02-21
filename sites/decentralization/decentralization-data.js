const BITNODES_API_URL = "https://bitnodes.io/api/v1";

////////////////////////////Data Retrieval/////////////////////////////////////
//get current total nodes in network, blockheight
async function getTotalNoOfNodes() {
    response = await axios.get(`${BITNODES_API_URL}/snapshots`, {
        params: { page: 1, limit: 1 },
    });
    return response.data;
}

//get list of nodes in the network
async function getNodeList() {
    response = await axios.get(`${BITNODES_API_URL}/snapshots/latest`, {
        params: {}, //remove to get full field: "coordinates"
    });
    return response.data;
}

//get a list of only nodes with coordinates in the network
async function getNodeMapList() {
    response = await axios.get(`${BITNODES_API_URL}/snapshots/latest`, {
        params: { field: "coordinates" },
    });
    return response.data;
}

////////////////////////////Data Cleaners/////////////////////////////////////

//remove all TOR addresses from nodeData, outputs total onion address
//ALSO split the continent name into two
//And remove nodes with no city
//object has been cleaned in-situ
function cleanNodeData(nodeData) {
    addressCount = 0;
    for (let key in nodeData.nodes) {
        if (nodeData.nodes[key][10] == null || nodeData.nodes[key][7] == null) {
            //Delete if it is an onion node
            delete nodeData.nodes[key];
            addressCount++;
        } else {
            nodeData.nodes[key][10] = nodeData.nodes[key][10].split("/");
        }
    }
    return addressCount;
}

//Sort the node data into a big object of objects with continents as keys
//each individual continent object contains objects with countries as keys
//and each individual country object contains objects with cities as keys
//and each individual city object contains lat long coords in readable format
function sortNodeData(nodeData) {}

//output an array with [lat, longs]
function getIndividualNodeLatLong(nodeData) {
    let latLong = [];
    for (let key in nodeData.nodes) {
        console.log(key);
        console.log(nodeData.nodes[key][8]);
        latLong.push([nodeData.nodes[key][8], nodeData.nodes[key][9]]);
    }

    return latLong;
}

//group nodes by their city
//as an object of arrays with city as keys
function getCityNodeLatLong(nodeData) {
    let latLong = {};
    let cities = [];
    for (let key in nodeData.nodes) {
        city = nodeData.nodes[key][10][1];
        if (!cities.includes(city)) {
            //if city is new
            cities.push(city);
            latLong[city] = []; //create new key in object, array
        }
        latLong[city].push([nodeData.nodes[key][8], nodeData.nodes[key][9]]);
    }

    return latLong;
}

//group nodes by their country code, outputs country latlong, together with number
//as an object of arrays with country code as keys
function getCountryNodeLatLong(nodeData) {
    let latLong = {};
    let countries= [];
    for (let key in nodeData.nodes) {
        country = nodeData.nodes[key][7];
        if (!countries.includes(country)) {
            //if country is new
            countries.push(country);
            latLong[country] = []; //create new key in object, array
        }
        latLong[country].push([nodeData.nodes[key][8], nodeData.nodes[key][9]]);
    }

    return latLong;
}

//Continent data is given in [10], with / as a seperator
//same config as countrylatlong
function getContinentNodeLatLong(nodeData) {
    let latLong = {};
    let continents = [];
    for (let key in nodeData.nodes) {
        continent = nodeData.nodes[key][10][0];
        if (!continents.includes(continent)) {
            //if continent is new
            continents.push(continent);
            latLong[continent] = []; //create new key in object, array
        }
        latLong[continent].push([nodeData.nodes[key][8], nodeData.nodes[key][9]]);
    }

    return latLong;
}
