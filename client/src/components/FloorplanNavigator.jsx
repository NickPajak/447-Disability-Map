import React, { useEffect, useState } from 'react';
import { GeoJSON, CircleMarker, Polyline, useMapEvents, Popup } from 'react-leaflet';
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
    const g = buildGraphFromGeojson(geojsonData, { maxConnectDist: 40 });
    setGraph(g);
    setAdj(graphToAdj(g.nodes, g.edges));
    setStartNode(null);
    setEndNode(null);
    setRouteCoords([]);
  }, [geojsonData]);

  // Map click handler to select closest node
  function MapClicker() {
    useMapEvents({
      click(e) {
        if (!graph) return;
        const { lat, lng } = e.latlng;

        // Find closest node
        let best = null;
        Object.values(graph.nodes).forEach(n => {
          const dx = n.coord[0] - lng;
          const dy = n.coord[1] - lat;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (!best || d < best.d) best = { n, d };
        });

        if (best && best.d < 30) { // threshold distance
          if (!startNode) setStartNode(best.n.id);
          else if (!endNode) setEndNode(best.n.id);
          else {
            setStartNode(best.n.id);
            setEndNode(null);
            setRouteCoords([]);
          }
        }
      }
    });
    return null;
  }

  // Compute route whenever start/end nodes are set
  useEffect(() => {
    if (!adj || !startNode || !endNode) return;

    const res = dijkstra(adj, startNode, endNode);
    if (!res) {
      setRouteCoords([]);
      return;
    }

    const coords = pathIdsToCoords(res.path, graph.nodes)
      .map(c => [c[1], c[0]]); // swap [x, y] → [lat, lng] for Leaflet
    setRouteCoords(coords);
  }, [adj, startNode, endNode, graph]);

  return (
    <>
      <MapClicker />

      {/* Floorplan GeoJSON */}
      {geojsonData && (
        <GeoJSON
          data={geojsonData}
          style={{
            color: "lime",
            fillColor: "rgba(0,255,0,0.2)",
            weight: 2,
            fillOpacity: 0.5
          }}
        />
      )}

      {/* Nodes */}
      {graph && Object.values(graph.nodes).map(n => {
        if (!n.coord || !Number.isFinite(n.coord[0]) || !Number.isFinite(n.coord[1])) return null;
        const latlng = [n.coord[1], n.coord[0]];

        let color = "blue";
        if (n.meta?.doorIndex !== undefined) color = "green";
        else if (n.meta?.feature_type === "elevator") color = "purple";

        // Highlight selected nodes
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
        <Polyline
          positions={routeCoords}
          color="red"
          weight={4}
          opacity={0.8}
        />
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
        </div>
      </div>
    </>
  );
}
