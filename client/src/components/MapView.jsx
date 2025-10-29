import React, {use, useEffect} from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styled from "styled-components";
import L from 'leaflet';


import {useBuildingGeoJSONData, useBusStopGeoJSONData,useHighwayGeoJSONData } from '../utils/loadGeoJSONData';
import { useBuildingMetadata } from '../utils/loadMetadata';

// default center for the map (UMBC coordinates)
const defaultCenter = [39.2554, -76.7116];

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

export default function MapView({ selectedFeature, geoJsonData, center = defaultCenter, zoom = 17 }) {
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

  const metadata = useBuildingMetadata();
  
  
  if (buildingsLoading || busstopsLoading || highwaysLoading || !metadata) {
    return <div>Loading map data...</div>;
  }

  const buildingStyle = {
    color: '#6e75817c',
    weight: 2,
    fillOpacity: 0.3
  };

  const highwayStyle = {
    color: '#7a8289fc',
    weight: 3,
    opacity: 0.9
  };

  const busstopStyle = {
    radius: 6,
    fillColor: '#ff5e00', 
    color: '#000000',   
    weight: 1,
    opacity: 1,
    fillOpacity: 0.9
  };

  

  return (
    <MapContainerStyled center={center} zoom={zoom} scrollWheelZoom={true}>
     <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />

     <GeoJSON
      data={buildings}
      style={() => ({...buildingStyle})}
      onEachFeature={(feature, layer) => {  
        const name = feature.properties.name || "Building";
        const buildingId = feature.properties.building_id;
        
        const info = metadata[buildingId] || {};
        const desc = info.description || "No description available.";
        const imgHtml = info.image || "No image available." ;
  
        const defaultImgHtml = `https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg`;
        const defaultImgAttribution = `<a href="https://commons.wikimedia.org/wiki/File:No_image_available.svg" target="_blank" rel="noopener noreferrer">Cburnett</a>, Public domain, via Wikimedia Commons`;
        

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
              onerror="this.onerror=null;this.src='${defaultImgHtml}'"
              width="250"
              height="150"
              style="object-fit: cover; border-radius: 4px;"
            />
            <p style="margin-top: 8px;">${desc}</p>
            <div style="display: flex; justify-content: space-between;">

            <button id="add-${buildingId}"
              style="
                margin-top: 8px;
                padding: 6px 12px;
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
              "

              //*****ADD BUTTON FUNCTIONALITY TO BE IMPLEMENTED*****
              onclick="
                this.innerText = 'ADDED';
                window.dispatchEvent(new CustomEvent('buildingAdded', { detail: { buildingId: '${buildingId}', name: '${name}', type: 'building' } }));
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
              onclick="
                // **********View floor plan function to be implemented*************
              "
            >
            VIEW FLOOR PLAN
            </button>
          </div>

        `;

        layer.bindPopup(customPopupStyle);

      }}
     />

      <GeoJSON
      data={highways}
      style={() => ({...highwayStyle})}
      />


      <GeoJSON
      data={busstops}
      pointToLayer={(feature, latlng) =>
        L.circleMarker(latlng, busstopStyle)
      }

      onEachFeature={(feature, layer) => {
        const name = feature?.properties?.name || "Bus Stop";
        const busStopId = feature.properties.busstop_id;

        const customPopupStyle = `
          <div style="
           width: 200px;
           min-height: 100px;
           overflow: hidden;
           text-align: left;
           font-family: Arial, sans-serif;
          ">
            <h3 style="margin-bottom: 8px;">Bus Stop: ${name} </h3>
            <button id ="add-${busStopId}"
              style="
                margin-top: 8px;
                padding: 6px 12px;
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
              "

              //*****ADD BUTTON FUNCTIONALITY TO BE IMPLEMENTED*****

              onclick="
                document.getElementById('add-${busStopId}').innerText = 'ADDED',
                window.dispatchEvent(new CustomEvent('buildingAdded', { detail: { buildingId: '${busStopId}', name: '${name}', type: 'busstop' } }))
                ;"

            >
            + ADD
            </button>

          </div>
        `;
        layer.bindPopup(customPopupStyle);
      }}
     />



      {selectedFeature && <ZoomFeature feature={selectedFeature} />}
    </MapContainerStyled>
  );
}
