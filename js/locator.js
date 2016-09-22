/**
 * Called whenever device has new user location data
 */
function followUserPosition(location){
    console.log("User location update:", location);
    updateDistanceTable([location.coords.longitude, location.coords.latitude]);
    console.log("closest AED:", aeds[distanceTable[0].id]);

    // Erstelle Positionsanzeige
    if (!posInnerCircle) {
        posInnerCircle = L.circle([location.coords.latitude, location.coords.longitude], 8, {
            color: '#00f',
            fillColor: '#00f',
            fillOpacity: 0.8,
            stroke: null,
            weight: 6
        });
    } else {
        posInnerCircle.setLatLng([location.coords.latitude, location.coords.longitude]);
    }
    if (!posOuterCircle) {
        var radius = Math.max(location.coords.accuracy, 10);
        posOuterCircle = L.circle([location.coords.latitude, location.coords.longitude], radius, {
            color: '#00f',
            fillColor: '#00f',
            fillOpacity: 0.1,
            weight: 6
        });
    } else {
        posOuterCircle.setLatLng([location.coords.latitude, location.coords.longitude]);
        posOuterCircle.setRadius(location.coords.accuracy);
    }

    /**
     * Decide wether user is close enough to an AED and inform user.
     * Only do this if position accuracy is good enough, and only once.
     */
    if (location.coords.accuracy < 80) {
        // show user position indicator
        if (!posLayerGroup.hasLayer(posInnerCircle)) {
            posInnerCircle.addTo(posLayerGroup);
            posOuterCircle.addTo(posLayerGroup);
        }
        // show alert on closest AED (if not already done so)
        console.log("userInformed:", userInformed);
        if (userInformed === false) {
            var closest = distanceTable[0];
            var userMarker = L.marker([location.coords.latitude, location.coords.longitude]);
            var closestMarker = L.marker([aeds[closest.id].geometry.coordinates[1], aeds[closest.id].geometry.coordinates[0]]);
            var group = L.featureGroup([userMarker, closestMarker]);
            var bbox = group.getBounds();
            map.fitBounds(bbox, {maxZoom: tilesMaxZoom});
            var alertText = "";
            if (closest.distance < 1.0) {
                // good candidate: less than 1 kilometer
                // Show closest AED and user position
                alertText = "Nächster AED: " + aeds[closest.id].properties.name + ", " + aeds[closest.id].properties.address + ", Entfernung: " + Math.round(closest.distance * 1000.0) + " m";
            } else {
                // no good candidate
                alertText = "Der nächste AED in Köln ist " + closest.distance.toFixed(1).toString().replace(".", ",") + " km entfernt."
            }
            var timeout = window.setTimeout(function(){
                alert(alertText);
            }, 1000);
            userInformed = true;
        }
    } else {
        // hide user position indicator
        posLayerGroup.clearLayers();
    }
}

/**
 * Handle geolocation error (abort etc.)
 */
function onLocationError(){
  // TODO: Show info to user?
  console.debug("User location Error");
}

if (typeof Number.prototype.toRad == 'undefined') {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180.0;
    }
}
