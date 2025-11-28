import { useEffect, useState } from "react";

export function useBuildingMetadata() {
    const [metadata, setMetadata] = useState({});

    useEffect(() => {
        async function loadMetadata() {
            try {
                const res = await fetch(process.env.PUBLIC_URL + "/metadata/metadata.json");
                const data = await res.json();
                setMetadata(data);
            } catch (err) {
                console.error("Error loading metadata:", err);
            }
        }
        loadMetadata();
    }, []);
    
    return metadata;
}
