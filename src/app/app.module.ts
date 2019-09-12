import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InfoboxComponent } from './infobox/infobox.component';
import { MapComponent } from './map/map.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { InfoboxResultsComponent } from './infobox-results/infobox-results.component';
import { CotizacionComponent } from './cotizacion/cotizacion.component';

@NgModule({
  declarations: [
    AppComponent,
    InfoboxComponent,
    MapComponent,
    SearchBoxComponent,
    NavBarComponent,
    InfoboxResultsComponent,
    CotizacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
