import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import stateGeoJSONData from '../../MAP/NEW STATES.json'; // Import GeoJSON Data
import './StateAtAGlanceSection.css';

// Removed GOOGLE_MAPS_KEY as we are switching to OpenStreetMap
// Open-Meteo is free and requires no API key.
// We use hardcoded coordinates for the capitals of the 8 NE states to avoid a separate geocoding call.
const STATE_COORDINATES = {
    'Arunachal Pradesh': { lat: 27.0844, lng: 93.6053 }, // Itanagar
    'Assam': { lat: 26.1445, lng: 91.7362 },             // Dispur
    'Manipur': { lat: 24.8170, lng: 93.9368 },           // Imphal
    'Meghalaya': { lat: 25.5788, lng: 91.8933 },         // Shillong
    'Mizoram': { lat: 23.7271, lng: 92.7176 },           // Aizawl
    'Nagaland': { lat: 25.6751, lng: 94.1086 },          // Kohima
    'Sikkim': { lat: 27.3389, lng: 88.6065 },            // Gangtok
    'Tripura': { lat: 23.8315, lng: 91.2868 },           // Agartala
    'Northeast India': { lat: 26.244, lng: 92.537 }      // Regional Center
};

// Encoded Polylines or Coordinate Strings for State Boundaries
// User can populate this with specific path data (color:0xff0000ff|weight:2|lat,lng|...)
const STATE_BOUNDARIES = {
    'Nagaland': 'color:0xff3b3bff|weight:2|27.0313,95.1946|27.0148,95.1695|26.9957,95.144|26.9822,95.1166|26.9576,95.0952|26.9472,95.0642|26.9362,95.0353|26.921,95.0041|26.9227,94.9682|26.9336,94.9399|26.9361,94.9084|26.9219,94.8791|26.8919,94.8582|26.8689,94.8364|26.8412,94.821|26.8138,94.8037|26.7899,94.7756|26.7663,94.7517|26.7509,94.7142|26.7297,94.6866|26.7203,94.6573|26.7155,94.6245|26.735,94.6007|26.7051,94.5924|26.6873,94.5677|26.7063,94.5392|26.682,94.5175|26.6662,94.489|26.6536,94.4584|26.6242,94.4386|26.6119,94.4042|26.5825,94.4122|26.552,94.4046|26.5265,94.3857|26.5037,94.3645|26.4854,94.3407|26.4632,94.3182|26.4784,94.2918|26.5108,94.2833|26.5431,94.286|26.5329,94.2532|26.5062,94.2365|26.4892,94.2102|26.4613,94.194|26.4365,94.176|26.4034,94.1731|26.3726,94.1718|26.3406,94.1745|26.3307,94.145|26.3262,94.1143|26.2944,94.0904|26.268,94.0751|26.2506,94.0485|26.2143,94.0344|26.1841,94.0153|26.1553,94.001|26.1231,93.993|26.0884,93.9894|26.056,93.9784|26.0302,93.9619|25.9944,93.9591|25.9574,93.9686|25.9282,93.9779|25.9013,93.961|25.8853,93.9339|25.8716,93.9054|25.8434,93.8817|25.8583,93.8522|25.8445,93.8252|25.817,93.8062|25.8355,93.7802|25.8652,93.7875|25.8957,93.7934|25.926,93.7908|25.957,93.7798|25.9452,93.7519|25.9225,93.7298|25.9108,93.7008|25.8768,93.692|25.8446,93.7142|25.8384,93.6805|25.823,93.6533|25.8017,93.6294|25.7742,93.6111|25.76,93.5825|25.7371,93.5591|25.7047,93.5418|25.6873,93.5159|25.6608,93.4999|25.6443,93.4741|25.6396,93.4438|25.6183,93.4215|25.5983,93.3989|25.5774,93.3745|25.5592,93.3457|25.5288,93.3499|25.5036,93.3691|25.4826,93.3911|25.4541,93.4004|25.4488,93.4331|25.4311,93.4581|25.4012,93.4612|25.3721,93.4705|25.3468,93.4518|25.3141,93.4637|25.2844,93.4711|25.2724,93.4989|25.2419,93.5022|25.246,93.5322|25.2422,93.5619|25.2189,93.5847|25.2183,93.6149|25.2469,93.6285|25.2745,93.6452|25.3002,93.6606|25.3276,93.6732|25.3566,93.6875|25.3718,93.7158|25.3966,93.7361|25.4152,93.762|25.4397,93.7824|25.4631,93.8049|25.4932,93.8026|25.4973,93.7724|25.5279,93.7646|25.5374,93.7941|25.5536,93.8217|25.5533,93.8597|25.5651,93.8884|25.5595,93.9183|25.5544,93.9495|25.5647,93.9788|25.5724,94.0104|25.5758,94.042|25.557,94.0656|25.5373,94.0942|25.5229,94.1226|25.5399,94.1496|25.5506,94.1781|25.5223,94.1901|25.496,94.2084|25.4959,94.24|25.5,94.2717|25.5055,94.302|25.5077,94.3359|25.5173,94.3653|25.5343,94.3931|25.5483,94.4207|25.579,94.4226|25.5978,94.4472|25.6152,94.4729|25.6141,94.5055|25.6368,94.5275|25.659,94.5502|25.6873,94.5637|25.6849,94.595|25.6563,94.5836|25.6256,94.5802|25.5983,94.5669|25.5682,94.5586|25.5373,94.5575|25.5026,94.5539|25.4889,94.581|25.471,94.608|25.4558,94.6373|25.4485,94.6684|25.4669,94.6952|25.474,94.7258|25.4934,94.7512|25.4804,94.781|25.4939,94.8079|25.5214,94.8228|25.553,94.8347|25.5639,94.8648|25.5656,94.8973|25.5936,94.8854|25.6071,94.9136|25.6371,94.921|25.668,94.9365|25.6868,94.9657|25.7072,94.989|25.7319,95.0118|25.7423,95.0408|25.7741,95.044|25.8068,95.0421|25.8339,95.0291|25.8629,95.0144|25.8951,95.0139|25.922,95.031|25.9397,95.0575|25.9506,95.0892|25.9756,95.114|25.9989,95.1346|26.0221,95.156|26.0523,95.1667|26.078,95.1823|26.0866,95.1511|26.0975,95.1223|26.1282,95.1261|26.1587,95.1171|26.1943,95.1271|26.2263,95.1187|26.2586,95.1223|26.29,95.1261|26.3211,95.1252|26.3517,95.123|26.3849,95.1292|26.394,95.0998|26.4259,95.0989|26.4461,95.0758|26.4767,95.0768|26.4974,95.0989|26.5239,95.1156|26.555,95.1229|26.5745,95.1468|26.6061,95.1484|26.6324,95.1667|26.6425,95.1956|26.6609,95.2197|26.6913,95.2307|26.7224,95.2221|26.7556,95.2165|26.7793,95.2358|26.7951,95.2083|26.8244,95.1975|26.8544,95.1851|26.8795,95.2084|26.9025,95.2321|26.929,95.2163|26.9561,95.2023|26.9849,95.1915|27.0313,95.1946',
    // Add real encoded polylines here for other states
};

// WMO Weather interpretation codes (Open-Meteo)
const getWeatherDetails = (code) => {
    if (code === 0) return { desc: 'Clear Sky', icon: 'clear_day' };
    if (code >= 1 && code <= 3) return { desc: 'Partly Cloudy', icon: 'partly_cloudy_day' };
    if (code >= 45 && code <= 48) return { desc: 'Foggy', icon: 'foggy' };
    if (code >= 51 && code <= 67) return { desc: 'Rainy', icon: 'rainy' };
    if (code >= 71 && code <= 77) return { desc: 'Snow', icon: 'ac_unit' };
    if (code >= 80 && code <= 82) return { desc: 'Showers', icon: 'rainy' };
    if (code >= 95 && code <= 99) return { desc: 'Thunderstorm', icon: 'thunderstorm' };
    return { desc: 'Unknown', icon: 'cloud' };
};

export default function StateAtAGlanceSection({ glance, stateName }) {
    const [weather, setWeather] = React.useState(null);
    const [loadingWeather, setLoadingWeather] = React.useState(true);

    React.useEffect(() => {
        if (!stateName) return;

        const coords = STATE_COORDINATES[stateName];
        if (!coords) {
            console.warn(`No coordinates found for ${stateName}`);
            setLoadingWeather(false);
            return;
        }

        const fetchWeather = async () => {
            try {
                // Open-Meteo API: Free, No Key required.
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,weather_code`
                );

                if (response.ok) {
                    const data = await response.json();
                    const current = data.current;
                    const details = getWeatherDetails(current.weather_code);

                    setWeather({
                        temp: Math.round(current.temperature_2m),
                        condition: details.desc,
                        icon: details.icon // Material Symbol name
                    });
                } else {
                    console.error("Failed to fetch weather:", response.statusText);
                }
            } catch (error) {
                console.error("Failed to fetch weather:", error);
            } finally {
                setLoadingWeather(false);
            }
        };

        fetchWeather();
    }, [stateName]);

    if (!glance) return null;

    // Default stats items mapping
    const stats = [
        { icon: 'map', label: 'States', value: glance.states },
        { icon: 'location_city', label: 'Capital', value: glance.capital },
        { icon: 'landscape', label: 'Landscape', value: glance.landscapeType },
        { icon: 'translate', label: 'Languages', value: glance.languages?.join(', ') },
        // Removed Climate from stats as it's now a separate card
        // { icon: 'thermostat', label: 'Climate', value: glance.climate },
        { icon: 'group', label: 'Population', value: glance.population },
        { icon: 'straighten', label: 'Area', value: glance.area }
    ].filter(item => item.value);

    // Google Maps Link
    const googleMapsLink = `https://www.google.com/maps/place/${encodeURIComponent(stateName + ', India')}`;

    return (
        <section className="glance-section-redesigned">
            <div className="glance-container">

                {/* Left Column: Title, Description, Stats Grid */}
                <div className="glance-left-column">
                    <div className="glance-header-content">
                        <h2 className="glance-main-title">At a Glance</h2>
                        <div className="glance-separator"></div>
                        <p className="glance-description">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                        </p>
                    </div>

                    <div className="glance-stats-grid">
                        {stats.map((item, index) => (
                            <div className="stat-card" key={index}>
                                <div className="stat-icon-box">
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">{item.label}</span>
                                    <span className="stat-value">{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Map & Weather */}
                <div className="glance-right-column">
                    {/* Map Card */}
                    {/* Map Card */}
                    <div className="glance-map-wrapper">
                        {/* Leaflet Map */}
                        <MapContainer
                            center={[STATE_COORDINATES[stateName]?.lat || 26.2006, STATE_COORDINATES[stateName]?.lng || 92.9376]}
                            zoom={7}
                            scrollWheelZoom={false}
                            className="glance-leaflet-map"
                            zoomControl={false}
                            dragging={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {/* Overlay State Boundary if found */}
                            {(() => {
                                const stateFeature = stateGeoJSONData?.features?.find(
                                    f => f.properties?.ST_NM?.toLowerCase() === stateName.toLowerCase()
                                );
                                return stateFeature ? (
                                    <GeoJSON
                                        data={stateFeature}
                                        style={{
                                            color: '#ff3b3b',
                                            weight: 2,
                                            opacity: 1,
                                            fillColor: '#ff3b3b',
                                            fillOpacity: 0.1
                                        }}
                                    />
                                ) : null;
                            })()}
                        </MapContainer>

                        <a
                            href={googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="map-overlay-link"
                            title={`View ${stateName} on Google Maps`}
                        >
                            <span className="material-symbols-outlined">open_in_new</span>
                        </a>
                    </div>

                    {/* Weather Card */}
                    <div className="glance-weather-card">
                        <h3 className="weather-title">Weather Today</h3>

                        {weather ? (
                            <div className="weather-main">
                                <span className="material-symbols-outlined weather-icon">{weather.icon}</span>
                                <div className="weather-temp-group">
                                    <span className="weather-temp">{weather.temp}°</span>
                                    <span className="weather-condition">{weather.condition}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="weather-main">
                                <span className="material-symbols-outlined weather-icon">
                                    {loadingWeather ? 'refresh' : 'cloud_off'}
                                </span>
                                <div className="weather-temp-group">
                                    <span className="weather-temp">{loadingWeather ? '--°' : 'N/A'}</span>
                                    <span className="weather-condition">
                                        {loadingWeather ? 'Loading...' : 'Unavailable'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <a href={`https://www.google.com/search?q=weather+${stateName}`} target="_blank" rel="noreferrer" className="weather-link">
                            <span className="material-symbols-outlined arrow-icon">chevron_right</span>
                            Weather Forecast
                            <span className="material-symbols-outlined link-icon">call_made</span>
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}
