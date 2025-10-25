import { useEffect, useState } from "react";

export function useBuildingMetadata() {
    // metadata --> will hold the array of building metadata from JSON
    const [metadata, setMetadata] = useState({});

    // performs fetch request to load metadata
    useEffect(() => {
        async function loadMetadata() {
            try {
                const indexRes = await fetch("/metadata/index.json");
                const files = await indexRes.json();

                const data = {};
                for (const file of files) {
                    const res = await fetch(`/metadata/${file}`);
                    const buildingData = await res.json();
                    data[buildingData.building_id] = buildingData;
                }
                setMetadata(data);
            } catch (err) {
                // if something went wrong, log error
                console.error("Error loading metadata:", err);
            } 
        }
        loadMetadata();
    }, []);
    
    // return metadata 
    return metadata;
}