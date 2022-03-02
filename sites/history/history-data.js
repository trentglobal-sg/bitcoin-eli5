const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

//get only the price data of Bitcoin
async function getBitcoinPriceData(days) {
    response = await axios.get(`${COINGECKO_API_URL}/coins/bitcoin/market_chart`, {
        params: { vs_currency: "usd", days: days, interval: "daily" },
    });
    return response.data;
}

//get the candle data of Bitcoin
async function getBitcoinCandleData(days) {
    response = await axios.get(`${COINGECKO_API_URL}/coins/bitcoin/ohlc`, {
        params: { vs_currency: "usd", days: days },
    });
    return response.data;
}

//processes line data to change to logarithmic if log flag is on
function processLineData(data, logSwitchFlag) {
    if (logSwitchFlag) {
        data = data.map(x => [x[0], Math.log(x[1])])
    }
    return data;
}

//process the candle data into a apexchart readable form
//log flag to indicate if the data should be logarithmic
function processCandleData(data, logSwitchFlag) {
    let processedData = [];
    for (let entry of data) {
        let processedEntry = {};
        processedEntry["x"] = new Date(entry[0]);
        ohlcData = entry.slice(1);
        if (logSwitchFlag) {
            ohlcData = ohlcData.map(x => Math.log(x))
        }
        processedEntry["y"] = ohlcData;
        processedData.push(processedEntry);
    }

    return processedData;
}
