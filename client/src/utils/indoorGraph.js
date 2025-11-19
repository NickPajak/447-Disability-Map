
function euclidean(a, b) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
}

let idCounter = 0;
function nextId(prefix = 'n') { return `${prefix}_${++idCounter}`; }

// Fix for multiline string

export function buildGraphFromGeojson(geojson, opts = {}) {
    const maxConnectDist = opts.maxConnectDist ?? 40;
    const corridors = geojson.features.filter(f => f.properties?.feature_type === 'corridor' && f.geometry.type === 'MultiLineString');
    const doors = geojson.features.filter(f => f.properties?.feature_type === 'door' && f.geometry.type === 'Point');

    const nodes = {};
    const edges = [];

    corridors.forEach((c, ci) => {
        const coords = c.geometry.coordinates;
        let prevId = null;
        coords.forEach((pt, i) => {
            const nodeId = nextId('c');
            nodes[nodeId] = { id: nodeId, coord: pt.slice(), meta: { corridorIndex: ci, vertexIndex: i } };
            if(prevId) {
                const w = euclidean(nodes[prevId].coord, pt);
                edges.push({u: prevId, v: nodeId, w});
                edges.push({ u: nodeId, v: prevId, w});
            }
            prevId = nodeId;
        });
    });

    doors.forEach((d, di) => {
        const doorId = nextId('d');
        const coord = d.geometry.coordinates.slice();
        nodes[doorId] = { id: doorId, coord, meta: { doorIndex: di, properties: d.properties } };
        
        let best = null;
        Object.values(nodes).forEach(n => {
            if(n.id === doorId) return;

            const dist = euclidean(n.coord, coord);
            if(dist <= maxConnectDist && (!best || dist < best.dist)) best = { node: n, dist};
        });
        if(best) {
            edges.push({ u: doorId, v: best.node.id, w: best.dist});
            edges.push({ u: best.node.id, v: doorId, w: best.dist });
        }
    });

    return { nodes, edges };
}

export function graphToAdj(nodes, edges) {
    const adj = {};
    Object.keys(nodes).forEach(k => adj[k] = []);
    edges.forEach(e => { adj[e.u].push({to: e.v, w: e.w}); });
    return adj;
}
