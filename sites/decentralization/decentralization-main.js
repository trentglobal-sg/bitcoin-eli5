window.addEventListener("DOMContentLoaded", async function () {
    map = initMap();

    //Node Map is a very big dataset, should only call once
    nodeData = await getNodeList();
    countryNames = await get2LetterCountryNames();
    cleanNodeData(nodeData, countryNames);
    let { continentNodes, countryNodes, cityNodes } = sortNodeData(nodeData);
    populateNodeMarkers(map, continentNodes, countryNodes, cityNodes, nodeData);

    // nodeData = await getNodeList();
    // cleanNodeData(nodeData);
    // sortedData = getContinentNodeLatLong(nodeData)
    // defaultPopulateNodeMarkers(map, sortedData);
});
