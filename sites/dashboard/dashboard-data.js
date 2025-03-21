const API_ENDPOINT_BLOCKCHAININFO = "https://blockchain.info";
const API_ENDPOINT_BLOCKCHAININFO2 = "https://api.blockchain.info";
const API_ENDPOINT_BINANCE = "https://api.binance.com/api/v3";
const API_ENDPOINT_BITNODES = "https://expert-parakeet-97w6rv7qjjxr3pjx4-3000.app.github.dev/api/v1";
const API_ENDPOINT_COINGECKO = "https://api.coingecko.com/api/v3";

//Global Variables
let currentBlockHeight = 0;

//1
async function getCurrentBlockHeight() {
    let response = await axios.get(API_ENDPOINT_BLOCKCHAININFO + "/q/getblockcount");
    currentBlockHeight = response.data;
    return response.data;
}
async function getActiveNodes() {
    let response = await axios.get(API_ENDPOINT_BITNODES + "/snapshots?limit=1");
    return response.data.results[0].total_nodes;
}
//2
async function getBlockData(blockHeight) {
    let response = await axios.get(API_ENDPOINT_BLOCKCHAININFO + "/rawblock/" + blockHeight);
    return response.data;
}
//3
async function getAverageBlockInterval() {
    let response = await axios.get(API_ENDPOINT_BLOCKCHAININFO + "/q/interval");
    return response.data;
}
async function getCurrentBlockReward() {
    let response = await axios.get(API_ENDPOINT_BLOCKCHAININFO + "/q/bcperblock");
    return response.data;
}
//4
async function getAverageHashrate() {
    let response = await axios.get(API_ENDPOINT_BLOCKCHAININFO + "/q/hashrate");
    return response.data;
}
async function getHashesToWin() {
    let response = await axios.get(API_ENDPOINT_BLOCKCHAININFO + "/q/hashestowin");
    return response.data;
}
//5
async function getCurrentPrice() {
    let response = await axios.get(API_ENDPOINT_BINANCE + "/ticker/price?symbol=BTCUSDT");
    return response.data.price;
}
async function getHighLowData() {
    let response = await axios.get(API_ENDPOINT_BINANCE + "/ticker/24hr?symbol=BTCUSDT");
    return [response.data.lowPrice, response.data.highPrice];
}

//Charts
//charts-1-6-7
async function getLastBlocksData() {
    let responseArray = [];
    for (i = 0; i < 8; i++) {
        let response = await axios.get(API_ENDPOINT_BLOCKCHAININFO + "/rawblock/" + (currentBlockHeight - i), {
            headers: {
                //CORS policy
                "Content-Type": null,
            },
        });
        responseArray[i] = response.data;
        responseArray[i].height = currentBlockHeight - i;
    }
    return responseArray;
}

//chart-2
async function getTransactionsPerBlock() {
    let timestamp = new Date();
    let response = await axios.get(API_ENDPOINT_BLOCKCHAININFO2 + "/charts/n-transactions-per-block", {
        headers: {
            //CORS policy
            "Content-Type": null,
        },
        params: {
            cors: true,
            start: Number(timestamp.getTime() / 1000 - 86400 * 50).toFixed(0),
            //Get the last 50 timestamp
        },
    });
    return response.data.values;
}
//chart-2-processing
function processTransactionsPerBlockData(transactionsPerBlockData) {
    for (let entry of transactionsPerBlockData) {
        entry.x = entry.x * 1000;
    }
    return transactionsPerBlockData;
}

//chart-3
async function getHashratePieData(days) {
    let response = await axios.get(API_ENDPOINT_BLOCKCHAININFO2 + "/pools", {
        timespan: "${days}days",
        cors: true,
    });
    return response.data;
}
//chart-3-processing
function processHashRatePieData(hashRatePieData) {
    dataArray = [[], []];
    for (let key in hashRatePieData) {
        dataArray[1].push(key);
        dataArray[0].push(hashRatePieData[key]);
    }
    return dataArray;
}

//chart-4
async function getTotalHashRate() {
    let response = await axios.get(API_ENDPOINT_BLOCKCHAININFO2 + "/charts/hash-rate", {
        headers: {
            //CORS policy
            "Content-Type": null,
        },
        params: {
            cors: true,
        },
    });
    return response.data.values;
}
//chart-4-processing
function processTotalHashRateData(totalHashRateData) {
    for (let entry of totalHashRateData) {
        entry.x = entry.x * 1000;
    }
    return totalHashRateData;
}

//chart-5
async function getTradeData() {
    let response = await axios.get(API_ENDPOINT_BINANCE + "/aggTrades", {
        params: {
            symbol: "BTCUSDT",
            limit: "200",
        },
    });
    return response.data;
}

function processTradeData(tradeData) {
    let dataArray = [];
    for (let entry of tradeData) {
        entry["m"] ? (typeEntry = "SELL") : (typeEntry = "BUY");
        let price = Number(entry["p"]).toFixed(0);
        let qty = Number(entry["q"]).toFixed(5);
        let cost = Number(price * qty).toFixed(0);
        if (cost > 1000) {
            processedEntry = [typeEntry, price, qty, cost];
            dataArray.push(processedEntry);
        }
    }
    return dataArray;
}

//chart-9
async function getKlineData() {
    let response = await axios.get(API_ENDPOINT_BINANCE + "/klines", {
        params: {
            symbol: "BTCUSDT",
            interval: "1m",
            limit: "25",
        },
    });
    return response.data;
}
//chart-9-processing
function processKlineData(klineData) {
    dataArray = [];
    for (let entry of klineData) {
        let processedEntry = {};
        processedEntry["x"] = new Date(entry[0]);
        processedEntry["y"] = [entry[1], entry[2], entry[3], entry[4]];
        dataArray.push(processedEntry);
    }

    return dataArray;
}
//flexi-1 (map)

//get list of nodes in the network
async function getNodeList() {
    response = await axios.get(`${API_ENDPOINT_BITNODES}/snapshots/latest`, {
        params: {}, //remove to get full field: "coordinates"
    });
    return response.data;
}
//get a list of 2 letter (ISO) country names with full country names
async function get2LetterCountryNames() {
    response = await axios.get(`https://pkgstore.datahub.io/core/country-list/data_json/data/8c458f2d15d9f2119654b29ede6e45b8/data_json.json`);
    return response.data;
}
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
            //replace _  in city names
            nodeData.nodes[key][10][1] = nodeData.nodes[key][10][1].replace(/_/g, " ");
        }
    }
    return addressDeletedCount;
}
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

//flexi-2
//flexi-3
async function getMarketChart() {
    let response = await axios.get(API_ENDPOINT_COINGECKO + "/coins/bitcoin/market_chart", {
        params: {
            vs_currency: "usd",
            days: 90,
            interval: "1h",
        },
    });
    return response.data;
}
function processMarketChartData(marketChartData) {
    return marketChartData;
}

//flexi-4
async function getExchangeData() {
    let response = await axios.get(API_ENDPOINT_COINGECKO + "/coins/bitcoin/tickers", {
        params: {
            include_exchange_logo: true,
            order: "volume_desc",
            depth: true,
        },
    });
    return response.data;
}
function processExchangeData(exchangeData) {
    for (let i = 0; i < exchangeData.tickers.length; i++) {
        if (exchangeData.tickers[i].base != "BTC" || !(exchangeData.tickers[i].target == "USD" || exchangeData.tickers[i].target == "USDT")) {
            exchangeData.tickers.splice(i, 1);
            i--;
        }
    }
    return exchangeData.tickers;
}
