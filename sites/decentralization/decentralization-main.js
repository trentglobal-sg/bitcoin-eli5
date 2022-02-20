window.addEventListener("DOMContentLoaded", async function () {
    map = initMap();
    //Node Map is a very big dataset, should only call once
    //nodeData = await getNodeList();
    //nodeMapData = await getNodeMapList();
    console.log(nodeMapData)
    populateNodeMarkers(map, nodeMapData.coordinates);
});
