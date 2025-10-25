import React from "react";
import styled from "styled-components";
import { useBuildingMetadata } from "../utils/loadMetadata";

const Card = styled.div`
    position: relative;
    width: 400px;
    height: 280px;
    background-color: #1e1e1e;
    color: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const ImageWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    overflow: hidden;
`;

const TextWrapper = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    padding: 10px
    display: flex;
    flex-direction: column;

`;

const BuildingImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;           /* required */
    object-position: center 40%; /* horizontal vertical - try 40% to show more center */
    display: block;
`;

const Label = styled.span`
    position: absolute;
    top: 120px; /* slightly overlapping image edge */
    left: 6px;
    background-color: rgba(30, 30, 30, 0.85);
    padding: 6px 12px;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 20px;
    white-space: nowrap;
    backdrop-filter: blur(4px);
`;

// TODO: Make this better
const Description = styled.p`
    font-size: 14px;
    font-weight: 400;
    max-height: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-wrap: break-word;
    padding: 12px;
`;

const FloorplanButton = styled.button`
    position: absolute;
    left: 10px;
    background-color: #fdb515;
    color: black;
    border-radius: 1rem;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #3b3b3b;
        color: #fdb515;
    }

`;


export default function DestinationCard({ label, building, onClear}) {
    const metadata = useBuildingMetadata();
    if (!building) return null; // or return a placeholder/loading message

    const id = building.properties.building_id;
    const info = metadata[id] || {};
    const imageSrc = `/assets/${id || "default"}.jpg`;

    return(
        <Card>
            <ImageWrapper>
                <BuildingImage src={imageSrc} alt={building?.properties?.name || "Building"}/>
            </ImageWrapper>
            <Label>{building.properties.name}</Label> 
            <TextWrapper>
                <Description>{info.description}</Description>
                <FloorplanButton type="submit">
                    <p>View Floorplan</p>
                </FloorplanButton>
            </TextWrapper>
            
        </Card>
    );
}