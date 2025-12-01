import { useEffect, useState } from "react";

const base = process.env.PUBLIC_URL;

export function useBuildingGeoJSONData() {
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(base + "/geojson_data/umbc_building_v1.geojson")
            .then(res => res.json())
            .then(data => {
                setBuildings(data.features || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading building data: ", err);
                setLoading(false);
            });
    }, []);

    return { buildings, loading };
}

export function useBusStopGeoJSONData() {
    const [busstops, setBusstops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(base + "/geojson_data/umbc_busstop.geojson")
            .then(res => res.json())
            .then(data => {
                setBusstops(data.features || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading busstop: ", err);
                setLoading(false);
            });
    }, []);

    return { busstops, loading };
}

export function useHighwayGeoJSONData() {
    const [highways, setHighways] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(base + "/geojson_data/umbc_highway_v2.geojson")
            .then(res => res.json())
            .then(data => {
                setHighways(data.features || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading highway data: ", err);
                setLoading(false);
            });
    }, []);

    return { highways, loading };
}

export function useEntranceGeoJSONData() {
    const [entrances, setEntrances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(base + "/geojson_data/umbc_entrance_v2.geojson")
            .then(res => res.json())
            .then(data => {
                setEntrances(data.features || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading entrance data: ", err);
                setLoading(false);
            });
    }, []);

    return { entrances, loading };
}
