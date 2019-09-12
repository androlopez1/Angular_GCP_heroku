import { Injectable } from '@angular/core';
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map: any;
  drawingManager: any;
  input: any;
  autocomplete: any;
  options: {};
  geocoder: any;
  result: any;
  result_2: any;

  constructor() { }

  drawPolygon() {
    document.getElementById('container-cotizacion').style.display = "none";
    document.getElementById('container-infobox').style.display = "none";
    document.getElementById('div-result').style.display = "none";
    document.getElementById('clear').style.display = "none";
    document.getElementById('continue').style.display = "none";
    document.getElementById('infobox-results').style.display = "none";
    (<HTMLInputElement> document.getElementById("continue")).disabled = true;
    (<HTMLInputElement> document.getElementById("clear")).disabled = true;

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 40.4167, lng: -3.70324 },
      zoom: 25,
      mapTypeId: 'hybrid',
      streetViewControl: false,
      mapTypeControl: false,
      rotateControl: false,
      tilt: 0
    });

    //Drawing control
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon'],
      },
      polygonOptions: {
      editable: true,
      geodesic: true, // When true, edges of the polygon are interpreted as geodesic and will follow the curvature of the Earth.
      }
    });

    // Create the search box and link it to the UI element.
    this.input = document.getElementById('pac-input');
    
    this.options = {
    types: ['address'],
    componentRestrictions: {country: 'es'}
    };

    this.autocomplete = new google.maps.places.Autocomplete(this.input, this.options);

    this.autocomplete.addListener('place_changed', () => {
      var place = this.autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        alert("Por favor, seleccione una dirección del desplegable que aparece mientras escribe la dirección.");
        return;
      }
      document.getElementById('container-infobox').style.display = "block";
      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
        this.map.setZoom(25);       
        document.getElementById('pac-input').style.fontSize = "smaller";
        document.getElementById('search-box').style.top = "15px";
        document.getElementById('cover').style.width = "auto";
        document.getElementById('cover').style.position="absolute";
        document.getElementById('cover').style.right="10px";
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(25);
      }
    });

    //Geolocation on click event 
    google.maps.event.addDomListener(document.getElementById('geolocation'), 'click', (event) => {
      this.geocoder = new google.maps.Geocoder();    
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.map.setCenter(pos);
          var google_map_position = new google.maps.LatLng( pos.lat, pos.lng );
          this.geocoder.geocode({'latLng': google_map_position }, (results, status) => {         
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                this.input = document.getElementById('pac-input');
                this.input.value = (results[0].formatted_address);
                document.getElementById('container-infobox').style.display = "block";
                this.map.setZoom(25);
                this.input.value = (results[0].formatted_address);
                this.input.style.fontSize = "smaller";
                document.getElementById('search-box').style.top = "15px";
                document.getElementById('cover').style.width = "auto";
                document.getElementById('cover').style.position="absolute";
                document.getElementById('cover').style.right="10px";
                
              }
            }
          });
        });
      }
    });

    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
      // Polygon drawn
      (<HTMLInputElement> document.getElementById("continue")).disabled = false;
      (<HTMLInputElement> document.getElementById("clear")).disabled = false;
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          document.getElementById('container-image').style.display = "none";
          document.getElementById('div-result').style.display = "block";
          this.result = document.getElementById('result');
          this.result_2 = document.getElementById('result_2');
          var area = google.maps.geometry.spherical.computeArea(event.overlay.getPath());
          var pos = this.map.getBounds().getCenter().toString();
          let input = Potencial(pos, area); 
          this.result.value = input[0]+" kWh";
          //this.result_2.value = input[1]+" %"; 
          this.result_2.value = area.toFixed(2)+" m2";     
        google.maps.event.addDomListener(document.getElementById('clear'), 'click', () => {
          event.overlay.setMap(null); //this will delete any created shape
          this.result = (<HTMLInputElement> document.getElementById("result"));
          this.result.value = "";
          this.result_2 = (<HTMLInputElement> document.getElementById("result_2"))
          this.result_2.value = ""
        });
        google.maps.event.addDomListener(document.getElementById('continue'), 'click', () => {
        document.getElementById('infobox-results').style.display = "block";
        document.getElementById('infobox').style.filter = "brightness(0.2)";
        document.getElementById('search-box').style.filter = "brightness(0.2)";
        document.getElementById('map').style.filter = "brightness(0.2)";
        (<HTMLInputElement> document.getElementById("continue")).disabled = true;
        (<HTMLInputElement> document.getElementById("clear")).disabled = true;
        });
        google.maps.event.addDomListener(document.getElementById('calcular'), 'click', () => {
        document.getElementById('container-cotizacion').style.display = "block";
        var instalacion = (<HTMLInputElement>document.getElementById("select-instalacion")).value;
        var factura = (<HTMLInputElement>document.getElementById("select-factura")).value;
        var energia = (<HTMLInputElement>document.getElementById("select-energia")).value;
        let output = Presupuesto(instalacion,factura, energia);
        (<HTMLInputElement> document.getElementById("paneles_input")).value = output[0]+"";
        (<HTMLInputElement> document.getElementById("potencia")).value = output[1]+" kW";
        (<HTMLInputElement> document.getElementById("area_input")).value = output[2]+" %";
        (<HTMLInputElement> document.getElementById("total_input")).value = output[3]+"\u20AC";
        (<HTMLInputElement> document.getElementById("ahorro_input")).value = output[4]+"\u20AC";
        (<HTMLInputElement> document.getElementById("autoconsumo_input")).value = output[5]+" %";
        });
        google.maps.event.addDomListener(document.getElementById('boton-volver'), 'click', () => {
        document.getElementById('infobox-results').style.display = "none";
        document.getElementById('container-cotizacion').style.display = "none";
        document.getElementById('infobox').style.filter = "brightness(1)";
        document.getElementById('search-box').style.filter = "brightness(1)";
        document.getElementById('map').style.filter = "brightness(1)";
        (<HTMLInputElement> document.getElementById("continue")).disabled = false;
        (<HTMLInputElement> document.getElementById("clear")).disabled = false;
        });
        google.maps.event.addDomListener(document.getElementById('boton-atras'), 'click', () => {
        document.getElementById('infobox-results').style.display = "block";
        document.getElementById('container-cotizacion').style.display = "none";
        });
        google.maps.event.addDomListener(document.getElementById('boton-borrar'), 'click', () => {
        event.overlay.setMap(null);
        document.getElementById('infobox-results').style.display = "none";
        document.getElementById('container-cotizacion').style.display = "none";
        (<HTMLInputElement> document.getElementById("result")).value = "";
        (<HTMLInputElement> document.getElementById("result_2")).value = "";
        document.getElementById('infobox').style.filter = "none";
        document.getElementById('search-box').style.filter = "none";
        document.getElementById('map').style.filter = "none";
        (<HTMLInputElement> document.getElementById("continue")).disabled = false;
        (<HTMLInputElement> document.getElementById("clear")).disabled = false;

        });      
      };
    });

    function Potencial(pos, area){
       var potencial = Math.floor(Math.random() * (+9.786 - +3.648)) + +3.648; 
       var tejado = Math.floor(Math.random() * (+100 - +50)) + +50;
      return ([potencial, tejado]);
    };

    function Presupuesto(instalacion, factura, energia){
       var paneles = Math.floor(Math.random() * (+5 - +2)) + +2;
       var potencia = paneles*0.32;
       var usada = paneles*14.4;
       var total = paneles*182;
       var ahorro = Math.floor(Math.random() * (+70 - +40)) + +40;
       var autoconsumo = Math.floor(Math.random() * (+80 - +50)) + +50;
      return ([paneles, potencia, usada, total, ahorro, autoconsumo]);
    };

    google.maps.event.addDomListener(document.getElementById('start'), 'click', () => {
      this.drawingManager.setMap(this.map);
      document.getElementById('clear').style.display = "inline-block";
      document.getElementById('continue').style.display = "inline-block";
      document.getElementById('start').style.display = "none";
    }); 

  }
}
