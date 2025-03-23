const BITNODES_API_URL = "https://bitcoin-eli5-proxy.onrender.com/api/v1";

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

//get a list of 2 letter (ISO) country names with full country names
async function get2LetterCountryNames() {
    response = await axios.get(`https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json`);
    return response.data;
}

////////////////////////////Data Cleaners/////////////////////////////////////

//remove all TOR addresses from nodeData, outputs total onion address
//ALSO split the continent name into two
//And remove nodes with no city
//Replace 2 letter country code with full country name
//object has been cleaned in-situ
function cleanNodeData(nodeData, countryNames) {
    addressDeletedCount = 0;
    for (let key in nodeData.nodes) {
        if (nodeData.nodes[key][10] == null || nodeData.nodes[key][7] == null) {
            //Delete if it is an onion node
            delete nodeData.nodes[key];
            addressDeletedCount++;
        } else {
            nodeData.nodes[key][10] = nodeData.nodes[key][10].split("/");
            //replace 2 letter country codes with full country names
            for (let i in countryNames) {
                if (countryNames[i].Code == nodeData.nodes[key][7]) {
                    nodeData.nodes[key][7] = countryNames[i].Name;
                }
            }
        }
    }
    return addressDeletedCount;
}

//this function takes the cleaned node data and returns 3 objects
//first object contains all continents and details
//second object contains all countries and details
//third object contains all cities and details
function sortNodeData(nodeData) {
    continentNodes = {};
    countryNodes = {};
    cityNodes = {};
    for (let key in nodeData.nodes) {
        let continent = nodeData.nodes[key][10][0];
        let country = nodeData.nodes[key][7];
        let city = nodeData.nodes[key][10][1];

        //continent level data processing
        if (!(continent in continentNodes)) {
            //if key didnt exist prior, make it
            continentNodes[continent] = {};
            continentNodes[continent].count = 0;
            continentNodes[continent].averageLocation = [0, 0];
            continentNodes[continent].countryCount = {};
        }
        if (!(country in continentNodes[continent].countryCount)) {
            //is country in the country count
            continentNodes[continent].countryCount[country] = 0;
        }
        continentNodes[continent].count += 1; //Count the number of nodes in the continent
        continentNodes[continent].averageLocation[0] += nodeData.nodes[key][8]; //sum the lats
        continentNodes[continent].averageLocation[1] += nodeData.nodes[key][9]; //sum the longs
        continentNodes[continent].countryCount[country] += 1; //put a count of every country

        //country level data processing
        if (!(country in countryNodes)) {
            //if key didnt exist prior, make it
            countryNodes[country] = {};
            countryNodes[country].count = 0;
            countryNodes[country].averageLocation = [0, 0];
            countryNodes[country].cityCount = {};
        }
        if (!(city in countryNodes[country].cityCount)) {
            //is city in the city count
            countryNodes[country].cityCount[city] = 0;
        }
        countryNodes[country].count += 1; //Count the number of nodes in the country
        countryNodes[country].averageLocation[0] += nodeData.nodes[key][8]; //sum the lats
        countryNodes[country].averageLocation[1] += nodeData.nodes[key][9]; //sum the longs
        countryNodes[country].cityCount[city] += 1; //put a count of every city

        //city level data processing
        if (!(city in cityNodes)) {
            //if key didnt exist prior, make it
            cityNodes[city] = {};
            cityNodes[city].count = 0;
            cityNodes[city].averageLocation = [0, 0];
        }
        cityNodes[city].count += 1; //Count the number of nodes in the city
        cityNodes[city].averageLocation[0] += nodeData.nodes[key][8]; //sum the lats
        cityNodes[city].averageLocation[1] += nodeData.nodes[key][9]; //sum the longs
    }

    //latlong averaging
    for (let key in continentNodes) {
        continentNodes[key].averageLocation[0] /= continentNodes[key].count; //average the lats
        continentNodes[key].averageLocation[1] /= continentNodes[key].count; //average the longs
    }
    for (let key in countryNodes) {
        countryNodes[key].averageLocation[0] /= countryNodes[key].count; //average the lats
        countryNodes[key].averageLocation[1] /= countryNodes[key].count; //average the longs
    }
    for (let key in cityNodes) {
        cityNodes[key].averageLocation[0] /= cityNodes[key].count; //average the lats
        cityNodes[key].averageLocation[1] /= cityNodes[key].count; //average the longs
    }

    return { continentNodes, countryNodes, cityNodes };
}
