export interface JournalActivite {
  id: string;
  parcelleId: string;
  type: TypeActivite;
  date: Date;
  description: string;
  cout?: number;
  quantite?: number;
  unite?: string;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TypeActivite {
  PLANTATION = 'plantation',
  IRRIGATION = 'irrigation',
  FERTILISATION = 'fertilisation',
  TRAITEMENT = 'traitement',
  RECOLTE = 'recolte',
  ENTRETIEN = 'entretien',
  AUTRE = 'autre'
}

