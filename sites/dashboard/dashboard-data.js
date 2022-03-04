const API_ENDPOINT_BLOCKCHAININFO = "https://blockchain.info";
const API_ENDPOINT_BINANCE = "https://api.binance.com/api/v3";
const API_ENDPOINT_BITNODES = "https://bitnodes.io/api/v1";

//
async function getCurrentBlockHeight() {
    response = await axios.get(API_ENDPOINT_BLOCKCHAININFO + "/q/getblockcount");
    return response.data;
}
async function getActiveNodes() {
    response = await axios.get(API_ENDPOINT_BITNODES + "/snapshots?limit=1");
    return response.data.results[0].total_nodes;
}
//
async function getBlockData(blockHeight) {
    response = await axios.get(API_ENDPOINT_BLOCKCHAININFO + "/rawblock/" + blockHeight);
    return response.data;
}
//
async function getAverageBlockInterval() {
    response = await axios.get(API_ENDPOINT_BLOCKCHAININFO + "/q/interval");
    return response.data;
}
async function getCurrentBlockReward() {
    response = await axios.get(API_ENDPOINT_BLOCKCHAININFO + "/q/bcperblock");
    return response.data;
}
//
async function getAverageHashrate() {
    response = await axios.get(API_ENDPOINT_BLOCKCHAININFO + "/q/hashrate");
    return response.data;
}
async function getHashesToWin() {
    response = await axios.get(API_ENDPOINT_BLOCKCHAININFO + "/q/hashestowin");
    return response.data;
}
//
async function getCurrentPrice() {
    response = await axios.get(API_ENDPOINT_BINANCE + "/ticker/price?symbol=BTCUSDT");
    return response.data.price;
}
async function getHighLowData() {
    response = await axios.get(API_ENDPOINT_BINANCE + "/ticker/24hr?symbol=BTCUSDT");
    return [response.data.lowPrice, response.data.highPrice];
}
