import React from "react";
import styled from "styled-components";
import { useBuildingMetadata } from "../utils/loadMetadata";

const Card = styled.div`
    position: relative;
    width: 400px;
    height: 280px;
    background-color: #fdb515;
    color: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border: 2px solid;
    border-color: #ffffffff;
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
    padding: 10px;
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
    background-color: rgba(54, 44, 14, 0.8);
    padding: 6px 12px;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 20px;
    white-space: nowrap;
    backdrop-filter: blur(4px);
`;

// TODO: Make this better
const Acronym = styled.p`
    background-color: #a67a05;
    color: #ffffffff;
    border-radius: 0.5rem;
    border: none;
    padding: 5px 9px;
    font-weight: 600;
    width: fit-content;
`;
const FloorplanButton = styled.button`
    left: 10px;
    background-color: rgba(59, 59, 59, 1);
    color: #ffffffff;
    border-radius: 1rem;
    border: 1px solid transparent;
    cursor: pointer;
    padding: 0px 8px;        /* controls height/width */
    width: fit-content;        /* button only as wide as its content */

    &:hover {
        background-color:  #a67a05;
        color: #ffffffff;
        border-color: #a07707ff;
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
                <Acronym>{metadata[id]?.acronym}</Acronym>
                <FloorplanButton type="submit">
                    <p style={{fontSize: "15px"}}>View Floorplan</p>
                </FloorplanButton>
            </TextWrapper>
            
        </Card>
    );
}