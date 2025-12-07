export interface Parcelle {
  id: string;
  nom: string;
  taille: number; // en hectares
  coordonneesGPS: {
    latitude: number;
    longitude: number;
  };
  cultureActuelle?: Culture;
  historiqueCultures?: Culture[];
  proprietaireId: string;
  region: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Culture {
  id: string;
  type: string; // Mil, Sorgho, Arachides, Niébé, etc.
  variete?: string;
  datePlantation: Date;
  dateRecolteEstimee?: Date;
  dateRecolteReelle?: Date;
  rendement?: number; // en tonnes
  parcelleId: string;
}

export interface SoilHumidity {
  parcelleId: string;
  date: Date;
  valeur: number; // pourcentage
}

