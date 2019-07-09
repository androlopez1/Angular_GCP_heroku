import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service'

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {

  constructor(private mapService: MapService) { }

  ngOnInit() {
  }

}
