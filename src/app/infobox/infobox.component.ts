import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service'

@Component({
  selector: 'app-infobox',
  templateUrl: './infobox.component.html',
  styleUrls: ['./infobox.component.css']
})
export class InfoboxComponent implements OnInit {

  constructor(private mapService: MapService) { }

  ngOnInit() {
  }

}
