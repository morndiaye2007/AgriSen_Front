export interface Produit {
  id: string;
  nom: string;
  description: string;
  prix: number;
  unite: string; // kg, sac, caisse, etc.
  quantiteDisponible: number;
  categorie: CategorieProduit;
  imageUrl?: string;
  images?: string[];
  vendeurId: string;
  vendeurNom?: string;
  region?: string;
  certifieBio?: boolean;
  certifieCommerceEquitable?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum CategorieProduit {
  FRUITS = 'fruits',
  LEGUMES = 'legumes',
  CEREALES = 'cereales',
  BETAILL = 'betail',
  AUTRE = 'autre'
}

export interface Commande {
  id: string;
  numeroCommande: string;
  acheteurId: string;
  acheteurNom?: string;
  vendeurId: string;
  vendeurNom?: string;
  produits: CommandeProduit[];
  prixTotal: number;
  statut: StatutCommande;
  dateCommande: Date;
  dateLivraisonEstimee?: Date;
  dateLivraisonReelle?: Date;
  adresseLivraison?: string;
  notes?: string;
}

export interface CommandeProduit {
  produitId: string;
  produitNom: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
}

export enum StatutCommande {
  EN_ATTENTE = 'en_attente',
  CONFIRMEE = 'confirmee',
  EXPEDIEE = 'expediee',
  LIVREE = 'livree',
  ANNULEE = 'annulee'
}

