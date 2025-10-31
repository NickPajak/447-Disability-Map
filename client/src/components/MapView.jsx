import React, { useEffect, useRef } from 'react';
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

function getFeatureCenter(feature){
    if (!feature.geometry) return null;

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
        return null;
      }

      return [lat, lng];
}
  //Zoom Feature
function ZoomFeature({feature}) {
  const map = useMap();
  useEffect(() => {
    if (!feature) return;
    const destination = getFeatureCenter(feature);
    if (destination) map.flyTo(destination, 18);
  }, [feature, map]);

  return null
}


export default function MapView({ selectedFeature, onAddFeature, geoJsonData, center = defaultCenter, zoom = 17 }) {
  //Load geoJsonData 
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

  const buildingMarkers = buildings.map((feature, index) => {
        const center = getFeatureCenter(feature);
        if (!center) return null;

        const name = feature.properties.name || "building";
        const buildingId = feature.properties.building_id;
        const info = metadata[buildingId] || {};
        const desc = info.description || "No description available.";
        const defaultImage = "/assets/default.jpg";
        const imgHtml = info.image || `/assets/${buildingId}.jpg` || `/assets/default.jpg`;

        return(
          <Marker key={index} position={center}>
            <Popup maxWidth= {260}>
              <div style={{width: "240px", textAlign: "left"}}>
                <h3>{name}</h3>
                <img
                  src={imgHtml}
                  alt={name}
                  style={{
                    width : "100%",
                    height: "auto",
                    maxHeight: "120px", 
                    objectFit: "cover", borderRadius: "4px" }}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = defaultImage;
                  }}
                />
                <p style={{ marginTop: "8px" }}>{desc}</p>
                <button
                    onClick={() => onAddFeature(feature)}
                      style={{
                        marginTop: "8px",
                        padding: "6px 12px",
                        backgroundColor:" #6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                >
                  + ADD
                </button>

                <button
                onclick="
                // **********View floor plan function to be implemented************
                "
                >
                  View Floorplan
                </button>
              </div>
            </Popup>
          </Marker>
        )
      })

  const busStopMarkers = busstops.map ((feature, index) => {
    const center = getFeatureCenter(feature);
    if(!center) return null;

    const name = feature.properties.name || "Bus Stop";
    const [lng, lat] = feature.geometry.coordinates;
    return (
      <Marker position={center}>
        <Popup maxWidth={220}>
          <h3>Bus Stop: {name}</h3>
          <button
            onClick={()=> onAddFeature(feature)}
            style={{
              marginTop: "8px",
              padding: "6px 12px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            + ADD
          </button>
        </Popup>
      </Marker>
    );
  });
    

  return (
    <MapContainerStyled center={center} zoom={zoom} scrollWheelZoom={true}>
     <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />

    <GeoJSON
    data={highways}
    style={() => ({...highwayStyle})}
    />


      <GeoJSON
      data={busstops}
      pointToLayer={(feature, latlng) =>
        L.circleMarker(latlng, busstopStyle)
      }
     />
     {busStopMarkers}
      {buildingMarkers}

      {selectedFeature && <ZoomFeature feature={selectedFeature} />}
    </MapContainerStyled>
  );
}
