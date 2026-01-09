export interface Parcelle {
  id?: number;
  nom: string;
  superficie: number;
  description?: string;
  agriculteurId: number;
  cultureId?: number;
  latitude?: number;
  longitude?: number;
  adresse?: string;
  ville?: string;
  typeSol?: string;
  sourceEau?: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
