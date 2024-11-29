class MarkerIndicators {
    constructor() {
        this.MARKER_MATERIAL = new THREE.LineBasicMaterial({ color: MARKER_COLOR });
        this.MARKER_MATERIAL_INIT = new THREE.LineBasicMaterial({ color: MARKER_COLOR, linewidth: 3 });
        this.addedMarkers = { };
        this.markersToAdd = { };
        this.markersToRemove = { };
    }

    scheduleRemoveAll() {
        for (let id in this.addedMarkers) {

            if (id in this.markersToRemove) // Was already scheduled to be removed
                continue;

            this.markersToRemove[id] = this.addedMarkers[id];
        }

        this.addedMarkers = { }

        // Also make sure nothing is scheduled to be added anymore
        this.markersToAdd = { }
    }

    removeMarker(id) {
        if (id in this.addedMarkers)
        {
            if (id in this.markersToRemove)
            {
                console.log("WARNING: id " + id + " already in markersToRemove");
            }
            this.markersToRemove[id] = this.addedMarkers[id];
            delete this.addedMarkers[id];
        }

        if (id in this.markersToAdd)
        {
            this.markersToAdd[id].geometry.dispose();
            delete this.markersToAdd[id];
        }
    }

    updateMarker(id, x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3, initialized) {
        console.log(`Marker ${id}: initialized = ${initialized}`);
        /*
        console.log("Need to draw marker " + id);
        console.log("    " + x0 + " " + y0 + " " + z0);
        console.log("    " + x1 + " " + y1 + " " + z1);
        console.log("    " + x2 + " " + y2 + " " + z2);
        console.log("    " + x3 + " " + y3 + " " + z3);
        */
        let geom = this.makeMarkerGeometry(id, x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3);
        let obj = new THREE.LineSegments(geom, (initialized)?this.MARKER_MATERIAL_INIT:this.MARKER_MATERIAL);

        this.removeMarker(id);

        this.markersToAdd[id] = obj;

    }

    updateMarkersInScene(scene) {
        for (let id in this.markersToRemove) {
            let segs = this.markersToRemove[id];

            scene.remove(segs);
            segs.geometry.dispose();
        }

        this.markersToRemove = {}

        for (let id in this.markersToAdd) {
            scene.add(this.markersToAdd[id]);
            if (id in this.addedMarkers)
                console.log("WARNING: id " + id + " is already present in addedMarkers");

            this.addedMarkers[id] = this.markersToAdd[id];
        }

        this.markersToAdd = { }
    }

    makeMarkerGeometry(id, x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        let lineGeo = new THREE.Geometry();
        lineGeo.vertices.push(new THREE.Vector3(x0, y0, z0));
        lineGeo.vertices.push(new THREE.Vector3(x1, y1, z1));

        lineGeo.vertices.push(new THREE.Vector3(x1, y1, z1));
        lineGeo.vertices.push(new THREE.Vector3(x2, y2, z2));

        lineGeo.vertices.push(new THREE.Vector3(x2, y2, z2));
        lineGeo.vertices.push(new THREE.Vector3(x3, y3, z3));

        lineGeo.vertices.push(new THREE.Vector3(x3, y3, z3));
        lineGeo.vertices.push(new THREE.Vector3(x0, y0, z0));
    
        lineGeo.vertices.push(new THREE.Vector3(x0, y0, z0));
        lineGeo.vertices.push(new THREE.Vector3(x2, y2, z2));

        lineGeo.vertices.push(new THREE.Vector3(x1, y1, z1));
        lineGeo.vertices.push(new THREE.Vector3(x3, y3, z3));

        return lineGeo;
    }
}
