import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service'
import { MapLoaderService } from '../map-loader.service'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private mapService: MapService) { }

  ngOnInit() {
    MapLoaderService.load().then(() => {
      this.drawPolygon();
    })
  }

  drawPolygon(): void {
    this.mapService.drawPolygon();
  }
  
}
