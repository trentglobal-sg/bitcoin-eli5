const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

async function getData() {
    console.log("lol")
    response = await axios.get(COINGECKO_API_URL + "/ping")
    console.log(response.data)
}