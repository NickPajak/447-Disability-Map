import React, { use, useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styled from "styled-components";
import L from 'leaflet';
import {useBuildingGeoJSONData, useBusStopGeoJSONData,useHighwayGeoJSONData, useEntranceGeoJSONData } from '../utils/loadGeoJSONData';
import { useBuildingMetadata } from '../utils/loadMetadata';
import { findRoute } from '../utils/geojsonRouteSearch';
import { Polyline } from 'react-leaflet';

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});
// default center for the map (UMBC coordinates)
const defaultCenter = [39.2554, -76.7116];

// Styled component for the map container
const MapContainerStyled = styled(MapContainer)`
    height: 100vh;
    width: 100%;
`;


// Light Base Map Tile Layer
const lightTileLayer = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
};

// Dark Base Map Tile Layer
const darkTileLayer = {
  url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  attribution: '&copy; <a href="https://www.carto.com/">CARTO</a> contributors &copy; OpenStreetMap'
};

//return center of the building
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

//hide building types. not show mis items in building geojson
const hiddenTypes = ["bridge", "deck", "Loading Dock"];


export default function MapView({ selectedFeature, onAddFeature,routeRequest ,darkMode, geoJsonData, center = defaultCenter, zoom = 17 }) {
  //Load geoJsonData 
  const { buildings, loading: buildingsLoading } = useBuildingGeoJSONData();
  const { busstops, loading: busstopsLoading } = useBusStopGeoJSONData();
  const { highways, loading: highwaysLoading } = useHighwayGeoJSONData();
  const { entrances, loading: entrancesLoading } = useEntranceGeoJSONData();
  const [route, setRoute] = useState(null);
  const metadata = useBuildingMetadata();

    // Handle route search
  useEffect(() => {
  if (!routeRequest) return;
  if (!highways.length || !entrances.length || !busstops.length) return;

  console.log("MapView received routeRequest:", routeRequest);

  const startId = routeRequest.startId;
  const endId = routeRequest.endId;

  // IMPORTANT: wrap GeoJSON arrays into FeatureCollection
  const highwayFC = { type: "FeatureCollection", features: highways };
  const entranceFC = { type: "FeatureCollection", features: entrances };
  const busstopFC = { type: "FeatureCollection", features: busstops };

  const result = findRoute({
    startBuildingId: startId,
    endBuildingId: endId,
    entrances: entranceFC,
    highways: highwayFC,
    busstops: busstops.features || busstops,
    metadata: metadata
  });

  console.log("Route result = ", result);

  setRoute(result);
}, [routeRequest, highways, entrances, busstops, metadata]);


  if (buildingsLoading || busstopsLoading || highwaysLoading || !metadata  || entrancesLoading) {
    return <div>Loading map data...</div>;
  }

  const buildingStyle = {
    color: darkMode ? '#a8a8a8ff' : '#6e75817c',
    weight: 1,
    fillColor: darkMode ? '#ffffffff' : '#6e75817c',
    fillOpacity: 0.3
  };

  const highwayStyle = {
    color: '#fdac153d',
    weight: 3,
    opacity: 0.9
  };

  const busstopStyle = {
    radius: 6,
    fillColor: '#fdb515', 
    color: '#000000',   
    weight: 1,
    opacity: 1,
    fillOpacity: 0.9
  };

  //Marker + Popup 
  const buildingMarkers = buildings
        //hide mis buildings
      .filter((feature)=> {
        const name = feature.properties.name?.toLowerCase() || "";
        return !(hiddenTypes.includes(name));
      })
      //show marker
      .map((feature, index) => {
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
                style={{
                  marginTop: "8px", 
                  marginLeft: "8px",
                  padding: "6px 12px",
                  backgroundColor:" #6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  center: "right",
                }}
                >
                  View Floorplan
                </button>
              </div>
            </Popup>
          </Marker>
        )
      })
  
    // Bus Marker
  const busStopMarkers = busstops
    .map ((feature, index) => {
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
     <TileLayer
      url={darkMode ? darkTileLayer.url : lightTileLayer.url}
      attribution={darkMode ? darkTileLayer.attribution : lightTileLayer.attribution}
    />

    <GeoJSON data={buildings.filter(
      (feature) => !hiddenTypes.includes(feature.properties.name?.toLowerCase())
    )}
    style={() => ({...buildingStyle})} />

    <GeoJSON data={busstops} style={() => ({...busstopStyle})} pointToLayer={(feature, latlng) => L.circleMarker(latlng, busstopStyle)}/>
     
    {busStopMarkers}
    {buildingMarkers}

    {selectedFeature && <ZoomFeature feature={selectedFeature} />}
    
    <GeoJSON data={highways} style={() => ({...highwayStyle})} />
    {route?.route_coords && (
    <Polyline
      positions={route.route_coords.map(([lng, lat]) => [lat, lng])}
     color="red"
      weight={5}
    />
    )}
    
    </MapContainerStyled>
  );


}
