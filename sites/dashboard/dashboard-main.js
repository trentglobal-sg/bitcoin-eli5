window.addEventListener("DOMContentLoaded", async function () {
    initInteractivePage();
    initInfoboardpage();
    initChartPage();

    //The below code is for the map widget (flexi-1)
    let map = initMap();
    let nodeData = await getNodeList();
    let countryNames = await get2LetterCountryNames();
    cleanNodeData(nodeData, countryNames);
    let { continentNodes, countryNodes, cityNodes } = sortNodeData(nodeData);
    populateNodeMarkers(map, continentNodes, countryNodes, cityNodes, nodeData);
});
