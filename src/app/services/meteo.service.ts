import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {Meteo} from "../core/models/Meteo";

@Injectable({
  providedIn: 'root'
})
export class MeteoService {
  private apiUrl = `${environment.baseUrl}/meteo`;

  constructor(private http: HttpClient) {}

  getCurrentWeather(latitude: number, longitude: number): Observable<Meteo> {
    return this.http.get<Meteo>(`${this.apiUrl}/current`, {
      params: {
        lat: latitude.toString(),
        lon: longitude.toString()
      }
    });
  }

  getWeatherForecast(latitude: number, longitude: number, days: number = 7): Observable<Meteo[]> {
    return this.http.get<Meteo[]>(`${this.apiUrl}/forecast`, {
      params: {
        lat: latitude.toString(),
        lon: longitude.toString(),
        days: days.toString()
      }
    });
  }

  getWeatherByCity(ville: string): Observable<Meteo> {
    return this.http.get<Meteo>(`${this.apiUrl}/ville/${ville}`);
  }

  getHistoricalWeather(latitude: number, longitude: number, date: Date): Observable<Meteo> {
    return this.http.get<Meteo>(`${this.apiUrl}/historical`, {
      params: {
        lat: latitude.toString(),
        lon: longitude.toString(),
        date: date.toISOString()
      }
    });
  }
}
