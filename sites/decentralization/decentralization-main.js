window.addEventListener("DOMContentLoaded", async function () {
    map = initMap();

    //Node Map is a very big dataset, should only call once
    nodeData = await getNodeList();
    cleanNodeData(nodeData);
    sortedData = sortNodeData(nodeData);
    populateNodeMarkers(map, sortedData);

    // nodeData = await getNodeList();
    // cleanNodeData(nodeData);
    // sortedData = getContinentNodeLatLong(nodeData)
    // defaultPopulateNodeMarkers(map, sortedData);
});
