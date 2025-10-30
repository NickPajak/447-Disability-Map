import React, {useState} from 'react';
import styled from "styled-components";
import RouteSearchBar from './RouteSearchBar';
import DestinationCard from './DestinationCard';
import {MapPinIcon} from '@heroicons/react/24/solid';

const StartRouteButton = styled.button`
    background-color: #fdb515;
    color: black;
    border-radius: 1rem;
    border: none;
    cursor: pointer;
    padding: 3px 20px;
    margin-top: 24px; 

    &:hover {
        background-color: #3b3b3b;
        color: #fdb515;
    }

`;

export default function RoutePlanner( {onSelectFeature}) {
    // Track which step the user is on: "start", "end", or "done"
    const [step, setStep] = useState("start");

    // Store selected start and end destinations
    const [startDestination, setStartDestination] = useState(null);
    const [endDestination, setEndDestination] = useState(null);

    //const [selectedFeature, setSelectedFeature] = useState(null);

    const handleSelectBuilding = (building) => {
        if(step === "start") {
            setStartDestination(building);
            setStep("end");
        } else {
            setEndDestination(building);
            setStep("done");
        }
        onSelectFeature(building);
    };

    // Resets both destinations and restarts planner from the "start" step.
    const resetRoute = () => {
        setStartDestination(null);
        setEndDestination(null);
        setStep("start");
    };

    return(
        <div style={{ position: "relative", paddingBottom:"80px"}}>
            <h2>Campus Compass</h2>
            <RouteSearchBar 
                key={step}
                placeholder={
                    step === "start" ? "Search start destination..." : "Search end destination"
                }
                onSelectBuilding={handleSelectBuilding}
            />

            {/* if there's no place added to route, add default welcome text*/}
            {!startDestination && !endDestination && (
                <div
                    style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "200px", 
                    backgroundColor: "rgba(0, 0, 0, 0.25)", 
                    borderRadius: "12px",
                    marginBottom: "16px",
                    textAlign: "center",
                    color: "white",
                    fontSize: "1.2rem",
                    fontWeight: "500",
                    gap: "10px",
                    }}
                >
                    <MapPinIcon style={{width: '50px', height: '50px'}} />
                    <div>Your path, made easier. </div>
                    <div>Begin by adding your current location. </div>
                </div>
            )}

            {/* Show both cards stacked below */}
            <div style={{ marginTop: "16px" }}>
                {startDestination && (
                <DestinationCard
                    label="Start"
                    building={startDestination}
                />
                )}

                {endDestination && (
                <DestinationCard
                    label="End"
                    building={endDestination}
                />
                )}
            </div>

            {(startDestination || endDestination) && (
                <button
                onClick={resetRoute}
                style={{
                    marginTop: "12px",
                    padding: "8px 12px",
                    backgroundColor: "#444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                }}
                >
                Reset
                </button>
            )}
            {/*TODO: Integrate button with route planning*/}
            {startDestination && endDestination && (
                <StartRouteButton style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                }}>
                    <h3>Start Route</h3>
                </StartRouteButton>
            )}
        </div>
    );
}