// Check which page we're on
const isIndexPage = document.getElementById('map') !== null;
const isSimulationPage = document.getElementById('cesiumContainer') !== null;

if (isIndexPage) {
    // Code for the map on index.html

    // Initialize the map centered on Brussels
    var map = L.map('map').setView([50.8503, 4.3517], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    var cameraPoints = [
        { lat: 50.8410006668756,lng: 4.345831479187118, czml_id: '2261576'},//yser
        { lat: 50.853175, lng: 4.347363, czml_id: '2261491'},//yser
        { lat: 50.8474995544188, lng: 4.3451069817770875, czml_id: '2261533'},//bourse
    ];

    cameraPoints.forEach(point => {
        var marker = L.marker([point.lat, point.lng]).addTo(map);
        marker.on('click', function() {
            window.location.href = `simulation.html?lat=${point.lat}&lng=${point.lng}&czml_id=${point.czml_id}`;
        });
    });
    
}

if (isSimulationPage) {
    // Add event listener for the Previous button
    document.getElementById('previousButton').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // Code for Cesium simulation on simulation.html
    async function initializeCesium() {
        const urlParams = new URLSearchParams(window.location.search);
        const lat = parseFloat(urlParams.get('lat'));
        const lng = parseFloat(urlParams.get('lng'));
        const czml_id = parseFloat(urlParams.get('czml_id'));
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OWIyZmM4ZC0yYjNkLTQ5NjItYjM1MS0wNDE1NmJkMDlkNjciLCJpZCI6MTU0NzkyLCJpYXQiOjE2OTAxOTM1NTZ9.v5U37J7_jTa0sPJh0dnBjcoU8XuQ98S8yisFBm4jrY0";
        const viewer = new Cesium.Viewer("cesiumContainer", {
            shouldAnimate: true,

        });

        try {
            console.log(lat)
            const resource = await Cesium.IonResource.fromAssetId(czml_id);
            const dataSource = await Cesium.CzmlDataSource.load(resource);
            await viewer.dataSources.add(dataSource);
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lng, lat, 3),
                orientation: {
                heading: Cesium.Math.toRadians(65), // Heading is set to 0 for North alignment, you can change as needed
                pitch: Cesium.Math.toRadians(-10), // This value will make the view direction slightly downwards
                roll: 0
                }
            });
        } catch (error) {
            console.log(error);
        }

        try {
            const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2255875);
            viewer.scene.primitives.add(tileset);


            // Apply the default style if it exists
            const extras = tileset.asset.extras;
            if (
            Cesium.defined(extras) &&
            Cesium.defined(extras.ion) &&
            Cesium.defined(extras.ion.defaultStyle)
            ) {
            tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
            }
        } catch (error) {
            console.log(error);
        }
    }
    initializeCesium();
}
