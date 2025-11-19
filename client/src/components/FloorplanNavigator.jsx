import React, { useEffect, useState } from 'react';
import { GeoJSON, CircleMarker, Polyline, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import { buildGraphFromGeojson, graphToAdj } from '../utils/indoorGraph';
import { dijkstra, pathIdsToCoords } from '../utils/indoorRouteSearch';

export default function FloorplanNavigator({ geojsonData }) {
  const [graph, setGraph] = useState(null);
  const [adj, setAdj] = useState(null);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [routeCoords, setRouteCoords] = useState(null);

  useEffect(() => {
    if (!geojsonData) return;
    const g = buildGraphFromGeojson(geojsonData, { maxConnectDist: 40 });
    setGraph(g);
    setAdj(graphToAdj(g.nodes, g.edges));
    setStartNode(null);
    setEndNode(null);
    setRouteCoords(null);
  }, [geojsonData]);

  function MapClicker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (!graph) return;
        let best = null;
        Object.values(graph.nodes).forEach(n => {
          const dx = n.coord[0] - lng;
          const dy = n.coord[1] - lat;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (!best || d < best.d) best = { n, d };
        });
        if (best && best.d < 30) {
          if (!startNode) setStartNode(best.n.id);
          else if (!endNode) setEndNode(best.n.id);
          else {
            setStartNode(best.n.id);
            setEndNode(null);
            setRouteCoords(null);
          }
        }
      }
    });
    return null;
  }

  useEffect(() => {
    if (!adj || !startNode || !endNode) return;
    const res = dijkstra(adj, startNode, endNode);
    if (!res) {
      setRouteCoords(null);
      return;
    }
    const coords = pathIdsToCoords(res.path, graph.nodes);
    setRouteCoords(coords.map(c => [c[1], c[0]])); // [lat, lng]
  }, [adj, startNode, endNode, graph]);

  return (
    <>
      <MapClicker />

      {/* Floorplan rooms */}
      {geojsonData && (
        <GeoJSON
          data={geojsonData}
          style={{
            color: "lime",
            weight: 2,
            fillColor: "rgba(0,255,0,0.2)",
            fillOpacity: 0.5
          }}
        />
      )}

      {/* Nodes as circle markers */}
      {graph && Object.values(graph.nodes).map(n => {
        if (!n.coord || !Number.isFinite(n.coord[0]) || !Number.isFinite(n.coord[1])) return null;

        const latlng = [n.coord[1], n.coord[0]]; // [lat, lng]
        let color = "blue";
        if (n.meta?.doorIndex !== undefined) color = "green";
        else if (n.meta?.feature_type === "elevator") color = "purple";

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
      {routeCoords && (
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
          <button onClick={() => { setStartNode(null); setEndNode(null); setRouteCoords(null); }} style={{ marginTop: 6 }}>
            Clear
          </button>
        </div>
      </div>
    </>
  );
}
