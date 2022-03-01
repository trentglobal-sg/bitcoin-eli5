const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

//get only the price data of a choosen coin
async function getBitcoinPriceData() {
    response = await axios.get(`${COINGECKO_API_URL}/coins/bitcoin/market_chart`, {
        params: { vs_currency: "usd", days: "max", interval: "daily" },
    });
    return response.data;
}



//process the candle data into a apexchart readable form
function processCandleData(data) {
    let processedData = [];
    for (entry of data) {
        let processedEntry = {};
        processedEntry["x"] = new Date(entry[0]);
        processedEntry["y"] = entry.slice(1);
        processedData.push(processedEntry);
    }

    return processedData;
}
