import MapView from "../components/MapView";
import RoutePlanner from "../components/RoutePlanner";
import styled from "styled-components";
import React, {useEffect, useState} from 'react';
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
    background-color: #2e2e2e;
  }
`;

const PageContainer = styled.div`
    display: flex;
    position: fixed;
    top: 0;       /* ensures no top gap */
    left: 0;      /* ensures no left gap */
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #2e2e2e;
`;

const SideBar = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 435px;
    height: 100%;
    background-color: #2e2e2e;
    color: white;
    border-right: 2px solid #444;
    padding: 1rem 1rem 1rem 1rem;
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
    
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari */
    }
    
`;

const MapContainer = styled.div`
    flex: 1; /* take remaining space on the right */
    background-color: #d9d9d9; /* placeholder for map */
    width: calc(100vw - 400px);
`;

export default function MainPage() {
    const [selectedFeature, setSelectedFeature] = useState(null);
    return (
        <>
            <GlobalStyle />
            <PageContainer>
                <SideBar>
                    <RoutePlanner onSelectFeature={setSelectedFeature}/>
                </SideBar>
                <MapContainer>
                    <MapView selectedFeature={selectedFeature} />
                </MapContainer>
            </PageContainer>
        </>
            
        
    );
}