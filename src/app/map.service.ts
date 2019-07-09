import { Injectable } from '@angular/core';
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map: any;
  drawingManager: any;
  message: string;
  input: any;
  autocomplete: any;
  options: {};
  defaultBounds: any;
  geocoder: any;
  display: any;
  clear: any;
  continue: any;
  search: any;
  start: any;
  infobox: any;
  container_image: any;
  result: any;
  search_box: any;

  constructor() { }

  drawPolygon() {

    this.display = document.getElementById('container-infobox').style.display = "none";
    this.result = document.getElementById('result').style.display = "none";
    this.clear = document.getElementById('clear').style.display = "none";
    this.continue = document.getElementById('continue').style.display = "none";
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
        alert("No hay datos disponibles para: '" + place.name + "'");
        return;
      }
      this.display = document.getElementById('container-infobox').style.display = "block";
      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
        this.map.setZoom(25);       
        this.input = document.getElementById('pac-input').style.fontSize = "smaller";
        //let elements: NodeListOf<Element> = document.getElementsByClassName("search-box");
        //elements[0].style.top="15px";
        this.search_box = document.getElementById('search-box').style.top = "15px";
        this.search = document.getElementById('cover').style.width = "auto";
        this.search = document.getElementById('cover').style.position="absolute";
        this.search = document.getElementById('cover').style.right="10px";
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
                this.input.value = (results[0].formatted_address);
                this.display = document.getElementById('container-infobox').style.display = "block";
                this.map.setZoom(25);
                this.input.value = (results[0].formatted_address);
                this.input = document.getElementById('pac-input').style.fontSize = "smaller";
                //let elements: NodeListOf<Element> = document.getElementsByClassName("search-box");
                //elements[0].style.top="15px";
                this.search_box = document.getElementById('search-box').style.top = "15px";
                this.search = document.getElementById('cover').style.width = "auto";
                this.search = document.getElementById('cover').style.position="absolute";
                this.search = document.getElementById('cover').style.right="10px";
                
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
        google.maps.event.addDomListener(document.getElementById('clear'), 'click', () => {
          event.overlay.setMap(null); //this will delete any created shape
          this.result = document.getElementById('result');
          this.result.value = ""
        });
        google.maps.event.addDomListener(document.getElementById('continue'), 'click', () => {
          //Compute area of polygon
          this.container_image = document.getElementById('container-image').style.display = "none";
          this.result = document.getElementById('result').style.display = "block";
          this.result = document.getElementById('result');
          this.result.value = "Area "+google.maps.geometry.spherical.computeArea(event.overlay.getPath())+" m2";
        }); 
      };
    });

    google.maps.event.addDomListener(document.getElementById('start'), 'click', () => {
      this.drawingManager.setMap(this.map);
      this.clear = document.getElementById('clear').style.display = "inline-block";
      this.continue = document.getElementById('continue').style.display = "inline-block";
      this.start = document.getElementById('start').style.display = "none";
    }); 

  }
}
