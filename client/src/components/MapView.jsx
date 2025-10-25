import React, {useEffect} from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styled from "styled-components";
import L from 'leaflet';


import {useBuildingGeoJSONData, useBusStopGeoJSONData,useHighwayGeoJSONData } from '../utils/loadGeoJSONData';

// Styled component for the map container
const MapContainerStyled = styled(MapContainer)`
    height: 100vh;
    width: 100%;
`;

// Base Map Tile Layer
const tileLayer = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
};

export default function MapView({ selectedFeature, geoJsonData, center = [39.2554, -76.7116], zoom = 17 }) {
    function ZoomFeature({feature}) {
    const map = useMap();
    useEffect(() => {
      if (!feature) return;

      let lat, lng;

      if (feature.geometry.type === "Point") {
        [lng, lat] = feature.geometry.coordinates;
      } else if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
        // Zoom to the centroid of the polygon
        const coords = feature.geometry.type === "Polygon"
          ? feature.geometry.coordinates[0] // first ring
          : feature.geometry.coordinates[0][0]; // first ring of first polygon

        const lats = coords.map(c => c[1]);
        const lngs = coords.map(c => c[0]);
        lat = (Math.min(...lats) + Math.max(...lats)) / 2;
        lng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
      } else {
        return;
      }

      map.flyTo([lat, lng], 18);
    }, [feature, map]);

    return null
  }
  
  const { buildings, loading: buildingsLoading } = useBuildingGeoJSONData();
  const { busstops, loading: busstopsLoading } = useBusStopGeoJSONData();
  const { highways, loading: highwaysLoading } = useHighwayGeoJSONData();
  
  
  if (buildingsLoading || busstopsLoading || highwaysLoading) {
    return <div>Loading map data...</div>;
  }

  return (
    <MapContainerStyled center={center} zoom={zoom} scrollWheelZoom={true}>
     <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />

     <GeoJSON
      data={buildings}
      style={() => ({
        color: '#a3b2ccc8',
        weight: 2,
        fillOpacity: 0.1
      })}
      onEachFeature={(feature, layer) => {
        const name = feature?.properties?.name || "Building";
        const buildingId = feature.properties.building_id;

      // image of each building fro assets folder
      const imgHtml = `<img src="/assets/${buildingId}.jpg" alt="${name}" style="width:100%;height:auto;"/>`;
        layer.bindPopup(`<div><strong>${name}</strong><br/>${imgHtml}</div>`);

      }}
     />

     <GeoJSON
      data={busstops}
      pointToLayer={(feature, latlng) =>
        L.circleMarker(latlng, {
         radius: 6,
         fillColor: 'red',
         color: '#ff0000',
         weight: 1,
         opacity: 1,
         fillOpacity: 0.8
        })
      }
      onEachFeature={(feature, layer) => {
        layer.bindPopup("Bus Stop:" + feature.properties.name);
      }}
     />

      <GeoJSON
      data={highways}
      style={() => ({
        color: '#7a8289fc',
        weight: 3,
        opacity: 0.9
      })}
      />


      {selectedFeature && <ZoomFeature feature={selectedFeature} />}
    </MapContainerStyled>
  );
}