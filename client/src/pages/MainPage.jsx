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

    // Welcome Message
    const [showAnnouncement, setShowAnnouncement] = useState(true);

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
                {showAnnouncement && (
                    <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999
                    }}>
                        <div style={{
                            width: "560px",
                            maxWidth: "90vw",
                            padding: "24px",
                            borderRadius: "14px",
                            background: "#ffffff",
                            color: "#000",
                            boxShadow: "0 6px 14px rgba(0,0,0,0.25)"
                        }}>
                            <h2 style={{ marginTop: 0 }}>Announcements</h2>

                            <div>
                                <h3>🚧 Alerts</h3>
                                <p>Construction around <strong>Sherman</strong> and <strong>Sondheim</strong>, so some routes may shift.</p>

                                <h3>♿ Accessibility Notes</h3>
                                <p>Outdoor accessible routes are open during school hours.</p>
                                <p>Indoor 24/7 routes need clearance once buildings lock.</p>

                                <h3>⚠️ Quick Reminder</h3>
                                <p>This app doesn’t replace official emergency or evacuation instructions.</p>
                            </div>

                            <button
                                onClick={() => setShowAnnouncement(false)}
                                style={{
                                    marginTop: "20px",
                                    padding: "12px",
                                    width: "100%",
                                    borderRadius: "10px",
                                    border: "none",
                                    background: "#333",
                                    color: "white",
                                    fontSize: "1rem",
                                    cursor: "pointer"
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

            </PageContainer>
        </>
    );
}
