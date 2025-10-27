import React, {useState} from 'react';
import RouteSearchBar from './RouteSearchBar';
import DestinationCard from './DestinationCard';
import MapView from './MapView';

export default function RoutePlanner( {onSelectFeature}) {
    // Track which step the user is on: "start", "end", or "done"
    const [step, setStep] = useState("start");

    // Store selected start and end destinations
    const [startDestination, setStartDestination] = useState(null);
    const [endDestination, setEndDestination] = useState(null);

    const [selectedFeature, setSelectedFeature] = useState(null);

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
        <div>
            <h2>Route Planner</h2>
            <RouteSearchBar 
                key={step}
                placeholder={
                    step === "start" ? "Search start destination..." : "Search end destination"
                }
                onSelectBuilding={handleSelectBuilding}
            />
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

            {/* Optional reset button */}
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
        </div>
    );
}