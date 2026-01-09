export interface Meteo {
  id?: number;
  latitude: number;
  longitude: number;
  ville?: string;
  temperature: number;
  temperatureMin?: number;
  temperatureMax?: number;
  humidite?: number;
  vitesseVent?: number;
  description?: string;
  icone?: string;
  probabilitePluie?: number;
  datePrevisionnelle: Date;
  createdAt?: Date;
}
