export interface AppNotification {
  id?: number;
  utilisateurId: number;
  titre: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  lu: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  parcelleId?: number;
  activityId?: number;
  priority?: 'low' | 'medium' | 'high';
}

// Classe pour créer une nouvelle notification
export class CreateNotification implements Omit<AppNotification, 'id' | 'createdAt' | 'updatedAt'> {
  utilisateurId: number;
  titre: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  lu: boolean;
  parcelleId?: number;
  activityId?: number;
  priority?: 'low' | 'medium' | 'high';

  constructor(data: CreateNotification) {
    this.utilisateurId = data.utilisateurId;
    this.titre = data.titre;
    this.message = data.message;
    this.type = data.type;
    this.lu = data.lu ?? false;
    this.parcelleId = data.parcelleId;
    this.activityId = data.activityId;
    this.priority = data.priority ?? 'medium';
  }
}
