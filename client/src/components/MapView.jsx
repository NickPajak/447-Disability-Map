import React from "react";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styled from "styled-components";
// Styled component for the map container
const MapContainerStyled = styled(MapContainer)`
    height: 100vh;
    width: 100%;
`;
const tileLayer = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
};
export default function MapView({ geoJsonData, center = [39.2554, -76.7116], zoom = 17 }) {
  return (
    <MapContainerStyled center={center} zoom={zoom} scrollWheelZoom={true}>
      <TileLayer
        url={tileLayer.url}
        attribution={tileLayer.attribution}
      />
      {geoJsonData && <GeoJSON data={geoJsonData} />}
    </MapContainerStyled>
  );
}