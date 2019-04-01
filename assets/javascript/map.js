// ESRI ArcGIS maps uses XY coordinates. In the United States
// This usually (not always) translates to X = longitude and Y = latitude.
// esri basemaps spatial reference is 102100 (web mercator). You can use 
// webMercatorUtils.geographictowebmercator:  
// https://developers.arcgis.com/javascript/3/jsapi/esri.geometry.webmercatorutils-amd.html

function renderMap(X, Y) {

     var map;
     var coordinates = [X, Y];

     require([
          "esri/map", "esri/geometry/Point",
          "esri/symbols/SimpleMarkerSymbol", "esri/graphic",
          "dojo/_base/array", "dojo/dom-style",
          "dojo/domReady!"
     ], function (
          Map, Point,
          SimpleMarkerSymbol, Graphic,
          arrayUtils, domStyle
     ) {


          map = new Map("streetMap", {
               basemap: "streets",
               center: coordinates,
               zoom: 15,
               minZoom: 2
          });

          map.on("load", mapLoaded);

          function mapLoaded() {

               // define path that will determine what the marker symbol will look like
               var iconPath =
                    "M16,4.938c-7.732,0-14,4.701-14,10.5c0,1.981,0.741,3.833,2.016,5.414L2,25.272l5.613-1.44c2.339,1.316,5.237,2.106,8.387,2.106c7.732,0,14-4.701,14-10.5S23.732,4.938,16,4.938zM16.868,21.375h-1.969v-1.889h1.969V21.375zM16.772,18.094h-1.777l-0.176-8.083h2.113L16.772,18.094z";

               // create a marker symbol
               var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
               markerSymbol.setPath(iconPath);
               markerSymbol.setSize(30);
               markerSymbol.setColor(new dojo.Color("#ff0000"));
               markerSymbol.setOutline(null);
               graphic = new Graphic(new Point(coordinates), markerSymbol);
               map.graphics.add(graphic);
          }
     });
}