import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeteoRoutingModule } from './meteo-routing.module';
import { MeteoComponent } from './meteo.component';
import { CurrentWeatherComponent } from './current-weather/current-weather.component';
import { ForecastComponent } from './forecast/forecast.component';
import { WeatherAlertsComponent } from './weather-alerts/weather-alerts.component';
import { WeatherHistoryComponent } from './weather-history/weather-history.component';
import { WeatherMapComponent } from './weather-map/weather-map.component';


@NgModule({
  declarations: [
    MeteoComponent,
    CurrentWeatherComponent,
    ForecastComponent,
    WeatherAlertsComponent,
    WeatherHistoryComponent,
    WeatherMapComponent
  ],
  imports: [
    CommonModule,
    MeteoRoutingModule
  ]
})
export class MeteoModule { }
