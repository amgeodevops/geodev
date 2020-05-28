// init des varaiable
var map,
featureList,
communeSearch = [],
hopitauxSearch = [],
ephadSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(commune.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Masquer la barre latérale et accéder à la carte -- pour ecran de petite taille */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /*  Fonctions de la barre latérale */

  $("#feature-list tbody").empty();
  /* Parcour la couche hopitaux et ajoutez uniquement les entités qui se trouvent dans les limites de l'affichage de la carte*/
  hopitaux.eachLayer(function (layer) {
    if (map.hasLayer(hopitauxLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append(
            '<tr class="feature-row" id="' +
            L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '">' +
            '<td style="vertical-align: middle;">' +
            '<img width="16" height="18" src="assets/img/health-medical.png">' +
            '</td><td class="feature-name">'
            + layer.feature.properties.rslongue +
            '</td><td style="vertical-align: middle;">' +
            '<i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Parcourez la couche ephad et ajoutez uniquement les entités situées dans les limites de l'affichage de la carte*/
  ephad.eachLayer(function (layer) {
    if (map.hasLayer(ephadLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append(
            '<tr class="feature-row" id="'
            + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '">' +
            '<td style="vertical-align: middle;">' +
            '<img width="16" height="18" src="assets/img/lounge.png">' +
            '</td><td class="feature-name">' + layer.feature.properties.rslongue + '' +
            '</td><td style="vertical-align: middle;">' +
            '<i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* mise a jour de la  list.js featureList avec ordre ascendant // l order est optionel */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 19});
var usgsImagery = L.layerGroup([L.tileLayer("http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}", {
  maxZoom: 15, }), L.tileLayer.wms("http://raster.nationalmap.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_SCALE/ImageServer/WMSServer?", {
  minZoom: 16,
  maxZoom: 19,
  layers: "0",
  format: 'image/jpeg',
  transparent: true,
  attribution: "Aerial Imagery courtesy USGS"
})]);

/* base layer */
var openstreetmap = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { maxZoom: 19}
)
// Tile type: openstreetmap Hot
var openstreetmapHot = L.tileLayer(
    'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    { maxZoom: 19}
)
// Tile type: openstreetmap Osm
var openstreetmapOsm = L.tileLayer(
    'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
    { maxZoom: 19}
)
// Tile type: Toner
var stamen =L.tileLayer(
    'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png',
    { maxZoom: 19}
)
// Tile type: CartoDB
var cartocdn=L.tileLayer(
    'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    { maxZoom: 19}
)
/* with Key API
// Tile type: thunderforest
var thunderforest = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', { maxZoom: 19})
// Tile type: Transport
var opencyclemap = L.tileLayer ('http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', { maxZoom: 19})
// Tile type: MapQuest
var mqcdn =L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', { maxZoom: 19})
*/
var igngp_route=L.tileLayer(
    'http://igngp.geoapi.fr/tile.php/routes/{z}/{x}/{y}.png',
    { maxZoom: 19}
)


/********************    */

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var commune = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "grey",
      fill: false,
      opacity: 1,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    communeSearch.push({
      name: layer.feature.properties.NOM_COM,
      source: "Commune",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/commune.geojson", function (data) {
  commune.addData(data);
});

//Create a color dictionary based off of subway route_id
var subwayColors = {"1":"#ff3135", "2":"#ff3135", "3":"ff3135", "4":"#009b2e",
    "5":"#009b2e", "6":"#009b2e", "7":"#ce06cb", "A":"#fd9a00", "C":"#fd9a00",
    "E":"#fd9a00", "SI":"#fd9a00","H":"#fd9a00", "Air":"#ffff00", "B":"#ffff00",
    "D":"#ffff00", "F":"#ffff00", "M":"#ffff00", "G":"#9ace00", "FS":"#6e6e6e",
    "GS":"#6e6e6e", "J":"#976900", "Z":"#976900", "L":"#969696", "N":"#ffff00",
    "Q":"#ffff00", "R":"#ffff00" };

var route = L.geoJson(null, {
  style: function (feature) {
      return {
        color: subwayColors[feature.properties.id],
        weight: 3,
        opacity: 1
      };
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Division</th><td>" + feature.properties.Division + "</td></tr>" + "<tr><th>Line</th><td>" + feature.properties.Line + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.Line);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");

        }
      });
    }
    layer.on({
      mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          opacity: 1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        route.resetStyle(e.target);
      }
    });
  }
});
$.getJSON("data/Route.geojson", function (data) {
  route.addData(data);
});

/* Couche de cluster à marqueur unique pour contenir tous les clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});

/* Espace réservé de couche vide à ajouter au contrôle de couche pour écouter quand ajouter / supprimer des hopitaux à la couche markerClusters  */
var hopitauxLayer = L.geoJson(null);
var hopitaux = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
       iconUrl: "assets/img/health-medical.png"
      }),
      title: feature.properties.rslongue,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" +
          "<b>Raison Sociale    : </b>" + feature.properties.rs + '<br/>' +
          "<b>Categorie         : </b>" + feature.properties.libcatgeta + '<br/>' +
          "<b>Libelle MFT       : </b>" + feature.properties.libmft + '<br/>' +
          "<b>Telephone         : </b>" + "0"+ feature.properties.telephone + '<br/>' +
          "<b>Telecopie         : </b>" + "0"+ feature.properties.telecopie ;

      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.rs);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '">' +
          '<td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/hopitaux.png">' +
          '</td><td class="feature-name">' + layer.feature.properties.rs + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      hopitauxSearch.push({
        name: layer.feature.properties.rs,
        address: layer.feature.properties.libmft,
        source: "Hopitaux",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/hopitaux.geojson", function (data) {
  hopitaux.addData(data);
  map.addLayer(hopitauxLayer);
});

/* Espace réservé de calque vide à ajouter au contrôle de calque pour écouter quand ajouter / supprimer ephad au calque markerClusters */
var ephadLayer = L.geoJson(null);
var ephad = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
       iconUrl: "assets/img/lounge.png",
      /*  iconSize: [24, 28],  iconAnchor: [12, 28], popupAnchor: [0, -25] */
      }),
      title: feature.properties.rslongue,
      riseOnHover: true // forcer les étiquettes des marqueurs
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content =
          "<table class='table table-striped table-bordered table-condensed'>" +
          "<b>Raison Sociale    : </b>" + feature.properties.Raison_Soc + '<br/>' +
          "<b>Categorie etab.   : </b>" + feature.properties.libcateget + '<br/>' +
          "<b>Classif SST       : </b>" +  feature.properties.SST_Classi + '<br/>' +
          "<b>Telephone         : </b>" + "0"+ feature.properties.telephone + '<br/>' +
          "<b>Nom Medecin T.    : </b>" + feature.properties.medecin + '<br/>' +
          "<b>Tel. Medecin T.   : </b>" + "0"+ feature.properties.Tel_MT + '<br/>' +
          "<b>Mail Medecin T    : </b>" + feature.properties.Mail_MT + '<br/>' +
          "<b>Convention        : </b>" + feature.properties.Convention + '<br/>' +
          "<b>Nombre COVID -    : </b>" + feature.properties.COVid_ + '<br/>' +
          "<b>Nombre Suspicion  : </b>" + feature.properties.Suspicion + '<br/>' +
          "<b>Nombre COVID +    : </b>" + feature.properties.COVid1 + '<br/>' +
          "<b> Adresse          : </b>" +  feature.properties.ADRESSE_PO + '<br/>' +
          "<b>Telephone         : </b>" + "0"+ feature.properties.TELEPHON_1 + '<br/>' +
          "<b>Capacite          : </b>" + feature.properties.CAPACITE + '<br/>' +
          "<b>Equipe Hygiene    : </b>" + feature.properties.EQ_HYGIENE + '<br/>' +
          "<b>Nom Directeur     : </b>" + feature.properties.DIRECTEUR + '<br/>' +
          "<b>Email Directeur   : </b>" + feature.properties.EMAIL_DIRE + '<br/>' +
          "<b>Email Medecin     : </b>" + feature.properties.EMAIL_MED_ + '<br/>' +
          "<b>Cadre Coord.      : </b>" + feature.properties.CADRE_COOR + '<br/>' +
          "<b>Email Cadre.Coord : </b>" + feature.properties.EMAIL_CADR + "<table>";


      /*    "<tr><th>Name</th><td>" + feature.properties.rslongue + "</td></tr>" +
          "<tr><th>Phone</th><td>" + feature.properties.TEL + "</td></tr>" +
          "<tr><th>Address</th><td>" + feature.properties.ADRESS1 + "</td></tr>" +
          "<tr><th>Website</th><td><" +
          "a class='url-break' href='" + feature.properties.URL + "' target='_blank'>"
          + feature.properties.URL + "</a></td></tr>" + "<table>";   */
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.rslongue);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append(
          '<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '">' +
          '<td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/lounge.png">' +
          '</td><td class="feature-name">' + layer.feature.properties.rslongue + '</td>' +
          '<td style="vertical-align: middle;">' +
          '<i class="fa fa-chevron-right pull-right"></i></td></tr>');
      ephadSearch.push({
        name: layer.feature.properties.rslongue,
        address: layer.feature.properties.adresse,
        source: "EPHAD",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/ephad.geojson", function (data) {
  ephad.addData(data);
  map.addLayer(ephadLayer);   // pour la rndre visible par defaut

});


map = L.map("map", {
  zoom: 9,
  center: [45.3, 5.85],
  layers: [cartoLight,  markerClusters, highlight],  //ajouter commune si besoin que la couche soit active
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === hopitauxLayer) {
    markerClusters.addLayer(hopitaux);
    syncSidebar();
  }
  if (e.layer === ephadLayer) {
    markerClusters.addLayer(ephad);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === hopitauxLayer) {
    markerClusters.removeLayer(hopitaux);
    syncSidebar();
  }
  if (e.layer === ephadLayer) {
    markerClusters.removeLayer(ephad);
    syncSidebar();
  }
});

/*   Filtre la liste des fonctionnalités de la barre latérale pour afficher uniquement les entités dans les limites de la carte actuelle
 */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Effacer la surbrillance de la fonction lorsque vous cliquez sur la carte */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Contrôle d'attribution */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Developper pour le projet OHGEOVIS " +
      "<a href=''> site du projet OHGEOVIS</a> | </span>" +
      "<a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* Contrôle de géolocalisation activé par GPS défini pour suivre la position de l'utilisateur */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "Ma localisation",
    popup: "Vous êtes à {distance} {unité} de ce point",
    outsideMapBoundsMsg: "Vous semblez etre situer en dehors des limites de la carte"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Les grand  écrans sup 767 bénéficient d'un contrôle de calque étendu et d'une barre latérale visible  */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}
// les base layer qui seront afficher -- a revoir si besoin de la totalité
var baseLayers = {
  "Street Map": cartoLight,
  "Aerial Imagery": usgsImagery,
  "CartoDB": cartocdn,
  "IGN- Route": igngp_route,
  "Toner": stamen,
  "Open streetmap": openstreetmap,
  "Open streetmap: Hot": openstreetmapHot,
  "Open streetmap: Osm": openstreetmapOsm

};

var groupedOverlays = {
  "Les Etablissements": {
    "<img src='assets/img/lounge.png' width='24' height='28'> Ehpad " : ephadLayer,
    "<img src='assets/img/health-medical.png' width='24' height='28'> Hopitaux": hopitauxLayer
  },
  "Isére": {
    "Commune": commune,
  /*  "Route": route */
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Mettez en surbrillance le texte du champ de recherche on clic */
$("#searchbox").click(function () {
  $(this).select();
});

/* Empêcher de rafraîchir la page  */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Fonction de recherche Typeahead */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Adapter la carte aux limites de la couche commune - cad - dept Isere*/
  map.fitBounds(commune.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var communeBH = new Bloodhound({
    name: "Commune",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: communeSearch,
    limit: 10
  });
// definition pour les filtre - recherche
  var hopitauxBH = new Bloodhound({
    name: "Hopitaux",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: hopitauxSearch,
    limit: 10
  });

  var ephadBH = new Bloodhound({
    name: "Ehpad",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: ephadSearch,
    limit: 10
  });

  /*
  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });

    geonamesBH.initialize();

*/
  communeBH.initialize();
  hopitauxBH.initialize();
  ephadBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "commune",
    displayKey: "name",
    source: communeBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>commune</h4>"
    }
  }, {
    name: "Hopitaux",
    displayKey: "id",
    source: hopitauxBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/health-medical.png' width='24' height='28'>&nbsp;Hopitaux</h4>",
      suggestion: Handlebars.compile(["{{rslongue}}<br>&nbsp;<small>{{telephone}}</small>"].join(""))
    }
  }, {
    name: "Ehpad",
    displayKey: "id",
    source: ephadBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/lounge.png' width='24' height='28'>&nbsp;EPHAD</h4>",
      suggestion: Handlebars.compile(["{{rslongue}}<br>&nbsp;<small>{{telephone}}</small>"].join(""))
    }
  },
    /*  {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  } */

  ).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "commune") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "HOPITAUX") {
      if (!map.hasLayer(hopitauxLayer)) {
        map.addLayer(hopitauxLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "Ehpad") {
      if (!map.hasLayer(ephadLayer)) {
        map.addLayer(ephadLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}
