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
        //{ lat: 50.853175, lng: 4.347363, czml_id: '2261491', height: 3, heading: -20, pitch: -10},//yser
        { simulation_name: "yser", lat: 50.853175, lng: 4.347363, czml_id: '2261491', height: 100, heading: -20, pitch: -30},//yser
        { simulation_name: "bourse", lat: 50.84801186541467, lng: 4.346133804743512, czml_id: '2261533', height: 3, heading: 50, pitch: -10},//bourse
        { simulation_name: "anneessens", lat: 50.84144828469932, lng: 4.344349282867575, czml_id: '2261576', height: 3, heading: 35, pitch: -10},//anneessens
    ];

    cameraPoints.forEach(point => {
        var marker = L.marker([point.lat, point.lng]).addTo(map);
        marker.on('click', function() {
            window.location.href = `simulation.html?lat=${point.lat}&lng=${point.lng}&czml_id=${point.czml_id}&height=${point.height}&heading=${point.heading}&pitch=${point.pitch}&simulation_name=${point.simulation_name}`;
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
        const height = parseFloat(urlParams.get('height'));
        const heading = parseFloat(urlParams.get('heading'));
        const pitch = parseFloat(urlParams.get('pitch'));
        const simulation_name = urlParams.get('simulation_name');
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OWIyZmM4ZC0yYjNkLTQ5NjItYjM1MS0wNDE1NmJkMDlkNjciLCJpZCI6MTU0NzkyLCJpYXQiOjE2OTAxOTM1NTZ9.v5U37J7_jTa0sPJh0dnBjcoU8XuQ98S8yisFBm4jrY0";
        const viewer = new Cesium.Viewer("cesiumContainer", {
            shouldAnimate: true,
        });
        document.getElementById('videoPlayer').src = `simulations2D/${simulation_name}.webm`;
        //load simulation data text files
        fetch(`simulationsDATA/${simulation_name}.txt`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('textContent').textContent = data;
        })
        .catch(error => {
            console.error('Error fetching the .txt file:', error);
        });


        try {
            console.log(lat)
            const resource = await Cesium.IonResource.fromAssetId(czml_id);
            const dataSource = await Cesium.CzmlDataSource.load(resource);
            await viewer.dataSources.add(dataSource);
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
                orientation: {
                heading: Cesium.Math.toRadians(heading), // Heading is set to 0 for North alignment, you can change as needed
                pitch: Cesium.Math.toRadians(pitch), // This value will make the view direction slightly downwards
                roll: 0
                }
            });
            // Set the simulation speed to 6x
            viewer.clock.multiplier = 5.0;
        } catch (error) {
            console.log(error);
        }

        try {
            const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2266365);
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

// Function to show the selected tab and hide others
function showTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.style.display = 'none';
    });
    
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(tabName).style.display = 'block';
    document.querySelector(`.tab-button[onclick="showTab('${tabName}')"]`).classList.add('active');
}

