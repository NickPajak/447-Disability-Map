import React, { useEffect, useState } from 'react';
import { GeoJSON, CircleMarker, Polyline, Popup } from 'react-leaflet';
import { buildGraphFromGeojson, graphToAdj } from '../utils/indoorGraph';
import { dijkstra, pathIdsToCoords } from '../utils/indoorRouteSearch';

export default function FloorplanNavigator({ geojsonData }) {
  const [graph, setGraph] = useState(null);
  const [adj, setAdj] = useState(null);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  // Build graph when geojsonData changes
  useEffect(() => {
    if (!geojsonData) return;
  
    // 1️⃣ Build initial graph
    const g = buildGraphFromGeojson(geojsonData, { maxConnectDist: 1000 }) || { nodes: {}, edges: [] };
  
    // 2️⃣ Normalize coordinates (take first point if MultiPoint)
    Object.values(g.nodes).forEach(n => {
      if (Array.isArray(n.coord?.[0])) n.coord = n.coord[0];
    });
  
    // 3️⃣ Ensure all doors exist as nodes
    geojsonData.features.forEach(f => {
      const id = f.properties?.id;
      if (typeof id === 'string' && id.startsWith('p_')) {
        if (!g.nodes[id]) {
          g.nodes[id] = { id, coord: f.geometry.coordinates };
        }
      }
    });
  
    // 4️⃣ Separate corridors and doors
    const corridors = Object.values(g.nodes).filter(n => n.id.startsWith('c_'));
    const doors = Object.values(g.nodes).filter(n => n.id.startsWith('p_'));
  
    // 5️⃣ Connect corridors to nearby corridors
    for (let i = 0; i < corridors.length; i++) {
      const c1 = corridors[i];
      for (let j = i + 1; j < corridors.length; j++) {
        const c2 = corridors[j];
        const dx = c1.coord[0] - c2.coord[0];
        const dy = c1.coord[1] - c2.coord[1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= 1000) { // adjust distance if needed
          g.edges.push({ u: c1.id, v: c2.id, w: dist });
          g.edges.push({ u: c2.id, v: c1.id, w: dist });
        }
      }
    }
  
    // 6️⃣ Snap doors to nearest corridor and add edges
    doors.forEach(door => {
      if (!door.coord || door.coord.length !== 2) return;
  
      let nearest = null;
      let minDist = Infinity;
  
      corridors.forEach(corridor => {
        const dx = corridor.coord[0] - door.coord[0];
        const dy = corridor.coord[1] - door.coord[1];
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < minDist) {
          minDist = dist;
          nearest = corridor;
        }
      });
  
      if (nearest) {
        // Snap door if slightly off
        if (minDist <= 5) {
          door.coord[0] = nearest.coord[0];
          door.coord[1] = nearest.coord[1];
        }
  
        // Add edges using u/v/w only
        g.edges.push({ u: door.id, v: nearest.id, w: minDist });
        g.edges.push({ u: nearest.id, v: door.id, w: minDist });
        console.log(`Snapped door ${door.id} to corridor ${nearest.id}`);
      } else {
        console.warn(`Door ${door.id} has no nearby corridor to snap to`);
      }
    });
  
    // 7️⃣ Build adjacency list
    const adjacency = graphToAdj(g.nodes, g.edges);
  
    setGraph(g);
    setAdj(adjacency);
    setStartNode(null);
    setEndNode(null);
    setRouteCoords([]);
  
    console.log("Sample nodes:", Object.values(g.nodes).slice(0, 5));
    console.log("Adjacency keys:", Object.keys(adjacency));
  
  }, [geojsonData]);
  
  
  
  
  

  // Compute route when button clicked
  function computeRoute() {
    if (!adj || !startNode || !endNode) {
      console.warn("Missing adjacency or nodes");
      return;
    }

    console.log("Computing route from", startNode, "to", endNode);

    // Check if nodes exist in adjacency
    if (!(startNode in adj)) {
      console.warn("Start node not in adjacency:", startNode);
      return;
    }
    if (!(endNode in adj)) {
      console.warn("End node not in adjacency:", endNode);
      return;
    }

    const res = dijkstra(adj, startNode, endNode);
    console.log("Dijkstra result:", res);

    if (!res) {
      console.warn("No path found between nodes");
      setRouteCoords([]);
      return;
    }

    const coords = pathIdsToCoords(res.path, graph.nodes).map(c => [c[1], c[0]]);
    console.log("Path coords:", coords);
    setRouteCoords(coords);
  }

  function connectDoorsToCorridors(graph) {
    const corridorNodes = Object.values(graph.nodes).filter(n => n.id.startsWith("c_"));
    const doorNodes = Object.values(graph.nodes).filter(n => n.id.startsWith("p_"));
  
    doorNodes.forEach(door => {
      if (!door.coord || door.coord.length !== 2) return;
  
      // Find nearest corridor node
      let nearest = null;
      let minDist = Infinity;
  
      corridorNodes.forEach(corridor => {
        const dx = corridor.coord[0] - door.coord[0];
        const dy = corridor.coord[1] - door.coord[1];
        const dist = Math.sqrt(dx * dx + dy * dy);
  
        if (dist < minDist) {
          minDist = dist;
          nearest = corridor;
        }
      });
  
      if (nearest) {
        // Add edge from door to corridor
        if (!graph.edges) graph.edges = [];
        graph.edges.push({ source: door.id, target: nearest.id, weight: minDist });
        graph.edges.push({ source: nearest.id, target: door.id, weight: minDist });
      }
    });
    }

    function snapDoorsToCorridors(graph, snapThreshold = 5) {
      // Separate corridors and doors
      const corridorNodes = Object.values(graph.nodes).filter(n => n.id.startsWith("c_"));
      const doorNodes = Object.values(graph.nodes).filter(n => n.id.startsWith("p_"));
    
      doorNodes.forEach(door => {
        if (!door.coord || door.coord.length !== 2) return;
    
        let nearest = null;
        let minDist = Infinity;
    
        corridorNodes.forEach(corridor => {
          if (!corridor.coord || corridor.coord.length !== 2) return;
          const dx = corridor.coord[0] - door.coord[0];
          const dy = corridor.coord[1] - door.coord[1];
          const dist = Math.sqrt(dx * dx + dy * dy);
    
          if (dist < minDist) {
            minDist = dist;
            nearest = corridor;
          }
        });
    
        if (nearest) {
          // If the door is slightly off, snap it to the corridor
          if (minDist <= snapThreshold) {
            door.coord[0] = nearest.coord[0];
            door.coord[1] = nearest.coord[1];
            console.log(`Snapped door ${door.id} to corridor ${nearest.id}`);
          }
    
          // Add edges both ways
          graph.edges.push({ u: door.id, v: nearest.id, w: minDist });
          graph.edges.push({ u: nearest.id, v: door.id, w: minDist });
        } else {
          console.warn(`Door ${door.id} has no nearby corridor to snap to`);
        }
      });
    }
    
  

  return (
    <>
      {/* Floorplan GeoJSON */}
      {geojsonData && (
        <GeoJSON
          data={geojsonData}
          style={{
            color: "lime",
            fillColor: "rgba(0,255,0,0.2)",
            weight: 2,
            fillOpacity: 0.5,
            interactive: false,
          }}
        />
      )}

      {/* Nodes */}
      {graph && Object.values(graph.nodes)
  .filter(n => adj && n.id in adj)   // <-- only nodes that are connected
  .map(n => {
    if (!n.coord || !Number.isFinite(n.coord[0]) || !Number.isFinite(n.coord[1])) return null;
    const latlng = [n.coord[1], n.coord[0]];

    let color = "blue";
    if (n.meta?.doorIndex !== undefined) color = "green";
    else if (n.meta?.feature_type === "elevator") color = "purple";
    if (n.id === startNode) color = "orange";
    else if (n.id === endNode) color = "red";

    return (
      <CircleMarker
        key={n.id}
        center={latlng}
        radius={6}
        fillColor={color}
        color="#000"
        weight={1}
        fillOpacity={0.9}
      >
        <Popup>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div>ID: {n.id}</div>
            <button onClick={() => setStartNode(n.id)}>Set Start</button>
            <button onClick={() => setEndNode(n.id)}>Set End</button>
          </div>
        </Popup>
      </CircleMarker>
    );
  })}


      {/* Route polyline */}
      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="red" weight={4} opacity={0.8} />
      )}

      {/* Simple UI */}
      <div style={{ position: 'absolute', right: 12, top: 12, zIndex: 999 }}>
        <div style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: 8, borderRadius: 6 }}>
          <div>Start: {startNode || '—'}</div>
          <div>End: {endNode || '—'}</div>
          <button
            onClick={() => { setStartNode(null); setEndNode(null); setRouteCoords([]); }}
            style={{ marginTop: 6 }}
          >
            Clear
          </button>
          <button
            onClick={computeRoute}
            style={{ marginTop: 6 }}
            disabled={!startNode || !endNode}
          >
            Compute Route
          </button>
        </div>
      </div>
    </>
  );
}
