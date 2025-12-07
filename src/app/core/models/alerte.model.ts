export interface AlerteMeteo {
  id: string;
  type: TypeAlerteMeteo;
  titre: string;
  description: string;
  niveau: NiveauAlerte;
  region: string;
  dateDebut: Date;
  dateFin?: Date;
  recommandations?: string[];
}

export enum TypeAlerteMeteo {
  PLUIE = 'pluie',
  SECHERESSE = 'secheresse',
  TEMPETE = 'tempete',
  VENT_FORT = 'vent_fort',
  TEMPERATURE_EXTREME = 'temperature_extreme'
}

export enum NiveauAlerte {
  INFO = 'info',
  ATTENTION = 'attention',
  ALERTE = 'alerte',
  URGENCE = 'urgence'
}

export interface AlerteMaladie {
  id: string;
  parcelleId: string;
  type: string;
  description: string;
  niveau: NiveauAlerte;
  dateDetection: Date;
  traitee?: boolean;
  dateTraitement?: Date;
  recommandations?: string[];
}

