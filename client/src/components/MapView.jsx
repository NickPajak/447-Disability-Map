import React from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styled from "styled-components";
import L from 'leaflet';


import {useBuildingGeoJSONData, useBusStopGeoJSONData,useHighwayGeoJSONData } from '../utils/loadGeoJSONData';

// Styled component for the map container
const MapContainerStyled = styled(MapContainer)`
    height: 100vh;
    width: 100%;
`;

// default center for the map (keep this name separate from the component prop)
const defaultCenter = [39.2554, -76.7116];


// Base Map Tile Layer
const tileLayer = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
};
export default function MapView({ geoJsonData, center = defaultCenter, zoom = 17 }) {
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
        const imgHtml = `/assets/${buildingId}.jpg` ;

        const customPopupStyle = `
          <div style ="
           width: 260px;
           min-height: 150px;
           overflow: hidden;
           text-align: left;
           font-family: Arial, sans-serif;
          ">
        
            <h3 style="margin-bottom: 8px;">${name}</h3>
            <img src="${imgHtml}" alt="${name}" 
              width="250"
              height="150"
            />

            <button 
              style="
                margin-top: 8px;
                padding: 6px 12px;
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
              "
            >
            + ADD
            </button>

            <button 
              style="
                margin-top: 8px;
                margin-left: 8px;
                padding: 6px 12px;
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                center: right;
              "
            >
            VIEW FLOOR PLAN
            </button>
          </div>

        `;

      // build the popup HTML as a string (embed image path directly into src)
        layer.bindPopup(customPopupStyle);

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
        const customPopupStyle = `
          <div style="
           width: 200px;
           min-height: 100px;
           overflow: hidden;
           text-align: left;
           font-family: Arial, sans-serif;
          ">
            <h3 style="margin-bottom: 8px;">Bus Stop: ${feature.properties.name}</h3>
            <button 
              style="
                margin-top: 8px;
                padding: 6px 12px;
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
              "
            >
            + ADD
            </button>

          </div>
        `;
        layer.bindPopup(customPopupStyle);
      }}
     />

    </MapContainerStyled>
  );
}