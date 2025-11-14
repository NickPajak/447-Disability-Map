// src/utils/geojsonRouteSearch.js
import PathFinder from "geojson-path-finder";

function isElevator(entrance) {
  if (!entrance || !entrance.properties) return false;
  const p = entrance.properties;
  const name = (p.name || '').toString().toLowerCase();
  return p.type === 'elevator' || p.is_elevator || p.elevator === true || name.includes('elevator');
}

/**
 * Get the entrance coordinates for a building, excluding elevators
 */
function getBuildingEntrances(buildingId, entrance, metadata) {
  const ids = metadata[buildingId]?.entrances || [];
  return entrance.features
    .filter(f => ids.includes(f.properties.id) && !isElevator(f))
    .map(f => f.geometry.coordinates);
}


export function findRoute({startBuildingId, endBuildingId,  entrances,  highways,  busstops,  metadata}) {

  const validHighwayFeatures = highways.features.filter(f => {
    const s = f && f.properties && f.properties.status;
    if (s === false) return false;
    return true;
  });
  const validHighways = { type: 'FeatureCollection', features: validHighwayFeatures };

  const pathFinder = new PathFinder(validHighways);

  const startCoords = [];
  const endCoords = [];

  //start Building 
  if (startBuildingId && metadata && metadata[startBuildingId]) {
    const startEntrancesIds = getBuildingEntrances(startBuildingId, entrances, metadata);
    startCoords.push(...startEntrancesIds);
  }

  //start Bus_stop
  else if (typeof endBuildingId === "string" && endBuildingId.startsWith("bus_")) {
    const bs = busstops.find(f => f.properties.id === startBuildingId);
    if (bs?.geometry?.coordinates)
      startCoords.push(bs.geometry.coordinates);
  }

  // 终点是建筑
  if (endBuildingId && metadata && metadata[endBuildingId]) {
    const endEntrances = getBuildingEntrances(endBuildingId, entrances, metadata);
    endCoords.push(...endEntrances);
  }

  else if (typeof endBuildingId === 'string' && endBuildingId.startsWith("bus_")) {
    const bs = busstops.find(f => f.properties.id === startBuildingId);
    if (bs?.geometry?.coordinates)
      startCoords.push(bs.geometry.coordinates);
  }

  if (startCoords.length === 0 || endCoords.length === 0) {
    return null;
  }


  let bestPath = null;
  let usedStart = null;
  let usedEnd = null;

  for (const s of startCoords) {
    for (const e of endCoords) {
      const start = { type: "Feature", geometry: { type: "Point", coordinates: s } };
      const end = { type: "Feature", geometry: { type: "Point", coordinates: e } };
      const path = pathFinder.findPath(start, end);
      if (path && (!bestPath || path.weight < bestPath.weight)) {
        bestPath = path;
        usedStart = s;
        usedEnd = e;
      }
    }
  }

  if (!bestPath) {
    return null;
  }

  const passedPoints = [];
  const tolerance = 0.00003;

  function isPointPassed(point) {
    const [lng, lat] = point;
    return bestPath.path.some(
      ([x, y]) => Math.abs(x - lng) < tolerance && Math.abs(y - lat) < tolerance
    );
  }
  

  // ⚙️ 5️⃣ 输出结构
  return {
    start_building: startBuildingId,
    end_building: endBuildingId,
    route_coords: bestPath.path,
    start_point: usedStart,
    end_point: usedEnd,
    passed_Points: passedPoints,
    total_distance: bestPath.weight
  };
}
