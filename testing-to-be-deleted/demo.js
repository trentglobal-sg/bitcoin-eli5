const group1 = markerClusterGroup();
const group2 = markerClusterGroup();
group1.addLayers(markers1);
group2.addLayers(markers2);
const group3 = markerClusterGroup();
group3.addLayers([group1, group2]);
group3.addTo(this.map);

map.on("zoomend", function () {
    if (map.getZoom() > 10) {
        group3.remove();
        group1.addTo(map);
        group2.addTo(map);
    } else {
        group3.addTo(map);
        group1.remove();
        group2.remove();
    }
});
