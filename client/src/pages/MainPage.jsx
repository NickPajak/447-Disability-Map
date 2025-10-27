import MapView from "../components/MapView";
import RoutePlanner from "../components/RoutePlanner";
import styled from "styled-components";
import React, {useEffect, useState} from 'react';

const PageContainer = styled.div`
    display: flex;
    justify-content: flex-start;  /* Align left */
    align-items: flex-start;      /* Align top */
    height: 100vh;
    background-color: #2e2e2e;
`;

const SideBar = styled.div`
    display: flex;
    flex-direction: column; /* stack vertically */
    gap: 1rem; /* spacing between elements */
    width: 400px;
    Margin-left: 0;
    padding: 1rem;
    background-color: #2e2e2e; /* dark sidebar background */
    color: white;
    border-right: 2px solid #444;
    overflow-y: auto;
`;

const MapContainer = styled.div`
    flex: 1; /* take remaining space on the right */
    height: 100%;
    background-color: #d9d9d9; /* placeholder for map */
`;

export default function MainPage() {
    const [selectedFeature, setSelectedFeature] = useState(null);
    return (
        <PageContainer>
            <SideBar>
                <RoutePlanner onSelectFeature={setSelectedFeature}/>
            </SideBar>
            <MapContainer>
                <MapView selectedFeature={selectedFeature} />
            </MapContainer>
        </PageContainer>
    );
}