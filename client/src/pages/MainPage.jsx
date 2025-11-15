import MapView from "../components/MapView";
import RoutePlanner from "../components/RoutePlanner";
import styled from "styled-components";
import React, { useState } from 'react';
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #acaaaaff;
  }
`;

const PageContainer = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: ${props => props.theme.routePlannerBg};
`;

const SideBar = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 440px;
    height: 100%;
    background-color: ${props => props.theme.routePlannerBg};
    color: white;
    border-right: 2px solid transparent;
    padding: 1rem 1rem 1rem 1rem;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const MapContainer = styled.div`
    flex: 1;
    background-color: #d9d9d9;
    width: calc(100vw - 400px);
`;

export default function MainPage({darkMode}) {
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [featureToAdd, setFeatureToAdd] = useState(null);
    const [routeRequest, setRouteRequest] = useState(null);

    const handleAddFeature = (feature) => {
        setFeatureToAdd(feature);
        setSelectedFeature(feature);
    };

    const handleFeatureConsumed = () => {
        setFeatureToAdd(null);
    };

    const handleRouteRequest = (startId, endId) => {
        setRouteRequest({startId, endId});
    };

    return (
        <>
            <GlobalStyle />
            <PageContainer>
                <SideBar>
                    <RoutePlanner
                        onSelectFeature={setSelectedFeature}
                        addFeature={featureToAdd}
                        onFeatureConsumed={handleFeatureConsumed}
                        onRouteRequest={handleRouteRequest}

                    />
                </SideBar>
                <MapContainer>
                    <MapView
                        selectedFeature={selectedFeature}
                        onAddFeature={handleAddFeature}
                        darkMode={darkMode}
                        routeRequest={routeRequest}
                    />
                </MapContainer>
            </PageContainer>
        </>
    );
}
