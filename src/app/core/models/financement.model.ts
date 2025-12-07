export interface DemandeCredit {
  id: string;
  demandeurId: string;
  montant: number;
  duree: number; // en mois
  motif: string;
  description: string;
  statut: StatutDemande;
  tauxInteret?: number;
  mensualite?: number;
  conseillerId?: string;
  dateDemande: Date;
  dateValidation?: Date;
  dateRefus?: Date;
  raisonRefus?: string;
  documents?: string[];
}

export enum StatutDemande {
  EN_ATTENTE = 'en_attente',
  EN_COURS = 'en_cours',
  VALIDEE = 'validee',
  REFUSEE = 'refusee',
  REMBOURSEE = 'remboursee'
}

export interface MessageConseiller {
  id: string;
  demandeId: string;
  expediteurId: string;
  destinataireId: string;
  message: string;
  dateEnvoi: Date;
  lu?: boolean;
}

