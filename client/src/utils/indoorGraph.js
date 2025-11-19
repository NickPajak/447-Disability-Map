
export function fixLooseConnections(geojson, tolerance = 3) {

    const features = geojson.features.filter(f => f.geometry.type === "MultiLineString");

    let endpoints = [];
    features.forEach((f, i) => {
        const coords = f.geometry.coordinates;
        const start = coords[0];
        const end = coords[coords.length - 1];
        endpoints.push({ pt: start, featureIndex: i, coordIndex: 0});
        endpoints.push({ pt: end, featureIndex: i, coordIndex: coords.length - 1});
    });

    const dist = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 (a[1] - b[1]) ** 2);

    const groups = [];
    const used = new Set();

    for (let i = 0; i < endpoints.length; i++) {
        if(used.has(i)) continue;

        const group = [endpoints[i]];
        used.add(i);

        for (let j = i + 1; j < endpoints.length; j++) {
            if(used.has(j)) continue;
            if(dist(endpoints[i].pt, endpoints[j].pt) <= tolerance) {
                group.push(endpoints[j]);
                used.add(j);
            }
        }
        groups.push(group);
    }

    const snapped = groups.map(group => {
        const xs = group.map(g => g.pt[0]);
        const ys = group.map(g => g.pt[1]);
        return [avg(xs), avg(ys)];
    });

    function avg(arr) {
        return arr.reduce((a,b) => a + b, 0) / arr.length;
    }

    const snappedGeo = JSON.parsre(JSON.stringify(geojson));
    groups.forEach((group, gIndex) => {
        const snappedPt = snapped[gIndex];

        group.forEach(( {featureIndex, coordIndex}) => {
            snappedGeo.feature[featureIndex].geometry.coordinates[coordIndex] = snappedPt;
        });
    });
    return snappedGeo;

}