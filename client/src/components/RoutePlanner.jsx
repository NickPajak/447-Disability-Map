import React, { useState, useEffect, useCallback } from 'react';
import styled from "styled-components";
import RouteSearchBar from './RouteSearchBar';
import DestinationCard from './DestinationCard';
import { MapPinIcon, HomeIcon } from '@heroicons/react/24/solid';
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
  color: ${props => props.theme.routePlannerText};
`;

const WelcomeText = styled.h2`
    color: ${props => props.theme.routePlannerText};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 50px; /* ensures content shouldnt hide behind bottombar */
  padding-right: 5px;
`;

const BottomBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.theme.bottomBarColor || "white"};
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
`;

const StartRouteButton = styled.button`
    background-color: #fdb515;
    color: black;
    border-radius: 1rem;
    border: none;
    cursor: pointer;
    padding: 3px 20px;

    &:hover {
        background-color: #3b3b3b;
        color: #fdb515;
    }

`;

const StartIcon = styled(HomeIcon)`
    width: 28px;
    height: 28px;
    color: ${props => props.theme.startIconColor};
`;

const MapIcon = styled(MapPinIcon)`
    width: 28px;
    height: 28px;
    color: ${props => props.theme.startIconColor};
`;

export default function RoutePlanner({ onSelectFeature, addFeature, onFeatureConsumed, onRouteRequest, onExpand, onCollapse }) {
    // Track which step the user is on: "start", "end", or "done"
    const [step, setStep] = useState("start");

    // Store selected start and end destinations
    const [startDestination, setStartDestination] = useState(null);
    const [endDestination, setEndDestination] = useState(null);

    //const [selectedFeature, setSelectedFeature] = useState(null);

    const handleSelectBuilding = useCallback((building) => {
        if (!building) return;

        if (step === "start") {
            setStartDestination(building);
            setStep("end");
            onSelectFeature?.(building);
        } else if (step === "end") {
            // Don't allow selecting the same building as start
            if (startDestination && building.properties.building_id === startDestination.properties.building_id) {
                return; // ignore duplicate
            }
            setEndDestination(building);
            setStep("done");
            onSelectFeature?.(building);
        }
    }, [onSelectFeature, step, startDestination]);


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


    return (
        <Wrapper>
            {/* <div style={{ position: "relative", paddingBottom: "80px" }}> */}
            <Title>Campus Compass</Title>
            <RouteSearchBar
                key={step}
                placeholder={
                    step === "start" ? "Search start destination..." : "Search end destination"
                }
                onSelectBuilding={handleSelectBuilding}
                disabledBuilding={step === "end" ? startDestination : null}
                onFocus={onExpand}
                onBlur={() => { }}
            />

            <ScrollArea>
                {/* if there's no place added to route, add default welcome text*/}
                {!startDestination && !endDestination && (
                    <WelcomeText>
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
                                fontSize: "1.2rem",
                                fontWeight: "700",
                                gap: "10px",
                            }}
                        >
                            <MapPinIcon style={{ width: '50px', height: '50px', color: '#fdb515' }} />
                            <div>Your path, made easier. </div>
                            <div>Begin by adding your current location. </div>
                        </div>
                    </WelcomeText>
                )}

                {/* Show both cards stacked below */}
                <div style={{ marginTop: "16px", position: "relative" }}>
                    {startDestination && (
                        <CardRow>
                            <IconWrapper style={{ marginTop: "8px" }}>
                                <StartIcon />
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
                                    <MapIcon />
                                </IconWrapper>
                                <DestinationCard
                                    label="End"
                                    building={endDestination}
                                />
                            </CardRow>
                        </>
                    )}
                </div>
            </ScrollArea>

            {/* fixed bottom bar */}
            {(startDestination || endDestination) && (
                <BottomBar>
                    <button
                        onClick={resetRoute}
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "#444",
                            color: "white",
                            border: "none",
                            borderRadius: "1rem",
                            cursor: "pointer",
                            flex: 1,
                        }}
                    >
                        <h3 style={{ margin: 0 }}>Reset</h3>
                    </button>

                    {/*TODO: Integrate button with route planning*/}
                    {startDestination && endDestination && (
                        <StartRouteButton
                            style={{
                                flex: 1,
                                padding: "10px 16px",
                            }}
                            onClick={() => {
                                if (startDestination && endDestination) {
                                    onRouteRequest(
                                        startDestination.properties.building_id || startDestination.properties.id,

                                        endDestination.properties.building_id || endDestination.properties.id,
                                    );
                                    console.log("START ROUTE:",
                                        startDestination?.properties?.building_id,
                                        startDestination?.properties?.id,
                                        endDestination?.properties?.building_id,
                                        endDestination?.properties?.id
                                    );
                                }
                            }}
                        >
                            <h3 style={{ margin: 0 }}>Start Route</h3>
                        </StartRouteButton>
                    )}
                </BottomBar>
            )}
        </Wrapper>
        // </div>
    );
}



