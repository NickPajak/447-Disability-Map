import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import MapView from "../components/MapView";
import RoutePlanner from "../components/RoutePlanner";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    background-color: #acaaaa;
    overflow: hidden;
  }
`;

const PageContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  gap: 1rem;
  position: relative;
  background-color: ${({ theme }) => theme.routePlannerBg};
  color: white;
  transition: all 0.3s ease;

  /* Desktop: always visible */
  width: 400px;
  @media (max-width: 768px) {
    /* Mobile: collapsed by default */
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: ${({ expanded }) => (expanded ? "100vh" : "0")};
    padding: ${({ expanded }) => (expanded ? "1rem" : "0")};
    overflow: auto;
    z-index: 2000;
  }
`;




const MapContainer = styled.div`
  flex: 1;
  background-color: #d9d9d9;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    filter: ${({ expanded }) => (expanded ? "blur(2px)" : "none")};
  }
`;



export default function MainPage({ darkMode }) {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureToAdd, setFeatureToAdd] = useState(null);
  const [routeRequest, setRouteRequest] = useState(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showRoute, setShowRoute] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleAddFeature = (feature) => {
    setFeatureToAdd(feature);
    setSelectedFeature(feature);
  };

  const handleFeatureConsumed = () => {
    setFeatureToAdd(null);
  };

  const handleRouteRequest = (startId, endId) => {
    setRouteRequest({ startId, endId });
    setShowRoute(true);
    if (isMobile) setIsExpanded(false);
  };

  return (
    <>
      <GlobalStyle />

      <PageContainer>
        {/* Sidebar toggle button */}
        {isMobile && (
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            style={{
              position: 'fixed',
              top: '10px',
              left: '10px',
              background: 'black',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              zIndex: 2100,
            }}
          >
            {isExpanded ? '✕' : '☰'}
          </button>
        )}


        {/* Sidebar */}
        <SideBar expanded={isExpanded}>
          <RoutePlanner
            onSelectFeature={setSelectedFeature}
            addFeature={featureToAdd}
            onFeatureConsumed={handleFeatureConsumed}
            onRouteRequest={handleRouteRequest}
            onExpand={() => setIsExpanded(true)}
            onCollapse={() => setIsExpanded(false)}
          />
        </SideBar>

        {/* Map */}
        <MapContainer expanded={isExpanded}>
          <MapView
            selectedFeature={selectedFeature}
            onAddFeature={handleAddFeature}
            darkMode={darkMode}
            routeRequest={showRoute ? routeRequest : null}
          />
        </MapContainer>

        {/* Announcement overlay */}
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
