function createMap(data) {
    const map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    data.features.forEach((quake) => {
        const lat = quake.geometry.coordinates[1];
        const lon = quake.geometry.coordinates[0];
        const mag = quake.properties.mag;
        const depth = quake.geometry.coordinates[2];
        const radius = mag * 2;
        const color = `hsl(${Math.min(depth, 300)}, 100%, 50%)`;

        const marker = L.circleMarker([lat, lon], {
            radius: radius,
            fillColor: color,
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        const popupContent = `
        <strong>Magnitude:</strong> ${mag}<br>
        <strong>Depth:</strong> ${depth}<br>
        <strong>Location:</strong> ${quake.properties.place}
    `;

    marker.bindPopup(popupContent);
});

    const legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<h4>Legend</h4>';
        div.innerHTML += '<div><span style="background: hsl(300, 100%, 50%)"></span> Depth > 300 km</div>';
        div.innerHTML += '<div><span style="background: hsl(0, 100%, 50%)"></span> Depth <= 300 km</div>';
        return div;
    };

    legend.addTo(map);
}

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson')
    .then(createMap);