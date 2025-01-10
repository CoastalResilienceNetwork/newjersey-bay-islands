// create map and layers for app
require([
  'esri/Map',
  'esri/views/MapView',
  'esri/widgets/BasemapGallery',
  'esri/widgets/Expand',
  'esri/widgets/BasemapGallery/support/PortalBasemapsSource',
  'esri/widgets/Search',
  'esri/widgets/Legend',
  'esri/widgets/ScaleBar',
  'esri/widgets/Measurement',
  'esri/layers/FeatureLayer',
  'esri/layers/MapImageLayer',
  'esri/PopupTemplate',
  'esri/tasks/QueryTask',
  'esri/tasks/support/Query',
  'esri/layers/GraphicsLayer',
  'esri/core/watchUtils',
  'esri/layers/WMSLayer',
  'esri/layers/ImageryTileLayer',
], function (
  Map,
  MapView,
  BasemapGallery,
  Expand,
  PortalSource,
  Search,
  Legend,
  ScaleBar,
  Measurement,
  FeatureLayer,
  MapImageLayer,
  PopupTemplate,
  QueryTask,
  Query,
  GraphicsLayer,
  watchUtils,
  WMSLayer,
  ImageryTileLayer
) {
  // create map
  app.map = new Map({
    basemap: 'oceans',
  });

  //create map view
  app.view = new MapView({
    container: 'viewDiv',
    center: [-74.2, 39.75],
    zoom: 10,
    map: app.map,
    // add popup window to map view for map clicks
    popup: {
      collapseEnabled: false,
      dockEnabled: true,
      dockOptions: {
        buttonEnabled: false,
        breakpoint: false,
      },
    },
  });

  //create basemap widget
  const allowedBasemapTitles = [
    'Oceans',
    'Topographic',
    'Imagery Hybrid',
    'Streets',
  ];
  const source = new PortalSource({
    // filtering portal basemaps
    filterFunction: (basemap) =>
      allowedBasemapTitles.indexOf(basemap.portalItem.title) > -1,
  });
  var basemapGallery = new BasemapGallery({
    view: app.view,
    source: source,
    container: document.createElement('div'),
  });
  var bgExpand = new Expand({
    view: app.view,
    content: basemapGallery,
    expandTooltip: 'Basemaps',
  });
  app.view.ui.add(bgExpand, {
    position: 'top-right',
  });
  // close expand when basemap is changed
  app.map.watch(
    'basemap.title',
    function (newValue, oldValue, property, object) {
      bgExpand.collapse();
    }
  );

  //create search widget
  const searchWidget = new Search({
    view: app.view,
    locationEnabled: false,
    container: document.createElement('div'),
  });
  var srExpand = new Expand({
    view: app.view,
    content: searchWidget,
    expandTooltip: 'Search location',
  });
  app.view.ui.add(srExpand, {
    position: 'top-right',
  });

  // move zoom controls to top right
  app.view.ui.move(['zoom'], 'top-right');
  // create supporting layers
  app.supportingLayers = new MapImageLayer({
    url: app.url,
  });

  //create Islands layer
  app.islandsLayer = new MapImageLayer({
    url: app.url,
    sublayers: [
      {
        id: 3,
        visible: true,
      },
    ],
  });

  // nooa charts
  app.noaaCharts = new MapImageLayer({
    url: 'https://gis.charttools.noaa.gov/arcgis/rest/services/MCS/ENCOnline/MapServer/exts/MaritimeChartService/MapServer',
    opacity: 0.8,
    visible: false,
  });

  // nooa charts
  app.erosion = new ImageryTileLayer({
    url: 'https://tiledimageservices1.arcgis.com/ze0XBzU1FXj94DJq/arcgis/rest/services/Likelihood_of_Erosion_by_2050/ImageServer',
    opacity: 0.8,
    visible: false,
  });

  app.public = new FeatureLayer({
    url: 'https://mapsdep.nj.gov/arcgis/rest/services/Features/Environmental_admin/MapServer/7',
    opacity: 0.8,
    visible: false,
  });

  //

  // graphics layer for map click graphics
  app.resultsLayer = new GraphicsLayer();
  // add layers to map
  app.map.add(app.noaaCharts);
  app.map.add(app.erosion);
  app.map.add(app.public);

  app.map.add(app.supportingLayers);
  app.map.add(app.islandsLayer);
  app.map.add(app.resultsLayer);

  // create legend
  app.legend = new Legend({
    view: app.view,
    layerInfos: [
      {
        layer: app.islandsLayer,
        title: 'NJ Bay Islands',
      },
      {
        layer: app.supportingLayers,
        title: 'Supporting Layers',
      },
    ],
    content: app.legend,
    // container: document.createElement("div")
  });
  app.lgExpand = new Expand({
    view: app.view,
    content: app.legend,
  });
  app.view.ui.add(app.lgExpand, {
    position: 'bottom-right',
  });

  // scalebar
  const scaleBar = new ScaleBar({
    view: app.view,
    unit: 'dual',
  });
  app.view.ui.add(scaleBar, {
    position: 'bottom-left',
  });

  // measurement
  const measurement = new Measurement({
    view: app.view,
  });
  app.view.ui.add(measurement, 'top-left');

  // measurement event listeners
  const distanceButton = document.querySelector('#distance');
  const areaButton = document.querySelector('#area');
  const clearButton = document.querySelector('#clear');
  distanceButton.addEventListener('click', () => {
    measurement.activeTool = 'distance';
    distanceButton.classList.add('active');
    areaButton.classList.remove('active');
    closeSupportingLayers();
  });
  areaButton.addEventListener('click', () => {
    measurement.activeTool = 'area';
    areaButton.classList.add('active');
    distanceButton.classList.remove('active');
    closeSupportingLayers();
  });
  clearButton.addEventListener('click', () => {
    console.log(app.view.zoom);
    measurement.clear();
    areaButton.classList.remove('active');
    distanceButton.classList.remove('active');
  });
  function closeSupportingLayers() {
    if (
      document
        .querySelector('#overmap-toggle-button span')
        .classList.contains('esri-icon-collapse')
    ) {
      console.log('made it');
      document.querySelector('#overmap-toggle-button span').click();
    }
  }

  // change legend based on window size
  var x = window.matchMedia('(max-width: 700px)');
  mobilePortrait(x); // Call listener function at run time
  x.addListener(mobilePortrait); // Attach listener function on state changes

  // change legend based on window size
  var y = window.matchMedia('(orientation:landscape)');
  mobileLandscape(y); // Call listener function at run time
  y.addListener(mobileLandscape); // Attach listener function on state changes

  // listen for poup close button
  watchUtils.whenTrue(app.view.popup, 'visible', function () {
    watchUtils.whenFalseOnce(app.view.popup, 'visible', function () {
      app.resultsLayer.removeAll();
    });
  });

  // call event listener for map clicks
  mapClick();

  app.islandsLayer.watch('loaded', function () {
    setControlVals();
  });

  // layer viewer
  buildLayerViewer();
});

function clearGraphics() {
  app.map.layers.removeAll();
}

function mobilePortrait(x) {
  if (x.matches) {
    app.lgExpand.collapse();
    app.mobile = true;
    if (document.querySelector(`#side-nav`).clientWidth == 0) {
      document
        .querySelector(`#side-nav`)
        .classList.toggle('hide-side-nav-width');
      document.querySelectorAll(`#map-toggle span`).forEach((span) => {
        span.classList.toggle('hide');
      });
    }
  } else {
    app.lgExpand.expand();
    app.mobile = false;
  }
}
function mobileLandscape(y) {
  if (y.matches) {
    if (document.querySelector(`#side-nav`).clientHeight == 0) {
      document
        .querySelector(`#side-nav`)
        .classList.toggle('hide-side-nav-height');
      document.querySelectorAll(`#map-toggle span`).forEach((span) => {
        span.classList.toggle('hide');
      });
    }
  }
}
