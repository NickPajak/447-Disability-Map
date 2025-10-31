import React, {useState, useEffect, useCallback} from 'react';
import styled from "styled-components";
import RouteSearchBar from './RouteSearchBar';
import DestinationCard from './DestinationCard';
import {MapPinIcon, HomeIcon} from '@heroicons/react/24/solid';
import { Icon } from 'leaflet';

const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  position: relative;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.h2`
  text-align: center;
  width: 100%;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  padding: 5px;
  color: #000000;
`;

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

export default function RoutePlanner( {onSelectFeature, addFeature, onFeatureConsumed} ) {
    // Track which step the user is on: "start", "end", or "done"
    const [step, setStep] = useState("start");

    // Store selected start and end destinations
    const [startDestination, setStartDestination] = useState(null);
    const [endDestination, setEndDestination] = useState(null);

    //const [selectedFeature, setSelectedFeature] = useState(null);

    const handleSelectBuilding = useCallback((building) => {
        if(!building) {
            return;
        }
        if(step === "start") {
            setStartDestination(building);
            setStep("end");
        } else {
            setEndDestination(building);
            setStep("done");
        }
        if (onSelectFeature) {
            onSelectFeature(building);
        }
    }, [onSelectFeature, step]);

    // Resets both destinations and restarts planner from the "start" step.
    const resetRoute = () => {
        setStartDestination(null);
        setEndDestination(null);
        setStep("start");
    };

    useEffect(() => {
        if (!addFeature) {
            return;
        }

        if (startDestination && endDestination) {
            return;
        }

        handleSelectBuilding(addFeature);
        if (onFeatureConsumed) {
            onFeatureConsumed();
        }
    }, [addFeature, handleSelectBuilding, onFeatureConsumed, startDestination, endDestination]);


    return(
        <div style={{ position: "relative", paddingBottom:"80px"}}>
            <Title>Campus Compass</Title>
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
                    backgroundColor: "rgba(253, 180, 21, 0)", 
                    borderRadius: "12px",
                    marginBottom: "16px",
                    textAlign: "center",
                    color: "black",
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    gap: "10px",
                    }}
                >
                    <MapPinIcon style={{width: '50px', height: '50px', color: '#fdb515'}} />
                    <div>Your path, made easier. </div>
                    <div>Begin by adding your current location. </div>
                </div>
            )}

            {/* Show both cards stacked below */}
            <div style={{ marginTop: "16px", position: "relative" }}>
                {startDestination && (
                    <CardRow>
                        <IconWrapper style={{ marginTop: "8px"}}>
                            <HomeIcon style={{width: "28px", height: "28px", color: 'black'}} />
                        </IconWrapper>
                        
                <DestinationCard
                    label="Start"
                    building={startDestination}
                />
                </CardRow>
                )}

                {endDestination && (
                    <>  
                        <CardRow>
                            <IconWrapper>
                                <MapPinIcon style={{ width: "28px", height: "28px", color: 'black'}} />
                            </IconWrapper>
                            <DestinationCard
                            label="End"
                            building={endDestination}
                            />
                        </CardRow>
                    </>
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



