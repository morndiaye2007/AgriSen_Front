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
