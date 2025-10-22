// handles fetching and caching the GeoJSON data

import { useEffect, useState } from "react";


// TODO: Integrate busstop, entrance, and highway data fetching and collections
// custom React hook
export function useBuildingGeoJSONData() {
    // buildings --> will hold the array of building features from GeoJSON
    // loading --> boolean to tell whether the fetch is still in progress
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);

    // performs fetch request to load GeoJSON file
    useEffect(() => {
        fetch("/geojson_data/umbc_building_v1.geojson")
        .then((res) => res.json()) // convert to JSON
        .then((data) => {
            setBuildings(data.features || []);
            // mark loading as done
            setLoading(false);
        })
        .catch((err) => {
            // if something went wrong, log error and stop loading
            console.error("Error loading building data: ", err);
            setLoading(false);
        });
    }, []);

    // return both the data and loading state
    return {buildings, loading};
}

export function useBusStopGeoJSONData() {
    // busstops --> will hold the array of bus stop features from GeoJSON
    // loading --> boolean to tell whether the fetch is still in progress
    const [busstops, setBusstops] = useState([]);
    const [loading, setLoading] = useState(true);

    // performs fetch request to load GeoJSON file
    useEffect(() => {
        fetch("/geojson_data/umbc_busstop.geojson")
        .then((res) => res.json())
        .then((data) => {
            setBusstops(data.features || []);
            // mark loading as done
            setLoading(false);
        })
        .catch((err) => {
            // if something went wrong, log error and stop loading
            console.error("Error loading busstop: ", err);
            setLoading(false);
        });
    }, []);

    // return both the data and loading state
    return {busstops, loading};
}