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

//remove all TOR addresses from nodeData, outputs a cleaned nodeData set
function removeOnionAddresses(nodeData) {
    addressCount = 0;
    for (let key in nodeData.nodes) {
        if ((nodeData.nodes[key][11] = "TOR")) {
            delete nodeData.nodes[key];
        }
        addressCount++;
    }
    return addressCount;
}

function getIndividualNodeLatLong(nodeData) {
    let latLong = [];
    for (let key in nodeData.nodes) {
        console.log(key);
        console.log(nodeData.nodes[key][8]);
        latLong.push([nodeData.nodes[key][8], nodeData.nodes[key][9]]);
    }

    return latLong;
}

//group nodes by their country code, outputs country latlong, together with number
function getCountryNodeLatLong(nodeData) {
    countryList = {}

    for (let key in nodeData.nodes) {

    }


}

function getContinentNodeLatLong(nodeData) {
    let latLong = [];
    for (let key in nodeData.nodes) {
        console.log(key);
        console.log(nodeData.nodes[key][8]);
        latLong.push([nodeData.nodes[key][8], nodeData.nodes[key][9]]);
    }

    return latLong;
}
