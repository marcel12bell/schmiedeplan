document.addEventListener('DOMContentLoaded', function() {
  var map = new L.Map('map',{scrollWheelZoom: false});
  map.setView([47.6844706, 13.0935104], 18, false);
  //map.locate({setView: true, maxZoom: 16});

  // function onLocationFound(e) {
  //     var radius = e.accuracy / 2;
  //     L.marker(e.latlng).addTo(map)
  //         .bindPopup("You are within " + radius + " meters from this point").openPopup();
  //     L.circle(e.latlng, radius).addTo(map);
  // }

  new L.TileLayer('https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    attribution: '<a href="http://content.stamen.com/dotspotting_toner_cartography_available_for_download">Stamen Toner</a>, <a href="http://www.openstreetmap.org/">OpenStreetMap</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 19,
    maxNativeZoom: 19
  }).addTo(map);

  function style(feature) {
      return {
          weight: 2,
          opacity: 1,
          color: 'rgb(135, 0, 0)',
          dashArray: '2',
          bordercolor: 'green',
          fillOpacity: 0.7
      };
  }

  function get_times(timetable) {
    var string = '';
    if (timetable) {
      for (el in timetable) {
        string += "<br>"+ timetable[el];
      }
    }
    return string;
  }

  var popup;
  var layer = L.geoJson(upper_rooms['features'], {
    style: style,
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.room + get_times(feature.properties.timetable));
    }
  }).addTo(map);

  L.control.search({
    layer: layer,
    initial: false,
    propertyName: 'room',
    buildTip: function(text, val) {
      var type = val.layer.feature.properties.times;
      return '<a href="#" class="'+type+'"><b>'+text+'</b></a>';
    }
  })
  .addTo(map);
});