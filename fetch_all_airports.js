const fs = require('fs');

// Read project_airports.js to get the list of airports
const projectAirportsRaw = fs.readFileSync('project_airports.js', 'utf8');
// Hacky parse since it's a window.PROJECT_AIRPORTS assignment
let airportsData;
try {
  const jsonStr = projectAirportsRaw.replace('window.PROJECT_AIRPORTS = ', '').replace(/;\s*$/, '');
  airportsData = JSON.parse(jsonStr);
} catch (e) {
  console.error("Failed to parse project_airports.js", e);
  process.exit(1);
}

const doneAirports = airportsData.filter(ap => ap.status === 'done');
console.log(`Found ${doneAirports.length} completed airports.`);

const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchOverpass(lat, lng) {
  const query = `
    [out:json][timeout:25];
    (
      way["aeroway"="taxiway"](around:2500, ${lat}, ${lng});
      way["aeroway"="runway"](around:2500, ${lat}, ${lng});
      node["aeroway"="parking_position"](around:2500, ${lat}, ${lng});
    );
    out geom;
  `;
  
  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'User-Agent': 'VATBRZ-Operations-Ground-Guide/1.0 (contact: info@vatsim.com.br)'
    },
    body: query
  });
  
  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.statusText}`);
  }
  
  return await response.json();
}

async function main() {
  const result = {};
  
  // Try to load existing data so we don't refetch if we already have it
  let existingData = {};
  try {
    if (fs.existsSync('data/airports_geometry.json')) {
      existingData = JSON.parse(fs.readFileSync('data/airports_geometry.json', 'utf8'));
    }
  } catch(e) {}

  for (let i = 0; i < doneAirports.length; i++) {
    const ap = doneAirports[i];
    console.log(`[${i+1}/${doneAirports.length}] Fetching ${ap.icao}...`);
    
    // Skip if we already have it (optional, but good for rate limits)
    // Actually let's fetch them all to be sure they are fresh, or skip if existing.
    if (existingData[ap.icao] && existingData[ap.icao].length > 0) {
      console.log(`  -> Already have data for ${ap.icao}, skipping Overpass.`);
      result[ap.icao] = existingData[ap.icao];
      continue;
    }

    try {
      const data = await fetchOverpass(ap.lat, ap.lng);
      
      const features = [];
      if (data.elements) {
        for (const el of data.elements) {
          if (el.type === 'node') {
            features.push({
              type: 'node',
              id: el.id,
              aeroway: el.tags ? el.tags.aeroway : null,
              coords: [el.lat, el.lon],
              ref: el.tags && el.tags.ref ? el.tags.ref : null
            });
          } else if (el.type === 'way') {
            if (el.geometry) {
              features.push({
                type: 'way',
                id: el.id,
                aeroway: el.tags ? el.tags.aeroway : null,
                coords: el.geometry.map(g => [g.lat, g.lon]),
                ref: el.tags && el.tags.ref ? el.tags.ref : null
              });
            }
          }
        }
      }
      
      result[ap.icao] = features;
      console.log(`  -> Saved ${features.length} features.`);
      
      // Wait 1.5s to respect Overpass rate limits
      await delay(1500);
      
    } catch (err) {
      console.error(`  -> Error fetching ${ap.icao}:`, err.message);
      // Wait a bit longer on error
      await delay(5000);
    }
  }
  
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }
  fs.writeFileSync('data/airports_geometry.json', JSON.stringify(result));
  console.log("Done! Wrote to data/airports_geometry.json");
}

main();
